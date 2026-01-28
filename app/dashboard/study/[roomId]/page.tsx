import { auth } from "@/app/lib/auth";
import { getRoomDetails, getStudyMessages } from "../actions";
import StudyRoomView from "../components/StudyRoomView";
import { redirect } from "next/navigation";

export default async function StudyRoomPage({ params }: { params: { roomId: string } }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const roomRes = await getRoomDetails(params.roomId);
    if (!roomRes.success || !roomRes.room) redirect("/dashboard/study");

    const msgRes = await getStudyMessages(params.roomId);
    const initialMessages = (msgRes.success && msgRes.messages) ? msgRes.messages : [];

    return (
        <div className="container py-4">
            <StudyRoomView
                room={roomRes.room}
                initialMessages={initialMessages}
                currentUserId={session.user.id}
            />
        </div>
    );
}
