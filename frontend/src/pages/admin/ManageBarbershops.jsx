import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { Pencil, Trash2, Save, PlusCircle, Search, Scissors } from "lucide-react";

const ManageBarbershops = () => {
  const { token, user } = useAuth();
  const [barbershops, setBarbershops] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", city: "", user_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");

  const API = "http://localhost:4000/api/barbershops";
  const USERS_API = "http://localhost:4000/api/users";

  // ✅ Verificación inicial
  useEffect(() => {
    if (!token) console.warn("🚫 No hay token — probablemente el usuario no está logueado");
  }, [token]);

  // ✅ Obtener barberías
  const fetchBarbershops = async () => {
    try {
      const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
      setBarbershops(res.data);
      console.log("📋 Barberías cargadas:", res.data);
    } catch (err) {
      console.error("❌ Error al obtener barberías:", err.response?.data || err.message);
      if (err.response?.status === 403) alert("No tienes permiso para ver barberías.");
    }
  };

  // ✅ Obtener dueños (solo admin)
  const fetchOwners = async () => {
    if (!user || user.role_id !== 1 || !token) return;
    try {
      const res = await axios.get(`${USERS_API}?role=2`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOwners(res.data);
      console.log("👥 Dueños cargados:", res.data);
    } catch (err) {
      console.error("❌ Error al obtener dueños:", err.response?.data || err.message);
    }
  };

  // ✅ Cargar datos al inicio
  useEffect(() => {
    if (token) {
      fetchBarbershops();
      fetchOwners();
    }
  }, [token]);

  // ✅ Crear o actualizar barbería
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.city) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        // ✏️ Editar
        const res = await axios.put(`${API}/${editingId}`, form, { headers });
        console.log("✏️ Barbería actualizada:", res.data);
        fetchBarbershops();
      } else {
        // ➕ Crear
        const res = await axios.post(API, form, { headers });
        console.log("🆕 Nueva barbería creada:", res.data.data);

        // 🔹 Agregar barbería al inicio del estado
        setBarbershops((prev) => [res.data.data, ...prev]);
      }

      // 🔹 Reset formulario
      setForm({ name: "", address: "", city: "", user_id: "" });
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error al guardar barbería:", err.response?.data || err.message);
      if (err.response?.status === 403) alert("No tienes permiso para esta acción.");
    }
  };

  // ✅ Editar barbería
  const handleEdit = (b) => {
    setForm({
      name: b.name,
      address: b.address,
      city: b.city,
      user_id: b.user_id || "",
    });
    setEditingId(b.id);
    console.log("✏️ Editando barbería:", b);
  };

  // ✅ Eliminar barbería
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta barbería?")) return;
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBarbershops((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar barbería:", err.response?.data || err.message);
      if (err.response?.status === 403) alert("No tienes permiso para eliminar barberías.");
    }
  };

  // ✅ Filtrar barberías por búsqueda
  const filtered = barbershops.filter((b) =>
    [b.name, b.city, b.id?.toString()].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-[#c9a227] mb-6 flex items-center gap-2">
          <Scissors className="text-[#c9a227]" /> Gestión de Barberías
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#c9a227] outline-none"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#c9a227] outline-none"
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#c9a227] outline-none"
          />

          {user?.role_id === 1 && (
            <select
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#c9a227] outline-none"
            >
              <option value="">Seleccionar dueño</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.full_name || o.username} ({o.email})
                </option>
              ))}
            </select>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#c9a227] to-yellow-600 text-black font-semibold py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
          >
            {editingId ? (
              <>
                <Save size={18} /> Guardar
              </>
            ) : (
              <>
                <PlusCircle size={18} /> Crear
              </>
            )}
          </motion.button>
        </form>

        {/* Buscador */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, ciudad o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 py-2 text-gray-200 focus:ring-2 focus:ring-[#c9a227] outline-none"
          />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-800/60 text-[#c9a227] border-b border-gray-700">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Dirección</th>
                <th className="py-3 px-4">Ciudad</th>
                <th className="py-3 px-4">Dueño</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">{b.id}</td>
                    <td className="py-3 px-4">{b.name}</td>
                    <td className="py-3 px-4">{b.address}</td>
                    <td className="py-3 px-4">{b.city}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {b.owner?.full_name || "—"}
                    </td>
                    <td className="py-3 px-4 flex gap-2 justify-center">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(b)}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        <Pencil size={18} />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No hay barberías registradas.
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

export default ManageBarbershops;
