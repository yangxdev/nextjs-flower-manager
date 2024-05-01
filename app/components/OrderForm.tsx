import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Col, ColorPicker, Form, InputNumber, Radio, Rate, Row, Select, Slider, Space, Switch, Upload } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
export default function OrderForm() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const normFile = (e: any) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onFinish = async (values: any) => {
        console.log("Received values of form: ", values);
        const deliveryDate = values.deliveryDate;
        const customerName = values.customerName;
        const customerWechatId = values.customerWechatId;
        const amount = values.amount;
        const productionCost = values.productionCost;
        // const photo = values.photo;

        // upload the photo to s3 and get the url
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        setUploading(true);

        // const photoName = photo[0].name;
        // const photoType = photo[0].type;
        const photoName = file.name;
        const photoType = file.type;

        // if (!file) {
        //     alert("Please select a file to upload.");
        //     return;
        // }

        // setUploading(true);

        const response = await fetch("/api/database/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                photoName,
                photoType,
            }),
        });
        if (response.ok) {
            const { url, fields } = await response.json();

            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            formData.append("file", file);
            console.log(Array.from(formData.entries()));

            const uploadResponse = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (uploadResponse.ok) {
                alert("Upload successful!");
            } else {
                console.error("S3 Upload Error:", uploadResponse);
                alert("Upload failed.");
            }
        } else {
            alert("Failed to get pre-signed URL.");
        }

        // setUploading(false);

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
                // photo,
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
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

    return (
        <div className="form">
            <Form name="addOrder" style={{ maxWidth: "500px" }} onFinish={onFinish}>
                <Form.Item label="username">
                    <span className="ant-form-text">Aggiungi ordine</span>
                </Form.Item>
                <Form.Item name="deliveryDate" label="Data di consegna" rules={[{ required: true, message: "Please input the delivery date" }]}>
                    <Input placeholder="Data di consegna" type="date" />
                </Form.Item>
                <Form.Item name="customerName" label="Nome cliente" rules={[{ required: true, message: "Please input client's name" }]}>
                    <Input placeholder="Nome cliente" type="text" />
                </Form.Item>
                <Form.Item name="customerWechatId" label="Wechat ID" rules={[{ required: true, message: "Please input client's Wechat ID" }]}>
                    <Input placeholder="Wechat ID" type="text" />
                </Form.Item>
                <Form.Item name="amount" label="Da pagare" rules={[{ required: true, message: "Please input the amount to be paid by the client" }]}>
                    <Input placeholder="Da pagare" type="number" />
                </Form.Item>
                <Form.Item name="productionCost" label="Costo di produzione" rules={[{ required: true, message: "Please input the production cost" }]}>
                    <Input placeholder="Costo di produzione" type="number" />
                </Form.Item>
                {/* <Form.Item name="photo" label="Foto" valuePropName="fileList" getValueFromEvent={normFile} extra="Seleziona una foto">
                    <Upload name="photo" listType="picture">
                        <Button icon={<UploadOutlined />}>Premi per caricare</Button>
                    </Upload>
                </Form.Item> */}
                <Form.Item name="photo" label="Foto" extra="Seleziona una foto">
                    <input
                        id="file"
                        type="file"
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                                setFile(files[0]);
                            }
                        }}
                        accept="image/png, image/jpeg"
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="reset">reset</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}
