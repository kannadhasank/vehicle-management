import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Drivers from './pages/Drivers';
import Projects from './pages/Projects';
import Maintenance from './pages/Maintenance';
import Insurance from './pages/Insurance';
import Fuel from './pages/Fuel';
import GPSTracking from './pages/GPSTracking';
import SoldLostVehicles from './pages/SoldLostVehicles';
import './App.css';

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const darkMode = useStore((state) => state.darkMode);

  // Get basename for GitHub Pages deployment
  const basename = import.meta.env.BASE_URL;

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/vehicles/:id" element={<VehicleDetail />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/fuel" element={<Fuel />} />
                    <Route path="/gps" element={<GPSTracking />} />
                    <Route path="/sold-lost" element={<SoldLostVehicles />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
