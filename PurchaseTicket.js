// src/components/PurchaseTicket.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PurchaseTicket.css'; // Import the CSS file

const PurchaseTicket = ({ contract, account }) => {
  const { eventId } = useParams();
  const [isVIP, setIsVIP] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [otherSpecialNeeds, setOtherSpecialNeeds] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);

  const calculateTicketPrice = () => {
    let basePrice = 100;
    let vipPrice = isVIP ? 50 : 0;
    let groupPrice = isGroup ? 30 : 0;
    let specialNeedsPrice = (vegetarian || otherSpecialNeeds) ? 20 : 0;

    return basePrice + vipPrice + groupPrice + specialNeedsPrice;
  };

  useEffect(() => {
    // Update ticket price whenever the options change
    setTicketPrice(calculateTicketPrice());
  }, [isVIP, isGroup, vegetarian, otherSpecialNeeds]);

  const purchaseTicket = async () => {
    if (contract && account) {
      try {
        await contract.purchaseTicket(eventId, isVIP, isGroup, vegetarian, otherSpecialNeeds, { from: account, value: ticketPrice });
        // Handle success or update the UI
      } catch (error) {
        console.error('Error purchasing ticket:', error);
      }
    }
  };

  return (
    <div className="purchase-ticket-container">
      <h2>Purchase Ticket for Event {eventId}</h2>
      <label>Is VIP:</label>
      <input type="checkbox" checked={isVIP} onChange={() => setIsVIP(!isVIP)} />
      <label>Is Group:</label>
      <input type="checkbox" checked={isGroup} onChange={() => setIsGroup(!isGroup)} />
      <label>Vegetarian:</label>
      <input type="checkbox" checked={vegetarian} onChange={() => setVegetarian(!vegetarian)} />
      <label>Other Special Needs:</label>
      <input type="checkbox" checked={otherSpecialNeeds} onChange={() => setOtherSpecialNeeds(!otherSpecialNeeds)} />
      <p>Ticket Price: {ticketPrice} ETH</p>
      <button onClick={purchaseTicket}>Purchase Ticket</button>
    </div>
  );
};

export default PurchaseTicket;
