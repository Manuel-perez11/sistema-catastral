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
      const result = await window.storage.get('catastro-data');
      if (result && result.value) {
        setData(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No hay datos previos');
    }
    setLoading(false);
  };

  const saveData = async (newData) => {
    try {
      await window.storage.set('catastro-data', JSON.stringify(newData));
      setData(newData);
    } catch (error) {
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
              claveCatastral: clave.trim()
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
    const csv = '\uFEFFNombre,Clave Catastral\nJuan Pérez García,12-345-678\nMaría López Rodríguez,12-345-679\nJosé Muñoz Peña,12-345-680';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_catastro.csv';
    a.click();
  };

  const clearData = async () => {
    if (confirm('¿Estás seguro de eliminar todos los registros?')) {
      try {
        await window.storage.delete('catastro-data');
        setData([]);
        setFilteredResults([]);
        alert('Datos eliminados');
      } catch (error) {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-xl text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.ibb.co/9hKC5xM/eloro-logo.png" 
                alt="Logo El Oro" 
                className="w-20 h-20 object-contain"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">H. AYUNTAMIENTO EL ORO, DGO</h2>
                <p className="text-lg text-gray-600 font-semibold">2025-2028</p>
                <p className="text-sm text-blue-600 font-semibold mt-1">Recaudación de Rentas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-block bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-4 mb-4">
            <Search className="text-white" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            SCCC - Sistema de Consulta de Clave Catastral
          </h1>
          <p className="text-xl text-blue-100">
            Ingresa tu nombre completo para consultar tu información
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Escribe tu nombre completo aquí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-xl shadow-inner"
            />
          </div>

          {searchTerm && (
            <div className="mt-6">
              {filteredResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    {filteredResults.length === 1 
                      ? 'Se encontró 1 resultado' 
                      : `Se encontraron ${filteredResults.length} resultados`}
                  </p>
                  {filteredResults.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="space-y-2">
                        <p className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                          Nombre del Contribuyente
                        </p>
                        <p className="font-semibold text-gray-900 text-2xl">
                          {item.nombre}
                        </p>
                        <div className="mt-4 pt-4 border-t border-green-200">
                          <p className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-2">
                            Clave Catastral
                          </p>
                          <p className="font-mono font-bold text-3xl text-green-600">
                            {item.claveCatastral}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-red-50 rounded-xl">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    No se encontraron resultados
                  </p>
                  <p className="text-gray-500">
                    Verifica que el nombre esté escrito correctamente
                  </p>
                </div>
              )}
            </div>
          )}

          {!searchTerm && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-lg">
                Escribe tu nombre en el cuadro de búsqueda para comenzar
              </p>
            </div>
          )}
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">ℹ️ Información Importante</h3>
          <ul className="space-y-2 text-sm text-blue-50">
            <li>• Escribe tu nombre completo tal como aparece en tu identificación</li>
            <li>• Si no encuentras tu nombre, intenta con solo un nombre y un apellido ya que algunos registros no tienen nombre completo</li>
            <li>• La clave catastral es necesaria para realizar el pago del predial</li>
            <li>• Si no encuentras tu información, contacta al número 5260041</li>
          </ul>
        </div>

        <div className="fixed bottom-4 right-4">
          {!isAdmin ? (
            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full shadow-lg transition-all"
              title="Acceso administrador"
            >
              <Lock size={20} />
            </button>
          ) : (
            <button
              onClick={handleAdminLogout}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all"
              title="Cerrar sesión"
            >
              <Unlock size={20} />
            </button>
          )}
        </div>

        {showAdminLogin && !isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Acceso Administrador</h3>
              <input
                type="password"
                placeholder="Contraseña"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="bg-white rounded-xl shadow-2xl p-6 mt-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">Panel de Administración</h2>
              <span className="text-sm text-green-600 font-semibold">● Sesión Activa</span>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Total de registros: <span className="font-bold text-xl">{data.length}</span>
                </p>

                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <Upload size={18} />
                    <span>Cargar CSV</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download size={18} />
                    <span>Plantilla CSV</span>
                  </button>

                  {data.length > 0 && (
                    <button
                      onClick={clearData}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                      <span>Limpiar Datos</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  ⚠️ IMPORTANTE - Codificación de caracteres:
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  Para que los nombres con ñ, acentos y caracteres especiales se vean correctamente:
                </p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4">
                  <li>• Guarda tu archivo CSV con codificación <strong>UTF-8</strong></li>
                  <li>• En Excel: "Guardar como" → "CSV UTF-8 (delimitado por comas)"</li>
                  <li>• En Google Sheets: "Descargar" → "Valores separados por comas (.csv)"</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">
                  Formato del archivo CSV:
                </p>
                <p className="text-xs text-yellow-700 font-mono bg-yellow-100 p-2 rounded">
                  Nombre,Clave Catastral<br/>
                  Juan Pérez García,12-345-678<br/>
                  María López Rodríguez,12-345-679<br/>
                  José Muñoz Peña,12-345-680
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### **PASO 5: Conectar GitHub con Vercel**

1. Ve a **https://vercel.com** (ya iniciaste sesión)
2. Haz clic en **"Add New..."** → **"Project"**
3. Haz clic en **"Import Git Repository"**
4. Conecta tu cuenta de **GitHub** si aún no lo has hecho
5. Busca tu repositorio `sistema-catastral`
6. Haz clic en **"Import"**
7. En la configuración:
   - **Framework Preset**: Vite
   - Deja todo lo demás como está
8. Haz clic en **"Deploy"**
9. **¡Espera 2-3 minutos!** ⏳

---

### **PASO 6: ¡Tu sistema está en línea!** 🎉

Vercel te dará una URL como:
```
https://sistema-catastral.vercel.app
