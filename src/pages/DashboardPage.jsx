import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Download, FileText, Music } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const data = await apiService.getUserPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (purchaseId, fileType, fileName) => {
    try {
      const { url } = await apiService.getDownloadUrl(purchaseId, fileType);
      
      // Crear enlace temporal para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Registrar descarga
      await apiService.trackDownload(purchaseId, fileType);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error al descargar el archivo');
    }
  };

  return (
    <div className="min-h-screen bg-dark py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mi Dashboard</h1>
            <p className="text-gray-400">Bienvenido, {user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-lighter rounded-xl p-6 border border-primary/20">
            <h3 className="text-xl font-semibold mb-2">Compras Totales</h3>
            <p className="text-3xl font-bold text-primary">{purchases.length}</p>
          </div>
          <div className="bg-dark-lighter rounded-xl p-6 border border-primary/20">
            <h3 className="text-xl font-semibold mb-2">Beats Adquiridos</h3>
            <p className="text-3xl font-bold text-accent">{purchases.length}</p>
          </div>
          <div className="bg-dark-lighter rounded-xl p-6 border border-primary/20">
            <h3 className="text-xl font-semibold mb-2">Total Gastado</h3>
            <p className="text-3xl font-bold text-green-500">
              ${purchases.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Mis Compras</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12 bg-dark-lighter rounded-xl border border-primary/20">
            <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl text-gray-400">Aún no has comprado ningún beat</p>
            <a href="/" className="inline-block mt-4 px-6 py-2 bg-primary hover:bg-primary/80 rounded-lg transition-colors">
              Explorar Catálogo
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-lighter rounded-xl p-6 border border-primary/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={purchase.beat.cover_image_url}
                      alt={purchase.beat.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{purchase.beat.title}</h3>
                      <p className="text-gray-400">{purchase.license_type.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(purchase.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDownload(purchase.id, 'pdf', `Licencia-${purchase.license_number}.pdf`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Licencia PDF
                    </button>

                    <button
                      onClick={() => handleDownload(purchase.id, 'mp3', `${purchase.beat.title}.mp3`)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      MP3
                    </button>

                    {purchase.license_type.includes_wav && (
                      <button
                        onClick={() => handleDownload(purchase.id, 'wav', `${purchase.beat.title}.wav`)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        WAV
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
