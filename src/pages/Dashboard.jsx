import { useNavigate } from 'react-router-dom';
import {
  Car,
  Users,
  FolderKanban,
  Wrench,
  Shield,
  Fuel,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Package,
} from 'lucide-react';
import useStore from '../store/useStore';
import { format, differenceInDays } from 'date-fns';

function Dashboard() {
  const navigate = useNavigate();
  const {
    vehicles,
    drivers,
    projects,
    maintenance,
    insurance,
    fuelRecords,
    gpsData,
    getActiveVehicles,
    getAvailableDrivers,
    getActiveProjects,
    getExpiringInsurance,
    getUpcomingMaintenance,
  } = useStore();

  const activeVehicles = getActiveVehicles();
  const availableDrivers = getAvailableDrivers();
  const activeProjects = getActiveProjects();
  const expiringInsurance = getExpiringInsurance(30);
  const upcomingMaintenance = getUpcomingMaintenance(30);
  const trackedVehicles = gpsData.filter((g) => g.tracking).length;

  const stats = [
    { 
      label: 'Total Vehicles', 
      value: vehicles.length, 
      icon: Car, 
      color: 'primary',
      onClick: () => navigate('/vehicles')
    },
    { 
      label: 'Active Vehicles', 
      value: activeVehicles.length, 
      icon: TrendingUp, 
      color: 'success',
      onClick: () => navigate('/vehicles')
    },
    { 
      label: 'Total Drivers', 
      value: drivers.length, 
      icon: Users, 
      color: 'info',
      onClick: () => navigate('/drivers')
    },
    { 
      label: 'Active Projects', 
      value: activeProjects.length, 
      icon: FolderKanban, 
      color: 'warning',
      onClick: () => navigate('/projects')
    },
    { 
      label: 'Vehicles Tracked', 
      value: trackedVehicles, 
      icon: MapPin, 
      color: 'success',
      onClick: () => navigate('/gps')
    },
    { 
      label: 'Sold/Lost Vehicles', 
      value: vehicles.filter(v => v.status === 'sold' || v.status === 'lost').length, 
      icon: Package, 
      color: 'danger',
      onClick: () => navigate('/sold-lost')
    },
  ];

  const totalFuelCost = fuelRecords.reduce((sum, f) => sum + f.totalCost, 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="stat-card" 
            onClick={stat.onClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* Expiring Insurance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield size={18} style={{ marginRight: 8, color: 'var(--warning)' }} />
              Insurance Expiring Soon
            </h3>
            <span className="badge badge-warning">{expiringInsurance.length}</span>
          </div>
          {expiringInsurance.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 20px' }}>
              <p>No insurance policies expiring in the next 30 days</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Policy</th>
                    <th>Provider</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringInsurance.slice(0, 5).map((policy) => {
                    const daysLeft = differenceInDays(new Date(policy.expiryDate), new Date());
                    return (
                      <tr key={policy.id}>
                        <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {policy.policyNumber}
                        </td>
                        <td>{policy.provider}</td>
                        <td>
                          <span className={`badge ${daysLeft <= 7 ? 'badge-danger' : 'badge-warning'}`}>
                            {daysLeft} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Maintenance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Wrench size={18} style={{ marginRight: 8, color: 'var(--info)' }} />
              Upcoming Maintenance
            </h3>
            <span className="badge badge-info">{upcomingMaintenance.length}</span>
          </div>
          {upcomingMaintenance.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 20px' }}>
              <p>No scheduled maintenance in the next 30 days</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingMaintenance.slice(0, 5).map((record) => (
                    <tr key={record.id}>
                      <td>{record.type}</td>
                      <td>{format(new Date(record.scheduledDate), 'MMM d, yyyy')}</td>
                      <td>
                        <span className="badge badge-info">{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Fuel size={18} style={{ marginRight: 8, color: 'var(--accent-primary)' }} />
              Fuel Costs
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon primary">
              <Fuel size={24} />
            </div>
            <div>
              <div className="stat-value">₹{totalFuelCost.toLocaleString()}</div>
              <div className="stat-label">Total fuel expenses ({fuelRecords.length} records)</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Wrench size={18} style={{ marginRight: 8, color: 'var(--success)' }} />
              Maintenance Costs
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon success">
              <Wrench size={24} />
            </div>
            <div>
              <div className="stat-value">₹{totalMaintenanceCost.toLocaleString()}</div>
              <div className="stat-label">Total maintenance costs ({maintenance.length} records)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: 32 }}>
        <div className="card-header">
          <h3 className="card-title">
            <AlertTriangle size={18} style={{ marginRight: 8, color: 'var(--danger)' }} />
            Vehicles Requiring Attention
          </h3>
        </div>
        {vehicles.filter(v => v.status === 'maintenance').length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 20px' }}>
            <p>All vehicles are operational</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.filter(v => v.status === 'maintenance').map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                      {vehicle.plateNumber}
                    </td>
                    <td>{vehicle.make} {vehicle.model}</td>
                    <td>
                      <span className="badge badge-warning">In Maintenance</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
