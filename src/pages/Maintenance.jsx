import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Wrench, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

const initialFormState = {
  vehicleId: '',
  type: '',
  description: '',
  scheduledDate: '',
  completedDate: '',
  cost: '',
  status: 'scheduled',
  notes: '',
};

const maintenanceTypes = [
  'Oil Change',
  'Tire Replacement',
  'Brake Service',
  'Battery Replacement',
  'Engine Tune-up',
  'Transmission Service',
  'Air Filter Replacement',
  'Coolant Flush',
  'Wheel Alignment',
  'General Inspection',
  'Other',
];

function Maintenance() {
  const { maintenance, vehicles, addMaintenance, updateMaintenance, deleteMaintenance } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const activeVehicles = vehicles.filter((v) => v.status !== 'sold' && v.status !== 'lost');

  const filteredMaintenance = maintenance.filter((m) => {
    const vehicle = vehicles.find((v) => v.id === m.vehicleId);
    const matchesSearch =
      m.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle?.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
    } else {
      setEditingRecord(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      cost: parseFloat(formData.cost) || 0,
    };
    if (editingRecord) {
      updateMaintenance(editingRecord.id, data);
    } else {
      addMaintenance(data);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    deleteMaintenance(id);
    setShowDeleteConfirm(null);
  };

  const handleMarkComplete = (record) => {
    updateMaintenance(record.id, {
      ...record,
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
    });
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'badge-info',
      'in-progress': 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    return badges[status] || 'badge-secondary';
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
              placeholder="Search maintenance..."
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
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Maintenance
        </button>
      </div>

      {filteredMaintenance.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Wrench size={64} />
            <h3>No Maintenance Records</h3>
            <p>Add your first maintenance record to get started</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Add Maintenance
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Scheduled</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaintenance.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                        {record.vehicleId ? getVehicleInfo(record.vehicleId) : 'Not Assigned'}
                      </span>
                    </td>
                    <td>{record.type}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {record.description}
                    </td>
                    <td>{format(new Date(record.scheduledDate), 'MMM d, yyyy')}</td>
                    <td>₹{record.cost?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {record.status !== 'completed' && (
                          <button
                            className="btn btn-sm btn-success btn-icon"
                            onClick={() => handleMarkComplete(record)}
                            title="Mark Complete"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-secondary btn-icon"
                          onClick={() => handleOpenModal(record)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger btn-icon"
                          onClick={() => setShowDeleteConfirm(record.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingRecord ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
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
              <label className="form-label">Type *</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                {maintenanceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cost (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                min="0"
                placeholder="Enter cost"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Enter maintenance description"
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Scheduled Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Completed Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.completedDate}
                onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
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
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRecord ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Maintenance Record"
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

export default Maintenance;
