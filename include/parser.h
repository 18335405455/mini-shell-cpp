#ifndef PARSER_H
#define PARSER_H

#include <string>
#include <vector>

std::vector<std::string> tokenize(const std::string& line);
std::vector<char*> build_args(const std::vector<std::string>& tokens);

#endif