import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { addCredential } from '../../../api'; // Adjusted import
import '../Modal.css';
import './AddModal.css';

const AddModal = ({ user, onClose, onSuccess }) => {
  const [newService, setNewService] = useState('');
  const [inputFields, setInputFields] = useState([{ key: '', value: '' }]);

  const handleAddField = () => setInputFields([...inputFields, { key: '', value: '' }]);

  const handleRemoveField = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const dataObj = {};
    inputFields.forEach(field => {
      if (field.key.trim()) dataObj[field.key.trim()] = field.value.trim();
    });
    await addCredential(user, newService, dataObj);
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay blurred" onClick={onClose}>
      <div className="modal wide-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Service</h3>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label>Service Name</label>
            <input 
              placeholder="e.g. Netflix, Chase Bank" 
              value={newService} 
              onChange={e => setNewService(e.target.value)} 
              required 
              className="main-input"
            />
          </div>
          
          <div className="dynamic-fields scrollable-fields">
            <label>Service Details</label>
            {inputFields.map((field, index) => (
              <div key={index} className="field-row">
                <input
                  name="key"
                  placeholder="Label"
                  value={field.key}
                  onChange={event => handleInputChange(index, event)}
                  required
                />
                <input
                  name="value"
                  placeholder="Value"
                  value={field.value}
                  onChange={event => handleInputChange(index, event)}
                  required
                />
                {inputFields.length > 1 && (
                  <button type="button" onClick={() => handleRemoveField(index)} className="remove-field-btn">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddField} className="add-field-btn">
            + Add Another Field
          </button>
          <button type="submit" className="primary-btn submit-btn">Save Credential</button>
        </form>
      </div>
    </div>
  );
};

export default AddModal;