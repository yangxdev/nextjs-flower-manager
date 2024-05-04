import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";

import SessionProvider from "./components/SessionProvider";
import NavMenu from "./components/NavMenu";
import { Toaster } from "react-hot-toast";

const dmSans = DM_Sans({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Flower Manager",
    description: "An order manager web app, made by YANGXDEV",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className={`${dmSans.className} text-black`}>
                <SessionProvider session={session}>
                    <main className="flex flex-row">
                        <NavMenu />
                        <div className="flex-grow p-4 w-screen h-screen relative bg-whiteDarker">
                            {children}
                            <Toaster position="top-right" reverseOrder={false} />
                        </div>
                    </main>
                </SessionProvider>
            </body>
        </html>
    );
}
