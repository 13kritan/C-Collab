const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    let dockerProcess = null;
    let tempDir = null;

    const killExistingProcess = () => {
      if (dockerProcess) {
        dockerProcess.kill("SIGKILL");
        dockerProcess = null;
      }
    };

    socket.on("run-code", ({ code }) => {
      killExistingProcess(); // Stop any previous run for this user
      console.log(code)
      tempDir = path.join(__dirname, "..", "temp", socket.id);
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const codePath = path.join(tempDir, "main.c");
      fs.writeFileSync(codePath, code);

      // We use -i for interactive mode
      // compiler.socket.js
      dockerProcess = spawn("docker", [
        "run", "--rm", "-i",
        "-v", `${tempDir}:/app`,
        "gcc:latest",
        "bash", "-c",
        // stdbuf -i0 -o0 -e0 disables buffering for input, output, and error
        "gcc /app/main.c -o /app/main && stdbuf -i0 -o0 -e0 /app/main"
      ]);

      dockerProcess.stdout.on("data", (data) => {
        const text = data.toString();
        socket.emit("stdout", text + "\n");
        // Simple heuristic: if output ends in ':' or '?', it's likely a prompt
        if (text.trim().endsWith(":") || text.trim().endsWith("?")) {
          socket.emit("awaiting-input", true);
        }
      });

      dockerProcess.stderr.on("data", (data) => {
        socket.emit("stderr", data.toString());
      });

      dockerProcess.on("close", (code) => {
        socket.emit("exit", `Program exited with code ${code}`);
        dockerProcess = null;
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
      });
    });

    socket.on("stdin", (input) => {
      if (dockerProcess && dockerProcess.stdin.writable) {
        dockerProcess.stdin.write(input + "\n");
      }
    });

    socket.on("disconnect", () => {
      killExistingProcess();
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });
};