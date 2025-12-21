import React from 'react';
import { Plus, LogOut, Settings, Download, Upload } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout, onAdd, onImport, onExport, onSettings }) => {
  return (
    <header>
      <div className="user-welcome"><span>Welcome, <strong>{user}</strong></span></div>
      <div className="header-actions">
        <button onClick={onAdd} className="header-icon-btn" title="Add New Credential">
          <Plus size={22} />
        </button>
        <button onClick={onImport} className="header-icon-btn" title="Import Data">
          <Upload size={22} />
        </button>
        <button onClick={onExport} className="header-icon-btn" title="Export to CSV">
          <Download size={22} />
        </button>
        <button onClick={onSettings} className="header-icon-btn" title="Settings">
          <Settings size={22} />
        </button>
        <button onClick={onLogout} className="header-icon-btn logout" title="Logout">
          <LogOut size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;