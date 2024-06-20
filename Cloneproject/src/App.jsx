import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import NavBar from "./components/Navbar";
import ProfilePicture from "./components/ProfilePicture";
import PostArea from "./components/Postarea";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile"

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<div className="App"><NavBar /><div className="flex"><ProfilePicture /><PostArea /></div></div>} />
          <Route path="/profile/" element={<div className="App"><NavBar  /><UserProfile/></div>} />
          <Route path="/edit-profile/" element={<EditProfile />} />
          {/* Add other routes here */}
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;









































// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NavBar from "./components/Navbar";
// import ProfilePicture from "./components/ProfilePicture";
// import PostArea from "./components/Postarea";
// import UserProfile from "./components/UserProfile";
// import Login from "./components/Login";
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

// library.add(faThumbsUp, faComment, faShare);


// const App = () => {
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);

//   // console.log("Token:", token);
//   // console.log("User:", user);

//   const handleLogin = (newToken) => {
//     // console.log("Login Successful. Token:", newToken);
//     setToken(newToken);
//   };

//   const handleUserUpdate = (newUser) => {
//     // console.log("User Update:", newUser);
//     setUser(newUser);
//   };
//   return(
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login onLogin={handleLogin} onUserUpdate={handleUserUpdate} />} />
//         <Route path="/home" element={<div className="App"><NavBar token={token} user={user} /><div className="flex"><ProfilePicture user={user} /><PostArea token={token} user={user}/> </div></div>} />
//         <Route path="/profile/" element={<div className="App"><NavBar token={token} user={user} /><UserProfile   token={token} /></div>} />
//       </Routes>
//     </BrowserRouter>
//   )
// };

//export default App;
