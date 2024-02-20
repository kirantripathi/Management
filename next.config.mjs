/** @type {import('next').NextConfig} */
const nextConfig = {
    compress:true,
    images:{
        remotePatterns:[{
            protocol:'https',
            hostname:'utfs.io',
            port:""
        }]
    }
};

export default nextConfig;
