// src/components/EventDetails.js
import React from 'react';

const EventDetails = ({ event }) => {
  return (
    <div>
      <h2>Event Details</h2>
      <p>Name: {event.name}</p>
      <p>Organizer: {event.organizer}</p>
      <p>Wallet: {event.wallet}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default EventDetails;
