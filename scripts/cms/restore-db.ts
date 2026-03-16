import { access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { getCmsConfig } from "../../lib/cms/config";
import { cmsLogger } from "../../lib/cms/logger";
import { parseCliArgs, resolvePath, runCommand } from "./_helpers";

const main = async () => {
    const args = parseCliArgs(process.argv.slice(2));
    const inputArg = args.get("input");
    if (!inputArg) {
        throw new Error("Missing required argument: --input <path-to-sql-file>");
    }

    const inputPath = resolvePath(inputArg);
    await access(inputPath, fsConstants.R_OK);

    const config = getCmsConfig();
    const databaseUrl = config.repository.postgresUrl;
    if (!databaseUrl) {
        throw new Error("CMS_DATABASE_URL (or DATABASE_URL) is required for DB restore.");
    }

    await runCommand("psql", ["--single-transaction", "--file", inputPath], {
        env: {
            ...process.env,
            DATABASE_URL: databaseUrl,
        },
    });

    cmsLogger.info("CMS database restore completed.", {
        inputPath,
    });
};

main().catch((error) => {
    cmsLogger.error("CMS database restore failed.", {
        error: cmsLogger.normalizeError(error),
    });
    process.exitCode = 1;
});

