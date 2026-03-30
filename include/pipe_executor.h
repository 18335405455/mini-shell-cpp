#ifndef PIPE_EXECUTOR_H
#define PIPE_EXECUTOR_H

#include <vector>
#include <string>

void execute_pipe(std::vector<std::string> left_tokens,
                  std::vector<std::string> right_tokens);

#endif