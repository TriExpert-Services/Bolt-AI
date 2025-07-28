import React from 'react';

const Transactions = () => {
  const transactions = [
    { id: 1, userId: 1, amount: 100, type: 'Deposit', date: '2023-01-15' },
    { id: 2, userId: 2, amount: 50, type: 'Withdrawal', date: '2023-01-16' },
    { id: 3, userId: 1, amount: 200, type: 'Deposit', date: '2023-01-17' },
  ];

  return (
    <div>
      <h2>Transactions</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>User ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Amount</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Type</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{transaction.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{transaction.userId}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{transaction.amount}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{transaction.type}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
