import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Fuel, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

const initialFormState = {
  vehicleId: '',
  date: '',
  fuelType: 'Petrol',
  quantity: '',
  pricePerUnit: '',
  totalCost: '',
  odometer: '',
  station: '',
};

function FuelManagement() {
  const { fuelRecords, vehicles, addFuelRecord, updateFuelRecord, deleteFuelRecord } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const activeVehicles = vehicles.filter((v) => v.status !== 'sold' && v.status !== 'lost');

  const filteredRecords = fuelRecords.filter((r) => {
    const vehicle = vehicles.find((v) => v.id === r.vehicleId);
    return (
      r.station?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fuelType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle?.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Calculate stats
  const totalFuelCost = fuelRecords.reduce((sum, r) => sum + (r.totalCost || 0), 0);
  const totalFuelQuantity = fuelRecords.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const avgPricePerUnit = fuelRecords.length > 0 
    ? fuelRecords.reduce((sum, r) => sum + (r.pricePerUnit || 0), 0) / fuelRecords.length 
    : 0;

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
    } else {
      setEditingRecord(null);
      setFormData({ ...initialFormState, date: new Date().toISOString().split('T')[0] });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
    setFormData(initialFormState);
  };

  const handleFormChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-calculate total cost
    if (field === 'quantity' || field === 'pricePerUnit') {
      const quantity = parseFloat(field === 'quantity' ? value : formData.quantity) || 0;
      const pricePerUnit = parseFloat(field === 'pricePerUnit' ? value : formData.pricePerUnit) || 0;
      newFormData.totalCost = (quantity * pricePerUnit).toFixed(2);
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      quantity: parseFloat(formData.quantity) || 0,
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0,
      totalCost: parseFloat(formData.totalCost) || 0,
      odometer: parseInt(formData.odometer) || 0,
    };
    if (editingRecord) {
      updateFuelRecord(editingRecord.id, data);
    } else {
      addFuelRecord(data);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    deleteFuelRecord(id);
    setShowDeleteConfirm(null);
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber}` : 'Not Assigned';
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon primary">
            <Fuel size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">₹{totalFuelCost.toLocaleString()}</div>
            <div className="stat-label">Total Fuel Cost</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <Fuel size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalFuelQuantity.toLocaleString()} L</div>
            <div className="stat-label">Total Fuel Consumed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">₹{avgPricePerUnit.toFixed(2)}</div>
            <div className="stat-label">Avg Price/Liter</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="search-box">
          <Search />
          <input
            type="text"
            className="form-input"
            placeholder="Search fuel records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Fuel Record
        </button>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Fuel size={64} />
            <h3>No Fuel Records</h3>
            <p>Add your first fuel record to start tracking</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Add Fuel Record
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vehicle</th>
                  <th>Fuel Type</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Total</th>
                  <th>Odometer</th>
                  <th>Station</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{format(new Date(record.date), 'MMM d, yyyy')}</td>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                        {getVehicleInfo(record.vehicleId)}
                      </span>
                    </td>
                    <td>{record.fuelType}</td>
                    <td>{record.quantity} L</td>
                    <td>₹{record.pricePerUnit?.toFixed(2)}</td>
                    <td style={{ fontWeight: 600 }}>₹{record.totalCost?.toLocaleString()}</td>
                    <td>{record.odometer?.toLocaleString()} km</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {record.station || '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
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
        title={editingRecord ? 'Edit Fuel Record' : 'Add Fuel Record'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vehicle</label>
              <select
                className="form-select"
                value={formData.vehicleId}
                onChange={(e) => handleFormChange('vehicleId', e.target.value)}
              >
                <option value="">Select Vehicle</option>
                {activeVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fuel Type *</label>
              <select
                className="form-select"
                value={formData.fuelType}
                onChange={(e) => handleFormChange('fuelType', e.target.value)}
                required
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity (Liters) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price per Liter (₹) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.pricePerUnit}
                onChange={(e) => handleFormChange('pricePerUnit', e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="Enter price per liter"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Cost (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.totalCost}
                onChange={(e) => handleFormChange('totalCost', e.target.value)}
                readOnly
                style={{ background: 'var(--bg-secondary)' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Odometer Reading (km)</label>
              <input
                type="number"
                className="form-input"
                value={formData.odometer}
                onChange={(e) => handleFormChange('odometer', e.target.value)}
                min="0"
                placeholder="Current odometer reading"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Station</label>
              <input
                type="text"
                className="form-input"
                value={formData.station}
                onChange={(e) => handleFormChange('station', e.target.value)}
                placeholder="e.g., Indian Oil - MG Road"
              />
            </div>
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
        title="Delete Fuel Record"
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

export default FuelManagement;
