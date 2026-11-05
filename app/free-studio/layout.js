import './free-studio.css';

export const metadata = {
  title: 'Free Image Studio — AI Media Studio',
  description: 'Create AI images using a quota-limited free-tier provider.',
  manifest: '/free-studio.webmanifest',
  appleWebApp: { capable: true, title: 'AI Free Studio', statusBarStyle: 'black-translucent' },
  icons: { icon: '/free-studio-icon.svg', apple: '/apple-touch-icon.png' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export default function FreeStudioLayout({ children }) {
  return children;
}
