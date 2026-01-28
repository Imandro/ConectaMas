import { getGroupDetails } from "../actions";
import GroupDashboardView from "./GroupDashboardView";
import { notFound } from "next/navigation";
import { auth } from "@/app/lib/auth";

interface PageProps {
    params: {
        groupId: string;
    }
}

export default async function GroupDashboardPage({ params }: PageProps) {
    const session = await auth();
    const group = await getGroupDetails(params.groupId);

    if (!group) {
        notFound();
    }

    return <GroupDashboardView group={group} currentUserId={session?.user?.id} />;
}
