/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.gr-assets.com',
				port: ''
			}
		]
	}
};

export default nextConfig;
