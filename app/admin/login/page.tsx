import AdminLoginForm from "@/components/admin/AdminLoginForm";

interface PageProps {
    searchParams: Promise<{ next?: string }>;
}

const normalizeNextPath = (value?: string) => {
    if (!value || typeof value !== "string") return "/admin/projects";
    if (!value.startsWith("/admin")) return "/admin/projects";
    return value;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const nextPath = normalizeNextPath(params.next);
    return <AdminLoginForm nextPath={nextPath} />;
}
