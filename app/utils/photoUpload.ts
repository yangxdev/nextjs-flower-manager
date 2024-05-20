export const handlePhotoUpload = async (file: File, setMessage: React.Dispatch<React.SetStateAction<string>>) => {
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
            return fileUrl;
        } else {
            console.error("S3 Upload Error:", uploadResponse);
            setMessage("Upload failed.");
        }
    } else {
        setMessage("Failed to get pre-signed URL.");
    }
    return "";
};
