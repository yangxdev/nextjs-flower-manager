import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import GlobalConfig from "@/app/app.config";
import CalendarSectionServer from "../app/components/CalendarSectionServer";
import OrderForm from "./components/OrderForm";
import SignOutButton from "./components/SignOutButton";
import Greetings from "./components/Greetings";

const defaultLanguage = GlobalConfig.i18n.defaultLanguage || "en";
const gc = GlobalConfig.i18n.translations[defaultLanguage as keyof typeof GlobalConfig.i18n.translations]?.dashboard;

export default async function Home() {
    const session = await getServerSession();
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <>
            {/* <div className="header flex flex-row justify-between">
                <div className="title font-bold text-2xl select-none">{gc?.title}</div>
                <div className="order-form">
                    <OrderForm label={"Add Order"}/>
                </div>
            </div>
            <div className="text-lg greeting mb-2 opacity-80" suppressHydrationWarning>
                    <Greetings />
                </div> */}
            <CalendarSectionServer />
            {/* <SignOutButton /> */}
        </>
    );
}

// DONE: Edit button in side view entries