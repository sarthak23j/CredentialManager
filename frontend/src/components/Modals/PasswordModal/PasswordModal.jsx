import React, { useState } from 'react';
import { Lock, Key, X } from 'lucide-react';
import { changePassword } from '../../../api';
import InputGroup from '../../ui/InputGroup';
import '../Modal.css';
import './PasswordModal.css';

const PasswordModal = ({ username, onClose, showToast }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await changePassword(username, oldPassword, newPassword);
      if (response.data.success) {
        showToast(response.data.message, "success");
        onClose();
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to change password", "error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Change Password</h3>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <InputGroup icon={Lock} type="password" placeholder="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          <InputGroup icon={Key} type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit" className="primary-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;