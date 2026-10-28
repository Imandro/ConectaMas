import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Auxilio Espiritual (SOS) | Conecta+',
    description: 'Encuentra paz en momentos de crisis con oraciones y verdades bíblicas.',
};

export default function SOSLayout({ children }: { children: React.ReactNode }) {
    return children;
}
