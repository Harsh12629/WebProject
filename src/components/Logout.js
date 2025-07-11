
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Logout({ setToken }) {
  useEffect(() => {
    setToken(null);
    localStorage.removeItem('token');
  }, [setToken]); 

  return <Navigate to="/login" />;
}
