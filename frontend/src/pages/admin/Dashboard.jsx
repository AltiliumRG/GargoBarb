// src/pages/admin/Dashboard.jsx

import React, { useState, useEffect } from "react";
import { Users, Scissors, Calendar, Sparkles, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, Wallet, TrendingUp, Award } from "lucide-react";
import api from "../../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalServices: 0,
    appointmentsToday: 0,
    earningsToday: 0,
    earningsWeekly: 0,
    earningsMonthly: 0,
    earningsYearly: 0,
    earningsPerBarber: [],
    recentAppointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmada': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'cancelada': return <XCircle className="text-red-500" size={18} />;
      case 'pendiente': return <Clock className="text-yellow-500" size={18} />;
      default: return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  if (loading) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col md:px-8 px-4 py-8">

      {/* Título */}
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Sparkles size={28} className="text-yellow-500" />
        Panel de Control
      </h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {/* Estadísticas de Volumen */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl shadow-xl hover:border-blue-500/50 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <Users size={32} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">Total</span>
          </div>
          <h2 className="text-gray-400 font-medium">Clientes</h2>
          <p className="text-4xl font-bold mt-1 text-white">{stats.totalClients}</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl shadow-xl hover:border-purple-500/50 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <Scissors size={32} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">Activos</span>
          </div>
          <h2 className="text-gray-400 font-medium">Servicios</h2>
          <p className="text-4xl font-bold mt-1 text-white">{stats.totalServices}</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl shadow-xl hover:border-yellow-500/50 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <Calendar size={32} className="text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">Hoy</span>
          </div>
          <h2 className="text-gray-400 font-medium">Citas Hoy</h2>
          <p className="text-4xl font-bold mt-1 text-white">{stats.appointmentsToday}</p>
        </div>
      </div>

      {/* Estadísticas de Ganancias */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <DollarSign size={22} className="text-green-500" />
        Resumen de Ingresos
      </h2>
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl group hover:border-green-500/50 transition-all">
          <div className="flex justify-between items-center mb-2">
            <Wallet size={20} className="text-green-400" />
            <span className="text-[10px] uppercase font-bold text-green-400">Hoy</span>
          </div>
          <p className="text-2xl font-bold text-white">${stats.earningsToday?.toLocaleString()}</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-center mb-2">
            <TrendingUp size={20} className="text-blue-400" />
            <span className="text-[10px] uppercase font-bold text-blue-400">Semana</span>
          </div>
          <p className="text-2xl font-bold text-white">${stats.earningsWeekly?.toLocaleString()}</p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl group hover:border-purple-500/50 transition-all">
          <div className="flex justify-between items-center mb-2">
            <Calendar size={20} className="text-purple-400" />
            <span className="text-[10px] uppercase font-bold text-purple-400">Mes</span>
          </div>
          <p className="text-2xl font-bold text-white">${stats.earningsMonthly?.toLocaleString()}</p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl group hover:border-yellow-500/50 transition-all">
          <div className="flex justify-between items-center mb-2">
            <Award size={20} className="text-yellow-400" />
            <span className="text-[10px] uppercase font-bold text-yellow-400">Año</span>
          </div>
          <p className="text-2xl font-bold text-white">${stats.earningsYearly?.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Ganancias por Barbero */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Scissors size={20} className="text-yellow-500" />
              Ranking de Barberos
            </h2>
          </div>
          <div className="p-4 flex-1">
            {stats.earningsPerBarber.length > 0 ? (
              <div className="space-y-4">
                {stats.earningsPerBarber.map((b, idx) => (
                  <div key={b.barber_id} className="flex items-center justify-between p-3 bg-gray-800/40 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{b.barber?.full_name || b.barber?.username}</p>
                        <p className="text-[10px] text-gray-500">@{b.barber?.username}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-green-400">${parseFloat(b.total_revenue).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10 text-sm">No hay datos de ingresos por barbero.</p>
            )}
          </div>
        </div>

        {/* Citas Recientes (Ahora en 2/3 del ancho) */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={22} className="text-blue-400" />
              Últimas Citas Agendadas
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Ver todas</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Cliente</th>
                  <th className="px-6 py-4 font-semibold">Barbero</th>
                  <th className="px-6 py-4 font-semibold">Servicio</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Precio</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {stats.recentAppointments.length > 0 ? (
                  stats.recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{apt.user?.full_name || apt.user?.username}</div>
                        <div className="text-[10px] text-gray-500">{apt.user?.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-yellow-500">{apt.barber?.full_name || "—"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 text-sm">{apt.service?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(apt.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 font-bold text-sm">${apt.service?.price?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold">
                          {getStatusIcon(apt.status)}
                          {apt.status}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No hay citas recientes para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

