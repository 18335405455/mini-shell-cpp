"use client";

import { useEffect, useRef, useState } from "react";

type HistoryItem = {
  type: "system" | "command" | "stdout" | "stderr";
  text: string;
};

type ExecuteResponse = {
  success: boolean;
  stdout: string;
  stderr: string;
};

export default function Home() {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "system", text: "Mini Shell Web Playground initialized." },
    { type: "system", text: "Built-in: cd, exit" },
    { type: "system", text: "Supported: external commands, <, >, |" },
    { type: "system", text: "Try: ls / pwd / echo hello / cat README.md" },
  ]);

  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = async () => {
    const trimmed = command.trim();
    if (!trimmed || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: trimmed }),
      });

      const data: ExecuteResponse = await res.json();

      const nextItems: HistoryItem[] = [
        { type: "command", text: `$ ${trimmed}` },
      ];

      if (data.stdout?.trim()) {
        nextItems.push({ type: "stdout", text: data.stdout.trim() });
      }

      if (data.stderr?.trim()) {
        nextItems.push({ type: "stderr", text: data.stderr.trim() });
      }

      if (!data.stdout?.trim() && !data.stderr?.trim()) {
        nextItems.push({ type: "system", text: "(no output)" });
      }

      setHistory((prev) => [...prev, ...nextItems]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: `$ ${trimmed}` },
        {
          type: "stderr",
          text: "Request failed. Please check the API route or server logs.",
        },
      ]);
    } finally {
      setCommand("");
      setLoading(false);
    }
  };

  const getLineColor = (type: HistoryItem["type"]) => {
    switch (type) {
      case "command":
        return "#ffffff";
      case "stdout":
        return "#22c55e";
      case "stderr":
        return "#ef4444";
      case "system":
      default:
        return "#22c55e";
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#22c55e",
        padding: "32px",
        fontFamily: "monospace",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "48px",
            color: "white",
            marginBottom: "12px",
            letterSpacing: "1px",
          }}
        >
          MINI SHELL Web Playground
        </h1>

        <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
          C++ Shell Core × Next.js Interactive Demo
        </p>

        <div
          style={{
            border: "1px solid #27272a",
            borderRadius: "20px",
            padding: "24px",
            background: "#050816",
            boxShadow: "0 0 24px rgba(34, 197, 94, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "24px",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#22c55e", fontSize: "20px" }}>$</span>

            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runCommand();
              }}
              placeholder="Enter command..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "18px",
              }}
            />

            <button
              onClick={runCommand}
              disabled={loading}
              style={{
                background: loading ? "#166534" : "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 20px",
                cursor: loading ? "not-allowed" : "pointer",
                minWidth: "88px",
                fontWeight: 600,
              }}
            >
              {loading ? "Running..." : "Run"}
            </button>
          </div>

          <div
            ref={outputRef}
            style={{
              background: "#000",
              borderRadius: "16px",
              padding: "20px",
              minHeight: "360px",
              maxHeight: "520px",
              overflowY: "auto",
              lineHeight: 1.9,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              border: "1px solid #111827",
            }}
          >
            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  color: getLineColor(item.type),
                  marginBottom: "6px",
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#0b1730",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #1f2937",
            }}
          >
            <h2 style={{ color: "white", marginBottom: "12px", fontSize: "20px" }}>
              Supported Features
            </h2>
            <p>built-in commands</p>
            <p>external commands</p>
            <p>single pipe |</p>
            <p>redirection &lt; &gt;</p>
          </div>

          <div
            style={{
              background: "#0b1730",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #1f2937",
            }}
          >
            <h2 style={{ color: "white", marginBottom: "12px", fontSize: "20px" }}>
              System Highlights
            </h2>
            <p>C++ parser</p>
            <p>executor engine</p>
            <p>pipe executor</p>
            <p>Unix process / fd management</p>
          </div>
        </div>
      </div>
    </main>
  );
}