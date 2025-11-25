import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Scissors,
  CalendarDays,
  UserCog,
  Building2,
  Eye,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";

const menuItems = [
  { path: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { path: "manage-users", icon: <UserCog size={20} />, label: "Usuarios" },
  { path: "manage-clients", icon: <Users size={20} />, label: "Clientes" },
  { path: "manage-barbershops", icon: <Building2 size={20} />, label: "Barberías" },

  { path: "/client/home", icon: <Eye size={20} />, label: "Vista Cliente" },
];

const AdminSidebar = ({ isOpen, isDesktop, toggleSidebar }) => {
  const visible = isDesktop ? true : isOpen;
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 🔥 Logout REAL — limpia backend + frontend
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });

      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      // incluso si falla igual cerramos sesión por seguridad
      logout();
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <>
      {/* Botón móvil */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-gradient-to-br from-gold to-gold-dark text-black hover:scale-110 shadow-gold transition-all"
        >
          {visible ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: visible ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        className="fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-dark via-dark-gray to-black backdrop-blur-xl border-r border-gold-dark shadow-lg shadow-gold/20 z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 py-6 border-b border-gold/20">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 drop-shadow-[0_0_8px_#FFD700]" />
          <h2 className="text-xl font-extrabold text-gold tracking-wide drop-shadow-[0_0_8px_#FFD700]">
            GargoBarb
          </h2>
        </div>

        {/* Menú */}
        <nav className="flex-1 mt-6 space-y-2 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path.startsWith("/") ? item.path : `/admin/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gold/20 text-gold border border-gold/50 shadow-gold"
                    : "text-gray-300 hover:text-gold hover:bg-dark-gray/60"
                }`
              }
              onClick={() => {
                if (!isDesktop) toggleSidebar(false);
              }}
            >
              <motion.span whileHover={{ rotate: 6, scale: 1.1 }} className="text-gold">
                {item.icon}
              </motion.span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gold/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold rounded-lg shadow-md hover:shadow-gold transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
