import '../styles/bootstrap.nomap.css';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import ClientProviders from './ClientProviders';

export const metadata = {
  title: 'CampusCraves',
  description: 'Campus food ordering platform',
  icons: {
    icon: '/campuslogo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/frames/frame_0001.png" />
        <link rel="preload" as="image" href="/frames/frame_0002.png" />
        <link rel="preload" as="image" href="/frames/frame_0003.png" />
        <link rel="preload" as="image" href="/frames/frame_0004.png" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
