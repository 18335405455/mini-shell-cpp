#include "../include/pipe_executor.h"
#include "../include/parser.h"

#include <iostream>
#include <vector>
#include <string>
#include <unistd.h>
#include <sys/wait.h>

using namespace std;

void execute_pipe(vector<string> left_tokens, vector<string> right_tokens) {
    if (left_tokens.empty() || right_tokens.empty()) {
        cerr << "syntax error: invalid pipe usage" << endl;
        return;
    }

    vector<char*> left_args = build_args(left_tokens);
    vector<char*> right_args = build_args(right_tokens);

    int fd[2];
    if (pipe(fd) < 0) {
        perror("pipe failed");
        return;
    }

    pid_t pid1 = fork();
    if (pid1 < 0) {
        perror("fork failed");
        close(fd[0]);
        close(fd[1]);
        return;
    }

    if (pid1 == 0) {
        if (dup2(fd[1], STDOUT_FILENO) < 0) {
            perror("dup2 failed");
            exit(1);
        }

        close(fd[0]);
        close(fd[1]);

        execvp(left_args[0], left_args.data());
        perror("exec failed");
        exit(1);
    }

    pid_t pid2 = fork();
    if (pid2 < 0) {
        perror("fork failed");
        close(fd[0]);
        close(fd[1]);
        waitpid(pid1, nullptr, 0);
        return;
    }

    if (pid2 == 0) {
        if (dup2(fd[0], STDIN_FILENO) < 0) {
            perror("dup2 failed");
            exit(1);
        }

        close(fd[0]);
        close(fd[1]);

        execvp(right_args[0], right_args.data());
        perror("exec failed");
        exit(1);
    }

    close(fd[0]);
    close(fd[1]);

    waitpid(pid1, nullptr, 0);
    waitpid(pid2, nullptr, 0);
}