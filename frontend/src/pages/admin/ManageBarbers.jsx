import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Edit3, Trash2, UserPlus, Search } from "lucide-react";
import api from "../../api/api";

const ManageBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    specialty: "",
    experience: "",
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Cargar barberos
  const fetchBarbers = async () => {
    try {
      const res = await api.get("/users?role=2");
      setBarbers(res.data);
    } catch (error) {
      console.error("Error al cargar barberos:", error);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  // ✅ Guardar barbero (nuevo o editado)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
      } else {
        // Para crear un nuevo barbero, usamos el endpoint de registro con role_id: 2
        await api.post("/auth/register", {
          ...form,
          role_id: 2
        });
      }
      fetchBarbers();
      setForm({
        username: "",
        full_name: "",
        email: "",
        password: "",
        specialty: "",
        experience: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar barbero:", error);
      alert(error.response?.data?.error || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Eliminar barbero
  const deleteBarber = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este barbero?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchBarbers();
    } catch (error) {
      console.error("Error al eliminar barbero:", error);
    }
  };

  // ✅ Filtrado
  const filteredBarbers = barbers.filter(
    (b) =>
      b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.username?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-6 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
      >
        Gestión de Barberos 💈
      </motion.h2>

      {/* 🔍 Buscador */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-gray-900 border border-yellow-500/30 rounded-full px-4 py-2 w-full max-w-md">
          <Search className="text-yellow-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o especialidad..."
            className="bg-transparent w-full focus:outline-none text-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🧾 Formulario */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/70 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow-lg mb-10 max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Usuario (username)"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            disabled={!!editingId} // No dejamos cambiar el username en edición por simplicidad
          />
          <input
            type="text"
            placeholder="Nombre Completo"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder={editingId ? "Nueva Contraseña (opcional)" : "Contraseña"}
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
          <input
            type="text"
            placeholder="Especialidad (e.g. Fades, Barba)"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          />
          <input
            type="number"
            placeholder="Experiencia (años)"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <UserPlus size={18} />
          )}
          {editingId ? "Actualizar Datos" : "Registrar Barbero"}
        </button>
      </motion.form>

      {/* 📋 Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-yellow-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 font-semibold">Barbero</th>
                <th className="py-4 px-6 font-semibold">Contacto</th>
                <th className="py-4 px-6 font-semibold">Perfil</th>
                <th className="py-4 px-6 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBarbers.length > 0 ? (
                filteredBarbers.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-white">{b.full_name || b.username}</div>
                      <div className="text-xs text-gray-500">@{b.username}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-300">{b.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-yellow-600 truncate max-w-[150px]">
                        {b.specialty || "General"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {b.experience ? `${b.experience} años exp.` : "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setForm({
                              username: b.username,
                              full_name: b.full_name || "",
                              email: b.email,
                              password: "",
                              specialty: b.specialty || "",
                              experience: b.experience || "",
                            });
                            setEditingId(b.id);
                          }}
                          className="p-2 hover:bg-yellow-500/10 rounded-full text-yellow-500 transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteBarber(b.id)}
                          className="p-2 hover:bg-red-500/10 rounded-full text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500">
                    No se encontraron barberos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageBarbers;
