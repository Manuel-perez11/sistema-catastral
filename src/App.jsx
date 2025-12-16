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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white animate-pulse">
        <Search size={48} className="mb-4 text-blue-400" />
        <p className="text-xl">Cargando datos catastrales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Fondo degradado y sección principal */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 min-h-64 pt-8 pb-16 shadow-inner">
        <div className="max-w-4xl mx-auto px-4">

          {/* ENCABEZADO */}
          <header className="bg-white rounded-3xl shadow-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center transform transition duration-500 hover:scale-[1.01]">
            <img 
              src="/logo.png" 
              alt="Logo El Oro" 
              className="w-20 h-20 object-contain rounded-full border-4 border-blue-500 p-1" 
            />
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800">H. AYUNTAMIENTO EL ORO, DGO</h2>
              <p className="font-semibold text-xl text-gray-600">2025–2028</p>
              <p className="text-blue-700 font-bold text-lg border-l-4 border-blue-500 pl-2">Dirección de Catastro</p>
            </div>
          </header>

          {/* TITULO */}
          <div className="text-center mb-10 text-white">
            <Search size={64} className="mx-auto mb-4 text-white p-2 border-2 border-white rounded-full animate-bounce" />
            <h1 className="text-4xl font-black tracking-tight">
              Sistema de Consulta de Clave Catastral
            </h1>
            <p className="text-blue-200 mt-2 text-xl font-light">
              Ingresa tu nombre completo para obtener tu clave
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal de la aplicación */}
      <div className="max-w-4xl mx-auto px-4 -mt-16">

        {/* BUSCADOR */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 transform transition duration-300 hover:shadow-3xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Escribe el nombre completo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300 placeholder-gray-500 shadow-md"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          </div>

          {searchTerm && (
            <div className="mt-8">
              {filteredResults.length ? (
                <div className="space-y-4">
                  {filteredResults.map((item) => (
                    <div key={item.id} className="bg-green-50 border-l-4 border-green-500 p-5 rounded-xl shadow-lg transition duration-300 hover:bg-green-100">
                      <p className="font-extrabold text-gray-900 text-lg mb-1">{item.nombre}</p>
                      <p className="font-mono text-green-700 text-2xl tracking-wider">
                        Clave Catastral: <span className="font-black">{item.claveCatastral}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-md">
                  <p className="text-red-700 font-semibold">
                    😔 Lo sentimos, no se encontraron resultados para "{searchTerm}".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INFORMACIÓN */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-gray-800 shadow-xl border border-gray-100 mb-8 transition duration-300 hover:shadow-2xl">
          <h3 className="text-xl font-bold mb-3 text-blue-700">📌 Información Importante</h3>
          <ul className="text-base space-y-2 list-disc list-inside text-gray-600">
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">•</span>
              Asegúrate de escribir tu **nombre completo** y correctamente.
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">•</span>
              La clave catastral es un requisito **indispensable** para realizar el pago de tu predial.
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">•</span>
              Para dudas o aclaraciones, comunícate al número **(674) 526 0041** de la Dirección de Catastro.
            </li>
          </ul>
        </div>

        {/* ADMIN */}
        {isAdmin && (
          <div className="bg-white rounded-2xl p-6 shadow-2xl border-4 border-yellow-400/50 mb-8 animate-in fade-in duration-500">
            <h3 className='text-2xl font-bold mb-4 text-yellow-700 flex items-center gap-2'><Unlock /> Panel de Administración</h3>
            <p className="text-lg mb-4 text-gray-700">Total de registros: <strong className="text-blue-600 text-xl">{data.length}</strong></p>

            <div className="flex gap-4 flex-wrap mt-4">
              {/* Botón Cargar CSV */}
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl cursor-pointer flex items-center gap-2 font-semibold transition duration-300 shadow-lg hover:shadow-xl">
                <Upload size={20} /> Cargar CSV
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Botón Plantilla */}
              <button 
                onClick={downloadTemplate} 
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition duration-300 shadow-lg hover:shadow-xl"
              >
                <Download size={20} /> Descargar Plantilla
              </button>

              {/* Botón Limpiar */}
              <button 
                onClick={clearData} 
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition duration-300 shadow-lg hover:shadow-xl"
              >
                <Trash2 size={20} /> Limpiar Datos
              </button>
            </div>

            <div className="mt-5 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm font-mono text-yellow-800">
                Formato CSV requerido: Nombre,Clave Catastral
              </p>
            </div>
          </div>
        )}

      </div>
      
      {/* BOTÓN ADMIN FLOTANTE */}
      <button
        onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition duration-300 transform hover:scale-110 ${isAdmin ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-900'} text-white`}
        aria-label={isAdmin ? "Cerrar sesión de administrador" : "Abrir inicio de sesión de administrador"}
      >
        {isAdmin ? <Unlock size={28} /> : <Lock size={28} />}
      </button>

      {/* MODAL LOGIN ADMIN */}
      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm transform transition duration-300 scale-100">
            <h4 className="text-2xl font-bold mb-5 text-gray-800">Acceso de Administrador</h4>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Contraseña"
              className="border-2 border-gray-300 p-3 mb-4 w-full rounded-lg focus:border-blue-500 outline-none"
            />
            <button
              onClick={handleAdminLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-semibold transition duration-300 shadow-md hover:shadow-lg"
            >
              Entrar
            </button>
            <button
              onClick={() => setShowAdminLogin(false)}
              className="mt-3 text-sm text-gray-600 hover:text-gray-800 w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
