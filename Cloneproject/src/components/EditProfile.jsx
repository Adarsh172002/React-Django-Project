import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const EditProfile = () => {
  const { token, refreshAccessToken } = useAuth();
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone_number: '',
    address: '',
    state: '',
    country: '',
    pincode: '',
    image: null,
  });
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
          }
        } else {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token, refreshAccessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser(prevUser => ({
      ...prevUser,
      image: file
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in user) {
      if (user[key] !== null && user[key] !== '') {
        formData.append(key, user[key]);
      }
    }

    // Print form data for debugging
    for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axios.put('http://127.0.0.1:8000/api/user-profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User profile saved successfully:', response.data);
      navigate('/profile');
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex p-4">
      <div className="w-full p-4">
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input 
              type="text" 
              name="username"
              value={user.username} 
              className="border rounded w-full py-2 px-3" 
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input 
              type="text" 
              name="email"
              value={user.email} 
              className="border rounded w-full py-2 px-3" 
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number:</label>
            <input 
              type="text" 
              name="phone_number"
              value={user.phone_number} 
              className="border rounded w-full py-2 px-3" 
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address:</label>
            <input 
              type="text" 
              name="address"
              value={user.address} 
              className="border rounded w-full py-2 px-3" 
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">State:</label>
            <input 
              type="text" 
              name="state"
              value={user.state} 
              className="border rounded w-full py-2 px-3" 
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country:</label>
            <input 
              type="text" 
              name="country"
              value={user.country} 
              className="border rounded w-full py-2 px-3" 
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pin Code:</label>
            <input 
              type="text" 
              name="pincode"
              value={user.pincode} 
              className="border rounded w-full py-2 px-3" 
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Profile Image:</label>
            <input 
              type="file" 
              name="image"
              className="border rounded w-full py-2 px-3" 
              onChange={handleFileChange}
            />
          </div>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-4"
            type="submit"
          >
            <span role="img" aria-label="Save">&#128190;</span> Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
