// src/components/EventPage.js
import React, { useState, useEffect } from 'react';
import EventDetails from './eventdetails';
import TicketList from './ticketlist';

const EventPage = ({ contract, account, eventId }) => {
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch event details and available tickets
    const fetchEventDetails = async () => {
      // Call contract methods to get event details and tickets
      // Update state with the fetched data
    };

    fetchEventDetails();
  }, [contract, account, eventId]);

  const purchaseTicket = async (ticketId) => {
    // Implement ticket purchase logic using contract methods
    // Refresh ticket list after a successful purchase
  };

  return (
    <div>
      {event && <EventDetails event={event} />}
      {tickets.length > 0 && <TicketList tickets={tickets} purchaseTicket={purchaseTicket} />}
    </div>
  );
};

export default EventPage;
