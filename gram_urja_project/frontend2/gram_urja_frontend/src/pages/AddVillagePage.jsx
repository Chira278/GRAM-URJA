import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/pages.css';

const AddVillagePage = ({ addVillage }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    country: 'India',
    latitude: '',
    longitude: '',
    population: '',
    area: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.state || !formData.latitude || !formData.longitude) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      addVillage({
        name: formData.name,
        state: formData.state,
        country: formData.country,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        population: formData.population || 'N/A',
        area: formData.area || 'N/A'
      });
      toast.success('Village added successfully! Ready for analysis.');
      setFormData({ name: '', state: '', country: 'India', latitude: '', longitude: '', population: '', area: '' });
      setTimeout(() => navigate('/dashboard'), 1500);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="add-village-container">
      <div className="form-card">
        <h2>Add New Village</h2>
        <p className="form-subtitle">Enter village details for renewable energy assessment</p>

        <form onSubmit={handleSubmit} className="village-form">
          <div className="form-row">
            <div className="form-group">
              <label>Village Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter village name" required />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Population</label>
              <input type="number" name="population" value={formData.population} onChange={handleChange} placeholder="Village population" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude *</label>
              <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g., 28.7041" step="0.0001" required />
            </div>
            <div className="form-group">
              <label>Longitude *</label>
              <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g., 77.1025" step="0.0001" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Area (sq km)</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="Total area" step="0.01" />
            </div>
          </div>

          <div className="form-info">
            <p>💡 Tip: Get latitude/longitude from Google Maps - right-click location and copy coordinates</p>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Adding Village...' : 'Add Village & Start Analysis'}
          </button>
        </form>

        <div className="quick-links">
          <p>Sample locations:</p>
          <button type="button" onClick={() => setFormData({...formData, name: 'Solar Village', state: 'Rajasthan', latitude: '26.9124', longitude: '75.7873'})}>
            Jaipur, Rajasthan
          </button>
          <button type="button" onClick={() => setFormData({...formData, name: 'Wind Village', state: 'Tamil Nadu', latitude: '13.0827', longitude: '80.2707'})}>
            Chennai, Tamil Nadu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVillagePage;
