import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', backgroundColor: '#f0f0f0', height: '100vh', padding: '20px' }}>
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
        </ul>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
