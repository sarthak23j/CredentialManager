import React from 'react';
import CredentialCard from '../CredentialCard/CredentialCard';
import './CredentialGrid.css';

const CredentialGrid = ({ credentials, onItemClick }) => {
  return (
    <section className="cred-list">
      <div className="grid">
        {credentials.map((c, i) => (
          <CredentialCard key={i} cred={c} onClick={onItemClick} />
        ))}
        {credentials.length === 0 && <p className="empty-msg">No credentials found.</p>}
      </div>
    </section>
  );
};

export default CredentialGrid;