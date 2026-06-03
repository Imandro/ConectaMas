import DashboardNav from '@/app/components/DashboardNav';
import SessionRefresher from '@/app/components/SessionRefresher';
import LegalFooter from '@/app/components/LegalFooter';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-vh-100 bg-light">
            <SessionRefresher />
            <DashboardNav />

            {/* Main Content Area */}
            <main className="min-vh-100">
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
