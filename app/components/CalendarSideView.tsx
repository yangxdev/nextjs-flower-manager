import React from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";

export default function CalendarSideView() {
    // when a date is selected, it will show the orders for that date on the right side
    const { selectedDate } = React.useContext(SelectedDateContext);
    // context to array
    console.log(selectedDate);
    // const { $D } = selectedDate;
    // console.log($D);
    const { $D, $H, $L, $M, $W, $d, $isDayjsObject, $m, $ms, $s, $u, $x, $y } = selectedDate;
    const month = Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date($y, $M, $D));
    const fullDate = `${month} ${$D}, ${$y}`;
    // TODO: setup prisma and postgresql

    return (
        <div className="flex flex-col gap-4 min-w-[22rem]">
            <div className="text-2xl font-bold mt-2">
                {fullDate}
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-2">
                    ciao
                </div>
            </div>
        </div>
    )
}