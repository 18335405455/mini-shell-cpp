#include "../include/executor.h"
#include "../include/parser.h"

#include <iostream>
#include <vector>
#include <string>
#include <unistd.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <algorithm>

using namespace std;

void execute_command(vector<string> tokens) {
    if (tokens.empty()) return;

    int input_index = -1;
    int output_index = -1;

    for (int i = 0; i < (int)tokens.size(); i++) {
        if (tokens[i] == "<") input_index = i;
        if (tokens[i] == ">") output_index = i;
    }

    vector<string> cmd_tokens;
    string input_file, output_file;

    int end_index = tokens.size();

    if (input_index != -1) {
        if (input_index == (int)tokens.size() - 1) {
            cerr << "syntax error: no input file after <" << endl;
            return;
        }
        input_file = tokens[input_index + 1];
        end_index = min(end_index, input_index);
    }

    if (output_index != -1) {
        if (output_index == (int)tokens.size() - 1) {
            cerr << "syntax error: no output file after >" << endl;
            return;
        }
        output_file = tokens[output_index + 1];
        end_index = min(end_index, output_index);
    }

    cmd_tokens.assign(tokens.begin(), tokens.begin() + end_index);

    vector<char*> args = build_args(cmd_tokens);
    if (args[0] == nullptr) return;

    pid_t pid = fork();

    if (pid < 0) {
        perror("fork failed");
        return;
    }

    if (pid == 0) {
        if (input_index != -1) {
            int fd = open(input_file.c_str(), O_RDONLY);
            if (fd < 0) {
                perror("open input failed");
                exit(1);
            }

            if (dup2(fd, STDIN_FILENO) < 0) {
                perror("dup2 input failed");
                close(fd);
                exit(1);
            }

            close(fd);
        }

        if (output_index != -1) {
            int fd = open(output_file.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0644);
            if (fd < 0) {
                perror("open output failed");
                exit(1);
            }

            if (dup2(fd, STDOUT_FILENO) < 0) {
                perror("dup2 output failed");
                close(fd);
                exit(1);
            }

            close(fd);
        }

        execvp(args[0], args.data());
        perror("exec failed");
        exit(1);
    } else {
        waitpid(pid, nullptr, 0);
    }
}