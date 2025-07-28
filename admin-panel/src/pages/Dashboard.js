import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', flex: 1 }}>
          <h3>Total Users</h3>
          <p>1,234</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', flex: 1 }}>
          <h3>Total Transactions</h3>
          <p>5,678</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', flex: 1 }}>
          <h3>Revenue</h3>
          <p>$12,345</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
