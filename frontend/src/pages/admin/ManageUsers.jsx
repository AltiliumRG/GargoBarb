import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Edit, Trash2, Search, Users } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", role_id: 3, password: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // 🔹 Obtener usuarios
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/users/${editingId}`, form);
      else await api.post("/users", form);
      setEditingId(null);
      setForm({ username: "", email: "", role_id: 3, password: "" });
      fetchUsers();
    } catch (err) {
      console.error("❌ Error al guardar usuario:", err);
    }
  };

  // 🔹 Eliminar usuario
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("❌ Error al eliminar:", err);
      }
    }
  };

  // 🔹 Filtro de búsqueda
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="p-8 text-white min-h-screen"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-black via-[#141414] to-[#0a0a0a] p-8 rounded-2xl shadow-2xl border border-gold/20 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gold mb-6 flex items-center gap-3">
          <Users size={26} className="text-gold" /> Gestión de Usuarios
        </h2>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 text-black"
        >
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="p-3 rounded-lg border border-gold/20 focus:ring-2 focus:ring-gold/50 outline-none transition"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-3 rounded-lg border border-gold/20 focus:ring-2 focus:ring-gold/50 outline-none transition"
          />
          <select
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}
            className="p-3 rounded-lg border border-gold/20 focus:ring-2 focus:ring-gold/50 outline-none transition"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Dueño / Barbero</option>
            <option value={3}>Cliente</option>
          </select>
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="p-3 rounded-lg border border-gold/20 focus:ring-2 focus:ring-gold/50 outline-none transition"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gold text-black py-3 px-4 rounded-lg font-semibold shadow-md hover:bg-yellow-400 transition"
          >
            {editingId ? "Actualizar" : "Crear"}
          </motion.button>
        </form>
      </motion.div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2 mb-6 bg-[#111] p-3 rounded-lg border border-gold/20 w-full md:w-1/2">
        <Search size={18} className="text-gold" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent flex-1 text-white outline-none"
        />
      </div>

      {/* Tabla de usuarios */}
      <motion.div
        className="overflow-auto rounded-xl border border-gold/20 shadow-xl backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gold/10 text-gold uppercase">
            <tr>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gold/10 hover:bg-gold/5 transition"
                  >
                    <td className="p-3">{u.username}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      {u.role_id === 1
                        ? "Administrador"
                        : u.role_id === 2
                        ? "Dueño / Barbero"
                        : "Cliente"}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setEditingId(u.id);
                          setForm({
                            username: u.username,
                            email: u.email,
                            role_id: u.role_id,
                            password: "",
                          });
                        }}
                        className="text-gold hover:text-yellow-300 transition"
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default ManageUsers;
