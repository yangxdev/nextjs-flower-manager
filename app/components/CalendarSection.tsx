"use client";
import { Calendar as AntdCalendar, Input } from "antd";
import CalendarSideView from "./CalendarSideView";
import React from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import Calendar from "./Calendar";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, ColorPicker, Form, InputNumber, Radio, Rate, Row, Select, Slider, Space, Switch, Upload } from "antd";

export default function CalendarSection(props: { orders: any[] }) {
    // a calendar component, it shows a calendar containing future orders (not implemented yet)
    // only current month is shown
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedDateInfo, setSelectedDateInfo] = React.useState(null);

    const normFile = (e: any) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
    };

    return (
        <div className="border-lightBorder border-2 rounded-xl p-4 mb-16 bg-white overflow-y-auto">
            <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
                <SelectedDateInfoContext.Provider value={{ selectedDateInfo, setSelectedDateInfo }}>
                    <div className="flex flex-row gap-6">
                        <Calendar orders={props.orders} />
                        <div className="border-r border-lightBorder"></div> {/* Divider */}
                        <CalendarSideView />
                    </div>
                </SelectedDateInfoContext.Provider>
            </SelectedDateContext.Provider>
            <div className="form">
                <Form name="addOrder" style={{ maxWidth: "500px" }} onFinish={onFinish}>
                    <Form.Item label="username">
                        <span className="ant-form-text">Aggiungi ordine</span>
                    </Form.Item>
                    <Form.Item name="deliveryDate" label="Data di consegna" rules={[{ required: true, message: "Please input your delivery date" }]}>
                        <Input placeholder="Data di consegna" type="date" />
                    </Form.Item>
                    <Form.Item name="username" label="Nome cliente" rules={[{ required: true, message: "Please input your username" }]}>
                        <Input placeholder="Nome cliente" type="text" />
                    </Form.Item>
                    <Form.Item name="wechatId" label="Wechat ID" rules={[{ required: true, message: "Please input your Wechat ID" }]}>
                        <Input placeholder="Wechat ID" type="text" />
                    </Form.Item>
                    <Form.Item name="amount" label="Da pagare" rules={[{ required: true, message: "Please input your amount" }]}>
                        <Input placeholder="Da pagare" type="number" />
                    </Form.Item>
                    <Form.Item name="productionCost" label="Costo di produzione" rules={[{ required: true, message: "Please input your production cost" }]}>
                        <Input placeholder="Costo di produzione" type="number" />
                    </Form.Item>
                    <Form.Item name="photo" label="Foto" valuePropName="fileList" getValueFromEvent={normFile} extra="Seleziona una foto">
                        <Upload name="photo" action="/upload.do" listType="picture">
                            <Button icon={<UploadOutlined />}>Premi per caricare</Button>
                        </Upload>
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
        </div>
    );
}
