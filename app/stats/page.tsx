import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import { BarChart3, Globe, Users, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
    // Fetch data from DB
    const users = await prisma.user.findMany({
        select: {
            country: true,
            age: true,
            sinsToOvercome: true,
            problemsFaced: true
        }
    });

    const totalUsers = users.length || 1; // Avoid division by zero

    // Aggregate Countries
    const countryMap: Record<string, number> = {};
    users.forEach(u => {
        const country = u.country || 'No especificado';
        countryMap[country] = (countryMap[country] || 0) + 1;
    });
    const countries = Object.entries(countryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Aggregate Struggles (from sinsToOvercome JSON string)
    const struggleMap: Record<string, number> = {};
    users.forEach(u => {
        try {
            if (u.sinsToOvercome) {
                const sins = JSON.parse(u.sinsToOvercome);
                if (Array.isArray(sins)) {
                    sins.forEach((sin: string) => {
                        struggleMap[sin] = (struggleMap[sin] || 0) + 1;
                    });
                }
            }
        } catch (e) { }
    });
    const topStruggles = Object.entries(struggleMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Age Breakdown
    const ages = {
        '12-14': users.filter(u => u.age && u.age >= 12 && u.age <= 14).length,
        '15-19': users.filter(u => u.age && u.age >= 15 && u.age <= 19).length,
        '20-24': users.filter(u => u.age && u.age >= 20 && u.age <= 24).length,
        '25-30': users.filter(u => u.age && u.age >= 25 && u.age <= 30).length,
        'Otros': users.filter(u => !u.age || u.age < 12 || u.age > 30).length,
    };

    return (
        <div className="min-vh-100 bg-light p-4 p-md-5">
            <div className="container max-width-1000 mx-auto">
                <div className="text-center mb-5 animate-fade-in">
                    <h1 className="display-4 fw-bold text-secondary font-fredoka">Impacto Conecta+</h1>
                    <p className="lead text-muted">Estadísticas reales de nuestra comunidad en tiempo real.</p>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '20px' }}>
                            <Users className="text-primary mb-2 mx-auto" size={32} />
                            <h2 className="h4 fw-bold">{totalUsers}</h2>
                            <p className="small text-muted mb-0">Usuarios Totales</p>
                        </div>
                    </div>
                    {/* Country Distribution */}
                    <div className="col-md-9">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
                            <h3 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <Globe size={20} className="text-info" /> Presencia por País (%)
                            </h3>
                            <div className="d-flex flex-column gap-3">
                                {countries.map(([name, count]) => (
                                    <div key={name}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="small fw-bold">{name}</span>
                                            <span className="small text-muted">{totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0}%</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-info" style={{ width: `${totalUsers > 0 ? (count / totalUsers) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Challenges Breakdown */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
                            <h3 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <BarChart3 size={20} className="text-danger" /> Desafíos más Comunes
                            </h3>
                            {topStruggles.map(([name, count]) => (
                                <div key={name} className="d-flex align-items-center justify-content-between py-2 border-bottom border-light">
                                    <span className="small">{name}</span>
                                    <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Age Demographics */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
                            <h3 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <TrendingUp size={20} className="text-success" /> Distribución por Edades
                            </h3>
                            <div className="d-grid gap-3">
                                {Object.entries(ages).map(([range, count]) => (
                                    <div key={range} className="d-flex align-items-center gap-3">
                                        <div className="fw-bold small" style={{ width: '50px' }}>{range}</div>
                                        <div className="flex-grow-1 bg-light rounded-pill overflow-hidden" style={{ height: '24px' }}>
                                            <div className="bg-success h-100" style={{ width: `${totalUsers > 0 ? (count / totalUsers) * 100 : 0}%` }}></div>
                                        </div>
                                        <div className="extra-small text-muted">{count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <Link href="/about" className="text-secondary fw-bold text-decoration-none">
                        ¿Por qué hacemos esto? Conoce más sobre nosotros &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
