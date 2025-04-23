import './globals.css';

export const metadata = {
  title: 'Photo Booth App',
  description: 'A digital photo booth application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}