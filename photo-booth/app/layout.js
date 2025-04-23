import './globals.css';
import { PhotoBoothProvider } from '../context/PhotoBoothContext';

export const metadata = {
  title: 'Photo Booth App',
  description: 'A digital photo booth application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PhotoBoothProvider>
          {children}
        </PhotoBoothProvider>
      </body>
    </html>
  );
}