import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplierDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/marketplace');
        setListings(response.data);
      } catch (err) {
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <p>Loading listings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Supplier Dashboard</h1>
      <p>Welcome to your dashboard. Here you can manage your listings and view contractor leads.</p>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierDashboard;
