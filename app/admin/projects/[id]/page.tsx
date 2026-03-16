import AdminProjectEditor from "@/components/admin/AdminProjectEditor";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminProjectEditorPage({ params }: PageProps) {
    const { id } = await params;
    return <AdminProjectEditor projectId={id} />;
}
