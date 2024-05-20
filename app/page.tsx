import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import CalendarSectionServer from "../app/components/CalendarSectionServer";

export default async function Home() {
    const session = await getServerSession();
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <>
            <CalendarSectionServer />
        </>
    );
}

// DONE: Edit button in side view entries
// TODO: add "go to top" button