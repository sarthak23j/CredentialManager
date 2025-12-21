import React, { useState } from 'react';
import { X, Edit3, Trash2, Check, Copy } from 'lucide-react';
import '../Modal.css';
import './DetailModal.css';

const DetailModal = ({ cred, onClose, onEdit, onDelete }) => {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!cred) return null;

  const handleCopy = async (key, value) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for non-secure contexts (HTTP)
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          return; // Exit if fallback fails
        }
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="modal-overlay blurred" onClick={onClose}>
      <div className="modal detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{cred.service}</h3>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>
        
        <div className="modal-body">
          {Object.entries(cred.data).map(([k, v]) => (
            <div 
              key={k} 
              className={`detail-row copyable ${copiedKey === k ? 'copied' : ''}`}
              onClick={() => handleCopy(k, v)}
              title="Click to copy"
            >
              <div className="detail-info">
                <span className="detail-key">{k}</span>
                <span className="detail-val">{v}</span>
              </div>
              <div className="copy-indicator">
                {copiedKey === k ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button onClick={() => onEdit(cred)} className="edit-btn-large">
            <Edit3 size={18} /> Edit
          </button>
          <button onClick={() => onDelete(cred.service)} className="delete-btn-large">
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;