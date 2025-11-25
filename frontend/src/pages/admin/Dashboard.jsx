// src/pages/admin/Dashboard.jsx

import React from "react";
import { Users, Scissors, Calendar, Sparkles } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col md:px-8 px-4 py-8">

      {/* Título */}
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Sparkles size={28} />
        Panel de Control
      </h1>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl shadow-md">
          <Users size={26} className="mb-2" />
          <h2 className="text-xl font-semibold">Clientes</h2>
          <p className="text-3xl font-bold mt-1">256</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl shadow-md">
          <Scissors size={26} className="mb-2" />
          <h2 className="text-xl font-semibold">Servicios</h2>
          <p className="text-3xl font-bold mt-1">42</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl shadow-md">
          <Calendar size={26} className="mb-2" />
          <h2 className="text-xl font-semibold">Citas Hoy</h2>
          <p className="text-3xl font-bold mt-1">18</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

