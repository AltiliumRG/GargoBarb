import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Trash2, Edit3, Search } from "lucide-react";
import api from "../../api/api";

const ManageClients = () => {
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  // ✅ Cargar dueños (rol 2)
  const fetchOwners = async () => {
    try {
      const res = await api.get("/users?role=2");
      setOwners(res.data);
    } catch (error) {
      console.error("❌ Error al cargar dueños:", error);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // ✅ Crear o editar dueño
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, {
          full_name: form.full_name,
          email: form.email,
          password: form.password || undefined,
          role_id: 2,
        });
      } else {
        await api.post("/users", {
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role_id: 2, // Dueño
        });
      }

      fetchOwners();
      setForm({ full_name: "", email: "", password: "" });
      setEditingId(null);
    } catch (error) {
      console.error("❌ Error al guardar dueño:", error);
      alert(error.response?.data?.message || "Error al guardar el dueño");
    }
  };

  // ✅ Eliminar dueño
  const deleteOwner = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este dueño?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchOwners();
    } catch (error) {
      console.error("❌ Error al eliminar dueño:", error);
    }
  };

  // ✅ Filtrar por nombre o correo
  const filteredOwners = owners.filter(
    (o) =>
      o.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-6 text-white">
      {/* Título */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
      >
        Gestión de Dueños
      </motion.h2>

      {/* Buscador */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center bg-gray-900 border border-yellow-500/30 rounded-full px-4 py-2 w-full max-w-md shadow-lg hover:shadow-yellow-500/20 transition-all">
          <Search className="text-yellow-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar dueño..."
            className="bg-transparent w-full focus:outline-none text-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Formulario */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900/70 backdrop-blur-md border border-yellow-500/20 p-6 rounded-2xl shadow-lg mb-10 max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none transition-all"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none transition-all"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none transition-all"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="mt-5 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all mx-auto"
        >
          <UserPlus size={20} />
          {editingId ? "Guardar Cambios" : "Agregar Dueño"}
        </motion.button>
      </motion.form>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="overflow-x-auto bg-gray-900/50 backdrop-blur-lg border border-yellow-500/10 rounded-2xl shadow-xl"
      >
        <table className="w-full text-gray-200">
          <thead>
            <tr className="bg-gray-800/80 border-b border-yellow-500/20">
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Correo</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.map((owner) => (
              <motion.tr
                key={owner.id}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(255, 215, 0, 0.05)",
                }}
                transition={{ duration: 0.2 }}
                className="border-b border-yellow-500/10"
              >
                <td className="py-3 px-4">{owner.full_name}</td>
                <td className="py-3 px-4">{owner.email}</td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setForm({
                        full_name: owner.full_name,
                        email: owner.email,
                        password: "",
                      });
                      setEditingId(owner.id);
                    }}
                    className="text-yellow-400 hover:text-yellow-300 transition-all"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => deleteOwner(owner.id)}
                    className="text-red-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredOwners.length === 0 && (
          <p className="text-center text-gray-400 py-6">
            No hay dueños registrados.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ManageClients;
