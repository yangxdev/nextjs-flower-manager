import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";

import SessionProvider from "./components/SessionProvider";
import NavMenu from "./components/NavMenu";
import { getServers } from "dns";
import { Toaster } from "react-hot-toast";

import localFont from "next/font/local";

const myFont = localFont({ src: "./fonts/Avenir Book.ttf" });

const dmSans = DM_Sans({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Flower Manager",
    description: "Generated by create next app, made by YANGXDEV",
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
                        <div className="flex-grow p-2 w-screen h-screen relative bg-whiteDarker">
                            {children}
                            <Toaster position="top-right" reverseOrder={false} />
                        </div>
                    </main>
                </SessionProvider>
            </body>
        </html>
    );
}
