"use client";

import { Share2 } from 'lucide-react';
import { shareDevotional } from '@/app/lib/shareUtils';
import { toast } from 'react-hot-toast';

interface ShareDevotionalButtonProps {
    devotional: {
        title: string;
        bibleVerse: string;
        bibleReference: string;
    };
}

export default function ShareDevotionalButton({ devotional }: ShareDevotionalButtonProps) {
    const handleShare = async () => {
        const result = await shareDevotional(devotional);

        if (result.success) {
            if (result.method === 'clipboard') {
                toast.success('¡Copiado al portapapeles!', {
                    icon: '📋',
                    style: { borderRadius: '15px', background: '#333', color: '#fff' }
                });
            } else {
                toast.success('¡Compartido!', {
                    icon: '✅',
                    style: { borderRadius: '15px', background: '#333', color: '#fff' }
                });
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="btn btn-light rounded-circle p-2 shadow-sm hover-scale"
            aria-label="Compartir devocional"
        >
            <Share2 size={20} />
        </button>
    );
}
