"use client";
import { Button } from "antd";
import { signOut } from "next-auth/react";
import { RiLogoutBoxLine } from "react-icons/ri";

export default function SignOutButton() {
    return (
        // <button className="transition rounded-lg duration-100 mx-6 w-fit text-black text-xl hover:bg-newBlue-200 dark:bg-lightGrayCustom2 dark:opacity-60 dark:hover:opacity-100 text-left" onClick={() => signOut()}>
        //     <div className="flex flex-row items-center gap-2 px-[1rem] py-2">
        //         <RiLogoutBoxLine />
        //         <div>Sign out</div>
        //     </div>
        // </button>
        <Button className="flex items-center ml-auto bg-white" onClick={() => signOut()} icon={<RiLogoutBoxLine />}>
            Sign out
        </Button>
    );
}
