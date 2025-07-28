import React from 'react';

const Users = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'User' },
  ];

  return (
    <div>
      <h2>Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
