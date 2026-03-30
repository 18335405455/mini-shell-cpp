# Mini Shell C++

A Linux mini shell built with C++ using core Unix system calls.

## Features
- Built-in commands: `cd`, `exit`
- External command execution via `fork + execvp`
- Parent-child synchronization using `waitpid`
- Output redirection with `>`
- Linux file descriptor control via `dup2`

## Tech Stack
- C++
- Linux (WSL Ubuntu)
- g++
- Git / GitHub

## Current Milestone
Implemented the first working shell prototype with built-in state management and stdout redirection.
