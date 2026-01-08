import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Capybara Chill Timer',
        short_name: 'CapyTimer',
        description: 'A chill focus timer with a cute capybara companion.',
        start_url: '/',
        display: 'standalone',
        background_color: '#2c5364',
        theme_color: '#C29B7F',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
