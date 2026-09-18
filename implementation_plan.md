# Implementation Plan - AquaGuard AI (MERN Smart Water Distribution Dashboard)

Build a full-stack MERN application for **AquaGuard AI**, a modern, realistic, industrial AI & IoT-based Smart Water Distribution & Intelligent Leak Detection System. The app features a live SVG/Canvas pipeline flow visualizer with animated water particles, real-time telemetry streaming (Socket.io), AI leak prediction engine, interactive valve controls, live sensor data tables, real-time charts, and full administrative capabilities.

## Architecture Overview

```
                   +-----------------------------------------------+
                   |           AquaGuard AI Client (React)         |
                   | - Dark Navy Industrial Glassmorphism Dashboard |
                   | - Live Interactive Pipeline Visualizer (SVG)  |
                   | - AI Leakage Detection Panel & Flow Charts    |
                   | - Valve Control & Live Sensor Telemetry Table |
                   +-----------------------+-----------------------+
                                           |
                                  Socket.io / REST API
                                           |
                   +-----------------------v-----------------------+
                   |           Express Node.js Backend             |
                   | - IoT Telemetry Simulator & Socket Server     |
                   | - AI Anomaly & Leak Detection Logic Engine    |
                   | - REST Controllers & Route Handlers           |
                   +-----------------------+-----------------------+
                                           |
                   +-----------------------v-----------------------+
                   |         MongoDB / Embedded Data Layer         |
                   | - Sensors, Valves, Leaks, Telemetry & Logs    |
                   +-----------------------------------------------+
```

## Proposed Architecture & File Structure

### Root Directory: `d:\All project files\water leakage dashboard`

#### Backend Components (`server/`)
- `package.json` - Node dependencies (`express`, `mongoose`, `socket.io`, `cors`, `dotenv`)
- `server.js` - HTTP server entry point, Socket.io initialization, API route registrations
- `config/db.js` - Database connection handler supporting local MongoDB with in-memory fallback
- `models/`
  - `Sensor.js` - Sensor schema (id, name, location, flowRate, status, pressure, lastUpdate)
  - `Valve.js` - Valve schema (id, location, state, flowRate, mode, lastAction)
  - `Alert.js` - Leakage alert schema (id, location, severity, probability, status, timestamp)
  - `Telemetry.js` - Historical flow rate logs for time-series charts
- `services/`
  - `iotSimulator.js` - Simulates real-time water flow rates, pressure fluctuations, dynamic particle vectors, AI leak predictions, and broadcasts live WebSocket events.
- `routes/`
  - `api.js` - API endpoints for fetching & updating sensors, valves, alerts, analytics, and triggering simulated leak events.

#### Frontend Components (`client/`)
- `package.json` - React dependencies (`react`, `react-dom`, `lucide-react`, `recharts`, `socket.io-client`, `tailwindcss`, `vite`)
- `vite.config.js` - Vite configuration with proxy to backend API (`http://localhost:5000`)
- `tailwind.config.js` & `src/index.css` - Custom glassmorphism, neon aqua/cyan theme, pipe animations, pulse keyframes.
- `src/`
  - `App.jsx` - Main app layout with navigation routing, live WebSocket connection state, notification toast triggers.
  - `components/`
    - `Header.jsx` - Top bar with logo, live status green badge, clock, alert dropdown, admin profile.
    - `Sidebar.jsx` - Industrial navigation panel with 12 sections (Dashboard, Live Monitoring, Water Flow, Leak Detection, Pipeline Network, Sensors, Valve Control, Alerts, Analytics, Reports, Admin Management, Settings).
    - `SummaryCards.jsx` - Top 5 KPI cards (Total Water Flow, Water Distributed, Leakage Detected, Active Sensors, Valves).
    - `PipelineVisualizer.jsx` - Interactive pipeline canvas/SVG with animated liquid particle streams, reservoir, sensors, valves, branches, house connections, red leak highlights, and isolation controls.
    - `AiLeakDetectionPanel.jsx` - Radial confidence gauge, anomaly scores, AI prediction metrics, and manual leak simulation trigger.
    - `LiveSensorTable.jsx` - Filterable/searchable table showing real-time sensor flow rates, pressure, status badges, and last update timers.
    - `RealTimeFlowChart.jsx` - Interactive Recharts graph with live update stream and timeframe filters (Live, 1H, 6H, 24H, 7D).
    - `ValveControlPanel.jsx` - Grid of smart valves with toggle switches, Auto/Manual mode selectors, and emergency shutoff action.
    - `AlertsPanel.jsx` - Active leak notification drawer and historical incident logs.
    - `SubViews/` - Modules for non-dashboard tabs (Live Monitoring, Pipeline Network, Analytics, Reports, Admin Management, Settings).

## User Review Required

> [!IMPORTANT]
> **Database & Backend Server**: The application will include a full Express + Socket.io backend and MongoDB integration with an automatic zero-config memory database fallback so that it can run immediately without requiring external MongoDB setup.

> [!TIP]
> **Pipeline Visualizer**: The pipeline visualizer will use React SVG rendering with CSS dynamic stroke-dashoffset animations and SVG particle overlays to ensure smooth 60fps rendering across desktop and mobile devices.

## Proposed Changes

### Build Pipeline Setup
- Initialize Vite + React client in `./client`
- Initialize Express + Socket.io backend in `./server`
- Configure root scripts for concurrent execution (`npm start`, `npm run dev`)

### Core Features & Views
1. **Header & Navigation System**
2. **5 Key Indicator Cards with glowing IoT borders**
3. **Interactive 2D Pipeline Visualizer**:
   - Main Reservoir Tank with animated water level
   - Primary Distribution Mains & Branch Pipes (Branch A, Branch B, Branch C)
   - 4 Smart Control Valves with state indicators
   - 6 Inline Telemetry Sensors with live flow rates
   - End-user Connected Buildings (Residential, Commercial, Industrial)
   - Animated water particles moving along pipe paths
   - Leak Event Overlay: Pulsing red highlight on affected pipe, "LEAK DETECTED" badge, affected sensor ID, estimated loss rate, auto-isolation recommendation.
4. **AI Leak Detection Engine Card**:
   - Dynamic SVG circular progress bar for Leak Probability (e.g. 94%)
   - Anomaly Score indicator (Low/Medium/High)
   - Live pattern classification & quick leak simulation buttons
5. **Real-time Flow Chart**:
   - Recharts animated spline curve with threshold line & anomaly flags
   - Timeframe toggles (Live, 1H, 6H, 24H, 7D)
6. **Live Sensor Telemetry Data Grid**:
   - Status indicators (Green: Normal, Yellow: Warning, Red: Leakage, Gray: Offline)
   - Search bar & status filtering
7. **Smart Valve Control Matrix**:
   - Interactive OPEN/CLOSED toggles, Auto/Manual mode switches
8. **Full Multi-View Interface**:
   - Dashboard, Live Monitoring, Water Flow, Leak Detection, Pipeline Network, Sensors, Valve Control, Alerts, Analytics, Reports, Admin Management, Settings.

## Verification Plan

### Automated & Manual Verification
- Start backend server on port 5000 and client on port 3000/5173.
- Verify REST API endpoints (`/api/sensors`, `/api/valves`, `/api/alerts`, `/api/telemetry`).
- Test Socket.io real-time broadcast stream (confirm live updates for flow rates, charts, and sensor table).
- Test interactive leak simulation button: confirm pipeline section turns red, AI card updates probability, alert badge counter increments, and valve emergency shutoff auto-isolates the leak.
- Verify responsive layout, dark industrial glassmorphism design, and visual polish.
