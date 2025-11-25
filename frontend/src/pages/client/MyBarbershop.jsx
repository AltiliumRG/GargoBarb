import { useEffect, useState } from "react";
import api from "../../api/api";

export default function MyBarbershop() {
  const [data, setData] = useState(null);
  useEffect(()=> {
    (async()=> {
      // si backend tiene ruta propia para "mi barbería" úsala, sino filtrar por owner en frontend
      const res = await api.get("/barbershop/my"); // opcional: ajusta según backend
      setData(res.data);
    })();
  }, []);

  if (!data) return <div>Cargando...</div>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
      <p>{data.address}</p>
    </div>
  );
}
