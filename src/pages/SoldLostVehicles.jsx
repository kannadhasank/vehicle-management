import { useState } from 'react';
import { Package, DollarSign, AlertTriangle, Search, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

function SoldLostVehicles() {
  const { vehicles, updateVehicle } = useStore();
  const [activeTab, setActiveTab] = useState('sold');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(null);

  const soldVehicles = vehicles.filter(
    (v) =>
      v.status === 'sold' &&
      (v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const lostVehicles = vehicles.filter(
    (v) =>
      v.status === 'lost' &&
      (v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedVehicles = activeTab === 'sold' ? soldVehicles : lostVehicles;

  const handleRestore = (vehicleId) => {
    updateVehicle(vehicleId, {
      status: 'active',
      soldDate: null,
      soldPrice: null,
      lostDate: null,
      lostNotes: null,
    });
    setShowRestoreConfirm(null);
  };

  const totalSoldValue = soldVehicles.reduce((sum, v) => sum + (v.soldPrice || 0), 0);

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon success">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{soldVehicles.length}</div>
            <div className="stat-label">Vehicles Sold</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon primary">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">₹{totalSoldValue.toLocaleString()}</div>
            <div className="stat-label">Total Sale Value</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{lostVehicles.length}</div>
            <div className="stat-label">Vehicles Lost</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'sold' ? 'active' : ''}`}
          onClick={() => setActiveTab('sold')}
        >
          <DollarSign size={16} style={{ marginRight: 8 }} />
          Sold ({soldVehicles.length})
        </button>
        <button
          className={`tab ${activeTab === 'lost' ? 'active' : ''}`}
          onClick={() => setActiveTab('lost')}
        >
          <AlertTriangle size={16} style={{ marginRight: 8 }} />
          Lost ({lostVehicles.length})
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
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
      </div>

      {displayedVehicles.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Package size={64} />
            <h3>No {activeTab === 'sold' ? 'Sold' : 'Lost'} Vehicles</h3>
            <p>
              {activeTab === 'sold'
                ? 'Vehicles marked as sold will appear here'
                : 'Vehicles marked as lost will appear here'}
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>Vehicle</th>
                  <th>Year</th>
                  <th>{activeTab === 'sold' ? 'Sale Date' : 'Lost Date'}</th>
                  {activeTab === 'sold' && <th>Sale Price</th>}
                  {activeTab === 'lost' && <th>Notes</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                        {vehicle.plateNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{vehicle.make} {vehicle.model}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {vehicle.color} • {vehicle.fuelType}
                      </div>
                    </td>
                    <td>{vehicle.year}</td>
                    <td>
                      {activeTab === 'sold' && vehicle.soldDate
                        ? format(new Date(vehicle.soldDate), 'MMM d, yyyy')
                        : activeTab === 'lost' && vehicle.lostDate
                        ? format(new Date(vehicle.lostDate), 'MMM d, yyyy')
                        : '-'}
                    </td>
                    {activeTab === 'sold' && (
                      <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                        ₹{vehicle.soldPrice?.toLocaleString() || '-'}
                      </td>
                    )}
                    {activeTab === 'lost' && (
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {vehicle.lostNotes || '-'}
                      </td>
                    )}
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowRestoreConfirm(vehicle.id)}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={!!showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(null)}
        title="Restore Vehicle"
      >
        <div className="confirm-dialog">
          <RotateCcw size={56} style={{ color: 'var(--success)' }} />
          <h3>Restore this vehicle?</h3>
          <p>The vehicle will be restored to active status.</p>
          <div className="confirm-actions">
            <button className="btn btn-secondary" onClick={() => setShowRestoreConfirm(null)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={() => handleRestore(showRestoreConfirm)}>
              Restore
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SoldLostVehicles;
