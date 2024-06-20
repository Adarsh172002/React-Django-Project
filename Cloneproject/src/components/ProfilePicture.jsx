import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePicture = () => {
  const { user, token, refreshAccessToken } = useAuth();
  const [userData, setUserData] = useState(user);
  const navigate = useNavigate();
  // Use the useAuth hook to access authentication state

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
          // Token might be expired, try to refresh it
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
  }, [token, refreshAccessToken, navigate]);

  return (
    <div className="flex flex-col items-center my-4">
      <img
        className="w-50 h-40 ml-5"
        src={`http://127.0.0.1:8000${userData.image}`}
        alt="Profile"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if fallback image also fails
          e.target.src = 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg';
        }}
      />
      <nav className="mt-4 w-full ml-10 mr-5 flex flex-col items-start bg-gray-200 rounded-lg p-2">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? 'px-4 py-2 mb-2 text-blue-500 border-l-4 border-blue-500' : 'px-4 py-2 mb-2 hover:text-blue-500'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? 'px-4 py-2 text-blue-500 border-l-4 border-blue-500' : 'px-4 py-2 hover:text-blue-500'
          }
        >
          Profile Details
        </NavLink>
      </nav>
    </div>
  );
};

export default ProfilePicture;
