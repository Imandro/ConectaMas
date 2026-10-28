import DashboardNav from '@/app/components/DashboardNav';
import SessionRefresher from '@/app/components/SessionRefresher';
import LegalFooter from '@/app/components/LegalFooter';
import { GuestProvider } from '@/app/components/GuestProvider';
import GuestDashboardWrapper from './components/GuestDashboardWrapper';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <GuestProvider>
            <div className="app-shell-bg min-vh-100 position-relative overflow-x-hidden">
                <SessionRefresher />
                <GuestDashboardWrapper />
                <DashboardNav />

                {/* Main Content Area */}
                <main className="min-vh-100 position-relative" style={{ zIndex: 1 }}>
                    <div className="container-fluid py-3 py-md-4 px-3 px-md-4 px-lg-5">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg p-0 w-100" style={{ maxWidth: '1200px' }}>
                                <div className="ms-lg-sidebar pb-mobile-nav">
                                    <div className="content-wrapper">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legal Footer */}
                    <div className="pb-mobile-nav">
                        <LegalFooter />
                    </div>
                </main>
            </div>
        </GuestProvider>
    );
}
