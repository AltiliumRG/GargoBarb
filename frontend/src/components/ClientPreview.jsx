import React, { useEffect, useState } from "react";
import api from "../api/api";
import { motion } from "framer-motion";

const ClientPreview = () => {
  const [shops, setShops] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/barbershops");
        setShops(res.data);
      } catch (err) { console.error(err); }
    })();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-3">Vista Cliente (preview)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map(s => (
          <motion.div key={s.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="bg-white p-4 rounded shadow">
            <h4 className="font-bold text-lg">{s.name}</h4>
            <p className="text-sm text-gray-600">{s.address}</p>
            <p className="text-sm mt-2">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientPreview;
