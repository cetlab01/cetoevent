// Import necessary modules
import React, { useState } from 'react';
import './CreateEvent.css'; // Import the CSS file

const CreateEvent = ({ contract, account }) => {
  // State for event details
  const [eventName, setEventName] = useState('');
  const [wallet, setWallet] = useState('');
  const [advertisement, setAdvertisement] = useState('');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketSupply, setTicketSupply] = useState(0);
  const [isRefundable, setIsRefundable] = useState(false);
  const [organizerCancellationFee, setOrganizerCancellationFee] = useState(0);
  const [buyerCancellationFee, setBuyerCancellationFee] = useState(0);

  // Function to handle event creation
  const createEvent = async () => {
    if (contract && account) {
      try {
        // Call the createEvent function in the smart contract
        await contract.createEvent(
          eventName,
          wallet,
          advertisement,
          ticketPrice,
          ticketSupply,
          isRefundable,
          organizerCancellationFee,
          buyerCancellationFee,
          { from: account }
        );
        // You can add code to handle success or update the UI
      } catch (error) {
        console.error('Error creating event:', error);
        // Handle errors and provide user feedback
      }
    }
  };

  // JSX structure for the component
  return (
    <div className="create-event-container">
      <h2 className="create-event-heading">Create Event</h2>
      {/* Event Name */}
      <label className="create-event-label">Event Name:</label>
      <input
        className="create-event-input"
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      {/* Wallet */}
      <label className="create-event-label">Wallet:</label>
      <input
        className="create-event-input"
        type="text"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />

      {/* Advertisement */}
      <label className="create-event-label">Advertisement:</label>
      <textarea
        className="create-event-input"
        value={advertisement}
        onChange={(e) => setAdvertisement(e.target.value)}
      />

      {/* Ticket Price */}
      <label className="create-event-label">Ticket Price:</label>
      <input
        className="create-event-input"
        type="number"
        value={ticketPrice}
        onChange={(e) => setTicketPrice(e.target.value)}
      />

      {/* Ticket Supply */}
      <label className="create-event-label">Ticket Supply:</label>
      <input
        className="create-event-input"
        type="number"
        value={ticketSupply}
        onChange={(e) => setTicketSupply(e.target.value)}
      />

      {/* Refundable Checkbox */}
      <label className="create-event-label">Refundable:</label>
      <input
        className="create-event-checkbox"
        type="checkbox"
        checked={isRefundable}
        onChange={() => setIsRefundable(!isRefundable)}
      />

      {/* Organizer Cancellation Fee */}
      <label className="create-event-label">Organizer Cancellation Fee:</label>
      <input
        className="create-event-input"
        type="number"
        value={organizerCancellationFee}
        onChange={(e) => setOrganizerCancellationFee(e.target.value)}
      />

      {/* Buyer Cancellation Fee */}
      <label className="create-event-label">Buyer Cancellation Fee:</label>
      <input
        className="create-event-input"
        type="number"
        value={buyerCancellationFee}
        onChange={(e) => setBuyerCancellationFee(e.target.value)}
      />

      {/* Create Event Button */}
      <button className="create-event-button" onClick={createEvent}>
        Create Event
      </button>
    </div>
  );
};

// Export the component
export default CreateEvent;
