import React from 'react';
import './InputGroup.css';

const InputGroup = ({ icon: Icon, type, placeholder, value, onChange, required = false }) => (
  <div className="input-group">
    {Icon && <Icon size={20} />}
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      required={required} 
    />
  </div>
);

export default InputGroup;
