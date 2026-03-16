import { parseJsonBody } from "@/lib/cms/api-request";
import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { submitContactLead } from "@/lib/contact/contact-service";

export async function POST(request: Request) {
    try {
        const body = await parseJsonBody(request);
        const result = await submitContactLead(request, body);
        return apiOk(result);
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/contact");
    }
}
