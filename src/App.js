import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import 'antd/dist/antd.css';

import { NavBar } from './Components';
import { LandingPage, UserPage } from './pages';

const UserPageWrapper = () => {
  const { userId } = useParams();
  return <UserPage userId={userId} />;
};

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:userId" element={<UserPageWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
