import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Gauge, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';

function GPSTracking() {
  const { vehicles, projects, gpsData, updateGPSLocation } = useStore();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const trackedVehicles = vehicles.filter((v) => {
    const gps = gpsData.find((g) => g.vehicleId === v.id && g.tracking);
    return gps;
  });

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getLatestLocation = (vehicleId) => {
    const gps = gpsData.find((g) => g.vehicleId === vehicleId);
    if (gps && gps.locations && gps.locations.length > 0) {
      return gps.locations[gps.locations.length - 1];
    }
    return null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    trackedVehicles.forEach((v) => {
      updateGPSLocation(v.id);
    });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      trackedVehicles.forEach((v) => {
        updateGPSLocation(v.id);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [trackedVehicles]);

  const selectedGPS = selectedVehicle 
    ? gpsData.find((g) => g.vehicleId === selectedVehicle) 
    : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span className="badge badge-success" style={{ marginRight: 12 }}>
            {trackedVehicles.length} Active
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            vehicles being tracked
          </span>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
          Refresh Locations
        </button>
      </div>

      {trackedVehicles.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <MapPin size={64} />
            <h3>No Vehicles Being Tracked</h3>
            <p>Assign vehicles to active projects to start GPS tracking</p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Vehicle List */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tracked Vehicles</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {trackedVehicles.map((vehicle) => {
                const location = getLatestLocation(vehicle.id);
                const gps = gpsData.find((g) => g.vehicleId === vehicle.id);
                const isSelected = selectedVehicle === vehicle.id;
                
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    style={{
                      padding: 16,
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      border: isSelected ? 'none' : '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ 
                          fontFamily: 'JetBrains Mono, monospace', 
                          fontSize: 16, 
                          fontWeight: 600,
                          color: isSelected ? 'white' : 'var(--accent-primary)',
                          marginBottom: 4,
                        }}>
                          {vehicle.plateNumber}
                        </div>
                        <div style={{ 
                          fontSize: 13, 
                          color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
                        }}>
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div style={{ 
                          fontSize: 12, 
                          color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                          marginTop: 8,
                        }}>
                          Project: {getProjectName(gps?.projectId)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {location && (
                          <>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 4,
                              color: isSelected ? 'white' : 'var(--success)',
                              fontSize: 14,
                              fontWeight: 600,
                            }}>
                              <Gauge size={14} />
                              {location.speed} km/h
                            </div>
                            <div style={{ 
                              fontSize: 11, 
                              color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                              marginTop: 4,
                            }}>
                              Updated: {format(new Date(location.timestamp), 'HH:mm:ss')}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map View */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                {selectedVehicle 
                  ? `Tracking: ${vehicles.find(v => v.id === selectedVehicle)?.plateNumber}`
                  : 'Select a Vehicle'
                }
              </h3>
            </div>
            
            <div className="gps-map">
              {selectedVehicle && selectedGPS ? (
                <>
                  {selectedGPS.locations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="gps-marker"
                      style={{
                        left: `${20 + (idx * 15) % 60}%`,
                        top: `${20 + (idx * 20) % 60}%`,
                        opacity: idx === selectedGPS.locations.length - 1 ? 1 : 0.4,
                        transform: idx === selectedGPS.locations.length - 1 ? 'scale(1)' : 'scale(0.7)',
                      }}
                    />
                  ))}
                  <div className="gps-info">
                    <h3>
                      <Navigation size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Current Location
                    </h3>
                    {(() => {
                      const loc = getLatestLocation(selectedVehicle);
                      return loc ? (
                        <p>
                          Lat: {loc.lat.toFixed(4)}° | Lng: {loc.lng.toFixed(4)}°
                          <br />
                          Speed: {loc.speed} km/h
                        </p>
                      ) : null;
                    })()}
                  </div>
                </>
              ) : (
                <div className="gps-info">
                  <MapPin size={32} style={{ marginBottom: 8, color: 'var(--text-muted)' }} />
                  <h3>No Vehicle Selected</h3>
                  <p>Select a vehicle from the list to view its location</p>
                </div>
              )}
            </div>

            {selectedVehicle && selectedGPS && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-muted)' }}>
                  TRACKING HISTORY
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedGPS.locations.slice(-5).reverse().map((loc, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 13,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                        {format(new Date(loc.timestamp), 'HH:mm:ss')}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
                        {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}>
                        <Gauge size={14} />
                        {loc.speed} km/h
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default GPSTracking;
