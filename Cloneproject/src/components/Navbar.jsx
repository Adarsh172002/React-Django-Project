import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { user, token, logout, refreshAccessToken } = useAuth(); // Use the useAuth hook to access authentication state
  const [userData, setUserData] = useState(user);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);

      } catch (error) {
        console.log(error.response);
        if (error.response && error.response.status === 401) {
          // Token might be expired, try to refresh
          try {
            await refreshAccessToken();
            const refreshedToken = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
              headers: {
                Authorization: `Bearer ${refreshedToken}`
              }
            });
            setUserData(response.data);
          } catch (refreshError) {
            console.error('Failed to refresh token and fetch user data:', refreshError);
            logout();
            navigate('/');
          }
        } else {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, refreshAccessToken, logout, navigate]);

  const handleLogout = () => {
    console.log('Logout clicked');
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-purple-600 p-4 flex items-center justify-between" style={{ backgroundColor: "#9f91eb" }}>
      <div className="flex items-center">
        <img
          src="https://preview.redd.it/tracing-logo-practice-002-please-suggest-me-how-i-can-v0-lt26am34y79c1.jpeg?auto=webp&s=ff019eaea5072165be3893d7ade32d481da99723"
          alt="Logo"
          className="w-10 h-10 rounded-full mr-2"
        />
      </div>
      <div className="flex-1 mx-4">
        <input
          type="text"
          className="w-30 py-2 px-4 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:bg-white"
          placeholder="Search"
        />
      </div>
      {userData ? (
        <div className="flex items-center">
          {userData.image ? (
            <img
              src={`http://127.0.0.1:8000${userData.image}`}
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop if fallback image also fails
                e.target.src = 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg';
              }}
            />
          ) : (
            <img
              src="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span className="text-white text-sm font-semibold">{userData.username}</span>
          <button onClick={handleLogout} className="ml-4 text-red-600 font-semibold">LOGOUT</button>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-white text-sm font-semibold">Loading...</span>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
