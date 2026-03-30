#include <iostream>
#include <vector>
#include <string>
#include <unistd.h>

#include "../include/parser.h"
#include "../include/executor.h"
#include "../include/pipe_executor.h"

using namespace std;

int main() {
    string line;

    while (true) {
        cout << "mini-shell> ";
        getline(cin, line);

        if (cin.eof()) {
            cout << endl;
            break;
        }

        if (line.empty()) continue;

        vector<string> tokens = tokenize(line);
        if (tokens.empty()) continue;

        if (tokens[0] == "exit") {
            break;
        }

        if (tokens[0] == "cd") {
            if (tokens.size() < 2) {
                cerr << "cd: missing argument" << endl;
            } else {
                if (chdir(tokens[1].c_str()) != 0) {
                    perror("cd failed");
                }
            }
            continue;
        }

        int pipe_index = -1;
        for (int i = 0; i < (int)tokens.size(); i++) {
            if (tokens[i] == "|") {
                pipe_index = i;
                break;
            }
        }

        if (pipe_index != -1) {
            for (const auto& token : tokens) {
                if (token == ">" || token == "<") {
                    cerr << "syntax error: mixing | with < or > is not supported yet" << endl;
                    pipe_index = -2;
                    break;
                }
            }

            if (pipe_index == -2) continue;

            if (pipe_index == 0 || pipe_index == (int)tokens.size() - 1) {
                cerr << "syntax error: invalid pipe usage" << endl;
                continue;
            }

            vector<string> left_tokens(tokens.begin(), tokens.begin() + pipe_index);
            vector<string> right_tokens(tokens.begin() + pipe_index + 1, tokens.end());

            execute_pipe(left_tokens, right_tokens);
        } else {
            execute_command(tokens);
        }
    }

    return 0;
}