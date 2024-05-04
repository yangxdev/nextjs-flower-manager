import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import { Button, Form, Modal, Radio, RadioChangeEvent } from "antd";
import toast from "react-hot-toast";
import Image from "next/image";
import { ScrollContext } from "../utils/ScrollContext";

export default function CalendarSideView() {
    const router = useRouter();

    const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState("");

    const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({});

    const { selectedDate } = React.useContext(SelectedDateContext);
    const { selectedDateInfo } = React.useContext(SelectedDateInfoContext);
    const infoIsEmpty = selectedDateInfo && Object.keys(selectedDateInfo).length === 0;

    // const { topViewRef } = React.useContext(ScrollContext);

    const sideViewRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (selectedDateInfo && !infoIsEmpty && window.innerWidth < 768) {
            sideViewRef?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }, [infoIsEmpty, selectedDateInfo]);

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

    if (!selectedDate) {
        return null;
    }

    const showZoomModal = (image: string) => {
        setModalImage(image);
        setIsZoomModalVisible(true);
    };

    const handleZoomModalClose = () => {
        setIsZoomModalVisible(false);
    };

    const onStatusChange = (e: RadioChangeEvent) => {
        const orderId = e.target.id?.split("-")[0];
        const newStatus = e.target.value;

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
            setOrderStatuses((prevStatuses) => ({ ...prevStatuses, [String(orderId)]: newStatus }));
        });

        toast.promise(
            responsePromise,
            {
                loading: "Loading...",
                success: "Status updated!",
                error: "Error when updating status",
            },
            {
                position: "bottom-center",
            }
        );
    };

    return (
        <div className="flex flex-col gap-4 min-w-[20rem] h-full" ref={sideViewRef}>
            <div className="text-2xl font-bold mt-2 gap-2 flex flex-row items-center justify-between">
                <div className="">{fullDate}</div>
            </div>
            <div className="flex flex-col gap-4 w-full overflow-y-auto h-screen">
                {selectedDateInfoArray.map((order: any, index: number) => (
                    <div key={index} className={`info-card gap-1 flex flex-col justify-between border-2 border-lightBorder rounded-md p-4 ${orderStatuses[order.id] || order.soldStatus}`}>
                        <div className="flex flex-row text-xs opacity-50 hidden">{order.id}</div>
                        <div className="flex flex-row">
                            <div className="font-semibold mr-2">Client:</div>
                            {order.customerName}
                        </div>
                        <div className="flex flex-row">
                            <div className="font-semibold mr-2">WeChat ID:</div>
                            {order.customerWechatId}
                        </div>
                        <div className="flex flex-row">
                            <div className="font-semibold mr-2">Amount:</div>
                            {"€ "}
                            {order.amount}
                        </div>
                        <div className="flex flex-row">
                            <div className="font-semibold mr-2">Status:</div>
                            {/* {order.soldStatus === "sold" ? "Sold" : "Non Sold"} */}
                            <Form name="">
                                <Radio.Group size="small" value={orderStatuses[order.id] || order.soldStatus} onChange={onStatusChange}>
                                    <Radio.Button value="toMake" id={`${order.id}-toMake`}>
                                        To make
                                    </Radio.Button>
                                    <Radio.Button value="toSell" id={`${order.id}-toSell`}>
                                        To sell
                                    </Radio.Button>
                                    <Radio.Button value="sold" id={`${order.id}-sold`}>
                                        Sold
                                    </Radio.Button>
                                </Radio.Group>
                            </Form>
                        </div>
                        <div className="flex flex-row">
                            <div className="font-semibold mr-2">Photo:</div>
                            {order.photo ? <Image src={order.photo} alt="order" width={200} height={200} className="w-40 h-fit rounded-xl cursor-pointer hover:brightness-90 transition duration-100" onClick={() => showZoomModal(order.photo)} /> : "Nessuna Photo"}

                            <Modal open={isZoomModalVisible} onOk={handleZoomModalClose} onCancel={handleZoomModalClose} footer={null}>
                                <Image src={modalImage} className="p-6 -mb-3" height={200} width={200} alt="order" style={{ width: "100%" }} />
                                <div className="additional-info text-center">
                                    {/* <div className="flex justify-center">
                                        <div className="font-semibold mr-1">{order.customerName}</div> (@{order.customerWechatId})<br />
                                    </div>
                                    <div>
                                        {"€ "}
                                        {order.amount}
                                        <br />
                                    </div>
                                    <div>{fullDate}</div> */}
                                    
                                    {/* <div>
                                            {(orderStatuses[order.id] || order.soldStatus) === "toMake" ? "To make" : ""}
                                            {(orderStatuses[order.id] || order.soldStatus) === "toSell" ? "To sell" : ""}
                                            {(orderStatuses[order.id] || order.soldStatus) === "sold" ? "Sold" : ""}
                                        </div>
                                        <div className="">{orderStatuses[order.id]}</div> */}
                                </div>
                            </Modal>
                        </div>
                    </div>
                ))}
            </div>
            {/* <div>
                <Button
                    type="primary"
                    onClick={() => {
                        topViewRef?.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    Torna su
                </Button>
            </div> */}
        </div>
    );
}

// TODO: mobile view
// BUG: photo zoom view shows wrong info
