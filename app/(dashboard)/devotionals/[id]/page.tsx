import { redirect } from 'next/navigation';

export default function LegacyDevotionalDetailPage({ params }: { params: { id: string } }) {
    redirect(`/dashboard/devotionals/${params.id}`);
}
