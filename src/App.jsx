import React, { useState, useEffect } from 'react';
import { Search, Lock, Unlock } from 'lucide-react';

export default function CatastroSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASSWORD = 'admin2024';

  // 🔹 CARGA AUTOMÁTICA DESDE PUBLIC
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/catastro.csv');
      const text = await res.text();

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
    } catch (error) {
      console.error('Error cargando catastro.csv', error);
    }

    setLoading(false);
  };

  // 🔎 FILTRADO
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    setFilteredResults(
      data.filter(item =>
        item.nombre.toLowerCase().includes(term)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Cargando datos catastrales…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-blue-800 text-white p-6 flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
        <div>
          <h1 className="text-2xl font-bold">H. Ayuntamiento El Oro, Dgo</h1>
          <p>Dirección de Catastro</p>
        </div>
      </header>

      {/* BUSCADOR */}
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
        <input
          type="text"
          placeholder="Escribe tu nombre completo"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-4 border rounded-lg text-lg"
        />

        <div className="mt-6 space-y-4">
          {filteredResults.map(item => (
            <div key={item.id} className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
              <p className="font-bold">{item.nombre}</p>
              <p className="font-mono text-lg text-green-700">
                {item.claveCatastral}
              </p>
            </div>
          ))}

          {searchTerm && !filteredResults.length && (
            <p className="text-red-600 font-semibold">
              No se encontraron resultados
            </p>
          )}
        </div>
      </div>

      {/* BOTÓN ADMIN */}
      <button
        onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
        className="fixed bottom-6 right-6 bg-gray-800 text-white p-4 rounded-full shadow-lg"
      >
        {isAdmin ? <Unlock /> : <Lock />}
      </button>

      {/* LOGIN ADMIN */}
      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-xl font-bold mb-4">Administrador</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Contraseña"
            />
            <button
              onClick={handleAdminLogin}
              className="bg-blue-600 text-white w-full p-2 rounded"
            >
              Entrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
