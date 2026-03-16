import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { listPublicProjects } from "@/lib/cms/project-service";

export async function GET() {
    try {
        const projects = await listPublicProjects();
        return apiOk({
            projects,
            total: projects.length,
        });
    } catch (error) {
        return toApiErrorResponse(error, "GET /api/projects");
    }
}
