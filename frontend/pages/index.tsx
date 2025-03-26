import { useEffect, useState } from 'react';
import axios from 'axios';
import HomeownerDashboard from '../components/HomeownerDashboard';
import ContractorDashboard from '../components/ContractorDashboard';

const IndexPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/api/auth/role');
        setRole(response.data.role);
      } catch (err) {
        setError('Failed to fetch user role');
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
      {role === 'homeowner' && <HomeownerDashboard />}
      {role === 'contractor' && <ContractorDashboard />}
    </div>
  );
};

export default IndexPage;
