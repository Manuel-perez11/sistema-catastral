import React, { useState, useEffect } from 'react';
import { Search, Upload, Trash2, Download, Lock, Unlock } from 'lucide-react';

export default function CatastroSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASSWORD = 'admin2024';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Intenta cargar datos
      const result = await window.storage?.get('catastro-data');
      if (result?.value) {
        setData(JSON.parse(result.value));
      }
    } catch {
      console.log('No hay datos previos');
    }
    setLoading(false);
  };

  const saveData = async (newData) => {
    try {
      await window.storage?.set('catastro-data', JSON.stringify(newData));
      setData(newData);
    } catch {
      alert('Error al guardar datos');
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    setFilteredResults(
      data.filter((item) =>
        item.nombre.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, data]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split('\n');
      const newData = [];

      for (let i = 1; i < lines.length; i++) {
        const [nombre, clave] = lines[i].split(',');
        if (nombre && clave) {
          newData.push({
            id: Date.now() + i,
            nombre: nombre.trim(),
            claveCatastral: clave.trim(),
          });
        }
      }

      if (newData.length) {
        saveData(newData);
        alert(`Se cargaron ${newData.length} registros`);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const downloadTemplate = () => {
    const csv =
      '\uFEFFNombre,Clave Catastral\nJuan Pérez García,12-345-678\nMaría López Rodríguez,12-345-679\nJosé Muñoz Peña,12-345-680';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_catastro.csv';
    a.click();
  };

  const clearData = async () => {
    if (confirm('¿Eliminar todos los registros?')) {
      await window.storage?.delete('catastro-data');
      setData([]);
      setFilteredResults([]);
      alert('Datos eliminados');
    }
  };

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
      // Mejorado: Icono giratorio y fondo más oscuro
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-medium text-gray-300">Cargando datos catastrales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Fondo degradado y sección principal */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 min-h-72 pt-8 pb-20 shadow-inner-xl">
        <div className="max-w-4xl mx-auto px-4">

          {/* ENCABEZADO */}
          <header className="bg-white rounded-3xl shadow-3xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center transform transition duration-500 hover:scale-[1.01] hover:shadow-4xl border border-gray-100">
            <img 
              src="/logo.png" 
              alt="Logo El Oro" 
              className="w-24 h-24 object-contain rounded-full border-4 border-blue-500 p-1 shadow-md" 
            />
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-wider">H. AYUNTAMIENTO EL ORO, DGO</h2>
              <p className="font-semibold text-xl text-gray-600">2025–2028</p>
              <p className="text-blue-700 font-bold text-lg border-l-4 border-blue-500 pl-3 pt-1">Dirección de Catastro</p>
            </div>
          </header>

          {/* TITULO */}
          <div className="text-center mb-10 text-white">
            {/* Animación mejorada: Icono con sombra y pulsación sutil */}
            <Search size={64} className="mx-auto mb-4 text-white p-3 bg-blue-500 rounded-full shadow-lg border-2 border-white/50 animate-pulse-slow" />
            <style jsx>{`
              @keyframes pulse-slow {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.03); }
              }
              .animate-pulse-slow {
                animation: pulse-slow 3s infinite ease-in-out;
              }
            `}</style>
            <h1 className="text-5xl font-black tracking-tighter drop-shadow-lg">
              Sistema de Consulta de Clave Catastral
            </h1>
            <p className="text-blue-200 mt-3 text-xl font-light">
              Ingresa tu nombre completo para obtener tu clave de forma rápida y segura.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal de la aplicación */}
      <div className="max-w-4xl mx-auto px-4 -mt-20">

        {/* BUSCADOR */}
        <div className="bg-white rounded-3xl shadow-4xl p-10 mb-8 transform transition duration-500 hover:shadow-5xl border border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Escribe el nombre completo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Mejorado: Borde más grueso en focus
              className="w-full px-6 py-5 border-3 border-gray-300 rounded-2xl text-xl font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition duration-300 placeholder-gray-500 shadow-inner"
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-blue-500" size={24} />
          </div>

          {searchTerm && (
            <div className="mt-8 transition-all duration-300">
              {filteredResults.length ? (
                <div className="space-y-4">
                  {filteredResults.map((item) => (
                    // Mejorado: Diseño del resultado con gradiente sutil y animación
                    <div key={item.id} className="bg-green-50 border-l-6 border-green-600 p-6 rounded-2xl shadow-lg transition duration-300 transform hover:scale-[1.02] hover:shadow-xl bg-gradient-to-r from-green-50 to-white animate-fade-in-down">
                      <p className="font-extrabold text-gray-900 text-xl mb-1">{item.nombre}</p>
                      <p className="font-mono text-green-700 text-3xl tracking-wider flex items-center gap-2">
                        Clave Catastral: <span className="font-black text-green-900">{item.claveCatastral}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // Mejorado: Mensaje de error más grande
                <div className="bg-red-100 border-l-6 border-red-600 p-5 rounded-xl shadow-md transition duration-300 animate-in fade-in">
                  <p className="text-red-800 font-bold text-lg">
                    😔 Lo sentimos, no se encontraron resultados para "{searchTerm}".
                  </p>
                  <p className="text-red-700 text-sm mt-1">Revisa la ortografía o consulta la información importante.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INFORMACIÓN */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 text-gray-800 shadow-2xl border border-blue-100 mb-8 transition duration-300 hover:shadow-3xl">
          <h3 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2">
            <span className='text-3xl'>💡</span> Información Importante
          </h3>
          <ul className="text-base space-y-3 list-disc list-inside text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">✓</span>
              Asegúrate de escribir tu **nombre completo** y correctamente. **Nota:** En caso de no aparecer con el nombre completo, asegúrate de que tu propiedad esté registrada en el Registro Público de la Propiedad.
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">✓</span>
              La clave catastral es un requisito **indispensable** para realizar el pago de tu predial.
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">✓</span>
              Para dudas o aclaraciones, comunícate al número **(649) 526 0041** de Presidencia Municipal.
            </li>
          </ul>
        </div>

        {/* ADMIN */}
        {isAdmin && (
          <div className="bg-white rounded-2xl p-8 shadow-3xl border-4 border-yellow-500 mb-8 animate-in fade-in duration-700">
            <h3 className='text-3xl font-bold mb-5 text-yellow-800 flex items-center gap-3'><Unlock size={28} /> Panel de Administración</h3>
            <p className="text-xl mb-4 text-gray-700">Total de registros cargados: <strong className="text-blue-600 text-2xl">{data.length}</strong></p>

            <div className="flex gap-4 flex-wrap mt-6">
              {/* Botón Cargar CSV */}
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl cursor-pointer flex items-center gap-2 font-bold transition duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]">
                <Upload size={20} /> Cargar CSV
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Botón Plantilla */}
              <button 
                onClick={downloadTemplate} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]"
              >
                <Download size={20} /> Descargar Plantilla
              </button>

              {/* Botón Limpiar */}
              <button 
                onClick={clearData} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]"
              >
                <Trash2 size={20} /> Limpiar Datos
              </button>
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <p className="text-sm font-mono text-yellow-800">
                Formato CSV requerido: <code className='font-bold'>Nombre,Clave Catastral</code>
              </p>
            </div>
          </div>
        )}

      </div>
      
      {/* BOTÓN ADMIN FLOTANTE */}
      <button
        onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl transition duration-500 transform ${isAdmin ? 'bg-red-600 hover:bg-red-700 rotate-0' : 'bg-gray-800 hover:bg-gray-900 rotate-12'} text-white z-40 hover:scale-110`}
        aria-label={isAdmin ? "Cerrar sesión de administrador" : "Abrir inicio de sesión de administrador"}
      >
        {isAdmin ? <Unlock size={28} /> : <Lock size={28} />}
      </button>

      {/* MODAL LOGIN ADMIN */}
      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-4xl w-full max-w-sm transform transition duration-500 scale-100 animate-in zoom-in-50">
            <h4 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">Acceso de Administrador</h4>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Contraseña"
              className="border-2 border-gray-300 p-3 mb-4 w-full rounded-lg focus:border-blue-600 outline-none transition duration-200"
            />
            <button
              onClick={handleAdminLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-bold transition duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              Entrar
            </button>
            <button
              onClick={() => setShowAdminLogin(false)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-800 w-full transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
