export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-4">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                {children}
            </div>

            <div className="mt-4 text-center">
                <small className="text-muted">
                    &copy; {new Date().getFullYear()} Conecta+ <br />
                    Tu espacio seguro.
                </small>
            </div>
        </div>
    );
}
