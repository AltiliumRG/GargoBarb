import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ManageServices = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", duration_minutes: "" });
  const [editingId, setEditingId] = useState(null);

  const fetch = async () => {
    try {
      const res = await api.get("/services");
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/services/${editingId}`, form);
      else await api.post("/services", form);
      setForm({ name: "", price: "", duration_minutes: "" });
      setEditingId(null);
      fetch();
    } catch (err) { console.error(err); alert("Error"); }
  };

  const handleEdit = (s) => { setForm({ name: s.name, price: s.price, duration_minutes: s.duration_minutes }); setEditingId(s.id); };
  const handleDelete = async (id) => { if(!confirm("Eliminar?")) return; await api.delete(`/services/${id}`); fetch(); };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Servicios</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="p-2 border rounded" placeholder="Nombre" required />
        <input name="price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} className="p-2 border rounded" placeholder="Precio" />
        <input name="duration_minutes" value={form.duration_minutes} onChange={(e)=>setForm({...form,duration_minutes:e.target.value})} className="p-2 border rounded" placeholder="Duración (min)" />
        <div className="md:col-span-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Actualizar" : "Crear"}</button>
          {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm({name:"",price:"",duration_minutes:""}) }} className="ml-2 px-3 py-2 border rounded">Cancelar</button>}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100"><tr><th className="p-2">ID</th><th className="p-2">Nombre</th><th className="p-2">Precio</th><th className="p-2">Duración</th><th className="p-2">Acciones</th></tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{i.id}</td>
                <td className="p-2">{i.name}</td>
                <td className="p-2">{i.price}</td>
                <td className="p-2">{i.duration_minutes}</td>
                <td className="p-2">
                  <button onClick={()=>handleEdit(i)} className="text-blue-600 mr-2">Editar</button>
                  <button onClick={()=>handleDelete(i.id)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageServices;
