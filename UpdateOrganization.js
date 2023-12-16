// src/components/UpdateOrganization.js
import React, { useState } from 'react';
import './UpdateOrganization.css'; // Import the CSS file

const UpdateOrganization = ({ contract, account }) => {
  const [name, setName] = useState('');
  const [logoURI, setLogoURI] = useState('');
  const [bannerURI, setBannerURI] = useState('');
  const [url, setUrl] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const updateOrganization = async () => {
    if (contract && account) {
      try {
        await contract.setOrganizationDetails(name, logoURI, bannerURI, url, additionalInfo, { from: account });
        // You can add code to handle success or update the UI
      } catch (error) {
        console.error('Error updating organization details:', error);
      }
    }
  };

  return (
    <div className="update-organization-container">
      <h2 className="update-organization-heading">Update Organization</h2>
      <label className="update-organization-label">Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="update-organization-input" />
      <label className="update-organization-label">Logo URI:</label>
      <input type="text" value={logoURI} onChange={(e) => setLogoURI(e.target.value)} className="update-organization-input" />
      <label className="update-organization-label">Banner URI:</label>
      <input type="text" value={bannerURI} onChange={(e) => setBannerURI(e.target.value)} className="update-organization-input" />
      <label className="update-organization-label">URL:</label>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="update-organization-input" />
      <label className="update-organization-label">Additional Info:</label>
      <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="update-organization-textarea" />
      <button onClick={updateOrganization} className="update-organization-button">Update Organization</button>
    </div>
  );
};

export default UpdateOrganization;
