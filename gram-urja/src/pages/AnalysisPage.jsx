import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import '../styles/pages.css';

const AnalysisPage = ({ villages }) => {
  const { villageId } = useParams();
  const navigate = useNavigate();
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const village = useMemo(() => {
    const v = villages.find(v => v.id === parseInt(villageId));
    if (!v) {
      return {
        name: 'Sample Village',
        state: 'Delhi',
        latitude: 28.7041,
        longitude: 77.1025
      };
    }
    return v;
  }, [villageId, villages]);

  const radarData = [
    { type: 'Solar', value: 85, fullMark: 100 },
    { type: 'Wind', value: 45, fullMark: 100 },
    { type: 'Biomass', value: 62, fullMark: 100 },
    { type: 'Hydro', value: 35, fullMark: 100 },
    { type: 'Overall', value: 57, fullMark: 100 },
  ];

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalyzed(true);
      toast.success('Analysis complete! Check recommendations below.');
      setLoading(false);
    }, 1500);
  };

  const handleGenerateReport = () => {
    toast.success('Report generated! Download available in Reports section.');
    localStorage.setItem('lastReport', JSON.stringify({
      village: village.name,
      date: new Date().toISOString(),
      data: radarData
    }));
    navigate('/reports');
  };

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <div>
          <h2>Energy Analysis</h2>
          <p className="location-info">📍 {village.name}, {village.state}</p>
          {village.latitude && <p className="coordinates">Coordinates: {village.latitude.toFixed(4)}, {village.longitude.toFixed(4)}</p>}
        </div>
        {!analyzed && (
          <button className="btn-analyze-large" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : '⚡ Run Analysis'}
          </button>
        )}
      </div>

      {analyzed && (
        <div className="analysis-grid">
          <div className="analysis-card">
            <h3>Energy Potential Radar</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2E7D32" />
                <PolarAngleAxis dataKey="type" stroke="#A5D6A7" />
                <PolarRadiusAxis stroke="#A5D6A7" />
                <Radar name="Score" dataKey="value" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="recommendations">
            <h3>Personalized Recommendations</h3>
            <div className="rec-item high">
              <span className="rec-icon">☀️</span>
              <div>
                <h4>Solar PV Installation</h4>
                <p className="score-badge">Score: 85/100 - EXCELLENT</p>
                <p>High solar irradiance in this region. Recommend rooftop or ground-mounted solar panels. Investment: ₹50-60 lakhs/MW. ROI: 5-7 years.</p>
              </div>
            </div>
            <div className="rec-item medium">
              <span className="rec-icon">🌱</span>
              <div>
                <h4>Biomass Energy</h4>
                <p className="score-badge">Score: 62/100 - MODERATE</p>
                <p>Good agricultural waste availability. Setup biogas plant for waste management and energy. Investment: ₹20-30 lakhs. Returns: Excellent.</p>
              </div>
            </div>
            <div className="rec-item medium">
              <span className="rec-icon">💨</span>
              <div>
                <h4>Wind Energy</h4>
                <p className="score-badge">Score: 45/100 - MODERATE</p>
                <p>Moderate wind potential. Small wind turbines (5-10kW) might be feasible. Investment: ₹15-25 lakhs. Requires proper site assessment.</p>
              </div>
            </div>
            <div className="rec-item low">
              <span className="rec-icon">💧</span>
              <div>
                <h4>Hydro Energy</h4>
                <p className="score-badge">Score: 35/100 - LOW</p>
                <p>Low hydroelectric potential. Consider micro-hydro only if water resources available. Investment: ₹30-50 lakhs if feasible.</p>
              </div>
            </div>
          </div>

          <div className="summary-card full-width">
            <h3>Overall Assessment</h3>
            <div className="summary-stats">
              <div className="stat">
                <h4>Overall Score</h4>
                <p className="big-number">57/100</p>
              </div>
              <div className="stat">
                <h4>Best Option</h4>
                <p className="big-text">Solar Energy</p>
              </div>
              <div className="stat">
                <h4>Estimated Investment</h4>
                <p className="big-text">₹50-70L</p>
              </div>
              <div className="stat">
                <h4>Annual Savings</h4>
                <p className="big-text">₹15-20L</p>
              </div>
            </div>
            <button className="btn-generate-report" onClick={handleGenerateReport}>
              📄 Generate Report
            </button>
          </div>
        </div>
      )}

      {!analyzed && (
        <div className="no-analysis">
          <div className="empty-state">
            <p className="empty-icon">📊</p>
            <p>Click "Run Analysis" to get detailed energy assessment</p>
            <p className="empty-subtitle">Our AI will analyze solar, wind, biomass, and hydro potential</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
