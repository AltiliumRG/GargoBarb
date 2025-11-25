import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Settings, HelpCircle, Info, Phone } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/api";

const Home = () => {
  const { user, logout } = useAuth(); // ← AHORA viene del contexto
  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================
  // ✅ 1. CARGAR BARBERÍAS CON SESIÓN ACTIVA
  // ======================================
  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        const res = await api.get("/barbershops", {
          withCredentials: true,
        });

        setBarbershops(res.data);
      } catch (err) {
        console.error("❌ Error al obtener barberías:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbershops();
  }, []);

  // ======================================
  // ⏳ LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300 bg-black">
        <p>Cargando barberías...</p>
      </div>
    );
  }

  // ======================================
  // 🏠 HOME UI
  // ======================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/80 backdrop-blur-md border-b border-yellow-500/30 px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      >
        <motion.h1
          className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => (window.location.href = "/client/home")}
        >
          GargoBarb 💈
        </motion.h1>

        <div className="flex items-center gap-6 text-sm">
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Info size={16} /> Sobre Nosotros
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <HelpCircle size={16} /> Soporte
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Phone size={16} /> Contacto
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Settings size={16} /> Configuración
          </button>

          <div className="border-l border-yellow-500/30 pl-4 flex items-center gap-3">
            <span className="text-gray-300 font-medium">
              {user?.full_name || "Invitado"}
            </span>

            <motion.button
              onClick={logout}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-3 py-1 rounded-md hover:shadow-yellow-500/30 transition"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
        >
          Barberías disponibles
        </motion.h2>

        {barbershops.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {barbershops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.3)",
                }}
                onClick={() =>
                  (window.location.href = `/client/barbershop/${shop.id}`)
                }
                className="cursor-pointer bg-gray-900/70 border border-yellow-500/20 rounded-2xl p-5 hover:border-yellow-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  {shop.name}
                </h3>
                <p className="text-gray-300">{shop.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {shop.city} · Propietario:{" "}
                  <span className="text-yellow-500">
                    {shop.owner?.full_name || "Desconocido"}
                  </span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            No hay barberías registradas todavía.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;

