import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, User, Car } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

const initialFormState = {
  name: '',
  licenseNumber: '',
  licenseExpiry: '',
  phone: '',
  email: '',
  address: '',
  status: 'available',
};

function Drivers() {
  const {
    drivers,
    vehicles,
    addDriver,
    updateDriver,
    deleteDriver,
    assignDriverToVehicle,
    unassignDriver,
  } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(null);

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery)
  );

  const availableVehicles = vehicles.filter(
    (v) => v.status === 'active' && !v.assignedDriver
  );

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData(driver);
    } else {
      setEditingDriver(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDriver) {
      updateDriver(editingDriver.id, formData);
    } else {
      addDriver(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    deleteDriver(id);
    setShowDeleteConfirm(null);
  };

  const handleAssignVehicle = (driverId, vehicleId) => {
    assignDriverToVehicle(driverId, vehicleId);
    setShowAssignModal(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: 'badge-success',
      'on-duty': 'badge-info',
      'on-leave': 'badge-warning',
      inactive: 'badge-secondary',
    };
    return badges[status] || 'badge-secondary';
  };

  const getAssignedVehicle = (driverId) => {
    return vehicles.find((v) => v.assignedDriver === driverId);
  };

  return (
    <div>
      <div className="card-header" style={{ background: 'transparent', padding: 0, marginBottom: 24, border: 'none' }}>
        <div className="search-box">
          <Search />
          <input
            type="text"
            className="form-input"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Driver
        </button>
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <User size={64} />
            <h3>No Drivers Found</h3>
            <p>Add your first driver to get started</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Add Driver
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>License</th>
                  <th>Phone</th>
                  <th>License Expiry</th>
                  <th>Status</th>
                  <th>Assigned Vehicle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => {
                  const assignedVehicle = getAssignedVehicle(driver.id);
                  return (
                    <tr key={driver.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{driver.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {driver.email}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {driver.licenseNumber}
                      </td>
                      <td>{driver.phone}</td>
                      <td>{format(new Date(driver.licenseExpiry), 'MMM d, yyyy')}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td>
                        {assignedVehicle ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                              {assignedVehicle.plateNumber}
                            </span>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => unassignDriver(driver.id)}
                            >
                              Unassign
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setShowAssignModal(driver.id)}
                            disabled={driver.status !== 'available'}
                          >
                            <Car size={14} />
                            Assign
                          </button>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary btn-icon"
                            onClick={() => handleOpenModal(driver)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger btn-icon"
                            onClick={() => setShowDeleteConfirm(driver.id)}
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
        title={editingDriver ? 'Edit Driver' : 'Add New Driver'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">License Number *</label>
              <input
                type="text"
                className="form-input"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
                placeholder="e.g., DL-0420110012345"
              />
            </div>
            <div className="form-group">
              <label className="form-label">License Expiry *</label>
              <input
                type="date"
                className="form-input"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+91 9876543210"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-textarea"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter address"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="on-duty">On Duty</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingDriver ? 'Update Driver' : 'Add Driver'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Vehicle Modal */}
      <Modal
        isOpen={!!showAssignModal}
        onClose={() => setShowAssignModal(null)}
        title="Assign Vehicle"
      >
        {availableVehicles.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <Car size={48} />
            <h3>No Available Vehicles</h3>
            <p>All vehicles are currently assigned or inactive</p>
          </div>
        ) : (
          <div>
            {availableVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="card"
                style={{ marginBottom: 12, cursor: 'pointer' }}
                onClick={() => handleAssignVehicle(showAssignModal, vehicle.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                      {vehicle.plateNumber}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </div>
                  </div>
                  <span className="badge badge-success">Available</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Driver"
      >
        <div className="confirm-dialog">
          <Trash2 size={56} style={{ color: 'var(--danger)' }} />
          <h3>Are you sure?</h3>
          <p>This action cannot be undone. The driver will be permanently deleted.</p>
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

export default Drivers;
