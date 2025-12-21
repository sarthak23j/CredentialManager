import React from 'react';
import './CredentialCard.css';

const CredentialCard = ({ cred, onClick }) => (
  <div className="cred-card compact" onClick={() => onClick(cred)}>
    <h4>{cred.service}</h4>
  </div>
);

export default CredentialCard;