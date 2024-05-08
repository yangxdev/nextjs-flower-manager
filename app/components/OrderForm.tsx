"use client";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Col, ColorPicker, Form, InputNumber, Radio, Rate, Row, Select, Slider, Space, Switch, Upload, Modal, ConfigProvider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { MdAddPhotoAlternate } from "react-icons/md";
import { LoadingStateContext } from "../utils/LoadingStateContext";

export default function OrderForm({ preselectedDate, label }: { preselectedDate?: Date | null; label: string | null }) {
    const router = useRouter();
    const isMobile = window.innerWidth < 768;
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [show, setShow] = useState<string>("hidden");
    const [loadedFileMessage, setLoadedFileMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const { loading } = React.useContext(LoadingStateContext);

    const formRef = useRef<any>();
    useEffect(() => {
        if (isAddModalVisible) {
            formRef.current.resetFields();
            setFile(null);
            setMessage("");
            setLoadedFileMessage("");
        }
    }, [isAddModalVisible]);

    const handleAddModalClose = () => {
        setIsAddModalVisible(false);
    };

    useEffect(() => {
        if (file) {
            setLoadedFileMessage(`File loaded: ${file.name}`);
        }
    }, [file]);

    const handlePhotoUpload = async (file: File) => {
        setUploading(true);

        const response = await fetch(`/api/postPhoto?filename=${file.name}&contentType=${file.type}`);

        if (response.ok) {
            const { url, fields } = await response.json();

            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            formData.append("file", file);

            const uploadResponse = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (uploadResponse.ok) {
                setMessage("Upload successful!");
                const fileUrl = new URL(fields.key, url).toString();
                setUploading(false);
                return fileUrl;
            } else {
                console.error("S3 Upload Error:", uploadResponse);
                setMessage("Upload failed.");
            }
        } else {
            setMessage("Failed to get pre-signed URL.");
        }

        setUploading(false);
        return "";
    };

    const handleSubmit = async (values: any) => {
        //console.log("Received values of form: ", values);
        setIsSubmitting(true);

        // AWS S3 photo upload process
        if (!file) {
            toast.error("Please upload a photo");
            return;
        }
        const photoUrl = await handlePhotoUpload(file);

        const { deliveryDate, customerName, customerWechatId, advance, amount, productionCost, soldStatus } = values;
        const responsePromise = fetch("/api/database/add_order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deliveryDate,
                customerName,
                customerWechatId,
                advance,
                amount,
                productionCost,
                soldStatus,
                photo: photoUrl || "",
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            router.refresh();
            handleAddModalClose();
            setIsSubmitting(false);
            return response;
        });

        toast.promise(
            responsePromise,
            {
                loading: "Saving...",
                success: "Order added successfully",
                error: "Error when adding order",
            },
            {
                position: "bottom-center",
            }
        );
    };

    useEffect((): void => {
        if (message.length > 0) {
            setShow("block");
        }
    }, [show, message]);

    const onReset = () => {
        formRef.current.resetFields();
        setFile(null);
        setMessage("");
        setLoadedFileMessage("");
    };

    return (
        <>
            {/* <div
                className="text-black border-2 border-lightBorder hover:text-white hover:bg-newBlue-500 w-fit items-center flex flex-row gap-1 p-2 rounded-lg bg-whiteDarker cursor-pointer"
                onClick={() => {
                    setIsAddModalVisible(true);
                }}
            >
                <FaPlus /> {label}
            </div> */}
            <div>
                <div
                    className={`custom-loading-spinner bg-white w-[7.5rem] border-[#d9d9d9] border-[1px] flex justify-center items-center h-[32px] rounded-[6px] ${loading ? "" : "hidden"}`}
                    style={{
                        boxShadow: "0 2px 0 rgba(0,0,0, 0.02)",
                    }}
                >
                    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-newPink-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
                <Button
                    type="default"
                    className={`flex items-center w-fit bg-white ${loading ? "hidden" : ""}`}
                    icon={<FaPlus />}
                    onClick={() => {
                        setIsAddModalVisible(true);
                    }}
                >
                    {label}
                </Button>
            </div>
            <Modal open={isAddModalVisible} transitionName={isMobile ? "" : undefined} onOk={handleAddModalClose} onCancel={handleAddModalClose} footer={null}>
                <div className="p-4 w-full rounded-md bg-white">
                    <div className="font-semibold mb-4 text-left text-lg">Add Order</div>
                    <Form name="addOrder" style={{ maxWidth: "500px" }} onFinish={handleSubmit} ref={formRef}>
                        <Form.Item name="deliveryDate" rules={[{ required: true, message: "Please input the date" }]} initialValue={preselectedDate ? preselectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Delivery date</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Delivery date" type="date" defaultValue={preselectedDate ? preselectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="customerName" rules={[{ required: true, message: "Please input the name" }]}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Client name</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Client name" type="text" />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="customerWechatId" rules={[{ required: true, message: "Please input the ID" }]}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>WeChat ID</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Wechat ID" type="text" />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="advance" rules={[{ required: true, message: "Please input the advance" }]} initialValue={0}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Advance</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Advance" type="number" defaultValue={0} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="amount" rules={[{ required: true, message: "Please input the amount" }]}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Amount</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Amount" type="number" />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="productionCost" rules={[{ required: true, message: "Please input the cost" }]}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Production cost</label>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="Production cost" type="number" />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="photo" extra={loadedFileMessage} rules={[{ required: true, message: "Please input the photo" }]}>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <label>Photo</label>
                                </Col>
                                <Col span={16}>
                                    <div className="flex justify-end select-none">
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
                        </Form.Item>

                        <Form.Item name="soldStatus" rules={[{ required: true, message: "Please select the status" }]} initialValue="toMake">
                            <Row gutter={8}>
                                <Col span={6}>
                                    <label>Status</label>
                                </Col>
                                <Col span={18} style={{ textAlign: "right" }}>
                                    <Radio.Group className="select-none" defaultValue={"toMake"} buttonStyle="solid">
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
                                <Button type="default" onClick={onReset}>
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

// Thanks @imevanc for the image upload functionality https://github.com/imevanc/nextjs-aws-s3

//TODO: drag and drop file upload
