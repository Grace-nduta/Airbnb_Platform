import React from 'react';
function Filters({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      />

      <input
        type="number"
        name="price"
        placeholder="Max Price"
        value={filters.price}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      />

      <select
        name="amenity"
        value={filters.amenity}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        <option value="">Any Amenity</option>
        <option value="wifi">WiFi</option>
        <option value="pool">Pool</option>
        <option value="kitchen">Kitchen</option>
        <option value="parking">Parking</option>
      </select>
    </div>
  );
}

export default Filters;