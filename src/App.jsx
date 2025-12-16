import React, { useState, useEffect } from 'react';
import { Search, Lock, Unlock, Sparkles } from 'lucide-react';

// Función auxiliar para normalizar cadenas: elimina acentos y la 'ñ' al compararlas
const normalizeString = (str) => {
    if (!str) return '';
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
};


export default function CatastroSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const ADMIN_PASSWORD = 'admin2024';

    // 🔹 CARGA AUTOMÁTICA DESDE PUBLIC (catastro.csv) - Con solución UTF-8
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await fetch('/catastro.csv');
            
            // Solución UTF-8: Usamos response.blob() y FileReader para forzar la lectura como UTF-8
            const blob = await res.blob();
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split('\n');
                const parsed = [];

                for (let i = 1; i < lines.length; i++) {
                    const [nombre, clave] = lines[i].split(','); 
                    if (nombre && clave) {
                        parsed.push({
                            id: i,
                            nombre: nombre.trim(),
                            claveCatastral: clave.trim(),
                        });
                    }
                }
                setData(parsed);
                setLoading(false);
            };
            reader.readAsText(blob, 'UTF-8');

            return; 
        } catch (error) {
            console.error('Error cargando catastro.csv', error);
        }

        setLoading(false);
    };

    // 🔎 FILTRADO MEJORADO para manejar acentos y la 'ñ'
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredResults([]);
            return;
        }

        const normalizedTerm = normalizeString(searchTerm);

        setFilteredResults(
            data.filter(item =>
                normalizeString(item.nombre).includes(normalizedTerm)
            )
        );
    }, [searchTerm, data]);

    const handleAdminLogin = () => {
        if (adminPassword === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setShowAdminLogin(false);
            setAdminPassword('');
        } else {
            alert('Contraseña incorrecta');
            setAdminPassword('');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white transition-all duration-500 relative overflow-hidden">
                {/* Partículas de fondo */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
                
                {/* Spinner con efectos */}
                <div className="relative">
                    <svg className="animate-spin h-16 w-16 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 animate-ping opacity-20">
                        <svg className="h-16 w-16 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        </svg>
                    </div>
                </div>
                
                <p className="text-2xl font-semibold text-gray-200 animate-pulse">Cargando datos catastrales...</p>
                <div className="mt-4 flex gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 font-sans">
            {/* Animaciones CSS avanzadas */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-25px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes gradient-y {
                    0%, 100% { background-position: 50% 0%; }
                    50% { background-position: 50% 100%; }
                }
                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2); }
                    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4), 0 0 120px rgba(59, 130, 246, 0.2); }
                }
                @keyframes slide-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-in-down {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                }
                
                .animate-float { animation: float 4s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; animation-delay: 1s; }
                .animate-shimmer { 
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                    background-size: 1000px 100%;
                    animation: shimmer 3s infinite;
                }
                .animate-gradient-x { 
                    background-size: 200% 200%;
                    animation: gradient-x 8s ease infinite; 
                }
                .animate-gradient-y { 
                    background-size: 200% 200%;
                    animation: gradient-y 8s ease infinite; 
                }
                .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
                .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
                .animate-slide-in-down { animation: slide-in-down 0.6s ease-out; }
                .animate-scale-in { animation: scale-in 0.5s ease-out; }
                .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
                .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
                
                .result-item {
                    animation: slide-in-up 0.5s ease-out;
                }
                .result-item:nth-child(2) { animation-delay: 0.1s; }
                .result-item:nth-child(3) { animation-delay: 0.2s; }
                .result-item:nth-child(4) { animation-delay: 0.3s; }
                .result-item:nth-child(5) { animation-delay: 0.4s; }
            `}</style>

            {/* Header con fondo animado */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 min-h-72 pt-8 pb-20 relative overflow-hidden animate-gradient-x">
                {/* Elementos decorativos flotantes */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-20 right-20 w-40 h-40 bg-blue-300 opacity-10 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-purple-300 opacity-10 rounded-full blur-2xl animate-float"></div>
                
                {/* Patrón de puntos decorativo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    {/* ENCABEZADO con animaciones mejoradas */}
                    <header className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center transform transition-all duration-500 hover:scale-[1.02] hover:shadow-4xl border border-white/50 animate-slide-in-down relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none"></div>
                        
                        <div className="relative">
                            <img 
                                src="/logo.png" 
                                alt="Logo El Oro" 
                                className="w-24 h-24 object-contain rounded-full border-4 border-blue-500 p-1 shadow-lg transition-all duration-500 hover:rotate-[360deg] hover:scale-110 hover:border-purple-500" 
                            />
                            <div className="absolute -top-1 -right-1 w-6 h-6">
                                <Sparkles className="text-yellow-400 animate-sparkle" size={24} />
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold text-gray-800 tracking-wider bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text">
                                H. AYUNTAMIENTO EL ORO, DGO
                            </h2>
                            <p className="font-semibold text-xl text-gray-600">2025–2028</p>
                            <p className="text-blue-700 font-bold text-lg border-l-4 border-blue-500 pl-3 pt-1 hover:border-purple-500 transition-colors duration-300">
                                Dirección de Catastro
                            </p>
                        </div>
                    </header>

                    {/* TITULO con efectos premium */}
                    <div className="text-center mb-10 text-white animate-scale-in">
                        <div className="relative inline-block mb-4">
                            <Search size={72} className="mx-auto text-white p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl border-4 border-white/30 animate-glow-pulse" />
                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
                            Sistema de Consulta de Clave Catastral
                        </h1>
                        <p className="text-blue-100 mt-3 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Ingresa tu nombre completo para obtener tu clave de forma <span className="font-semibold text-white">rápida y segura</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
                {/* BUSCADOR premium */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 mb-8 transform transition-all duration-500 hover:shadow-4xl border-2 border-white/50 animate-slide-in-up relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Escribe el nombre completo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-5 pr-14 border-2 border-gray-300 rounded-2xl text-xl font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-200 outline-none transition-all duration-300 placeholder-gray-400 shadow-inner hover:border-blue-400 hover:shadow-lg"
                            />
                            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-blue-500 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" size={28} />
                        </div>

                        {searchTerm && (
                            <div className="mt-8">
                                {filteredResults.length ? (
                                    <div className="space-y-4">
                                        {filteredResults.map((item, index) => (
                                            <div 
                                                key={item.id} 
                                                className="result-item bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-l-6 border-green-600 p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl hover:border-emerald-600 relative overflow-hidden group"
                                                style={{animationDelay: `${index * 0.1}s`}}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                                                
                                                <div className="relative z-10">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <span className="text-3xl flex-shrink-0 animate-bounce">👤</span>
                                                        <p className="font-extrabold text-gray-900 text-xl leading-tight">{item.nombre}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 bg-green-100/80 backdrop-blur-sm p-4 rounded-xl border border-green-200 hover:border-green-400 transition-colors duration-300">
                                                        <span className="text-2xl animate-pulse">🏠</span>
                                                        <span className="font-semibold text-green-700 text-lg">Clave Catastral:</span>
                                                        <span className="font-black text-green-900 text-2xl tracking-wider bg-white px-4 py-2 rounded-lg shadow-md">
                                                            {item.claveCatastral}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-6 border-red-600 p-6 rounded-xl shadow-lg animate-slide-in-up relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full blur-3xl opacity-20"></div>
                                        <p className="text-red-800 font-bold text-xl mb-2 flex items-center gap-2">
                                            <span className="text-3xl">😔</span>
                                            Lo sentimos, no se encontraron resultados
                                        </p>
                                        <p className="text-red-700 text-base">
                                            No se encontraron resultados para "<span className="font-semibold">{searchTerm}</span>". Revisa la ortografía o consulta la información importante.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* INFORMACIÓN con diseño mejorado */}
                <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 backdrop-blur-sm rounded-2xl p-8 text-gray-800 shadow-xl border-2 border-blue-200/50 mb-8 transition-all duration-500 hover:shadow-2xl hover:border-blue-300 animate-scale-in relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full opacity-10 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text flex items-center gap-3">
                            <span className='text-4xl animate-bounce'>💡</span> 
                            Información Importante
                        </h3>
                        
                        <ul className="space-y-4">
                            {[
                                'Asegúrate de escribir tu nombre completo y correctamente. Nota: En caso de no aparecer con el nombre completo, asegúrate de que tu propiedad esté registrada en el Registro Público de la Propiedad.',
                                'La clave catastral es un requisito indispensable para realizar el pago de tu predial.',
                                'Para dudas o aclaraciones, comunícate al número (649) 526 0041 de Presidencia Municipal.'
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:translate-x-2 hover:bg-white hover:shadow-md group/item">
                                    <span className="font-bold text-blue-600 text-2xl flex-shrink-0 transition-transform duration-300 group-hover/item:scale-125">✓</span>
                                    <span className="text-gray-700 leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ADMIN PANEL mejorado */}
                {isAdmin && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-2xl border-4 border-yellow-400 mb-8 animate-scale-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                        
                        <h3 className='text-3xl font-bold mb-5 text-transparent bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text flex items-center gap-3'>
                            <Unlock size={32} className="text-yellow-600 animate-pulse" /> 
                            Panel de Administración
                        </h3>
                        
                        <p className="text-xl mb-6 text-gray-700 bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                            Total de registros cargados: 
                            <strong className="text-blue-600 text-3xl ml-2 font-black">{data.length}</strong>
                        </p>
                        
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl border-2 border-gray-300 text-gray-700 shadow-inner">
                            <p className="font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="text-xl">ℹ️</span>
                                Funcionalidad Desactivada
                            </p>
                            <p className="text-sm leading-relaxed">
                                La gestión de datos (Cargar CSV, Limpiar) fue removida de esta versión para usar la carga automática desde <code className="bg-gray-300 px-2 py-1 rounded">/catastro.csv</code>
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* BOTÓN ADMIN FLOTANTE premium */}
            <button
                onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
                className={`fixed bottom-8 right-8 p-5 rounded-full shadow-2xl transition-all duration-500 transform ${
                    isAdmin 
                        ? 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rotate-0 animate-glow-pulse' 
                        : 'bg-gradient-to-br from-gray-800 to-gray-950 hover:from-gray-900 hover:to-black rotate-12'
                } text-white z-50 hover:scale-125 hover:rotate-180 active:scale-95 border-4 border-white/20`}
                aria-label={isAdmin ? "Cerrar sesión" : "Iniciar sesión"}
            >
                {isAdmin ? (
                    <Unlock size={32} className="animate-pulse" />
                ) : (
                    <Lock size={32} />
                )}
            </button>

            {/* MODAL LOGIN premium */}
            {showAdminLogin && !isAdmin && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-scale-in">
                    <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-4xl w-full max-w-md transform transition-all duration-500 border-2 border-blue-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                        
                        <div className="relative z-10">
                            <h4 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text border-b-2 border-blue-200 pb-3">
                                🔐 Acceso de Administrador
                            </h4>
                            
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="border-2 border-gray-300 p-4 mb-6 w-full rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 outline-none transition-all duration-300 text-lg"
                                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                            />
                            
                            <button
                                onClick={handleAdminLogin}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl w-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-95"
                            >
                                Entrar
                            </button>
                            
                            <button
                                onClick={() => setShowAdminLogin(false)}
                                className="mt-4 text-sm text-gray-600 hover:text-gray-800 w-full transition-all duration-300 font-semibold hover:underline"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
