import React, { useState } from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import { Modal } from "antd";

export default function CalendarSideView() {
    // when a date is selected, it will show the orders for that date on the right side
    const { selectedDate } = React.useContext(SelectedDateContext);
    const { selectedDateInfo } = React.useContext(SelectedDateInfoContext);
    if (!selectedDate) {
        return null;
    }
    const { $D, $H, $L, $M, $W, $d, $isDayjsObject, $m, $ms, $s, $u, $x, $y } = selectedDate;
    const month = Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date($y, $M, $D));
    const fullDate = `${month} ${$D}, ${$y}`;

    const selectedDateInfoArray = selectedDateInfo
        ? Object.values(selectedDateInfo).map((order: any) => ({
              customerName: order.customerName,
              customerWechatId: order.customerWechatId,
              amount: order.amount,
              photo: order.photo,
          }))
        : [];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState("");

    const showModal = (image: string) => {
        setModalImage(image);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="flex flex-col gap-4 min-w-[22rem]">
            <div className="text-2xl font-bold mt-2">{fullDate}</div>
            <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col gap-4 w-full">
                    {selectedDateInfoArray.map((order: any, index: number) => (
                        <div key={index} className="flex flex-col justify-between border-2 border-lightBorder rounded-md p-4">
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Cliente:</div>
                                {order.customerName}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">WeChat ID:</div>
                                {order.customerWechatId}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Quantità:</div>
                                {"€ "}
                                {order.amount}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Foto:</div>
                                {order.photo ? <img src={order.photo} alt="order" className="w-40 h-fit rounded-xl cursor-pointer hover:brightness-90 transition duration-100" onClick={() => showModal(order.photo)} /> : "Nessuna foto"}

                                <Modal open={isModalVisible} onOk={handleOk} onCancel={handleOk} footer={null}>
                                    <img src={modalImage} className="p-6 -mb-3" alt="order" style={{ width: "100%" }} />
                                    <div className="additional-info text-center">
                                        <div className="flex justify-center">
                                            <div className="font-semibold mr-1">{order.customerName}</div> (@{order.customerWechatId})<br/>
                                        </div>
                                        <div>{"€ "}{order.amount}<br /></div>
                                        <div>{fullDate}</div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// TODO: mobile view