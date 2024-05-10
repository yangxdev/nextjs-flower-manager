import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import { Button, ConfigProvider, Form, Modal, Popconfirm, Radio, RadioChangeEvent } from "antd";
import toast from "react-hot-toast";
import Image from "next/image";
import { ScrollContext } from "../utils/ScrollContext";
import { MdDelete } from "react-icons/md";
import OrderForm from "./OrderForm";
import EditForm from "./EditForm";
import { useMediaQuery } from "react-responsive";
import { FaPlus } from "react-icons/fa6";
import { AddModalContext } from "../utils/AddModalContext";
import dayjs from "dayjs";

export default function CalendarSideView(props: { orders: any[] }) {
    const router = useRouter();

    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState("");

    const { isAddModalVisible, setIsAddModalVisible } = React.useContext(AddModalContext);

    const { selectedDate } = React.useContext(SelectedDateContext);
    const { selectedDateInfo, setSelectedDateInfo } = React.useContext(SelectedDateInfoContext);
    const infoIsEmpty = selectedDateInfo && Object.keys(selectedDateInfo).length === 0;

    const filteredOrders = props.orders.filter((order) => dayjs(order.deliveryDate).isSame(selectedDate, "day"));

    useEffect(() => {
        // updates the orders list when the received props change
        setSelectedDateInfo({});
        filteredOrders.forEach((order) => {
            setSelectedDateInfo((prevState: any) => {
                return {
                    ...prevState,
                    [order.id]: order,
                };
            });
        });
    }, [props.orders]);

    // const { topViewRef } = React.useContext(ScrollContext);

    const sideViewRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // when in mobile, scrolls to the bottom of the side view when a date is selected
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
              advance: order.advance,
              amount: order.amount,
              productionCost: order.productionCost,
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

    const onStatusChange = (id: string) => (e: RadioChangeEvent) => {
        const responsePromise = fetch("/api/database/update_order_status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                sold_status: e.target.value,
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            router.refresh();
            handleUpdateContext(id, e.target.value);
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

    const handleUpdateContext = (id: string, status: string) => {
        setSelectedDateInfo((prevState: any) => {
            const updatedInfo = { ...prevState };
            for (const key in updatedInfo) {
                if (updatedInfo[key].id === id) {
                    updatedInfo[key].soldStatus = status;
                }
            }
            return updatedInfo;
        });
    };

    const deleteOrder = async (id: string) => {
        const responsePromise = fetch("/api/database/delete_order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            router.refresh();
            setSelectedDateInfo((prevState: any) => {
                const updatedInfo = { ...prevState };
                for (const key in updatedInfo) {
                    if (updatedInfo[key].id === id) {
                        delete updatedInfo[key];
                    }
                }
                return updatedInfo;
            });
        });

        toast.promise(
            responsePromise,
            {
                loading: "Loading...",
                success: "Order deleted!",
                error: "Error when deleting order",
            },
            {
                position: "bottom-center",
            }
        );
    };

    const borderColor = (status: string) => {
        switch (status) {
            case "toMake":
                return "border-l-[#f5222d]";
            case "toSell":
                return "border-l-[#faad14]";
            case "sold":
                return "border-l-[#52c41a]";
            default:
                return "";
        }
    };

    return (
        <>
            <div className="border-b hidden border-[1.5px] md:border-r border-lightBorder"></div>

            <div className={`calendar-side-view flex flex-col gap-4 min-w-fit h-full md:overflow-y-auto md:h-[calc(100vh-13rem)] ${!infoIsEmpty ? "fade show" : "hide fade"}`} ref={sideViewRef}>
                <div className="mt-2 gap-2 flex flex-row items-center justify-between">
                    <div className="text-2xl font-bold text-black">{fullDate}</div>
                    <Button
                        type="default"
                        className={`flex items-center w-fit bg-white`}
                        icon={<FaPlus />}
                        onClick={() => {
                            setIsAddModalVisible(true);
                        }}
                    ></Button>
                </div>
                <div className="flex flex-col gap-4 w-full overflow-y-auto">
                    {selectedDateInfoArray.map((order: any, index: number) => (
                        <div key={index} className={`info-card gap-1 bg-white flex flex-col justify-between border-2 border-lightBorder rounded-md p-4 ${borderColor(order.soldStatus)} border-l-4`}>
                            <div className="flex flex-row text-xs opacity-50">{order.id}</div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Client:</div>
                                {order.customerName}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">WeChat ID:</div>
                                {order.customerWechatId}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Advance:</div>
                                {"€ " + order.advance}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Amount:</div>
                                {"€ " + order.amount}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Production cost:</div>
                                {"€ " + order.productionCost}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Status:</div>
                                {/* {order.soldStatus === "sold" ? "Sold" : "Non Sold"} */}
                                <Form name="">
                                    <Radio.Group buttonStyle="solid" size="small" className="select-none" onChange={onStatusChange(order.id)} value={order.soldStatus}>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Radio: {
                                                        buttonSolidCheckedActiveBg: "#F5222D",
                                                        buttonSolidCheckedBg: "#F5222D",
                                                        buttonSolidCheckedHoverBg: "#FF4D4F",
                                                    },
                                                },
                                            }}
                                        >
                                            <Radio.Button value="toMake">To make</Radio.Button>
                                        </ConfigProvider>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Radio: {
                                                        buttonSolidCheckedActiveBg: "#FAAD14",
                                                        buttonSolidCheckedBg: "#FAAD14",
                                                        buttonSolidCheckedHoverBg: "#FFC940",
                                                    },
                                                },
                                            }}
                                        >
                                            <Radio.Button value="toSell">To sell</Radio.Button>
                                        </ConfigProvider>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Radio: {
                                                        buttonSolidCheckedActiveBg: "#52C41A",
                                                        buttonSolidCheckedBg: "#52C41A",
                                                        buttonSolidCheckedHoverBg: "#73D13D",
                                                    },
                                                },
                                            }}
                                        >
                                            <Radio.Button value="sold">Sold</Radio.Button>
                                        </ConfigProvider>
                                    </Radio.Group>
                                </Form>
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Photo:</div>
                                {order.photo ? <Image src={order.photo} alt="order" width={200} height={200} className="w-40 h-fit rounded-xl cursor-pointer hover:brightness-90 transition duration-100" onClick={() => showZoomModal(order.photo)} /> : "Nessuna Photo"}

                                <Modal open={isZoomModalVisible} transitionName={isMobile ? "" : undefined} onOk={handleZoomModalClose} onCancel={handleZoomModalClose} footer={null}>
                                    <Image src={modalImage} className="p-6 -mb-3" height={200} width={200} alt="order" style={{ width: "100%" }} onClick={handleZoomModalClose} />
                                </Modal>
                            </div>
                            <div className="flex flex-row mt-2 justify-end gap-3">
                                <EditForm orderId={order.id} orders={props.orders} />
                                <Popconfirm
                                    title="Delete this order"
                                    description="Are you sure you want to delete this order? This action cannot be undone."
                                    onConfirm={() => {
                                        deleteOrder(order.id);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button className="flex flex-row gap-1 items-center pr-5" type="primary" danger>
                                        <MdDelete />
                                        Delete
                                    </Button>
                                </Popconfirm>
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
        </>
    );
}

// DONE: mobile view
// BUG: photo zoom view shows wrong info -> disabled for now
// TODO: skeleton of image loading
// TODO: add entry from side view, with already selected date
// TODO: search functionality
