import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the useAuth hook

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user,token } = useAuth(); // Use the useAuth hook to access authentication context

  useEffect(() => {
    if (user ) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      
      const userResponse = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });

      login(access, refresh, userResponse.data); // Update authentication state with refresh token
      
      navigate('/home');
    } catch (err) {
      setError('Invalid username and password. Please retry.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#9f91eb", backgroundSize: 'cover' }}>
      <div className="flex w-3/4 bg-white bg-opacity-20 rounded-lg shadow-lg">
        <div className="w-1/2 flex flex-col justify-center p-8">
          <h2 className="text-center text-3xl font-bold text-blue mb-4">Welcome to website</h2>
          <img
            src="https://preview.redd.it/tracing-logo-practice-002-please-suggest-me-how-i-can-v0-lt26am34y79c1.jpeg?auto=webp&s=ff019eaea5072165be3893d7ade32d481da99723"
            alt="Company Logo"
            className="h-40 w-40 mx-auto mb-4"
          />
          <p className="text-center text-blue mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-center text-3xl font-bold mb-6">User Login</h2>
          {error && <p className="text-center text-red-600 mb-4">{error}</p>}
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <a className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
