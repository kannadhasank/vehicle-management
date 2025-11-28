import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Initial mock data
const initialVehicles = [
  {
    id: uuidv4(),
    plateNumber: 'KA-01-AB-1234',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Silver',
    vin: '1HGBH41JXMN109186',
    status: 'active',
    fuelType: 'Petrol',
    mileage: 45000,
    assignedDriver: null,
    assignedProject: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    plateNumber: 'MH-02-CD-5678',
    make: 'Honda',
    model: 'City',
    year: 2021,
    color: 'White',
    vin: '2HGBH41JXMN109187',
    status: 'active',
    fuelType: 'Diesel',
    mileage: 62000,
    assignedDriver: null,
    assignedProject: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    plateNumber: 'TN-03-EF-9012',
    make: 'Ford',
    model: 'EcoSport',
    year: 2020,
    color: 'Blue',
    vin: '3HGBH41JXMN109188',
    status: 'maintenance',
    fuelType: 'Petrol',
    mileage: 78000,
    assignedDriver: null,
    assignedProject: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    plateNumber: 'DL-04-GH-3456',
    make: 'Mahindra',
    model: 'XUV500',
    year: 2019,
    color: 'Black',
    vin: '4HGBH41JXMN109189',
    status: 'sold',
    fuelType: 'Diesel',
    mileage: 95000,
    assignedDriver: null,
    assignedProject: null,
    soldDate: '2024-06-15',
    soldPrice: 850000,
    createdAt: new Date().toISOString(),
  },
];

const initialDrivers = [
  {
    id: uuidv4(),
    name: 'Rajesh Kumar',
    licenseNumber: 'DL-0420110012345',
    licenseExpiry: '2026-03-15',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    address: '123 Main Street, Delhi',
    status: 'available',
    assignedVehicle: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Suresh Sharma',
    licenseNumber: 'MH-0520120023456',
    licenseExpiry: '2025-08-20',
    phone: '+91 9876543211',
    email: 'suresh.sharma@email.com',
    address: '456 Park Road, Mumbai',
    status: 'available',
    assignedVehicle: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Amit Patel',
    licenseNumber: 'GJ-0620130034567',
    licenseExpiry: '2024-12-10',
    phone: '+91 9876543212',
    email: 'amit.patel@email.com',
    address: '789 Lake View, Ahmedabad',
    status: 'on-duty',
    assignedVehicle: null,
    createdAt: new Date().toISOString(),
  },
];

const initialProjects = [
  {
    id: uuidv4(),
    name: 'Highway Construction - NH48',
    description: 'Construction project for National Highway 48 expansion',
    location: 'Gujarat - Rajasthan Border',
    startDate: '2024-01-15',
    endDate: '2025-06-30',
    status: 'active',
    assignedVehicles: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Metro Rail Project - Phase 2',
    description: 'Underground metro construction in city center',
    location: 'Bangalore Central',
    startDate: '2024-03-01',
    endDate: '2026-12-31',
    status: 'active',
    assignedVehicles: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Bridge Repair - Yamuna',
    description: 'Maintenance and repair of Yamuna bridge',
    location: 'Delhi NCR',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    status: 'completed',
    assignedVehicles: [],
    createdAt: new Date().toISOString(),
  },
];

const initialMaintenance = [
  {
    id: uuidv4(),
    vehicleId: null,
    type: 'Oil Change',
    description: 'Regular oil change and filter replacement',
    scheduledDate: '2024-11-15',
    completedDate: '2024-11-15',
    cost: 3500,
    status: 'completed',
    notes: 'Used synthetic oil',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    vehicleId: null,
    type: 'Tire Replacement',
    description: 'Replace all four tires',
    scheduledDate: '2024-12-20',
    completedDate: null,
    cost: 25000,
    status: 'scheduled',
    notes: 'Bridgestone tires ordered',
    createdAt: new Date().toISOString(),
  },
];

const initialInsurance = [
  {
    id: uuidv4(),
    vehicleId: null,
    provider: 'ICICI Lombard',
    policyNumber: 'POL-2024-001234',
    type: 'Comprehensive',
    premium: 15000,
    startDate: '2024-01-01',
    expiryDate: '2025-01-01',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    vehicleId: null,
    provider: 'HDFC Ergo',
    policyNumber: 'POL-2024-005678',
    type: 'Third Party',
    premium: 8000,
    startDate: '2024-03-15',
    expiryDate: '2025-03-15',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

const initialFuelRecords = [
  {
    id: uuidv4(),
    vehicleId: null,
    date: '2024-11-20',
    fuelType: 'Petrol',
    quantity: 40,
    pricePerUnit: 102.5,
    totalCost: 4100,
    odometer: 45000,
    station: 'Indian Oil - MG Road',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    vehicleId: null,
    date: '2024-11-18',
    fuelType: 'Diesel',
    quantity: 50,
    pricePerUnit: 89.5,
    totalCost: 4475,
    odometer: 62000,
    station: 'HP Petrol Pump - Highway',
    createdAt: new Date().toISOString(),
  },
];

const initialGPSData = [];

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      isAuthenticated: false,
      user: null,
      
      // Theme
      darkMode: true,
      
      // Data
      vehicles: initialVehicles,
      drivers: initialDrivers,
      projects: initialProjects,
      maintenance: initialMaintenance,
      insurance: initialInsurance,
      fuelRecords: initialFuelRecords,
      gpsData: initialGPSData,
      
      // Auth Actions
      login: (username, password) => {
        if (username === 'admin' && password === 'admin') {
          set({ isAuthenticated: true, user: { username: 'admin', role: 'Administrator' } });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      
      // Theme Actions
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Vehicle Actions
      addVehicle: (vehicle) => set((state) => ({
        vehicles: [...state.vehicles, { ...vehicle, id: uuidv4(), createdAt: new Date().toISOString() }]
      })),
      
      updateVehicle: (id, updates) => set((state) => ({
        vehicles: state.vehicles.map((v) => v.id === id ? { ...v, ...updates } : v)
      })),
      
      deleteVehicle: (id) => set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id)
      })),
      
      markVehicleSold: (id, soldDate, soldPrice) => set((state) => ({
        vehicles: state.vehicles.map((v) => 
          v.id === id ? { ...v, status: 'sold', soldDate, soldPrice, assignedDriver: null, assignedProject: null } : v
        )
      })),
      
      markVehicleLost: (id, lostDate, notes) => set((state) => ({
        vehicles: state.vehicles.map((v) => 
          v.id === id ? { ...v, status: 'lost', lostDate, lostNotes: notes, assignedDriver: null, assignedProject: null } : v
        )
      })),
      
      // Driver Actions
      addDriver: (driver) => set((state) => ({
        drivers: [...state.drivers, { ...driver, id: uuidv4(), createdAt: new Date().toISOString() }]
      })),
      
      updateDriver: (id, updates) => set((state) => ({
        drivers: state.drivers.map((d) => d.id === id ? { ...d, ...updates } : d)
      })),
      
      deleteDriver: (id) => set((state) => ({
        drivers: state.drivers.filter((d) => d.id !== id)
      })),
      
      assignDriverToVehicle: (driverId, vehicleId) => set((state) => {
        const updatedDrivers = state.drivers.map((d) => {
          if (d.id === driverId) {
            return { ...d, assignedVehicle: vehicleId, status: 'on-duty' };
          }
          if (d.assignedVehicle === vehicleId) {
            return { ...d, assignedVehicle: null, status: 'available' };
          }
          return d;
        });
        
        const updatedVehicles = state.vehicles.map((v) => {
          if (v.id === vehicleId) {
            return { ...v, assignedDriver: driverId };
          }
          if (v.assignedDriver === driverId) {
            return { ...v, assignedDriver: null };
          }
          return v;
        });
        
        return { drivers: updatedDrivers, vehicles: updatedVehicles };
      }),
      
      unassignDriver: (driverId) => set((state) => {
        const driver = state.drivers.find((d) => d.id === driverId);
        if (!driver) return state;
        
        const updatedDrivers = state.drivers.map((d) => 
          d.id === driverId ? { ...d, assignedVehicle: null, status: 'available' } : d
        );
        
        const updatedVehicles = state.vehicles.map((v) => 
          v.assignedDriver === driverId ? { ...v, assignedDriver: null } : v
        );
        
        return { drivers: updatedDrivers, vehicles: updatedVehicles };
      }),
      
      // Project Actions
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { ...project, id: uuidv4(), assignedVehicles: [], createdAt: new Date().toISOString() }]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),
      
      deleteProject: (id) => set((state) => {
        const project = state.projects.find((p) => p.id === id);
        const vehicleIds = project?.assignedVehicles || [];
        
        const updatedVehicles = state.vehicles.map((v) => 
          vehicleIds.includes(v.id) ? { ...v, assignedProject: null } : v
        );
        
        const updatedGPSData = state.gpsData.filter((g) => g.projectId !== id);
        
        return {
          projects: state.projects.filter((p) => p.id !== id),
          vehicles: updatedVehicles,
          gpsData: updatedGPSData,
        };
      }),
      
      assignVehicleToProject: (vehicleId, projectId) => set((state) => {
        // Remove vehicle from previous project if any
        const vehicle = state.vehicles.find((v) => v.id === vehicleId);
        const previousProjectId = vehicle?.assignedProject;
        
        const updatedProjects = state.projects.map((p) => {
          if (p.id === projectId) {
            return { ...p, assignedVehicles: [...(p.assignedVehicles || []).filter(id => id !== vehicleId), vehicleId] };
          }
          if (p.id === previousProjectId) {
            return { ...p, assignedVehicles: (p.assignedVehicles || []).filter((id) => id !== vehicleId) };
          }
          return p;
        });
        
        const updatedVehicles = state.vehicles.map((v) => 
          v.id === vehicleId ? { ...v, assignedProject: projectId } : v
        );
        
        // Start GPS tracking
        const newGPSEntry = {
          id: uuidv4(),
          vehicleId,
          projectId,
          tracking: true,
          startTime: new Date().toISOString(),
          locations: [generateRandomLocation()],
          createdAt: new Date().toISOString(),
        };
        
        return {
          projects: updatedProjects,
          vehicles: updatedVehicles,
          gpsData: [...state.gpsData.filter(g => g.vehicleId !== vehicleId), newGPSEntry],
        };
      }),
      
      unassignVehicleFromProject: (vehicleId) => set((state) => {
        const vehicle = state.vehicles.find((v) => v.id === vehicleId);
        const projectId = vehicle?.assignedProject;
        
        const updatedProjects = state.projects.map((p) => 
          p.id === projectId 
            ? { ...p, assignedVehicles: (p.assignedVehicles || []).filter((id) => id !== vehicleId) }
            : p
        );
        
        const updatedVehicles = state.vehicles.map((v) => 
          v.id === vehicleId ? { ...v, assignedProject: null } : v
        );
        
        // Stop GPS tracking
        const updatedGPSData = state.gpsData.map((g) => 
          g.vehicleId === vehicleId ? { ...g, tracking: false, endTime: new Date().toISOString() } : g
        );
        
        return {
          projects: updatedProjects,
          vehicles: updatedVehicles,
          gpsData: updatedGPSData,
        };
      }),
      
      // Maintenance Actions
      addMaintenance: (record) => set((state) => ({
        maintenance: [...state.maintenance, { ...record, id: uuidv4(), createdAt: new Date().toISOString() }]
      })),
      
      updateMaintenance: (id, updates) => set((state) => ({
        maintenance: state.maintenance.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),
      
      deleteMaintenance: (id) => set((state) => ({
        maintenance: state.maintenance.filter((m) => m.id !== id)
      })),
      
      // Insurance Actions
      addInsurance: (policy) => set((state) => ({
        insurance: [...state.insurance, { ...policy, id: uuidv4(), createdAt: new Date().toISOString() }]
      })),
      
      updateInsurance: (id, updates) => set((state) => ({
        insurance: state.insurance.map((i) => i.id === id ? { ...i, ...updates } : i)
      })),
      
      deleteInsurance: (id) => set((state) => ({
        insurance: state.insurance.filter((i) => i.id !== id)
      })),
      
      // Fuel Actions
      addFuelRecord: (record) => set((state) => ({
        fuelRecords: [...state.fuelRecords, { ...record, id: uuidv4(), createdAt: new Date().toISOString() }]
      })),
      
      updateFuelRecord: (id, updates) => set((state) => ({
        fuelRecords: state.fuelRecords.map((f) => f.id === id ? { ...f, ...updates } : f)
      })),
      
      deleteFuelRecord: (id) => set((state) => ({
        fuelRecords: state.fuelRecords.filter((f) => f.id !== id)
      })),
      
      // GPS Actions
      updateGPSLocation: (vehicleId) => set((state) => ({
        gpsData: state.gpsData.map((g) => 
          g.vehicleId === vehicleId && g.tracking
            ? { ...g, locations: [...g.locations, generateRandomLocation()] }
            : g
        )
      })),
      
      // Getters
      getVehicleById: (id) => get().vehicles.find((v) => v.id === id),
      getDriverById: (id) => get().drivers.find((d) => d.id === id),
      getProjectById: (id) => get().projects.find((p) => p.id === id),
      getMaintenanceByVehicle: (vehicleId) => get().maintenance.filter((m) => m.vehicleId === vehicleId),
      getInsuranceByVehicle: (vehicleId) => get().insurance.filter((i) => i.vehicleId === vehicleId),
      getFuelRecordsByVehicle: (vehicleId) => get().fuelRecords.filter((f) => f.vehicleId === vehicleId),
      getGPSDataByVehicle: (vehicleId) => get().gpsData.find((g) => g.vehicleId === vehicleId),
      
      getActiveVehicles: () => get().vehicles.filter((v) => v.status === 'active'),
      getSoldVehicles: () => get().vehicles.filter((v) => v.status === 'sold'),
      getLostVehicles: () => get().vehicles.filter((v) => v.status === 'lost'),
      getVehiclesInMaintenance: () => get().vehicles.filter((v) => v.status === 'maintenance'),
      
      getAvailableDrivers: () => get().drivers.filter((d) => d.status === 'available'),
      getActiveProjects: () => get().projects.filter((p) => p.status === 'active'),
      
      getExpiringInsurance: (days = 30) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return get().insurance.filter((i) => {
          const expiryDate = new Date(i.expiryDate);
          return expiryDate <= futureDate && expiryDate >= now;
        });
      },
      
      getUpcomingMaintenance: (days = 30) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return get().maintenance.filter((m) => {
          const scheduledDate = new Date(m.scheduledDate);
          return scheduledDate <= futureDate && scheduledDate >= now && m.status !== 'completed';
        });
      },
    }),
    {
      name: 'vehicle-management-storage',
    }
  )
);

// Helper function to generate random GPS coordinates (around India)
function generateRandomLocation() {
  const baseLat = 20.5937 + (Math.random() - 0.5) * 10;
  const baseLng = 78.9629 + (Math.random() - 0.5) * 10;
  return {
    lat: baseLat,
    lng: baseLng,
    timestamp: new Date().toISOString(),
    speed: Math.floor(Math.random() * 80) + 20,
  };
}

export default useStore;
