export default function Table({ columns = [], data = [], actions }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-left p-3">{col.title}</th>
            ))}
            {actions && <th className="p-3">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-t">
              {columns.map((col) => (
                <td key={col.key} className="p-3">{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {actions && <td className="p-3">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
