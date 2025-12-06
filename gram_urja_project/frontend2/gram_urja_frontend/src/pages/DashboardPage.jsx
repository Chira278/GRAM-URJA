import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/pages.css';

const DashboardPage = ({ villages }) => {
  const navigate = useNavigate();

  const energyData = [
    { name: 'Solar', value: 85, color: '#FFD700' },
    { name: 'Wind', value: 45, color: '#00CED1' },
    { name: 'Biomass', value: 62, color: '#32CD32' },
    { name: 'Hydro', value: 35, color: '#4169E1' },
  ];

  const trendData = [
    { month: 'Jan', solar: 65, wind: 35, biomass: 50 },
    { month: 'Feb', solar: 70, wind: 40, biomass: 55 },
    { month: 'Mar', solar: 75, wind: 42, biomass: 58 },
    { month: 'Apr', solar: 80, wind: 45, biomass: 62 },
    { month: 'May', solar: 85, wind: 48, biomass: 65 },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Energy Analytics Dashboard</h2>
          <p className="subtitle">{villages.length} villages registered • Ready for analysis</p>
        </div>
        <button className="btn-add" onClick={() => navigate('/add-village')}>
          + Add New Village
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>Energy Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={energyData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} dataKey="value">
                {energyData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Energy Trends (5 months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid stroke="#2E7D32" />
              <XAxis stroke="#A5D6A7" />
              <YAxis stroke="#A5D6A7" />
              <Tooltip contentStyle={{ backgroundColor: '#1B5E20', border: 'none', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="solar" stroke="#FFD700" strokeWidth={2} />
              <Line type="monotone" dataKey="wind" stroke="#00CED1" strokeWidth={2} />
              <Line type="monotone" dataKey="biomass" stroke="#32CD32" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3>Average Energy Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid stroke="#2E7D32" />
              <XAxis dataKey="name" stroke="#A5D6A7" />
              <YAxis stroke="#A5D6A7" />
              <Tooltip contentStyle={{ backgroundColor: '#1B5E20', border: 'none', color: '#fff' }} />
              <Bar dataKey="value" fill="#4CAF50" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-grid">
          {energyData.map((item, idx) => (
            <div key={idx} className="stat-card" style={{ borderLeft: `4px solid ${item.color}` }}>
              <h4>{item.name}</h4>
              <p className="score">{item.value}</p>
              <p className="label">Average Score</p>
            </div>
          ))}
        </div>

        {villages.length > 0 && (
          <div className="villages-section full-width">
            <h3>Your Villages</h3>
            <div className="villages-list">
              {villages.map((v) => (
                <div key={v.id} className="village-item">
                  <div>
                    <h4>{v.name}</h4>
                    <p>{v.state}, {v.country}</p>
                    <p className="coordinates">Lat: {v.latitude.toFixed(4)}, Lon: {v.longitude.toFixed(4)}</p>
                  </div>
                  <button className="btn-analyze" onClick={() => navigate(`/analysis/${v.id}`)}>
                    Analyze →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
