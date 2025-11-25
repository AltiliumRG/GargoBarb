export default function CardBarbershop({ b }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h4 className="font-bold text-lg">{b.name}</h4>
      <p className="text-sm text-gray-600">{b.address}</p>
      <p className="text-sm mt-2">Propietario: {b.ownerName || b.owner}</p>
    </div>
  );
}
