import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Users, Music, DollarSign, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBeats: 0,
    totalSales: 0,
    pendingRequests: 0
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Verificar que el usuario es admin
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // TODO: Cargar estadísticas desde la API
    loadStats();
  }, [isAuthenticated, user, navigate]);

  const loadStats = async () => {
    // TODO: Implementar llamada a la API
    setStats({
      totalUsers: 25,
      totalBeats: 45,
      totalSales: 1250,
      pendingRequests: 3
    });
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-effect p-6 rounded-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Panel de Administración</span>
          </h1>
          <p className="text-gray-400">Bienvenido, {user?.username}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Usuarios"
            value={stats.totalUsers}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Music}
            label="Total Beats"
            value={stats.totalBeats}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={DollarSign}
            label="Ventas Totales"
            value={`$${stats.totalSales}`}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Solicitudes Pendientes"
            value={stats.pendingRequests}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Tabs */}
        <div className="glass-effect rounded-xl p-6">
          <div className="flex gap-4 border-b border-white/10 mb-6">
            {['overview', 'users', 'beats', 'requests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'overview' ? 'Resumen' : 
                 tab === 'users' ? 'Usuarios' :
                 tab === 'beats' ? 'Beats' : 'Solicitudes'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-white">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-green-500" />
                      <div>
                        <p className="font-medium">Nueva compra realizada</p>
                        <p className="text-sm text-gray-400">usuario@example.com - Beat: "Summer Vibes"</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">Hace 5 min</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="text-blue-500" />
                      <div>
                        <p className="font-medium">Nuevo registro de usuario</p>
                        <p className="text-sm text-gray-400">newuser@example.com</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">Hace 1 hora</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Gestión de Usuarios</h3>
                <p className="text-gray-400">Próximamente: Lista de usuarios, edición y gestión</p>
              </div>
            )}

            {activeTab === 'beats' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Gestión de Beats</h3>
                <p className="text-gray-400">Próximamente: Lista de beats, aprobación y moderación</p>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Solicitudes de Productor</h3>
                <p className="text-gray-400">Próximamente: Aprobación de solicitudes de productores</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
