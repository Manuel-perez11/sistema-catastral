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
      const result = await window.storage?.get('catastro-data');
      if (result && result.value) {
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
    if (searchTerm.trim() === '') {
      setFilteredResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = data.filter(item =>
      item.nombre.toLowerCase().includes(term)
    );
    setFilteredResults(results);
  }, [searchTerm, data]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const newData = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [nombre, clave] = line.split(',');
          if (nombre && clave) {
            newData.push({
              id: Date.now() + i,
              nombre: nombre.trim(),
              claveCatastral: clave.trim(),
            });
          }
        }
      }

      if (newData.length > 0) {
        saveData(newData);
        alert(`Se cargaron ${newData.length} registros exitosamente`);
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
    if (confirm('¿Estás seguro de eliminar todos los registros?')) {
      try {
        await window.storage?.delete('catastro-data');
        setData([]);
        setFilteredResults([]);
        alert('Datos eliminados');
      } catch {
        alert('Error al eliminar datos');
      }
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

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-700 flex items-center justify-center">
        <div className="text-xl text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
      <div className="max-w-4xl mx-auto py-8">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://i.ibb.co/9hKC5xM/eloro-logo.png"
              alt="Logo El Oro"
              className="w-20 h-20"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                H. AYUNTAMIENTO EL ORO, DGO
              </h2>
              <p className="text-lg text-gray-600 font-semibold">2025-2028</p>
              <p className="text-sm text-blue-600 font-semibold">
                Recaudación de Rentas
              </p>
            </div>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <input
            type="text"
            placeholder="Escribe tu nombre completo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-4 border rounded-xl text-xl"
          />

          {searchTerm && (
            <div className="mt-6">
              {filteredResults.length > 0 ? (
                filteredResults.map(item => (
                  <div key={item.id} className="bg-green-50 p-4 rounded-xl mb-3">
                    <p className="font-bold">{item.nombre}</p>
                    <p className="font-mono text-green-700">
                      {item.claveCatastral}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-red-600 mt-4">
                  No se encontraron resultados
                </p>
              )}
            </div>
          )}
        </div>

        {/* ADMIN */}
        {isAdmin && (
          <div className="bg-white rounded-xl p-6">
            <p className="mb-2">
              Total de registros: <strong>{data.length}</strong>
            </p>

            <div className="flex gap-3 flex-wrap">
              <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                <Upload size={16} />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={downloadTemplate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                <Download size={16} /> Plantilla
              </button>

              <button
                onClick={clearData}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                <Trash2 size={16} /> Limpiar
              </button>
            </div>

            <div className="mt-4 bg-yellow-100 p-3 rounded">
              <p className="text-xs font-mono">
                Nombre,Clave Catastral
              </p>
            </div>
          </div>
        )}

        {!isAdmin && (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full"
          >
            <Lock size={20} />
          </button>
        )}

        {showAdminLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Contraseña"
                className="border p-2 mb-3 w-full"
              />
              <button
                onClick={handleAdminLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Entrar
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <button
            onClick={handleAdminLogout}
            className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-full"
          >
            <Unlock size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
