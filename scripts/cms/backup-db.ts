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
    const databaseUrl = config.repository.postgresUrl;
    if (!databaseUrl) {
        throw new Error("CMS_DATABASE_URL (or DATABASE_URL) is required for DB backup.");
    }

    const outputArg = args.get("output");
    const outputPath = resolvePath(outputArg || `backups/cms-db-${createTimestampTag()}.sql`);
    await ensureParentDirectory(outputPath);

    await runCommand("pg_dump", ["--no-owner", "--no-privileges", "--format=plain", "--file", outputPath], {
        env: {
            ...process.env,
            DATABASE_URL: databaseUrl,
        },
    });

    cmsLogger.info("CMS database backup created.", {
        outputPath,
    });
};

main().catch((error) => {
    cmsLogger.error("CMS database backup failed.", {
        error: cmsLogger.normalizeError(error),
    });
    process.exitCode = 1;
});

