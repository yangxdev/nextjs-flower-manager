import { Button, Col, Form, Input, Modal, Radio, Row, Space } from "antd";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdAddPhotoAlternate, MdEdit } from "react-icons/md";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import dayjs, { Dayjs } from "dayjs";
import { getRandomValues } from "crypto";

export default function EditForm(props: { orderId: string; orders: any[] }) {
    const router = useRouter();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const orderData = props.orders.find((order) => order.id === props.orderId);
    const { deliveryDate, customerName, customerWechatId, advance, amount, productionCost, photo, soldStatus } = orderData;

    const inputDefaultDeliveryDate = deliveryDate ? deliveryDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

    const { selectedDateInfo, setSelectedDateInfo } = useContext(SelectedDateInfoContext);

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

    const formRef = useRef<any>(null);
    const handleEditModalClose = () => {
        formRef.current.resetFields();
        setIsEditModalVisible(false);
    };
    const handleContextUpdate = (values: any) => {
        // get all orders of the selected date
        const date = deliveryDate;
        const updatedDeliveryDate = values.deliveryDate;
        if (!dayjs(updatedDeliveryDate).isSame(date, "day")) {
            const updatedFilteredOrders = (selectedDateInfo as any[]).filter((order) => order.id !== props.orderId);
            setSelectedDateInfo(updatedFilteredOrders);
            return;
        }
        const filteredOrders = props.orders.filter((order) => dayjs(order.deliveryDate).isSame(date, "day"));
        const updatedFilteredOrders = filteredOrders.map((order) => {
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
        setSelectedDateInfo(updatedFilteredOrders);
    };

    const onReset = () => {
        formRef.current.resetFields();
    }

    return (
        <>
            <Button className="flex flex-row items-center gap-1" type="default" onClick={() => setIsEditModalVisible(true)}>
                <MdEdit /> {"Edit"}
            </Button>
            <Modal
                key={isEditModalVisible ? "editModal" : null} // the solution!!!
                open={isEditModalVisible}
                transitionName=""
                footer={null}
                onCancel={() => handleEditModalClose()}
                onOk={() => setIsEditModalVisible(false)}
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
                                    <Radio.Group defaultValue={soldStatus} buttonStyle="solid">
                                        <Radio.Button value="toMake">To make</Radio.Button>
                                        <Radio.Button value="toSell">To sell</Radio.Button>
                                        <Radio.Button value="sold">Sold</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item className="text-right">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                    Submit
                                </Button>
                                {/* <button type="reset" className="p-2 bg-white hover:bg-newRed-500 hover:text-white transition duration-200 border-2 rounded-md">
                                    Reset
                                </button> */}
                                {/* reset button */}
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
