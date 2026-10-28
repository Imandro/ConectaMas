export default function Loading() {
    return (
        <main aria-busy="true" className="min-vh-100 bg-primary d-flex align-items-center justify-content-center p-3">
            <div className="w-100" style={{ maxWidth: '600px' }}>
                <div className="mb-4 rounded-pill p-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="rounded-pill" style={{ width: '28%', height: '8px', backgroundColor: '#f3b33e' }} />
                </div>
                <section className="ui-surface-glass onboarding-panel rounded-4 p-4 p-md-5 text-center" aria-label="Cargando onboarding">
                    <div className="placeholder-glow">
                        <div className="placeholder col-7 rounded-pill mb-3" />
                        <div className="placeholder col-10 rounded-pill mb-4" />
                        <div className="placeholder col-12 rounded-4 mb-3" style={{ height: '56px' }} />
                        <div className="placeholder col-12 rounded-4 mb-3" style={{ height: '56px' }} />
                        <div className="placeholder col-12 rounded-pill" style={{ height: '52px' }} />
                    </div>
                </section>
            </div>
        </main>
    );
}
