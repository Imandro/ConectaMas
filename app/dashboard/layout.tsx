import DashboardNav from '@/app/components/DashboardNav';
import SessionRefresher from '@/app/components/SessionRefresher';
import LegalFooter from '@/app/components/LegalFooter';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-vh-100 bg-light position-relative overflow-hidden">
            {/* Decorative background orbs */}
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', zIndex: 0 }}>
                <div className="position-absolute rounded-circle" style={{
                    width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)',
                    top: '-100px', right: '-100px',
                }} />
                <div className="position-absolute rounded-circle" style={{
                    width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
                    bottom: '50px', left: '-50px',
                }} />
            </div>

            <SessionRefresher />
            <DashboardNav />

            {/* Main Content Area */}
            <main className="min-vh-100 position-relative" style={{ zIndex: 1 }}>
                <div className="container-fluid py-4 px-3 px-md-4 px-lg-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg p-0" style={{ maxWidth: '1200px' }}>
                            <div className="ms-lg-sidebar pb-mobile-nav">
                                <div className="content-wrapper">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Footer */}
                <LegalFooter />
            </main>
        </div>
    );
}
