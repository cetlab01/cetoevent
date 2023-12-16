// src/components/CancelEvent.js
import React, { useState } from 'react';
import './CancelEvent.css'; // Import the CSS file

const CancelEvent = ({ contract, account }) => {
  const [eventId, setEventId] = useState(0);
  const [message, setMessage] = useState(null);

  const cancelEvent = async () => {
    if (contract && account) {
      try {
        await contract.cancelEvent(eventId, { from: account });
        // Handle success
        setMessage('Event canceled successfully!');
        // You can add code to further update the UI or reset form fields
      } catch (error) {
        // Handle error
        setMessage('Error canceling event: ' + error.message);
        console.error('Error canceling event:', error);
      }
    }
  };

  return (
    <div className="cancel-event-container">
      <h2 className="cancel-event-heading">Cancel Event</h2>
      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
      <label className="cancel-event-label">Event ID:</label>
      <input
        type="number"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="cancel-event-input"
      />
      <button onClick={cancelEvent} className="cancel-event-button">
        Cancel Event
      </button>
    </div>
  );
};

export default CancelEvent;
