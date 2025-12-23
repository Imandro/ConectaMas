import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-4 position-relative overflow-hidden">
            {/* Background Decor */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-light" style={{ zIndex: -1 }}>
                <div className="position-absolute top-0 start-50 translate-middle rounded-circle bg-warning opacity-10 blur-3xl" style={{ width: '600px', height: '600px', filter: 'blur(100px)' }}></div>
                <div className="position-absolute bottom-0 end-0 rounded-circle bg-secondary opacity-10 blur-3xl" style={{ width: '500px', height: '500px', filter: 'blur(80px)' }}></div>
            </div>

            <div className="card border-0 shadow-lg bg-white-80 backdrop-blur-md p-4 p-md-5 text-center" style={{ maxWidth: '480px', width: '100%', borderRadius: '32px' }}>
                {/* Logo Real */}
                <div className="mb-4 mx-auto animate-fade-in">
                    <div className="position-relative mx-auto" style={{ width: '200px', height: '80px' }}>
                        <Image
                            src="/logo.png"
                            alt="Conecta+ Logo"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>
                </div>

                {/* Hero Text */}
                <h1 className="display-5 fw-bold mb-2 text-secondary font-fredoka">
                    No estás solo.
                </h1>

                <p className="lead text-muted mb-4 fs-5">
                    Dios sigue contigo.
                </p>

                {/* Buttons */}
                <div className="d-grid gap-3 w-100">
                    <Link href="/auth/register" className="btn btn-primary btn-lg text-white shadow-sm hover-scale rounded-pill py-3 fw-bold">
                        Crear cuenta
                    </Link>

                    <Link href="/auth/login" className="btn btn-outline-secondary btn-lg border-2 hover-scale rounded-pill py-3 fw-bold">
                        Ya tengo cuenta
                    </Link>


                </div>
            </div>
        </div>
    );
}
