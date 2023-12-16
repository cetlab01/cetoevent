// Navigation.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav>
      <ul>
        <li className="nav-item"><Link to="/">Home</Link></li>
        <li className="nav-item"><Link to="/Create-Event">Create Event</Link></li>
        <li className="nav-item"><Link to="/Purchase-Ticket">Purchase Ticket</Link></li>
        <li className="nav-item"><Link to="/Resell-Ticket">Resell Ticket</Link></li>
        <li className="nav-item"><Link to="/Cancel-Event">Cancel Event</Link></li>
        <li className="nav-item"><Link to="/Rate-Event">Rate Event</Link></li>
        <li className="nav-item"><Link to="/Update-Organization">Update Organization</Link></li>
        <li className={`nav-item dropdown ${dropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
          <span>More</span>
          <div className="dropdown-container">
            <Link className="user-dashboard" to="/user-dashboard">User Dashboard</Link>
            <Link className="event-details" to="/eventdetails">Event Details</Link>
            <Link className="event-page" to="/eventpage">Event Page</Link>
            <Link className="ticket-list" to="/ticketlist">Ticket List</Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
