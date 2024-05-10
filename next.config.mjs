/** @type {import('next').NextConfig} */
const nextConfig = {
    compress:true,
    images:{
        domains: ['res.cloudinary.com'],
        remotePatterns:[{
            protocol:'https',
            hostname:'utfs.io',
            port:""
        }]
    },
    experimental:{
        serverActions:{
            bodySizeLimit:"4.5mb"
        }
    }
};

export default nextConfig;
