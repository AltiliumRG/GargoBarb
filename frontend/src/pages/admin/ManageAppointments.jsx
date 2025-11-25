import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ManageAppointments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments");
      setItems(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetch(); }, []);

  const handleDelete = async (id) => {
    if(!confirm("Eliminar cita?")) return;
    try { await api.delete(`/appointments/${id}`); fetch(); } catch(e){ console.error(e) }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Citas</h2>
      {loading ? <p>Cargando...</p> : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100"><tr><th className="p-2">ID</th><th className="p-2">Cliente</th><th className="p-2">Barbero</th><th className="p-2">Servicio</th><th className="p-2">Fecha</th><th className="p-2">Acciones</th></tr></thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{a.id}</td>
                  <td className="p-2">{a.client_name || a.user?.full_name || a.user?.username}</td>
                  <td className="p-2">{a.barber_name || a.barber?.full_name}</td>
                  <td className="p-2">{a.service_name || a.service?.name}</td>
                  <td className="p-2">{new Date(a.date).toLocaleString()}</td>
                  <td className="p-2"><button onClick={()=>handleDelete(a.id)} className="text-red-600">Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
