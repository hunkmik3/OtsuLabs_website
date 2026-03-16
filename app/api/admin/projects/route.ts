import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { parseJsonBody } from "@/lib/cms/api-request";
import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { createAdminProject, listAdminProjects } from "@/lib/cms/project-service";

export async function GET(request: Request) {
    try {
        await assertAdminRequest(request);
        const projects = await listAdminProjects();
        return apiOk({
            projects,
            total: projects.length,
        });
    } catch (error) {
        return toApiErrorResponse(error, "GET /api/admin/projects");
    }
}

export async function POST(request: Request) {
    try {
        await assertAdminRequest(request);
        const body = await parseJsonBody(request);
        const project = await createAdminProject(body);
        return apiOk({ project }, 201);
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/admin/projects");
    }
}
