````markdown
# Mini Shell C++

A Linux mini shell built with C++ using core Unix system calls.

---

## Features

- Built-in commands: `cd`, `exit`
- External command execution via `fork + execvp`
- Parent-child synchronization using `waitpid`
- Input redirection `<`
- Output redirection `>`
- Single pipe `|` support
- Linux file descriptor control via `dup2`

---

## Tech Stack

- C++
- Linux (WSL Ubuntu)
- g++
- Git / GitHub

---

## Usage Examples

```bash
echo hello > out.txt
cat < out.txt
echo hello | wc -c
cd ..
pwd
````

---

## Project Structure

```text
mini-shell/
├── src/
│   ├── main.cpp              # shell loop and built-in commands
│   ├── parser.cpp            # token parsing
│   ├── executor.cpp          # command execution with < and >
│   └── pipe_executor.cpp     # pipe handling
├── include/
│   ├── parser.h
│   ├── executor.h
│   └── pipe_executor.h
├── Makefile
└── README.md
```

---

## Core System Calls

* `fork()`
* `execvp()`
* `waitpid()`
* `pipe()`
* `dup2()`
* `open()`
* `chdir()`

---

## Current Milestone

Modularized mini shell with support for input/output redirection and single pipe execution.

---

## Future Improvements

* Multiple pipe support (`cmd1 | cmd2 | cmd3`)
* Background job execution (`&`)
* Command history
* Better syntax parsing
* Mixed pipe and redirection support

```
```
