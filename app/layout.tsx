import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DealMemory — Deal Intelligence Agent',
  description: 'Grounded Deal Intelligence Agent for Microsoft Hackathon powered by Hindsight Memory Engine and Azure OpenAI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
