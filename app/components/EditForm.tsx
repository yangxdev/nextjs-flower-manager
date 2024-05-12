import { Button, Col, ConfigProvider, Form, Input, Modal, Radio, Row, Space } from "antd";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedDateOrders } from "../features/selectedDateOrders/selectedDateOrdersSlice";

export default function EditForm(props: { orderId: string; orders: any[] }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const formRef = useRef<any>(null);
    const isMobile = window.innerWidth < 768;
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedDateOrders = JSON.parse(useSelector((state: RootState) => state.selectedDateOrders.value) as string);
    if (selectedDateOrders === undefined || Object.keys(selectedDateOrders).length === 0) {
        return null;
    }

    if (props.orderId === undefined) {
        return null;
    }
    const orderData = Object.values(selectedDateOrders).find((order: any) => order.id === props.orderId); // const orderData = props.orders.find((order) => order.id === props.orderId);
    if (orderData === undefined) {
        return null;
    }
    const { deliveryDate, customerName, customerWechatId, advance, amount, productionCost, photo, soldStatus } = orderData as any;
    const inputDefaultDeliveryDate = deliveryDate ? deliveryDate.split("T")[0] : new Date().toISOString().split("T")[0];

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        const responsePromise = fetch("/api/database/edit_order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deliveryDate: values.deliveryDate,
                customerName: values.customerName,
                customerWechatId: values.customerWechatId,
                advance: values.advance,
                amount: values.amount,
                productionCost: values.productionCost,
                soldStatus: values.soldStatus,
                photo: photo,
                updated_at: new Date().toISOString(),
                orderId: props.orderId,
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            router.refresh();
            handleEditModalClose();
            handleContextUpdate(values);
            setIsSubmitting(false);
            return response;
        });

        toast.promise(
            responsePromise,
            {
                loading: "Saving...",
                success: "Order edited successfully",
                error: "Error when editing order",
            },
            {
                position: "bottom-center",
            }
        );
    };

    const handleEditModalClose = () => {
        setIsEditModalVisible(false);
    };
    const handleContextUpdate = (values: any) => {
        // get all orders of the selected date
        const date = deliveryDate;
        const updatedDeliveryDate = values.deliveryDate;
        if (!dayjs(updatedDeliveryDate).isSame(date, "day")) {
            const updatedFilteredOrders = (selectedDateOrders as any[]).filter((order) => order.id !== props.orderId);
            dispatch(setSelectedDateOrders(updatedFilteredOrders));
            return;
        }
        const filteredOrders = props.orders.filter((order) => dayjs(order.deliveryDate).isSame(date, "day"));
        const toBeDispatched = filteredOrders.map((order) => {
            if (order.id === props.orderId) {
                return {
                    ...order,
                    deliveryDate: values.deliveryDate,
                    customerName: values.customerName,
                    customerWechatId: values.customerWechatId,
                    advance: values.advance,
                    amount: values.amount,
                    productionCost: values.productionCost,
                    soldStatus: values.soldStatus,
                };
            }
            return order;
        });
        dispatch(setSelectedDateOrders(JSON.stringify(toBeDispatched)));
    };

    const onReset = () => {
        formRef.current.resetFields();
    };

    return (
        <>
            <Button className="flex flex-row items-center gap-1" type="default" onClick={() => setIsEditModalVisible(true)}>
                <MdEdit /> {"Edit"}
            </Button>
            <Modal
                key={isEditModalVisible ? "editModal" : null} // solution to the issue of modals not re-rendering (also breaking the photo input field)
                open={isEditModalVisible}
                transitionName={isMobile ? "" : undefined}
                footer={null}
                onCancel={handleEditModalClose}
                onOk={handleEditModalClose}
            >
                <div className="p-4 w-full rounded-md bg-white">
                    <div className="font-semibold mb-4 text-left text-lg">Edit Order</div>
                    <Form name="editOrder" style={{ maxWidth: "500px" }} onFinish={handleSubmit} ref={formRef}>
                        <Form.Item name="deliveryDate" rules={[{ required: true, message: "Please input the date" }]} initialValue={inputDefaultDeliveryDate}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Delivery date</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Delivery date" type="date" defaultValue={inputDefaultDeliveryDate} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="customerName" rules={[{ required: true, message: "Please input the name" }]} initialValue={customerName}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Client name</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Client name" type="text" defaultValue={customerName} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="customerWechatId" rules={[{ required: true, message: "Please input the ID" }]} initialValue={customerWechatId}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>WeChat ID</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Wechat ID" type="text" defaultValue={customerWechatId} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="advance" rules={[{ required: true, message: "Please input the advance" }]} initialValue={advance}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Advance</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Advance" type="number" defaultValue={advance} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="amount" rules={[{ required: true, message: "Please input the amount" }]} initialValue={amount}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Amount</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Amount" type="number" defaultValue={amount} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="productionCost" rules={[{ required: true, message: "Please input the cost" }]} initialValue={productionCost}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Production cost</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Production cost" type="number" defaultValue={productionCost} />
                                </Col>
                            </Row>
                        </Form.Item>

                        {/* <Form.Item name="photo" extra={loadedFileMessage} rules={[{ required: true, message: "Please input the photo" }]}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Photo</label>
                                </Col>
                                <Col span={16}>
                                    <div className="flex justify-end">
                                        <input
                                            id="file"
                                            type="file"
                                            className=""
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                if (files) {
                                                    setFile(files[0]);
                                                }
                                            }}
                                            accept="image/png, image/jpeg, image/jpg"
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor="file" className="flex flex-row gap-1 items-center w-fit border-2 p-2 cursor-pointer hover:bg-newBlue-200 transition duration-200 rounded-lg">
                                            <MdAddPhotoAlternate />
                                            {file ? "Change photo" : "Upload photo"}
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                        </Form.Item> */}

                        <Form.Item name="soldStatus" rules={[{ required: true, message: "Please select the status" }]} initialValue={soldStatus}>
                            <Row gutter={8}>
                                <Col span={6}>
                                    <label>Status</label>
                                </Col>
                                <Col span={18} style={{ textAlign: "right" }}>
                                    <Radio.Group defaultValue={soldStatus} className="select-none" buttonStyle="solid">
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
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item className="text-right">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                    Submit
                                </Button>
                                <Button htmlType="button" onClick={onReset}>
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
