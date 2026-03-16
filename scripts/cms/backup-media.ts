import { getCmsConfig } from "../../lib/cms/config";
import { cmsLogger } from "../../lib/cms/logger";
import {
    createTimestampTag,
    ensureParentDirectory,
    parseCliArgs,
    resolvePath,
    runCommand,
} from "./_helpers";

const main = async () => {
    const args = parseCliArgs(process.argv.slice(2));
    const config = getCmsConfig();

    if (config.media.storageMode !== "local") {
        throw new Error(
            "Media backup script currently supports local mode only. For S3 mode, use provider-native backup/export."
        );
    }

    const sourceDirectory = resolvePath(config.media.localUploadDirectory);
    const outputPath = resolvePath(args.get("output") || `backups/cms-media-${createTimestampTag()}.tar.gz`);
    await ensureParentDirectory(outputPath);

    await runCommand("tar", ["-czf", outputPath, "-C", sourceDirectory, "."]);

    cmsLogger.info("CMS media backup created.", {
        sourceDirectory,
        outputPath,
    });
};

main().catch((error) => {
    cmsLogger.error("CMS media backup failed.", {
        error: cmsLogger.normalizeError(error),
    });
    process.exitCode = 1;
});

