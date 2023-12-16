// src/components/RateEvent.js
import React, { useState } from 'react';
import './RateEvent.css'; // Import the CSS file

const RateEvent = ({ contract, account }) => {
  const [eventId, setEventId] = useState(0);
  const [rating, setRating] = useState(0);

  const rateEvent = async () => {
    if (contract && account) {
      try {
        await contract.rateEvent(eventId, rating, { from: account });
        // You can add code to handle success or update the UI
      } catch (error) {
        console.error('Error rating event:', error);
      }
    }
  };

  return (
    <div className="rate-event-container">
      <h2 className="rate-event-heading">Rate Event</h2>
      <label className="rate-event-label">Event ID:</label>
      <input type="number" className="rate-event-input" value={eventId} onChange={(e) => setEventId(e.target.value)} />
      <label className="rate-event-label">Rating (1-5):</label>
      <input type="number" className="rate-event-input" value={rating} onChange={(e) => setRating(e.target.value)} />
      <button className="rate-event-button" onClick={rateEvent}>Rate Event</button>
    </div>
  );
};

export default RateEvent;
