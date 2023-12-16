// src/components/ResellTicket.js
import React, { useState } from 'react';
import './ResellTicket.css'; // Import the CSS file

const ResellTicket = ({ contract, account }) => {
  const [eventId, setEventId] = useState(0);
  const [ticketId, setTicketId] = useState(0);
  const [price, setPrice] = useState(0);

  const resellTicket = async () => {
    if (contract && account) {
      try {
        await contract.resellTicket(eventId, ticketId, price, { from: account });
        // You can add code to handle success or update the UI
      } catch (error) {
        console.error('Error reselling ticket:', error);
      }
    }
  };

  return (
    <div className="resell-ticket-container">
      <h2 className="resell-ticket-heading">Resell Ticket</h2>
      <label className="resell-ticket-label">Event ID:</label>
      <input type="number" value={eventId} onChange={(e) => setEventId(e.target.value)} className="resell-ticket-input" />
      <label className="resell-ticket-label">Ticket ID:</label>
      <input type="number" value={ticketId} onChange={(e) => setTicketId(e.target.value)} className="resell-ticket-input" />
      <label className="resell-ticket-label">Price:</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="resell-ticket-input" />
      <button onClick={resellTicket} className="resell-ticket-button">Resell Ticket</button>
    </div>
  );
};

export default ResellTicket;
