import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Col, ColorPicker, Form, InputNumber, Radio, Rate, Row, Select, Slider, Space, Switch, Upload } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function OrderForm() {
    const router = useRouter();

    const [file, setFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>("");
    const [show, setShow] = React.useState<string>("hidden");
    const [loadedFileMessage, setLoadedFileMessage] = React.useState<string>("");

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
        console.log("Received values of form: ", values);

        // AWS S3 photo upload process
        if (!file) {
            toast.error("Please upload a photo");
            return;
        }
        const photoUrl = await handlePhotoUpload(file);

        // Add order process
        const { deliveryDate, customerName, customerWechatId, amount, productionCost, soldStatus} = values;
        const responsePromise = fetch("/api/database/add_order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deliveryDate,
                customerName,
                customerWechatId,
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
            return response;
        });

        toast.promise(
            responsePromise,
            {
                loading: "Saving...",
                success: "Order added successfully",
                error: "Error when adding order",
            },
            {}
        );
    };

    React.useEffect((): void => {
        if (message.length > 0) {
            setShow("block");
        }
    }, [show, message]);

    return (
        <div className="border-2 border-lightBorder p-4 w-[28rem] rounded-md bg-whiteDarker text-right">
            <Form name="addOrder" style={{ maxWidth: "500px" }} onFinish={handleSubmit}>
                <Form.Item name="deliveryDate" label="Data di consegna" rules={[{ required: true, message: "Please input the date" }]}>
                    <Input placeholder="Data di consegna" type="date" />
                </Form.Item>
                <Form.Item name="customerName" label="Nome cliente" rules={[{ required: true, message: "Please input the name" }]}>
                    <Input placeholder="Nome cliente" type="text" />
                </Form.Item>
                <Form.Item name="customerWechatId" label="Wechat ID" rules={[{ required: true, message: "Please input the Wechat ID" }]}>
                    <Input placeholder="Wechat ID" type="text" />
                </Form.Item>
                <Form.Item name="amount" label="Da pagare" rules={[{ required: true, message: "Please input the amount" }]}>
                    <Input placeholder="Da pagare" type="number" />
                </Form.Item>
                <Form.Item name="productionCost" label="Costo di produzione" rules={[{ required: true, message: "Please input the cost" }]}>
                    <Input placeholder="Costo di produzione" type="number" />
                </Form.Item>
                <Form.Item label="Foto" extra={loadedFileMessage} rules={[{ required: true, message: "Please input a photo" }]}>
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
                    <label htmlFor="file" className="border-2 p-2 cursor-pointer hover:bg-newBlue-200 transition duration-200 rounded-lg">
                        Scegli foto
                    </label>
                </Form.Item>
                <Form.Item name="soldStatus" label="Status" rules={[{ required: true, message: "Please select the status" }]} initialValue="toSell">
                    <Radio.Group>
                        <Radio value="toMake">Da fare</Radio>
                        <Radio value="toSell">Da vendere</Radio>
                        <Radio value="sold">Venduto</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <button type="submit" className="p-2 bg-white hover:bg-newBlue-500 hover:text-white transition duration-200 border-2 rounded-md">
                            Submit
                        </button>
                        <button type="reset" className="p-2 bg-white hover:bg-newRed-500 hover:text-white transition duration-200 border-2 rounded-md">
                            Reset
                        </button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}

// Thanks @imevanc for the image upload functionality https://github.com/imevanc/nextjs-aws-s3
