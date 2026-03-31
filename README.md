# MINI SHELL C++ × Web Playground

A modular Linux mini shell built with C++ using core Unix system calls, upgraded with a Next.js interactive web playground for real-time command execution demos.

## Project Overview

This project implements a custom Unix-style mini shell in C++ and exposes it through a web-based interactive playground.

The web UI sends commands to a Next.js API route, which spawns the compiled `mini_shell` executable and returns the output back to the browser.

## Execution Flow

```text
Web UI (Next.js)
   ↓
API Route (/api/execute)
   ↓
spawn ./mini_shell
   ↓
C++ parser / executor / pipe executor
   ↓
stdout / stderr
   ↓
Browser terminal panel
```

## Core Features

### Shell Core (C++)
- Built-in commands: `cd`, `exit`
- External command execution via `fork + execvp`
- Parent-child synchronization using `waitpid`
- Input redirection `<`
- Output redirection `>`
- Single pipe `|`
- Linux file descriptor control via `dup2`
- Error propagation through `stderr`

### Web Playground (Next.js)
- Interactive terminal-style UI
- Real command execution through the custom C++ shell
- Auto-scroll command history
- Colored error output rendering
- Browser-based demo environment
- Stateless API execution architecture

## Tech Stack

### System Layer
- C++
- Linux / WSL Ubuntu
- g++
- Unix system calls
- Makefile

### Web Layer
- Next.js
- React
- TypeScript
- Next API Routes
- Node.js `spawn()`

## Demo Scenarios

### Basic Command Execution
- `ls`
- `pwd`
- `echo hello`
- `cat README.md`

### Redirection

```bash
echo hello > out.txt
cat < out.txt
```

### Pipe

```bash
echo hello | wc -c
```

### Error Output

```bash
not_a_command
cat not_exist.txt
```

## Project Structure

```text
mini-shell/
├── src/
│   ├── main.cpp
│   ├── parser.cpp
│   ├── executor.cpp
│   └── pipe_executor.cpp
├── include/
│   ├── parser.h
│   ├── executor.h
│   └── pipe_executor.h
├── web/
│   ├── app/
│   │   ├── page.tsx
│   │   └── api/execute/route.ts
│   └── package.json
├── assets/
├── Makefile
└── README.md
```

## Core System Calls

- `fork()`
- `execvp()`
- `waitpid()`
- `pipe()`
- `dup2()`
- `open()`
- `chdir()`

## Current Milestone

A functional C++ mini shell plus web playground prototype supporting:
- built-in commands
- external commands
- input/output redirection
- single pipe execution
- real error rendering
- browser-based interactive execution

## Future Improvements

- Multiple pipe support (`cmd1 | cmd2 | cmd3`)
- Persistent session shell state
- Background job execution (`&`)
- Command history persistence
- Better syntax parsing
- Mixed pipe and redirection support
- WebSocket-based long-lived shell process

## Why This Project Matters

This project bridges system programming and interactive web demonstration.

It transforms a traditional Unix systems project into a portfolio-ready engineering showcase, making the shell logic directly explorable through a browser.

Suitable for:
- systems internships
- backend engineering roles
- AI infra / platform roles
- Unix process control demos
