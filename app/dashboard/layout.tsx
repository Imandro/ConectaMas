import DashboardNav from '@/app/components/DashboardNav';
import SessionRefresher from '@/app/components/SessionRefresher';

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
                {/* Desktop: Add margin left to accommodate fixed sidebar */}
                <div className="d-none d-md-block" style={{ width: '240px' }}></div>

                <div className="container-fluid py-4 px-3 px-md-4">
                    <div className="row">
                        <div className="col-12 col-md-auto d-none d-md-block" style={{ width: '240px' }}>
                            {/* Placeholder for sidebar space if we wanted static, but sidebar is fixed. 
                                So we just need to push content. 
                            */}
                        </div>
                        <div className="col p-0 ps-md-4">
                            <div className="d-md-block ms-md-sidebar pb-mobile-nav" style={{ transition: 'margin 0.3s' }}>
                                <div className="content-wrapper">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
