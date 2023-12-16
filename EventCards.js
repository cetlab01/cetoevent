// src/components/EventCards.js
import React from 'react';
import { Link } from 'react-router-dom';

const EventCards = ({ events }) => {
  return (
    <div className="event-cards-container">
      {events.map((event, index) => (
        <div key={index} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <Link to={`/purchase-ticket/${index + 1}`}>
            {/* Use `index + 1` as the event ID (you can replace this with your actual event ID logic) */}
            <button className="book-now-button">Book Now</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EventCards;
