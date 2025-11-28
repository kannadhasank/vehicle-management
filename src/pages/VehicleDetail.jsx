import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  DollarSign,
  AlertTriangle,
  Wrench,
  Shield,
  Fuel,
  MapPin,
  User,
  FolderKanban,
} from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    vehicles,
    drivers,
    projects,
    maintenance,
    insurance,
    fuelRecords,
    gpsData,
    updateVehicle,
    deleteVehicle,
    markVehicleSold,
    markVehicleLost,
    assignDriverToVehicle,
    unassignDriver,
    assignVehicleToProject,
    unassignVehicleFromProject,
  } = useStore();

  const vehicle = vehicles.find((v) => v.id === id);
  const [activeTab, setActiveTab] = useState('details');
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [soldData, setSoldData] = useState({ date: '', price: '' });
  const [lostData, setLostData] = useState({ date: '', notes: '' });

  if (!vehicle) {
    return (
      <div className="card">
        <div className="empty-state">
          <AlertTriangle size={64} />
          <h3>Vehicle Not Found</h3>
          <p>The vehicle you're looking for doesn't exist</p>
          <button className="btn btn-primary" onClick={() => navigate('/vehicles')}>
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const vehicleMaintenance = maintenance.filter((m) => m.vehicleId === id);
  const vehicleInsurance = insurance.filter((i) => i.vehicleId === id);
  const vehicleFuel = fuelRecords.filter((f) => f.vehicleId === id);
  const vehicleGPS = gpsData.find((g) => g.vehicleId === id);
  const assignedDriver = drivers.find((d) => d.id === vehicle.assignedDriver);
  const assignedProject = projects.find((p) => p.id === vehicle.assignedProject);
  const availableDrivers = drivers.filter((d) => d.status === 'available');
  const activeProjects = projects.filter((p) => p.status === 'active');

  const handleMarkSold = () => {
    if (soldData.date && soldData.price) {
      markVehicleSold(id, soldData.date, parseFloat(soldData.price));
      setShowSoldModal(false);
      navigate('/sold-lost');
    }
  };

  const handleMarkLost = () => {
    if (lostData.date) {
      markVehicleLost(id, lostData.date, lostData.notes);
      setShowLostModal(false);
      navigate('/sold-lost');
    }
  };

  const handleAssignDriver = (driverId) => {
    assignDriverToVehicle(driverId, id);
    setShowDriverModal(false);
  };

  const handleAssignProject = (projectId) => {
    assignVehicleToProject(id, projectId);
    setShowProjectModal(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      maintenance: 'badge-warning',
      inactive: 'badge-secondary',
      sold: 'badge-info',
      lost: 'badge-danger',
    };
    return badges[status] || 'badge-secondary';
  };

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'maintenance', label: `Maintenance (${vehicleMaintenance.length})` },
    { id: 'insurance', label: `Insurance (${vehicleInsurance.length})` },
    { id: 'fuel', label: `Fuel (${vehicleFuel.length})` },
  ];

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={() => navigate('/vehicles')}
        style={{ marginBottom: 24 }}
      >
        <ArrowLeft size={18} />
        Back to Vehicles
      </button>

      {/* Header Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <h2 style={{ fontSize: 28, fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                {vehicle.plateNumber}
              </h2>
              <span className={`badge ${getStatusBadge(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          </div>
          <div className="action-buttons">
            {vehicle.status !== 'sold' && vehicle.status !== 'lost' && (
              <>
                <button className="btn btn-secondary" onClick={() => setShowSoldModal(true)}>
                  <DollarSign size={18} />
                  Mark as Sold
                </button>
                <button className="btn btn-danger" onClick={() => setShowLostModal(true)}>
                  <AlertTriangle size={18} />
                  Mark as Lost
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {vehicle.status === 'active' && (
        <div className="quick-actions">
          <button className="btn btn-secondary" onClick={() => setShowDriverModal(true)}>
            <User size={18} />
            {assignedDriver ? 'Change Driver' : 'Assign Driver'}
          </button>
          <button className="btn btn-secondary" onClick={() => setShowProjectModal(true)}>
            <FolderKanban size={18} />
            {assignedProject ? 'Change Project' : 'Assign to Project'}
          </button>
          {vehicleGPS?.tracking && (
            <button className="btn btn-success" onClick={() => navigate('/gps')}>
              <MapPin size={18} />
              View GPS Tracking
            </button>
          )}
        </div>
      )}

      {/* Assignments */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>
            <User size={18} style={{ marginRight: 8 }} />
            Assigned Driver
          </h3>
          {assignedDriver ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{assignedDriver.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {assignedDriver.phone}
                </div>
              </div>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => unassignDriver(assignedDriver.id)}
              >
                Unassign
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No driver assigned</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>
            <FolderKanban size={18} style={{ marginRight: 8 }} />
            Assigned Project
          </h3>
          {assignedProject ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{assignedProject.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {assignedProject.location}
                </div>
                {vehicleGPS?.tracking && (
                  <span className="badge badge-success" style={{ marginTop: 8 }}>
                    <MapPin size={12} style={{ marginRight: 4 }} />
                    GPS Tracking Active
                  </span>
                )}
              </div>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => unassignVehicleFromProject(id)}
              >
                Unassign
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No project assigned</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="card">
          <div className="detail-section">
            <h3>Vehicle Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Plate Number</label>
                <span>{vehicle.plateNumber}</span>
              </div>
              <div className="detail-item">
                <label>VIN</label>
                <span>{vehicle.vin || '-'}</span>
              </div>
              <div className="detail-item">
                <label>Make</label>
                <span>{vehicle.make}</span>
              </div>
              <div className="detail-item">
                <label>Model</label>
                <span>{vehicle.model}</span>
              </div>
              <div className="detail-item">
                <label>Year</label>
                <span>{vehicle.year}</span>
              </div>
              <div className="detail-item">
                <label>Color</label>
                <span>{vehicle.color || '-'}</span>
              </div>
              <div className="detail-item">
                <label>Fuel Type</label>
                <span>{vehicle.fuelType}</span>
              </div>
              <div className="detail-item">
                <label>Mileage</label>
                <span>{vehicle.mileage?.toLocaleString()} km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="card">
          {vehicleMaintenance.length === 0 ? (
            <div className="empty-state">
              <Wrench size={48} />
              <h3>No Maintenance Records</h3>
              <p>No maintenance records found for this vehicle</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Scheduled</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleMaintenance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.type}</td>
                      <td>{record.description}</td>
                      <td>{format(new Date(record.scheduledDate), 'MMM d, yyyy')}</td>
                      <td>₹{record.cost?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${record.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'insurance' && (
        <div className="card">
          {vehicleInsurance.length === 0 ? (
            <div className="empty-state">
              <Shield size={48} />
              <h3>No Insurance Policies</h3>
              <p>No insurance policies found for this vehicle</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Policy Number</th>
                    <th>Provider</th>
                    <th>Type</th>
                    <th>Premium</th>
                    <th>Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleInsurance.map((policy) => (
                    <tr key={policy.id}>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{policy.policyNumber}</td>
                      <td>{policy.provider}</td>
                      <td>{policy.type}</td>
                      <td>₹{policy.premium?.toLocaleString()}</td>
                      <td>{format(new Date(policy.expiryDate), 'MMM d, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="card">
          {vehicleFuel.length === 0 ? (
            <div className="empty-state">
              <Fuel size={48} />
              <h3>No Fuel Records</h3>
              <p>No fuel records found for this vehicle</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Fuel Type</th>
                    <th>Quantity</th>
                    <th>Cost</th>
                    <th>Odometer</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleFuel.map((record) => (
                    <tr key={record.id}>
                      <td>{format(new Date(record.date), 'MMM d, yyyy')}</td>
                      <td>{record.fuelType}</td>
                      <td>{record.quantity} L</td>
                      <td>₹{record.totalCost?.toLocaleString()}</td>
                      <td>{record.odometer?.toLocaleString()} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Mark as Sold Modal */}
      <Modal
        isOpen={showSoldModal}
        onClose={() => setShowSoldModal(false)}
        title="Mark Vehicle as Sold"
      >
        <div className="form-group">
          <label className="form-label">Sale Date *</label>
          <input
            type="date"
            className="form-input"
            value={soldData.date}
            onChange={(e) => setSoldData({ ...soldData, date: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Sale Price (₹) *</label>
          <input
            type="number"
            className="form-input"
            value={soldData.price}
            onChange={(e) => setSoldData({ ...soldData, price: e.target.value })}
            placeholder="Enter sale price"
          />
        </div>
        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={() => setShowSoldModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleMarkSold}>
            Confirm Sale
          </button>
        </div>
      </Modal>

      {/* Mark as Lost Modal */}
      <Modal
        isOpen={showLostModal}
        onClose={() => setShowLostModal(false)}
        title="Mark Vehicle as Lost"
      >
        <div className="form-group">
          <label className="form-label">Date Lost *</label>
          <input
            type="date"
            className="form-input"
            value={lostData.date}
            onChange={(e) => setLostData({ ...lostData, date: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={lostData.notes}
            onChange={(e) => setLostData({ ...lostData, notes: e.target.value })}
            placeholder="Enter any relevant details..."
          />
        </div>
        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={() => setShowLostModal(false)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleMarkLost}>
            Mark as Lost
          </button>
        </div>
      </Modal>

      {/* Assign Driver Modal */}
      <Modal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        title="Assign Driver"
      >
        {availableDrivers.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <User size={48} />
            <h3>No Available Drivers</h3>
            <p>All drivers are currently assigned</p>
          </div>
        ) : (
          <div>
            {availableDrivers.map((driver) => (
              <div
                key={driver.id}
                className="card"
                style={{ marginBottom: 12, cursor: 'pointer' }}
                onClick={() => handleAssignDriver(driver.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{driver.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {driver.phone} • License: {driver.licenseNumber}
                    </div>
                  </div>
                  <span className="badge badge-success">Available</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Assign Project Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Assign to Project"
      >
        <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
          Note: Assigning to a project will automatically start GPS tracking.
        </p>
        {activeProjects.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <FolderKanban size={48} />
            <h3>No Active Projects</h3>
            <p>Create a project first to assign vehicles</p>
          </div>
        ) : (
          <div>
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="card"
                style={{ marginBottom: 12, cursor: 'pointer' }}
                onClick={() => handleAssignProject(project.id)}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{project.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {project.location}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {project.assignedVehicles?.length || 0} vehicles assigned
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default VehicleDetail;
