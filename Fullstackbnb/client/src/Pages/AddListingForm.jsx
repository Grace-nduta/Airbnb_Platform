import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AddListingForm({ onListingCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price_per_night: '',
    description: '',
    amenities: '',
    image_url: ''
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); 
    if (!token) {
      alert('You must be logged in as a host.');
      return;
    }

    fetch('http://127.0.0.1:5555/host/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        location: formData.location,
        price_per_night: parseFloat(formData.price_per_night),
        description: formData.description,
        amenities: formData.amenities.split(',').map(a => a.trim()),
        image_url: formData.image_url
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert('Listing created successfully!');
          onListingCreated?.(data); 
        }
      })
      .catch(err => {
        console.error('Create listing error:', err);
        alert('Failed to create listing.');
      });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add a New Listing</h3>
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price_per_night"
          placeholder="Price per night"
          className="w-full p-2 border rounded"
          value={formData.price_per_night}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="amenities"
          placeholder="Amenities (comma-separated)"
          className="w-full p-2 border rounded"
          value={formData.amenities}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          className="w-full p-2 border rounded"
          value={formData.image_url}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
}

export default AddListingForm;