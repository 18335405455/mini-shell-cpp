"use client";

import { useEffect, useRef, useState } from "react";

type HistoryItem = {
  id: number;
  command: string;
  output: string;
  error?: string;
};

const quickCommands = [
  "ls",
  "pwd",
  "echo hello",
  "cat README.md",
  "echo hello > out.txt",
  "cat < out.txt",
  "echo hello | wc -c",
  "not_a_command",
];

export default function Home() {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 1,
      command: "system_boot",
      output:
        "Mini Shell Web Playground initialized.\nType a command below to execute via your custom C++ shell.",
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = async (cmd?: string) => {
    const finalCommand = (cmd ?? command).trim();
    if (!finalCommand || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: finalCommand }),
      });

      const data = await res.json();

      const outputText =
        typeof data?.output === "string"
          ? data.output
          : typeof data?.stdout === "string"
          ? data.stdout
          : "";

      const errorText =
        typeof data?.error === "string"
          ? data.error
          : typeof data?.stderr === "string"
          ? data.stderr
          : "";

      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          command: finalCommand,
          output: outputText || (errorText ? "" : "Command executed with no output."),
          error: errorText || undefined,
        },
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          command: finalCommand,
          output: "",
          error: "Request failed. Please check whether the API route and mini_shell executable are running correctly.",
        },
      ]);
    } finally {
      setCommand("");
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clearHistory = () => {
    setHistory([
      {
        id: 1,
        command: "system_boot",
        output:
          "Mini Shell Web Playground initialized.\nType a command below to execute via your custom C++ shell.",
      },
    ]);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 overflow-hidden">
      <div className="relative min-h-screen">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-[-5%] top-[10%] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[20%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-20" />
        </div>

        <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10 lg:px-12">
          {/* hero */}
          <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Mini Shell C++ × Web Playground
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Build Unix process control.
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Demo it like a product.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                A browser-based interactive playground powered by a custom C++ mini shell.
                Execute commands through your own parser, executor, redirection logic, and
                pipe handler—then render results in a polished terminal UI.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                  C++ / Unix System Calls
                </span>
                <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-200">
                  Next.js / React / TypeScript
                </span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                  Real Command Execution
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">System Status</div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs text-zinc-500">Runtime</div>
                  <div className="mt-1 text-lg font-medium text-zinc-100">WSL Ubuntu / Linux Shell</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs text-zinc-500">Execution Model</div>
                  <div className="mt-1 text-lg font-medium text-zinc-100">
                    Next API Route → spawn mini_shell
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs text-zinc-500">Core Concepts</div>
                  <div className="mt-1 text-lg font-medium text-zinc-100">
                    fork / execvp / waitpid / pipe / dup2
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="text-xs text-emerald-300/80">Ready State</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-medium text-emerald-200">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                    Shell Playground Online
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* quick actions */}
          <div className="mb-5 flex flex-wrap gap-3">
            {quickCommands.map((item) => (
              <button
                key={item}
                onClick={() => runCommand(item)}
                disabled={loading}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {item}
              </button>
            ))}
            <button
              onClick={clearHistory}
              className="rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/20"
            >
              clear
            </button>
          </div>

          {/* terminal */}
          <div className="flex-1 rounded-[28px] border border-white/10 bg-zinc-950/80 shadow-[0_0_80px_rgba(34,211,238,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-sm text-zinc-400">
                  mini-shell://interactive-session
                </span>
              </div>
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Browser Terminal
              </div>
            </div>

            <div className="h-[62vh] overflow-y-auto px-5 py-5 font-mono text-sm leading-7 md:text-[15px]">
              {history.map((item) => (
                <div key={item.id} className="mb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-emerald-400">visitor@mini-shell</span>
                    <span className="text-zinc-500">:</span>
                    <span className="text-cyan-400">~/playground</span>
                    <span className="text-zinc-500">$</span>
                    <span className="break-all text-zinc-100">{item.command}</span>
                  </div>

                  {item.output ? (
                    <pre className="mt-2 whitespace-pre-wrap break-words text-zinc-300">
                      {item.output}
                    </pre>
                  ) : null}

                  {item.error ? (
                    <pre className="mt-2 whitespace-pre-wrap break-words text-red-400">
                      {item.error}
                    </pre>
                  ) : null}
                </div>
              ))}

              {loading && (
                <div className="mb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-emerald-400">visitor@mini-shell</span>
                    <span className="text-zinc-500">:</span>
                    <span className="text-cyan-400">~/playground</span>
                    <span className="text-zinc-500">$</span>
                    <span className="text-zinc-100">{command}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-cyan-300">
                    <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
                    executing...
                  </div>
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex flex-1 items-center rounded-2xl border border-white/10 bg-black/50 px-4 py-3 shadow-inner shadow-cyan-500/5">
                  <span className="mr-3 font-mono text-emerald-400">$</span>
                  <input
                    ref={inputRef}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        runCommand();
                      }
                    }}
                    placeholder="Type shell command... e.g. ls / pwd / echo hello | wc -c"
                    className="w-full bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                  />
                </div>

                <button
                  onClick={() => runCommand()}
                  disabled={loading || !command.trim()}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-6 py-3 font-medium text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Running..." : "Execute"}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                <span>Supports built-ins, redirection, single pipe, and error rendering.</span>
                <span>Perfect for README screenshots and demo videos 😈</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}