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
      <div className="min-h-screen flex items-center justify-center bg-blue-700 text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
      <div className="max-w-4xl mx-auto py-8">

        {/* ENCABEZADO */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 flex gap-4 items-center">
          <img src="/logo.png" alt="Logo El Oro" className="w-20 h-20" />
          <div>
            <h2 className="text-2xl font-bold">H. AYUNTAMIENTO EL ORO, DGO</h2>
            <p className="font-semibold">2025–2028</p>
            <p className="text-blue-600 font-semibold">Dirección de Catastro</p>
          </div>
        </div>

        {/* TITULO */}
        <div className="text-center mb-6 text-white">
          <Search size={48} className="mx-auto mb-3" />
          <h1 className="text-3xl font-bold">
            Sistema de Consulta de Clave Catastral
          </h1>
          <p className="text-blue-100">
            Ingresa tu nombre completo
          </p>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <input
            type="text"
            placeholder="Nombre completo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-4 border rounded-xl text-xl"
          />

          {searchTerm && (
            <div className="mt-6">
              {filteredResults.length ? (
                filteredResults.map((item) => (
                  <div key={item.id} className="bg-green-50 p-4 rounded-xl mb-3">
                    <p className="font-bold">{item.nombre}</p>
                    <p className="font-mono text-green-700 text-xl">
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

        {/* INFORMACIÓN */}
        <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-6 text-white mb-6">
          <h3 className="font-bold mb-2">ℹ Información Importante</h3>
          <ul className="text-sm space-y-1">
            <li>• Escribe tu nombre completo</li>
            <li>• La clave es necesaria para pagar el predial</li>
            <li>• Dudas: 5260041</li>
          </ul>
        </div>

        {/* ADMIN */}
        {isAdmin && (
          <div className="bg-white rounded-xl p-6">
            <p>Total de registros: <strong>{data.length}</strong></p>

            <div className="flex gap-3 flex-wrap mt-3">
              <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2">
                <Upload size={16} /> CSV
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>

              <button onClick={downloadTemplate} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                <Download size={16} /> Plantilla
              </button>

              <button onClick={clearData} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
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

        {/* BOTÓN ADMIN */}
        <button
          onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full"
        >
          {isAdmin ? <Unlock /> : <Lock />}
        </button>

        {/* LOGIN */}
        {showAdminLogin && !isAdmin && (
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

      </div>
    </div>
  );
}
