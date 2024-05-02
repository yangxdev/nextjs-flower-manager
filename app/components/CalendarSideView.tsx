import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import { Form, Modal, Radio, RadioChangeEvent } from "antd";
import toast from "react-hot-toast";

export default function CalendarSideView({ handleUpdateView }) {
    const router = useRouter();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState("");

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
            id: order.id,
            customerName: order.customerName,
            customerWechatId: order.customerWechatId,
            amount: order.amount,
            photo: order.photo,
            soldStatus: order.soldStatus,
        }))
        : [];

    // console.log(selectedDateInfoArray);

    if (!selectedDate) {
        return null;
    }

    const showModal = (image: string) => {
        setModalImage(image);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const onStatusChange = (e: RadioChangeEvent) => {
        const responsePromise = fetch("/api/database/update_order_status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: e.target.id?.split("-")[0],
                soldStatus: e.target.value,
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            router.refresh();
            handleUpdateView();
        });

        toast.promise(
            responsePromise,
            {
                loading: "Loading...",
                success: "Stato aggiornato!",
                error: "Errore nell'aggiornamento dello stato",
            },
        )
    }

    return (
        <div className="flex flex-col gap-4 min-w-[20rem]">
            <div className="text-2xl font-bold mt-2">{fullDate}</div>
            <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col gap-4 w-full">
                    {selectedDateInfoArray.map((order: any, index: number) => (
                        <div key={index} className={`info-card gap-1 flex flex-col justify-between border-2 border-lightBorder rounded-md p-4 ${order.soldStatus}`}>
                            <div className="flex flex-row text-xs opacity-50">
                                {order.id}
                            </div>
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
                                <div className="font-semibold mr-2">Stato:</div>
                                {/* {order.soldStatus === "sold" ? "Venduto" : "Non venduto"} */}
                                <Form name="">
                                    <Radio.Group size="small" value={order.soldStatus} onChange={onStatusChange}>
                                        <Radio.Button value="toMake" id={`${order.id}-toMake`}>Da fare</Radio.Button>
                                        <Radio.Button value="toSell" id={`${order.id}-toSell`}>Da vendere</Radio.Button>
                                        <Radio.Button value="sold" id={`${order.id}-sold`}>Venduto</Radio.Button>
                                    </Radio.Group>
                                </Form>
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Foto:</div>
                                {order.photo ? <img src={order.photo} alt="order" className="w-40 h-fit rounded-xl cursor-pointer hover:brightness-90 transition duration-100" onClick={() => showModal(order.photo)} /> : "Nessuna foto"}

                                <Modal open={isModalVisible} onOk={handleOk} onCancel={handleOk} footer={null}>
                                    <img src={modalImage} className="p-6 -mb-3" alt="order" style={{ width: "100%" }} />
                                    <div className="additional-info text-center">
                                        <div className="flex justify-center">
                                            <div className="font-semibold mr-1">{order.customerName}</div> (@{order.customerWechatId})<br />
                                        </div>
                                        <div>{"€ "}{order.amount}<br /></div>
                                        <div>{fullDate}</div>
                                        <div>
                                            {order.soldStatus === "toMake" ? "Da fare" : ""}
                                            {order.soldStatus === "toSell" ? "Da vendere" : ""}
                                            {order.soldStatus === "sold" ? "Venduto" : ""}
                                        </div>
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
// BUG: photo zoom view shows wrong info