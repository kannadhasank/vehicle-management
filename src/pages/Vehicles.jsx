import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Car } from 'lucide-react';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

const initialFormState = {
  plateNumber: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  vin: '',
  fuelType: 'Petrol',
  mileage: 0,
  status: 'active',
};

function Vehicles() {
  const navigate = useNavigate();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.status !== 'sold' &&
      v.status !== 'lost' &&
      (v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, formData);
    } else {
      addVehicle(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    deleteVehicle(id);
    setShowDeleteConfirm(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      maintenance: 'badge-warning',
      inactive: 'badge-secondary',
    };
    return badges[status] || 'badge-secondary';
  };

  return (
    <div>
      <div className="card-header" style={{ background: 'transparent', padding: 0, marginBottom: 24, border: 'none' }}>
        <div className="search-box">
          <Search />
          <input
            type="text"
            className="form-input"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Car size={64} />
            <h3>No Vehicles Found</h3>
            <p>Add your first vehicle to get started</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Add Vehicle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="vehicle-card"
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}
            >
              <div className="vehicle-card-header">
                <span className="vehicle-plate">{vehicle.plateNumber}</span>
                <span className={`badge ${getStatusBadge(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
              <div className="vehicle-info">
                <div className="vehicle-info-row">
                  <span>Vehicle</span>
                  <span>{vehicle.make} {vehicle.model}</span>
                </div>
                <div className="vehicle-info-row">
                  <span>Year</span>
                  <span>{vehicle.year}</span>
                </div>
                <div className="vehicle-info-row">
                  <span>Fuel</span>
                  <span>{vehicle.fuelType}</span>
                </div>
                <div className="vehicle-info-row">
                  <span>Mileage</span>
                  <span>{vehicle.mileage?.toLocaleString()} km</span>
                </div>
              </div>
              <div className="action-buttons" style={{ marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                >
                  <Eye size={16} />
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleOpenModal(vehicle)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setShowDeleteConfirm(vehicle.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Plate Number *</label>
              <input
                type="text"
                className="form-input"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                required
                placeholder="e.g., KA-01-AB-1234"
              />
            </div>
            <div className="form-group">
              <label className="form-label">VIN</label>
              <input
                type="text"
                className="form-input"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="Vehicle Identification Number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Make *</label>
              <input
                type="text"
                className="form-input"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                required
                placeholder="e.g., Toyota"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model *</label>
              <input
                type="text"
                className="form-input"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                placeholder="e.g., Camry"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year *</label>
              <input
                type="number"
                className="form-input"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <input
                type="text"
                className="form-input"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g., Silver"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select
                className="form-select"
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mileage (km)</label>
              <input
                type="number"
                className="form-input"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                min="0"
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
              <option value="maintenance">In Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Vehicle"
      >
        <div className="confirm-dialog">
          <Trash2 size={56} style={{ color: 'var(--danger)' }} />
          <h3>Are you sure?</h3>
          <p>This action cannot be undone. The vehicle will be permanently deleted.</p>
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

export default Vehicles;
