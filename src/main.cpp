#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <unistd.h>
#include <sys/wait.h>
#include <fcntl.h>

using namespace std;

int main() {
    string line;

    while (true) {
        cout << "mini-shell> ";
        getline(cin, line);

        if (line.empty()) continue;

        // 1. 分词
        stringstream ss(line);
        vector<string> tokens;
        string token;

        while (ss >> token) {
            tokens.push_back(token);
        }

        if (tokens.empty()) continue;

        // 2. 内建命令：exit
        if (tokens[0] == "exit") {
            break;
        }

        // 3. 内建命令：cd
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

        // 4. 检查是否有输出重定向 >
        int redirect_index = -1;
        for (int i = 0; i < (int)tokens.size(); i++) {
            if (tokens[i] == ">") {
                redirect_index = i;
                break;
            }
        }

        // 5. 构造 execvp 参数
        vector<char*> args;

        if (redirect_index == -1) {
            // 没有重定向：全部 tokens 都是命令参数
            for (auto& t : tokens) {
                args.push_back(&t[0]);
            }
        } else {
            // 有重定向：只取 > 前面的部分作为命令参数
            if (redirect_index == 0) {
                cerr << "syntax error: no command before >" << endl;
                continue;
            }
            if (redirect_index == (int)tokens.size() - 1) {
                cerr << "syntax error: no output file after >" << endl;
                continue;
            }

            for (int i = 0; i < redirect_index; i++) {
                args.push_back(&tokens[i][0]);
            }
        }

        args.push_back(nullptr);

        // 6. 创建子进程
        pid_t pid = fork();

        if (pid < 0) {
            perror("fork failed");
            continue;
        }

        if (pid == 0) {
            // 子进程

            // 7. 如果有 >，做 stdout 重定向
            if (redirect_index != -1) {
                string filename = tokens[redirect_index + 1];

                int fd = open(filename.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0644);
                if (fd < 0) {
                    perror("open failed");
                    exit(1);
                }

                if (dup2(fd, STDOUT_FILENO) < 0) {
                    perror("dup2 failed");
                    close(fd);
                    exit(1);
                }

                close(fd);
            }

            execvp(args[0], args.data());
            perror("exec failed");
            exit(1);
        } else {
            // 父进程等待子进程结束
            waitpid(pid, nullptr, 0);
        }
    }

    return 0;
}