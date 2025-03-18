import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InsuranceDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get('/api/insurance');
        setClaims(response.data);
      } catch (err) {
        setError('Failed to fetch claims');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return <p>Loading claims...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Insurance Dashboard</h1>
      <p>Welcome to your dashboard. Here you can manage insurance claims.</p>
      <ul>
        {claims.map((claim) => (
          <li key={claim.id}>
            <h2>Claim ID: {claim.id}</h2>
            <p>Status: {claim.status}</p>
            <p>Description: {claim.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsuranceDashboard;
