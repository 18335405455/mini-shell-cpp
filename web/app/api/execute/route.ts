import { spawn } from "child_process";

type ExecuteRequest = {
  command?: string;
};

function cleanOutput(raw: string): string {
  if (!raw) return "";

  let text = raw.replace(/\r/g, "");
  text = text.replace(/mini-shell>\s*/g, "");

  return text.trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ExecuteRequest;
    const command = body.command?.trim();

    if (!command) {
      return Response.json(
        {
          success: false,
          stdout: "",
          stderr: "Empty command.",
        },
        { status: 400 }
      );
    }

    const result = await new Promise<{
      success: boolean;
      stdout: string;
      stderr: string;
    }>((resolve, reject) => {
      const child = spawn("./mini_shell", [], {
        cwd: "/home/niki/mini-shell",
        stdio: "pipe",
      });

      let stdout = "";
      let stderr = "";
      let settled = false;

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          child.kill("SIGKILL");
          reject(new Error("Command timed out."));
        }
      }, 5000);

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        if (!settled) {
          settled = true;
          reject(err);
        }
      });

      child.on("close", (code) => {
        clearTimeout(timer);
        if (!settled) {
          settled = true;

          const cleanedStdout = cleanOutput(stdout);
          const cleanedStderr = cleanOutput(stderr);

          resolve({
            success: code === 0 && !cleanedStderr,
            stdout: cleanedStdout,
            stderr: cleanedStderr,
          });
        }
      });

      child.stdin.write(`${command}\n`);
      child.stdin.write("exit\n");
      child.stdin.end();
    });

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error.";

    return Response.json(
      {
        success: false,
        stdout: "",
        stderr: message,
      },
      { status: 500 }
    );
  }
}