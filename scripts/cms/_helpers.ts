import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export const parseCliArgs = (argv: string[]) => {
    const args = new Map<string, string>();

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (!token.startsWith("--")) continue;

        const key = token.slice(2);
        const next = argv[index + 1];
        if (!next || next.startsWith("--")) {
            args.set(key, "true");
            continue;
        }

        args.set(key, next);
        index += 1;
    }

    return args;
};

export const createTimestampTag = () => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(
        now.getUTCHours()
    )}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
};

export const resolvePath = (value: string) => resolve(process.cwd(), value);

export const ensureParentDirectory = async (filePath: string) => {
    await mkdir(dirname(filePath), { recursive: true });
};

export const runCommand = async (
    command: string,
    args: string[],
    options?: { env?: NodeJS.ProcessEnv }
) => {
    await new Promise<void>((resolvePromise, rejectPromise) => {
        const child = spawn(command, args, {
            stdio: "inherit",
            env: options?.env ?? process.env,
        });

        child.on("error", (error) => {
            rejectPromise(error);
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolvePromise();
                return;
            }
            rejectPromise(new Error(`${command} exited with code ${code ?? -1}`));
        });
    });
};

export const quoteSqlIdentifier = (value: string) => `"${value.replace(/"/g, "\"\"")}"`;

