import { mkdir } from "node:fs/promises";
import { getCmsConfig } from "../../lib/cms/config";
import { cmsLogger } from "../../lib/cms/logger";
import { parseCliArgs, resolvePath, runCommand } from "./_helpers";

const main = async () => {
    const args = parseCliArgs(process.argv.slice(2));
    const inputArg = args.get("input");
    if (!inputArg) {
        throw new Error("Missing required argument: --input <path-to-tar.gz>");
    }

    const config = getCmsConfig();
    if (config.media.storageMode !== "local") {
        throw new Error(
            "Media restore script currently supports local mode only. For S3 mode, use provider-native restore."
        );
    }

    const inputPath = resolvePath(inputArg);
    const targetDirectory = resolvePath(config.media.localUploadDirectory);
    await mkdir(targetDirectory, { recursive: true });

    await runCommand("tar", ["-xzf", inputPath, "-C", targetDirectory]);

    cmsLogger.info("CMS media restore completed.", {
        inputPath,
        targetDirectory,
    });
};

main().catch((error) => {
    cmsLogger.error("CMS media restore failed.", {
        error: cmsLogger.normalizeError(error),
    });
    process.exitCode = 1;
});

