# \# MINI SHELL C++ × Web Playground

# 

# A modular Linux mini shell built with C++ using core Unix system calls, upgraded with a Next.js interactive web playground for real-time command execution demos.

# 

# \---

# 

# \## 🚀 Project Overview

# 

# This project implements a custom Unix-style mini shell in C++ and exposes it through a web-based interactive playground.

# 

# The web UI sends commands to a Next.js API route, which spawns the compiled `mini\_shell` executable and streams the output back to the browser.

# 

# \### Execution Flow

# 

# ```text

# Web UI (Next.js)

# &#x20;  ↓

# API Route (/api/execute)

# &#x20;  ↓

# spawn ./mini\_shell

# &#x20;  ↓

# C++ parser / executor / pipe executor

# &#x20;  ↓

# stdout / stderr

# &#x20;  ↓

# Browser terminal panel

# ```

# 

# \---

# 

# \## ✨ Core Features

# 

# \### Shell Core (C++)

# \- Built-in commands: `cd`, `exit`

# \- External command execution via `fork + execvp`

# \- Parent-child synchronization using `waitpid`

# \- Input redirection `<`

# \- Output redirection `>`

# \- Single pipe `|`

# \- Linux file descriptor control via `dup2`

# \- Error propagation through `stderr`

# 

# \### Web Playground (Next.js)

# \- Interactive terminal-style UI

# \- Real command execution through custom C++ shell

# \- Auto-scroll command history

# \- Red error output highlighting

# \- Browser-based demo environment

# \- Stateless API execution architecture

# 

# \---

# 

# \## 🧠 Tech Stack

# 

# \### System Layer

# \- C++

# \- Linux / WSL Ubuntu

# \- g++

# \- Unix system calls

# \- Makefile

# 

# \### Web Layer

# \- Next.js

# \- React

# \- TypeScript

# \- Next API Routes

# \- Node.js `spawn()`

# 

# \---

# 

# \## 📸 Demo Screenshots

# 

# \### 1. Basic Command Execution

# \- `ls`

# \- `pwd`

# \- `echo hello`

# \- `cat README.md`

# 

# \### 2. Redirection

# ```bash

# echo hello > out.txt

# cat < out.txt

# ```

# 

# \### 3. Pipe

# ```bash

# echo hello | wc -c

# ```

# 

# \### 4. Error Output

# ```bash

# not\_a\_command

# cat not\_exist.txt

# ```

# 

# \---

# 

# \## 📂 Project Structure

# 

# ```text

# mini-shell/

# ├── src/

# │   ├── main.cpp

# │   ├── parser.cpp

# │   ├── executor.cpp

# │   └── pipe\_executor.cpp

# ├── include/

# │   ├── parser.h

# │   ├── executor.h

# │   └── pipe\_executor.h

# ├── web/

# │   ├── app/

# │   │   ├── page.tsx

# │   │   └── api/execute/route.ts

# │   └── package.json

# ├── assets/

# ├── Makefile

# └── README.md

# ```

# 

# \---

# 

# \## 🔧 Core System Calls

# 

# \- `fork()`

# \- `execvp()`

# \- `waitpid()`

# \- `pipe()`

# \- `dup2()`

# \- `open()`

# \- `chdir()`

# 

# \---

# 

# \## 🎯 Current Milestone

# 

# A fully functional \*\*C++ mini shell + web playground prototype\*\*, supporting:

# 

# \- built-in commands

# \- external commands

# \- redirection

# \- single pipe

# \- real error rendering

# \- browser-based execution

# 

# \---

# 

# \## 🚧 Future Improvements

# 

# \- Multiple pipe support (`cmd1 | cmd2 | cmd3`)

# \- Persistent session shell state

# \- Background job execution (`\&`)

# \- Command history persistence

# \- Better syntax parsing

# \- Mixed pipe + redirection

# \- WebSocket-based long-lived shell process

# 

# \---

# 

# \## 💡 Why This Project Matters

# 

# This project bridges:

# 

# > \*\*System Programming × Full-Stack Interactive Demo\*\*

# 

# It transforms a traditional OS / Unix systems project into a \*\*portfolio-ready engineering showcase\*\*, making the shell logic directly explorable through a browser.

# 

# Perfect for:

# \- systems internships

# \- AI infra / platform roles

# \- backend / remote engineering

# \- Unix process control demos

