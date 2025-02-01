/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'], // Add Cloudinary domain
      },
    trailingSlash:true,
};

export default nextConfig;
