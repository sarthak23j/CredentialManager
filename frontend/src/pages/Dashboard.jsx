import React, { useState, useEffect } from 'react';
import { getCredentials, deleteCredential, searchCredentials } from '../api';
import Header from '../components/Header/Header';
import SearchBar from '../components/SearchBar/SearchBar';
import CredentialGrid from '../components/CredentialGrid/CredentialGrid';
import AddModal from '../components/Modals/AddModal/AddModal';
import EditModal from '../components/Modals/EditModal/EditModal';
import DetailModal from '../components/Modals/DetailModal/DetailModal';
import ImportModal from '../components/Modals/ImportModal/ImportModal';
import PasswordModal from '../components/Modals/PasswordModal/PasswordModal';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, showToast }) => {
  const [credentials, setCredentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [viewingCred, setViewingCred] = useState(null);
  const [editingCred, setEditingCred] = useState(null);

  useEffect(() => { fetchCredentials(); }, []);

  const fetchCredentials = async () => {
    try {
      const response = await getCredentials(user);
      setCredentials(response.data);
    } catch (e) { console.error(e); }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) return fetchCredentials();
    const res = await searchCredentials(user, q);
    setCredentials(res.data);
  };

  const handleDelete = async (svc) => {
    try {
      await deleteCredential(user, svc);
      showToast(`Deleted ${svc}`, 'success');
      setViewingCred(null);
      fetchCredentials();
    } catch (e) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleEdit = (cred) => {
    setViewingCred(null);
    setEditingCred(cred);
  };

  const handleExport = () => {
    if (credentials.length === 0) return showToast("No data to export", "error");
    const allKeys = new Set();
    credentials.forEach(c => Object.keys(c.data).forEach(k => allKeys.add(k)));
    const headers = ['service', ...Array.from(allKeys)];
    const csvRows = credentials.map(c => {
      return headers.map(header => {
        if (header === 'service') return `"${c.service}"`;
        const val = c.data[header] || "";
        return `"${val.toString().replace(/"/g, '""')}"`;
      }).join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `credentials_export_${user}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Export started!", "success");
  };

  return (
    <div className="dashboard">
      <Header 
        user={user} 
        onLogout={onLogout} 
        onAdd={() => setShowAddModal(true)}
        onImport={() => setShowImportModal(true)}
        onExport={handleExport}
        onSettings={() => setShowPasswordModal(true)}
      />

      <SearchBar query={searchQuery} onSearch={handleSearch} />
      
      <CredentialGrid credentials={credentials} onItemClick={setViewingCred} />

      {showPasswordModal && <PasswordModal username={user} onClose={() => setShowPasswordModal(false)} showToast={showToast} />}
      
      {showAddModal && (
        <AddModal 
          user={user} 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => { fetchCredentials(); showToast("Credential added!"); }}
        />
      )}

      {showImportModal && (
        <ImportModal
          username={user}
          onClose={() => setShowImportModal(false)}
          onSuccess={fetchCredentials}
          showToast={showToast}
        />
      )}

      {viewingCred && (
        <DetailModal 
          cred={viewingCred} 
          onClose={() => setViewingCred(null)} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {editingCred && (
        <EditModal 
          username={user} 
          credential={editingCred} 
          onClose={() => setEditingCred(null)} 
          onUpdateSuccess={() => { fetchCredentials(); showToast("Updated successfully!"); }}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default Dashboard;
