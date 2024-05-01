import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Col, ColorPicker, Form, InputNumber, Radio, Rate, Row, Select, Slider, Space, Switch, Upload } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function OrderForm() {
    const [file, setFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>("");
    const [show, setShow] = React.useState<string>("hidden");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

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
            } else {
                console.error("S3 Upload Error:", uploadResponse);
                setMessage("Upload failed.");
            }
        } else {
            setMessage("Failed to get pre-signed URL.");
        }

        setUploading(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md gap-x-4">
                <input
                    id="file"
                    type="file"
                    className="cursor-pointer min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                            setFile(files[0]);
                        }
                    }}
                    accept="image/png, image/jpeg, image/jpg"
                />
                <button className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" type="submit" disabled={uploading}>
                    Upload
                </button>
                <div className={`pt-2 relative ${show}`}>
                    <div className="absolute left-[40%] mx-auto rounded-md bg-white/5 px-3.5 py-4 text-white">{message}</div>
                </div>
            </form>
        </>
    );
}

// Thanks @imevanc for the image upload functionality https://github.com/imevanc/nextjs-aws-s3