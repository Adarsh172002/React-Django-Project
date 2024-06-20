import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Update the path accordingly

const UserProfile = () => {
  const { token, refreshAccessToken } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response && error.response.status === 401) {
          try {
            await refreshAccessToken();
            const refreshedToken = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
              headers: {
                Authorization: `Bearer ${refreshedToken}`
              }
            });
            setUser(response.data);
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            // Handle logout or redirect to login page
          }
        }
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token, refreshAccessToken]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex p-4">
      <div className="w-1/3 flex flex-col items-center">
        <img 
          className="w-50 h-60 rounded-full"
          src={`http://127.0.0.1:8000${user.image}`}
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop if fallback image also fails
            e.target.src = 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg';
          }}
        />
        <nav className="mt-4 w-60 flex flex-col items-start bg-gray-200 rounded-lg p-2">
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              isActive ? 'px-4 py-2 mb-2 text-blue-500 border-l-4 border-blue-500' : 'px-4 py-2 mb-2 hover:text-blue-500'
            }
          >
            Home
          </NavLink>
          <NavLink 
            to={`/edit-profile`} 
            className={({ isActive }) => 
              isActive ? 'px-4 py-2 text-blue-500 border-l-4 border-blue-500' : 'px-4 py-2 hover:text-blue-500'
            }
          >
            Edit Profile
          </NavLink>
        </nav>
      </div>
      <div className="w-2/3 p-4">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <p className="border rounded w-full py-2 px-3">{user.username}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <p className="border rounded w-full py-2 px-3">{user.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number:</label>
            <p className="border rounded w-full py-2 px-3">{user.phone_number}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address:</label>
            <p className="border rounded w-full py-2 px-3">{user.address}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">State:</label>
            <p className="border rounded w-full py-2 px-3">{user.state}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country:</label>
            <p className="border rounded w-full py-2 px-3">{user.country}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pin Code:</label>
            <p className="border rounded w-full py-2 px-3">{user.pincode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
