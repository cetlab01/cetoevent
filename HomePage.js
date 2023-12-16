// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import EventCards from './EventCards'; // Correct the import path
import './HomePage.css'; // Import your specific styles

const HomePage = () => {
  // Example featured events data
  const featuredEventsData = [
    {
      title: 'Summer Music Festival',
      description: 'Join us for a weekend of music and fun!',
    },
    {
      title: 'Tech Conference 2023',
      description: 'Explore the latest in technology and innovation.',
    },
    {
      title: 'Foodie Fiesta',
      description: 'A culinary extravaganza for food enthusiasts!',
    },
    {
      title: 'Outdoor Adventure Retreat',
      description: 'Escape to nature and embark on thrilling adventures.',
    },
    {
      title: 'Art and Culture Expo',
      description: 'Immerse yourself in a world of creativity and expression.',
    },
    {
      title: 'Blockchain Symposium',
      description: 'Immerse yourself in a world of creativity and expression.',
    },
    // ... (other events)
  ];

  return (
    <div className="home-page">
      {/* Removed <Header /> */}

      <div className="banner">
        {/* Include banners or featured images */}
        <h1>Your Event Booking DApp</h1>
        <p>Find and book exciting events near you!</p>
        <Link to="/create-event">Create Event</Link>
        <Link to="/purchase-ticket">Book a Ticket</Link>
      </div>

      <div className="featured-events">
        <h2>Featured Events</h2>
        {/* Render event cards */}
        <EventCards events={featuredEventsData} />
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <p>Discover, book, and enjoy events in just a few simple steps:</p>
        <ol>
          <li>Explore events on our platform.</li>
          <li>Choose the event that interests you.</li>
          <li>Book your tickets or create your own event.</li>
          <li>Attend and have a great time!</li>
        </ol>
      </div>

      {/* Removed <Footer /> */}
    </div>
  );
};

export default HomePage;
