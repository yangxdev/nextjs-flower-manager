import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ACTIVE_ROUTE =
    "pl-[1rem] text-white bg-newBlue-500 dark:text-textColor dark:bg-lightGrayCustom ";
const INACTIVE_ROUTE =
    "pl-[1rem] text-black hover:bg-newBlue-200 hover:text-black dark:text-textColor dark:hover:bg-lightGrayCustom";

const NavLink = ({ to, icon, children }: { to: string; icon: React.ComponentType; children: React.ReactNode }) => {
    const pathname = usePathname();
    return (
        <Link draggable="false" href={to}>
            <li className={`flex flex-row items-center duration-100 transition gap-3 py-3 mx-6 my-4 text-xl font-base rounded-lg ${pathname === to ? ACTIVE_ROUTE : INACTIVE_ROUTE}`}>
                {React.createElement(icon)}
                <span>{children}</span>
            </li>
        </Link>
    );
};

export default NavLink;
