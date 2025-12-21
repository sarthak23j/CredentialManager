import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { importCredentials } from '../../../api';
import '../Modal.css';
import './ImportModal.css';

const ImportModal = ({ username, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target.result;
      let parsedData = [];

      try {
        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          parsedData = parseCSV(content);
        } else {
          alert("Please upload a .json or .csv file");
          setLoading(false);
          return;
        }

        const res = await importCredentials(username, parsedData);
        alert(`Successfully imported ${res.data.count} credentials!`);
        onSuccess();
        onClose();
      } catch (err) {
        alert("Error parsing file. Ensure format is correct.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const service = values[0];
      const data = {};
      headers.slice(1).forEach((header, index) => {
        if (values[index + 1]) {
          data[header] = values[index + 1];
        }
      });
      return { service, data };
    });
  };

  return (
    <div className="modal-overlay blurred" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Import Credentials</h3>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>
        
        <div className="import-options">
          <div className="import-info">
             <p>Select a file to bulk-add credentials.</p>
             <ul>
               <li><strong>JSON:</strong> Array of objects with <code>service</code> and <code>data</code> fields.</li>
               <li><strong>CSV:</strong> First column as <code>service</code>, subsequent columns as data fields.</li>
             </ul>
          </div>

          <label className="file-upload-zone">
            {loading ? <p>Processing...</p> : (
              <>
                <Upload size={40} />
                <span>Click to browse JSON or CSV</span>
                <input type="file" accept=".json,.csv" onChange={handleFileChange} hidden />
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
