import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atelier Vault',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LalaloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}