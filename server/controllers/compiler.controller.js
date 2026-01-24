const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Built-in Node tool

const runCCode = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    // Generate a unique ID using built-in crypto (works in CommonJS perfectly)
    const jobId = crypto.randomUUID();
    
    // Create paths
    const folderPath = path.join(__dirname, 'temp');
    const filePath = path.join(folderPath, `${jobId}.c`);
    const outPath = path.join(folderPath, `${jobId}.out`);

    // Ensure temp directory exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    try {
        // 1. Write the code to file
        fs.writeFileSync(filePath, code);

        // 2. Compile
        exec(`gcc "${filePath}" -o "${outPath}"`, (compileError, stdout, stderr) => {
            if (compileError) {
                // If compilation fails, delete the .c file and return error
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                return res.status(200).json({ status: "error", stderr });
            }

            // 3. Run the binary
            exec(`"${outPath}"`, (runError, runStdout, runStderr) => {
                // Cleanup: Delete both files after execution
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

                if (runError) {
                    return res.status(200).json({ status: "run_error", stderr: runStderr });
                }

                res.status(200).json({ status: "success", stdout: runStdout });
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};

module.exports = { runCCode };