import './globals.css';
import { Providers } from './providers';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'ECommerce Store',
  description: 'Your one-stop shop for everything you need',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}