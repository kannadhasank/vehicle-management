# FleetPro - Vehicle Management System

A comprehensive React-based vehicle management application with features for fleet tracking, maintenance scheduling, insurance management, fuel tracking, driver management, and GPS tracking.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Zustand](https://img.shields.io/badge/Zustand-State%20Management-orange)

## Features

- **Vehicle Management** - Full CRUD operations for vehicles
- **Driver Management** - Manage drivers and assign them to vehicles
- **Project Management** - Create projects and assign vehicles
- **Maintenance Tracking** - Schedule and track vehicle maintenance
- **Insurance Management** - Track insurance policies and expiry alerts
- **Fuel Management** - Record fuel purchases and track costs
- **GPS Tracking** - Real-time vehicle tracking when assigned to projects
- **Sold/Lost Vehicles** - Track disposed vehicles with restore option
- **Dark/Light Mode** - Toggle between themes
- **Persistent Storage** - All data stored in localStorage

## Demo Credentials

- **Username:** `admin`
- **Password:** `admin`

## Tech Stack

- React 18
- Vite
- Zustand (State Management)
- React Router v6
- Lucide React (Icons)
- date-fns (Date Handling)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/vehicle-management.git
cd vehicle-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deploying to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch.

**Steps:**

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it `vehicle-management` (or any name you prefer)
   - Keep it public
   - Don't initialize with README

2. **Update the base URL in `vite.config.js`**
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/YOUR_REPO_NAME/', // Change this to your repository name
   })
   ```

3. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions** as the source
   - The workflow will run automatically

5. **Access your deployed app**
   - After the workflow completes, your app will be available at:
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Method 2: Manual Deployment

If you prefer manual deployment:

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add these scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## Project Structure

```
vehicle-management/
├── src/
│   ├── components/
│   │   ├── Layout.jsx      # Main layout with sidebar
│   │   └── Modal.jsx       # Reusable modal component
│   ├── pages/
│   │   ├── Dashboard.jsx   # Dashboard with stats
│   │   ├── Vehicles.jsx    # Vehicle list & CRUD
│   │   ├── VehicleDetail.jsx # Single vehicle view
│   │   ├── Drivers.jsx     # Driver management
│   │   ├── Projects.jsx    # Project management
│   │   ├── Maintenance.jsx # Maintenance records
│   │   ├── Insurance.jsx   # Insurance policies
│   │   ├── Fuel.jsx        # Fuel records
│   │   ├── GPSTracking.jsx # GPS tracking view
│   │   ├── SoldLostVehicles.jsx # Sold/Lost vehicles
│   │   └── Login.jsx       # Login page
│   ├── store/
│   │   └── useStore.js     # Zustand store
│   ├── App.jsx             # Main app component
│   ├── App.css             # Global styles
│   └── main.jsx            # Entry point
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── package.json
├── vite.config.js
└── README.md
```

## Customization

### Change Repository Name

Update the `base` in `vite.config.js`:
```js
base: '/your-new-repo-name/',
```

### Modify Theme Colors

Edit the CSS variables in `src/App.css`:
```css
:root {
  --accent-primary: #6366f1;
  --accent-secondary: #818cf8;
  /* ... other variables */
}
```

## Troubleshooting

### Blank page after deployment

1. Make sure `base` in `vite.config.js` matches your repository name
2. Clear browser cache and reload
3. Check the browser console for errors

### 404 errors on page refresh

GitHub Pages doesn't support client-side routing out of the box. The app uses HashRouter alternative or you can add a 404.html redirect.

### Workflow not running

1. Go to repository Settings → Actions → General
2. Ensure "Allow all actions and reusable workflows" is selected

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
