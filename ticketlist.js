// src/components/TicketList.js
import React from 'react';

const TicketList = ({ tickets, purchaseTicket }) => {
  return (
    <div>
      <h2>Available Tickets</h2>
      {tickets.map((ticket, index) => (
        <div key={index}>
          <p>Ticket ID: {index}</p>
          {/* Display ticket details, e.g., type, price, etc. */}
          <button onClick={() => purchaseTicket(index)}>Purchase Ticket</button>
        </div>
      ))}
    </div>
  );
};

export default TicketList;
