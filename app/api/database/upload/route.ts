import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

export async function POST(request: Request) {
    const { filename, contentType } = await request.json();
    console.log(process.env.AWS_BUCKET_NAME);
    try {
        const client = new S3Client({ region: 'eu-central-1' });
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        const { url, fields } = await createPresignedPost(client, {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uuidv4(),
            Conditions: [
                ["content-length-range", 0, 10485760], // up to 10 MB
                ["starts-with", "$Content-Type", contentType],
            ],
            Fields: {
                acl: "public-read",
                "Content-Type": contentType,
            },
            Expires: 600, // Seconds before the presigned post expires. 3600 by default.
        });

        return Response.json({ url, fields });
    } catch (error) {
        return Response.json({ error: error.message });
    }
}
