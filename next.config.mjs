/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/p/:path*',
                destination: '/protected/:path*'
            }
        ]
    },
    images: {
        domains: ['localhost', 'nextjs-flower-manager-bucket.s3.us-east-1.amazonaws.com']
    }
};

export default nextConfig;