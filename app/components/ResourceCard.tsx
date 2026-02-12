"use client";

import { Download, FileText, Video, Headphones, BookOpen, FileCheck } from 'lucide-react';

interface ResourceCardProps {
    resource: {
        id: string;
        title: string;
        description: string;
        type: string;
        url: string;
        category: string;
        downloadCount: number;
        isPremium: boolean;
    };
}

export default function ResourceCard({ resource }: ResourceCardProps) {
    const typeIcons: Record<string, any> = {
        PDF: FileText,
        VIDEO: Video,
        AUDIO: Headphones,
        GUIDE: BookOpen,
        WORKSHEET: FileCheck,
    };

    const typeColors: Record<string, string> = {
        PDF: 'bg-danger-subtle text-danger',
        VIDEO: 'bg-primary-subtle text-primary',
        AUDIO: 'bg-success-subtle text-success',
        GUIDE: 'bg-warning-subtle text-warning',
        WORKSHEET: 'bg-info-subtle text-info',
    };

    const Icon = typeIcons[resource.type] || FileText;
    const colorClass = typeColors[resource.type] || 'bg-secondary-subtle text-secondary';

    const handleDownload = async () => {
        // Track download
        try {
            await fetch(`/api/resources/${resource.id}/download`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error tracking download:', error);
        }

        // Open resource
        window.open(resource.url, '_blank');
    };

    return (
        <div
            className="card border-0 shadow-sm h-100 bg-white hover-scale transition-all"
            style={{ borderRadius: '20px' }}
        >
            <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3 mb-3">
                    <div className={`${colorClass} p-3 rounded-4`}>
                        <Icon size={28} />
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-start justify-content-between mb-2">
                            <h6 className="fw-bold text-dark mb-0">{resource.title}</h6>
                            {resource.isPremium && (
                                <span className="badge bg-warning text-dark px-2 py-1 small">
                                    Premium
                                </span>
                            )}
                        </div>
                        <p className="text-muted small mb-0">{resource.description}</p>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark px-3 py-1 rounded-pill">
                            {resource.category}
                        </span>
                        <span className="text-muted small">
                            <Download size={14} className="me-1" />
                            {resource.downloadCount}
                        </span>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="btn btn-sm btn-primary rounded-pill px-3"
                    >
                        <Download size={16} className="me-1" />
                        Descargar
                    </button>
                </div>
            </div>
        </div>
    );
}
