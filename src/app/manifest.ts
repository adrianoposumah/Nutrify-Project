import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nutrify: Kenali Makananmu, Jaga Kesehatanmu',
    short_name: 'Nutrify',
    description: 'Aplikasi untuk mengenali makanan dan minuman yang ada disekitar kita',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#fe6301',
    icons: [
      {
        src: 'icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: 'screenshots/home.png',
        sizes: '1903x959',
        type: 'image/png',
        label: 'Tampilan Utama',
        form_factor: 'wide',
      },
      {
        src: 'screenshots/category.png',
        sizes: '1901x958',
        type: 'image/png',
        label: 'Daftar Makanan',
        form_factor: 'wide',
      },
      {
        src: 'screenshots/detail.png',
        sizes: '1901x957',
        type: 'image/png',
        label: 'Detail Makanan',
        form_factor: 'wide',
      },
      {
        src: 'screenshots/home-mobile.png',
        sizes: '389x868',
        type: 'image/png',
        label: 'Tampilan Utama',
        form_factor: 'narrow',
      },
      {
        src: 'screenshots/category-mobile.png',
        sizes: '388x866',
        type: 'image/png',
        label: 'Daftar Makanan',
        form_factor: 'narrow',
      },
      {
        src: 'screenshots/detail-mobile.png',
        sizes: '389x869',
        type: 'image/png',
        label: 'Detail Makanan',
        form_factor: 'narrow',
      },
    ],
    shortcuts: [
      {
        name: 'Periksa Makanan',
        short_name: 'Tools',
        url: '/tools',
        icons: [
          {
            src: 'icons/add-x512.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
  };
}
