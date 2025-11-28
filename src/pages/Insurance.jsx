import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

const initialFormState = {
  vehicleId: '',
  provider: '',
  policyNumber: '',
  type: 'Comprehensive',
  premium: '',
  startDate: '',
  expiryDate: '',
  status: 'active',
};

const insuranceProviders = [
  'ICICI Lombard',
  'HDFC Ergo',
  'Bajaj Allianz',
  'New India Assurance',
  'United India Insurance',
  'Oriental Insurance',
  'National Insurance',
  'Tata AIG',
  'Reliance General',
  'Other',
];

function Insurance() {
  const { insurance, vehicles, addInsurance, updateInsurance, deleteInsurance } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const activeVehicles = vehicles.filter((v) => v.status !== 'sold' && v.status !== 'lost');

  const filteredInsurance = insurance.filter((i) => {
    const vehicle = vehicles.find((v) => v.id === i.vehicleId);
    const matchesSearch =
      i.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle?.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (policy = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setFormData(policy);
    } else {
      setEditingPolicy(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPolicy(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      premium: parseFloat(formData.premium) || 0,
    };
    if (editingPolicy) {
      updateInsurance(editingPolicy.id, data);
    } else {
      addInsurance(data);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    deleteInsurance(id);
    setShowDeleteConfirm(null);
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model}` : 'Not Assigned';
  };

  const getExpiryStatus = (expiryDate) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { badge: 'badge-danger', text: 'Expired' };
    if (days <= 7) return { badge: 'badge-danger', text: `${days}d left` };
    if (days <= 30) return { badge: 'badge-warning', text: `${days}d left` };
    return { badge: 'badge-success', text: 'Active' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="search-box">
            <Search />
            <input
              type="text"
              className="form-input"
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Policy
        </button>
      </div>

      {/* Expiring Soon Alert */}
      {insurance.filter((i) => {
        const days = differenceInDays(new Date(i.expiryDate), new Date());
        return days >= 0 && days <= 30;
      }).length > 0 && (
        <div className="card" style={{ marginBottom: 24, borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
            <div>
              <strong>Attention Required</strong>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
                {insurance.filter((i) => {
                  const days = differenceInDays(new Date(i.expiryDate), new Date());
                  return days >= 0 && days <= 30;
                }).length} insurance policies expiring in the next 30 days
              </p>
            </div>
          </div>
        </div>
      )}

      {filteredInsurance.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Shield size={64} />
            <h3>No Insurance Policies</h3>
            <p>Add your first insurance policy to get started</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Add Policy
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Vehicle</th>
                  <th>Provider</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInsurance.map((policy) => {
                  const expiryStatus = getExpiryStatus(policy.expiryDate);
                  return (
                    <tr key={policy.id}>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {policy.policyNumber}
                      </td>
                      <td>
                        <span style={{ color: 'var(--accent-primary)' }}>
                          {getVehicleInfo(policy.vehicleId)}
                        </span>
                      </td>
                      <td>{policy.provider}</td>
                      <td>{policy.type}</td>
                      <td>₹{policy.premium?.toLocaleString()}</td>
                      <td>{format(new Date(policy.expiryDate), 'MMM d, yyyy')}</td>
                      <td>
                        <span className={`badge ${expiryStatus.badge}`}>
                          {expiryStatus.text}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary btn-icon"
                            onClick={() => handleOpenModal(policy)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger btn-icon"
                            onClick={() => setShowDeleteConfirm(policy.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingPolicy ? 'Edit Insurance Policy' : 'Add Insurance Policy'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vehicle</label>
            <select
              className="form-select"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
            >
              <option value="">Select Vehicle (Optional)</option>
              {activeVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Policy Number *</label>
              <input
                type="text"
                className="form-input"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                required
                placeholder="e.g., POL-2024-001234"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Provider *</label>
              <select
                className="form-select"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                required
              >
                <option value="">Select Provider</option>
                {insuranceProviders.map((provider) => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="Comprehensive">Comprehensive</option>
                <option value="Third Party">Third Party</option>
                <option value="Zero Depreciation">Zero Depreciation</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Premium (₹) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.premium}
                onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                required
                min="0"
                placeholder="Enter premium amount"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPolicy ? 'Update Policy' : 'Add Policy'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Insurance Policy"
      >
        <div className="confirm-dialog">
          <Trash2 size={56} style={{ color: 'var(--danger)' }} />
          <h3>Are you sure?</h3>
          <p>This action cannot be undone.</p>
          <div className="confirm-actions">
            <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Insurance;
