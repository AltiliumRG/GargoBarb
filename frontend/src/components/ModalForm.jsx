import { useState } from "react";

export default function ModalForm({ initial = {}, fields = [], onSubmit, onClose, title }) {
  const [form, setForm] = useState(initial);

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white p-6 rounded w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm">{f.label}</label>
              <input
                className="border w-full p-2 rounded"
                value={form[f.key] ?? ""}
                onChange={handleChange(f.key)}
                placeholder={f.placeholder || ""}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Guardar</button>
        </div>
      </form>
    </div>
  );
}
