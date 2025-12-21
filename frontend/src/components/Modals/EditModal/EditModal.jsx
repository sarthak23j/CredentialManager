import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { updateCredential } from '../../../api';
import '../Modal.css';
import './EditModal.css';

const EditModal = ({ username, credential, onClose, onUpdateSuccess }) => {
  const [inputFields, setInputFields] = useState(
    Object.entries(credential.data).map(([key, value]) => ({ key, value }))
  );

  const handleAddField = () => {
    setInputFields([...inputFields, { key: '', value: '' }]);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataObj = {};
    inputFields.forEach(field => {
      if (field.key.trim()) {
        dataObj[field.key.trim()] = field.value.trim();
      }
    });

    try {
      const response = await updateCredential(username, credential.service, dataObj);
      if (response.data.success) {
        onUpdateSuccess();
        onClose();
      }
    } catch (error) {
      alert("Error updating credential");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal wide-modal">
        <div className="modal-header">
          <h3>Edit {credential.service}</h3>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="dynamic-fields scrollable-fields">
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
                <button type="button" onClick={() => handleRemoveField(index)} className="remove-field-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddField} className="add-field-btn secondary">
            + Add New Field
          </button>
          <button type="submit" className="primary-btn submit-btn">
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;