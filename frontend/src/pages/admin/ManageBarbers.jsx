import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Edit3, Trash2, UserPlus, Search } from "lucide-react";

const ManageBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience: "",
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ✅ Cargar barberos
  const fetchBarbers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users?role=barber");
      const data = await res.json();
      setBarbers(data);
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

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/users/${editingId}`
      : "http://localhost:5000/api/users";

    const body = JSON.stringify({ ...form, role: "barber" });

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      fetchBarbers();
      setForm({
        name: "",
        email: "",
        password: "",
        specialty: "",
        experience: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar barbero:", error);
    }
  };

  // ✅ Eliminar barbero
  const deleteBarber = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este barbero?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      fetchBarbers();
    } catch (error) {
      console.error("Error al eliminar barbero:", error);
    }
  };

  // ✅ Filtrado
  const filteredBarbers = barbers.filter(
    (b) =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
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
            placeholder="Buscar barbero..."
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
        className="bg-gray-900/70 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow-lg mb-10 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            placeholder="Contraseña"
            className="p-3 rounded-lg bg-gray-800 border border-yellow-500/20 text-gray-200 focus:border-yellow-500 outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
          <input
            type="text"
            placeholder="Especialidad (fade, barba, etc)"
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
          className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all"
        >
          <UserPlus size={18} />
          {editingId ? "Guardar Cambios" : "Agregar Barbero"}
        </button>
      </motion.form>

      {/* 📋 Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="overflow-x-auto"
      >
        <table className="w-full border-collapse text-gray-200">
          <thead>
            <tr className="bg-gray-800 border-b border-yellow-500/20">
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Correo</th>
              <th className="py-3 px-4 text-left">Especialidad</th>
              <th className="py-3 px-4 text-center">Experiencia</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredBarbers.map((b) => (
              <motion.tr
                key={b._id}
                whileHover={{ scale: 1.01, backgroundColor: "#1a1a1a" }}
                className="border-b border-yellow-500/10 transition-all"
              >
                <td className="py-3 px-4">{b.name}</td>
                <td className="py-3 px-4">{b.email}</td>
                <td className="py-3 px-4">{b.specialty || "—"}</td>
                <td className="py-3 px-4 text-center">
                  {b.experience ? `${b.experience} años` : "—"}
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setForm({
                        name: b.name,
                        email: b.email,
                        password: "",
                        specialty: b.specialty,
                        experience: b.experience,
                      });
                      setEditingId(b._id);
                    }}
                    className="text-yellow-400 hover:text-yellow-300 transition"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => deleteBarber(b._id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ManageBarbers;
