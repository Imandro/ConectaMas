"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, ChevronLeft, Printer, Download } from 'lucide-react';
import { pdfContentData } from '@/prisma/seeds/pdf_content_v2';
import Link from 'next/link';

export default function ResourceDownloadPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const content = pdfContentData[id];

    useEffect(() => {
        // Option to auto-trigger print after a short delay for rendering
        if (content) {
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [content]);

    if (!content) {
        return (
            <div className="container py-5 text-center">
                <h3>Recurso no encontrado</h3>
                <Link href="/dashboard/resources" className="btn btn-primary mt-3">
                    Volver a Recursos
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-4 py-md-5">
            {/* Header - Hidden on Print */}
            <div className="container mb-4 d-print-none">
                <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded-4 shadow-sm">
                    <button
                        onClick={() => router.back()}
                        className="btn btn-link text-decoration-none text-dark d-flex align-items-center gap-2"
                    >
                        <ChevronLeft size={20} />
                        <span>Volver</span>
                    </button>
                    <div className="d-flex gap-2">
                        <button onClick={() => window.print()} className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2">
                            <Printer size={18} />
                            <span>Imprimir / Guardar PDF</span>
                        </button>
                    </div>
                </div>
                <div className="alert alert-info mt-3 rounded-4 border-0 shadow-sm">
                    <strong>💡 Tip:</strong> Al abrir el diálogo de impresión, selecciona <strong>"Guardar como PDF"</strong> en el destino para descargar el archivo.
                </div>
            </div>

            {/* Document - The Printable Area */}
            <div className="container">
                <div
                    className="bg-white mx-auto shadow-lg p-5"
                    style={{
                        maxWidth: '800px',
                        minHeight: '1000px',
                        borderRadius: '0', // More document-like
                        border: '1px solid #eee'
                    }}
                >
                    {/* Brand Watermark */}
                    <div className="d-flex align-items-center justify-content-between mb-5 border-bottom pb-4">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary text-white p-2 rounded-3">
                                <FileText size={24} />
                            </div>
                            <span className="fw-bold fs-4 text-primary">Conecta+</span>
                        </div>
                        <div className="text-muted small text-end">
                            <div>Recurso Educativo Cristiano</div>
                            <div>www.conectamas.app</div>
                        </div>
                    </div>

                    {/* Content */}
                    <article className="pdf-content">
                        <div className="mb-5">
                            <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-1 rounded-pill">
                                {content.category}
                            </span>
                            <h1 className="display-5 fw-bold text-dark mb-4">{content.title}</h1>
                            <p className="lead text-muted lh-base">
                                {content.introduction}
                            </p>
                        </div>

                        {content.sections.map((section, index) => (
                            <div key={index} className="mb-5">
                                <h3 className="fw-bold text-primary mb-3">
                                    {index + 1}. {section.subtitle}
                                </h3>
                                <div className="fs-5 text-dark lh-lg" style={{ textAlign: 'justify' }}>
                                    {section.content}
                                </div>
                            </div>
                        ))}

                        <div className="mt-5 p-4 bg-light rounded-4 border-start border-primary border-4">
                            <h4 className="fw-bold text-dark mb-2">Conclusión</h4>
                            <p className="mb-0 text-muted italic">
                                "{content.conclusion}"
                            </p>
                        </div>
                    </article>

                    {/* Footer */}
                    <div className="mt-5 pt-5 border-top text-center text-muted small">
                        <p>© {new Date().getFullYear()} Conecta+ • Edificando la Generación de Cristal sobre la Roca.</p>
                        <p className="mb-0">Este material es para uso personal y comunitario. Prohibida su venta.</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        padding: 0 !important;
                    }
                    .d-print-none {
                        display: none !important;
                    }
                    .container {
                        max-width: 100% !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .shadow-lg {
                        box-shadow: none !important;
                    }
                    .bg-light {
                        background: white !important;
                    }
                    article {
                        page-break-inside: avoid;
                    }
                    @page {
                        margin: 2cm;
                    }
                }
                .pdf-content h3 {
                    border-bottom: 2px solid #f8f9fa;
                    padding-bottom: 10px;
                }
            `}</style>
        </div>
    );
}
