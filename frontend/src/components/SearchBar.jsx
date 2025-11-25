// src/components/SearchBar.jsx
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, filterBy);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-dark.gray px-4 py-2 rounded-xl border border-gold/20 shadow-inner w-full md:w-1/2"
    >
      <select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="bg-dark.light text-gold text-sm rounded-lg px-2 py-1 focus:outline-none border border-gold/30"
      >
        <option value="name">Nombre</option>
        <option value="id">ID</option>
        <option value="email">Correo</option>
      </select>

      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none px-2"
      />

      <button
        type="submit"
        className="bg-gold hover:bg-gold.light text-black font-semibold px-3 py-1 rounded-lg shadow-md hover:shadow-glow transition-all"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;
