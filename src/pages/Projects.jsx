import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FolderKanban, Car, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

const initialFormState = {
  name: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
  status: 'active',
};

function Projects() {
  const {
    projects,
    vehicles,
    addProject,
    updateProject,
    deleteProject,
    assignVehicleToProject,
    unassignVehicleFromProject,
    gpsData,
  } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(null);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableVehicles = vehicles.filter(
    (v) => v.status === 'active' && !v.assignedProject
  );

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    deleteProject(id);
    setShowDeleteConfirm(null);
  };

  const handleAssignVehicle = (vehicleId) => {
    assignVehicleToProject(vehicleId, showAssignModal);
    setShowAssignModal(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      completed: 'badge-info',
      'on-hold': 'badge-warning',
      cancelled: 'badge-danger',
    };
    return badges[status] || 'badge-secondary';
  };

  const getProjectVehicles = (projectId) => {
    return vehicles.filter((v) => v.assignedProject === projectId);
  };

  const isVehicleTracking = (vehicleId) => {
    const gps = gpsData.find((g) => g.vehicleId === vehicleId);
    return gps?.tracking || false;
  };

  return (
    <div>
      <div className="card-header" style={{ background: 'transparent', padding: 0, marginBottom: 24, border: 'none' }}>
        <div className="search-box">
          <Search />
          <input
            type="text"
            className="form-input"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FolderKanban size={64} />
            <h3>No Projects Found</h3>
            <p>Create your first project to get started</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Add Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {filteredProjects.map((project) => {
            const projectVehicles = getProjectVehicles(project.id);
            return (
              <div key={project.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{project.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      <MapPin size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      {project.location}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadge(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
                  {project.description}
                </p>

                <div style={{ display: 'flex', gap: 24, marginBottom: 16, fontSize: 13 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Start: </span>
                    {format(new Date(project.startDate), 'MMM d, yyyy')}
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>End: </span>
                    {format(new Date(project.endDate), 'MMM d, yyyy')}
                  </div>
                </div>

                {/* Assigned Vehicles */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    ASSIGNED VEHICLES ({projectVehicles.length})
                  </div>
                  {projectVehicles.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No vehicles assigned</p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {projectVehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 12px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 13,
                          }}
                        >
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)' }}>
                            {vehicle.plateNumber}
                          </span>
                          {isVehicleTracking(vehicle.id) && (
                            <MapPin size={12} style={{ color: 'var(--success)' }} />
                          )}
                          <button
                            onClick={() => unassignVehicleFromProject(vehicle.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: 16,
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  {project.status === 'active' && (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowAssignModal(project.id)}
                    >
                      <Car size={14} />
                      Add Vehicle
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleOpenModal(project)}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setShowDeleteConfirm(project.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="Enter project location"
            />
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
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Vehicle Modal */}
      <Modal
        isOpen={!!showAssignModal}
        onClose={() => setShowAssignModal(null)}
        title="Assign Vehicle to Project"
      >
        <p style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
          Note: Assigning a vehicle to a project will automatically start GPS tracking.
        </p>
        {availableVehicles.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <Car size={48} />
            <h3>No Available Vehicles</h3>
            <p>All vehicles are currently assigned to projects or inactive</p>
          </div>
        ) : (
          <div>
            {availableVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="card"
                style={{ marginBottom: 12, cursor: 'pointer' }}
                onClick={() => handleAssignVehicle(vehicle.id)}
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
        title="Delete Project"
      >
        <div className="confirm-dialog">
          <Trash2 size={56} style={{ color: 'var(--danger)' }} />
          <h3>Are you sure?</h3>
          <p>This will unassign all vehicles and stop their GPS tracking.</p>
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

export default Projects;
