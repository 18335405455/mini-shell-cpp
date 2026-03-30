#include "../include/parser.h"
#include <sstream>

using namespace std;

vector<string> tokenize(const string& line) {
    stringstream ss(line);
    vector<string> tokens;
    string token;

    while (ss >> token) {
        tokens.push_back(token);
    }

    return tokens;
}

vector<char*> build_args(const vector<string>& tokens) {
    vector<char*> args;

    for (const auto& token : tokens) {
        args.push_back(const_cast<char*>(token.c_str()));
    }

    args.push_back(nullptr);
    return args;
}