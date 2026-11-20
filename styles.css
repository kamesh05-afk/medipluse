/* ==========================================================================
   Smart Medicine Reminder & Daily Wellness Companion - Styles
   Modern, Accessible, Responsive, Themeable, PWA Ready
   ========================================================================== */

:root {
  /* Color Palette - Light Theme */
  --bg-primary: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #ffffff;
  --bg-subtle: #f1f5f9;
  --bg-hover: #e2e8f0;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;

  --border-color: #e2e8f0;
  --border-focus: #3b82f6;

  /* Accent Colors */
  --primary: #2563eb;
  --primary-light: #dbeafe;
  --primary-dark: #1d4ed8;
  --primary-glow: rgba(37, 99, 235, 0.25);

  --success: #10b981;
  --success-light: #d1fae5;
  --success-dark: #047857;

  --warning: #f59e0b;
  --warning-light: #fef3c7;
  --warning-dark: #b45309;

  --danger: #ef4444;
  --danger-light: #fee2e2;
  --danger-dark: #b91c1c;

  --purple: #8b5cf6;
  --purple-light: #ede9fe;

  --cyan: #06b6d4;
  --cyan-light: #cffafe;

  --rose: #f43f5e;
  --rose-light: #ffe4e6;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);

  /* Layout Variables */
  --sidebar-width: 270px;
  --header-height: 70px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-full: 9999px;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --font-base: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Dark Theme */
body.dark-mode {
  --bg-primary: #0b1120;
  --bg-surface: #1e293b;
  --bg-surface-elevated: #334155;
  --bg-subtle: #0f172a;
  --bg-hover: #334155;

  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --text-inverse: #0f172a;

  --border-color: #334155;
  --border-focus: #60a5fa;

  --primary: #3b82f6;
  --primary-light: #1e3a8a;
  --primary-dark: #60a5fa;
  --primary-glow: rgba(59, 130, 246, 0.35);

  --success: #10b981;
  --success-light: #064e3b;
  --warning: #f59e0b;
  --warning-light: #78350f;
  --danger: #f87171;
  --danger-light: #7f1d1d;
  --purple: #a78bfa;
  --purple-light: #4c1d95;
  --cyan: #22d3ee;
  --cyan-light: #164e63;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

/* Senior / High Contrast Accessibility Mode */
body.senior-mode {
  font-size: 18px;
  line-height: 1.6;
}
body.senior-mode .btn,
body.senior-mode .nav-item,
body.senior-mode .badge {
  font-size: 16px;
  padding: 10px 18px;
}
body.senior-mode h1 { font-size: 2.2rem; }
body.senior-mode h2 { font-size: 1.8rem; }
body.senior-mode h3 { font-size: 1.4rem; }

/* Base Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-base);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
}

/* ==========================================================================
   AUTHENTICATION & PATIENT REGISTRATION GATE (PRE-ENTER SCREEN)
   ========================================================================== */
#auth-gate-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e1b4b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.auth-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 650px;
  padding: 32px;
  animation: modalPop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  margin: auto;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.auth-brand-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.auth-badge-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary), #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 16px var(--primary-glow);
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.auth-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.auth-notice {
  background-color: var(--primary-light);
  border-left: 4px solid var(--primary);
  padding: 12px 16px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: 22px;
  font-size: 0.84rem;
  color: var(--text-primary);
}

body.dark-mode .auth-notice {
  background-color: rgba(37, 99, 235, 0.2);
}

/* App Container Layout */
.app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* Sidebar Navigation */
.sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.brand {
  padding: 22px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary), #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-menu {
  list-style: none;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.92rem;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
}

.nav-item:hover {
  background-color: var(--bg-subtle);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
  border-color: rgba(37, 99, 235, 0.15);
}

body.dark-mode .nav-item.active {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.3);
}

.nav-item svg {
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.nav-badge {
  margin-left: auto;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background-color: var(--danger);
  color: #ffffff;
  font-weight: 700;
}

.nav-badge.warning {
  background-color: var(--warning);
  color: #1e293b;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.patient-mini-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.patient-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.patient-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.patient-info h4 {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.patient-info p {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.patient-address-snippet {
  font-size: 0.72rem;
  color: var(--text-secondary);
  border-top: 1px dashed var(--border-color);
  padding-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.logout-link-btn {
  background: none;
  border: none;
  color: var(--danger);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  text-align: right;
  padding: 2px 0;
}

.logout-link-btn:hover {
  text-decoration: underline;
}

/* Main Content Area */
.main-wrapper {
  margin-left: var(--sidebar-width);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

/* Top App Header */
.top-header {
  height: var(--header-height);
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 90;
  backdrop-filter: blur(8px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.menu-toggle-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
}

.header-title-block h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.header-title-block p {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.live-time-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.live-time-chip .pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--success);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}

.icon-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-primary);
  border-color: var(--primary);
}

.icon-btn.active-sound {
  color: var(--primary);
  background-color: var(--primary-light);
  border-color: var(--primary);
}

/* Install Shortcut / PWA Pill Button */
.btn-shortcut-install {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  transition: var(--transition);
}

.btn-shortcut-install:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* Page Views Container */
.content-area {
  padding: 24px 28px 60px;
  flex: 1;
}

.tab-pane {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tab-pane.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Global Grid and Card Styles */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 22px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(37, 99, 235, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Metric / Quick Stats Cards */
.stat-card {
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue { background-color: var(--primary-light); color: var(--primary); }
.stat-icon.green { background-color: var(--success-light); color: var(--success); }
.stat-icon.amber { background-color: var(--warning-light); color: var(--warning); }
.stat-icon.rose { background-color: var(--rose-light); color: var(--rose); }

.stat-value {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-footer {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
}

/* Hero Next Dose Banner */
.next-dose-banner {
  grid-column: span 8;
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #ffffff;
  border: none;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

body.dark-mode .next-dose-banner {
  background: linear-gradient(135deg, #172554, #1d4ed8);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.banner-left {
  flex: 1;
}

.banner-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.banner-med-title {
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.banner-med-meta {
  font-size: 0.92rem;
  opacity: 0.9;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
}

.banner-med-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.banner-countdown {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-md);
  padding: 14px 20px;
  text-align: center;
  min-width: 150px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.countdown-num {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  color: #fbbf24;
}

.countdown-label {
  font-size: 0.72rem;
  opacity: 0.85;
  text-transform: uppercase;
}

.banner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

/* Quick Pedometer Mini Widget in Dashboard */
.pedometer-mini-card {
  grid-column: span 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.steps-circle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  position: relative;
}

.circular-chart {
  max-width: 160px;
  max-height: 160px;
}

.circle-bg {
  fill: none;
  stroke: var(--bg-subtle);
  stroke-width: 3.2;
}

.circle-progress {
  fill: none;
  stroke: var(--success);
  stroke-width: 3.2;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.circle-text-center {
  position: absolute;
  text-align: center;
}

.center-step-count {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.center-step-goal {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.step-mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  text-align: center;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 10px 6px;
  margin-top: 8px;
}

.mini-stat-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.mini-stat-lbl {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Medicine Schedule List & Cards */
.schedule-section {
  grid-column: span 8;
}

.timeline-group {
  margin-bottom: 24px;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--border-color);
}

.med-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  margin-bottom: 12px;
  transition: var(--transition);
}

.med-card:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

.med-card.is-due {
  border-left: 4px solid var(--warning);
  background-color: rgba(245, 158, 11, 0.04);
}

.med-card.is-taken {
  border-left: 4px solid var(--success);
  opacity: 0.85;
}

.med-card.is-skipped {
  border-left: 4px solid var(--text-muted);
  opacity: 0.65;
}

.med-main-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.med-icon-pill {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.med-details h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.med-meta-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.stock-indicator-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.badge-in-stock {
  background-color: var(--success-light);
  color: var(--success-dark);
}

.badge-low-stock {
  background-color: var(--warning-light);
  color: var(--warning-dark);
  animation: pulse-badge 1.5s infinite;
}

.badge-out-stock {
  background-color: var(--danger-light);
  color: var(--danger-dark);
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.med-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
  text-decoration: none;
  font-family: inherit;
}

.btn-primary {
  background-color: var(--primary);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.btn-success {
  background-color: var(--success);
  color: #ffffff;
}

.btn-success:hover {
  background-color: var(--success-dark);
}

.btn-warning {
  background-color: var(--warning);
  color: #1e293b;
}

.btn-outline {
  background-color: transparent;
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.btn-outline:hover {
  background-color: var(--bg-subtle);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.btn-danger-outline {
  background-color: transparent;
  border-color: var(--danger-light);
  color: var(--danger);
}

.btn-danger-outline:hover {
  background-color: var(--danger-light);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 1rem;
}

.btn-white {
  background-color: #ffffff;
  color: var(--primary);
  border: none;
}
.btn-white:hover {
  background-color: #f1f5f9;
}

/* Medicine Stock Inventory Tab */
.stock-inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.stock-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: var(--transition);
}

.stock-card:hover {
  box-shadow: var(--shadow-md);
}

.stock-card.critical {
  border-color: var(--danger);
  box-shadow: 0 0 0 1px var(--danger);
}

.stock-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.stock-progress-wrap {
  margin: 16px 0;
}

.stock-numbers {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--text-secondary);
}

.stock-bar-track {
  height: 10px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.stock-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

.stock-bar-fill.healthy { background-color: var(--success); }
.stock-bar-fill.warning { background-color: var(--warning); }
.stock-bar-fill.danger { background-color: var(--danger); }

.days-left-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-md);
  margin-top: 8px;
}

/* Step Activity Hub */
.activity-hero-card {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-surface), var(--bg-subtle));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 28px;
  margin-bottom: 24px;
}

.ped-circle-big {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.ped-circle-big .circular-chart {
  max-width: 240px;
  max-height: 240px;
}

.ped-circle-big .circle-bg {
  stroke-width: 4.5;
}

.ped-circle-big .circle-progress {
  stroke-width: 4.5;
  stroke: #10b981;
}

.ped-big-text {
  position: absolute;
  text-align: center;
}

.ped-big-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1;
}

.ped-big-goal {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 6px;
}

.activity-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-box {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.metric-box-val {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.metric-box-lbl {
  font-size: 0.78rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.walking-sim-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px 20px;
}

.sim-walker-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sim-avatar-animate {
  font-size: 1.8rem;
  display: inline-block;
}

.sim-avatar-animate.walking {
  animation: walk-bounce 0.8s infinite alternate ease-in-out;
}

@keyframes walk-bounce {
  0% { transform: translateY(0) rotate(-4deg); }
  100% { transform: translateY(-6px) rotate(4deg); }
}

/* 7-Day Chart SVG Container */
.chart-container {
  width: 100%;
  height: 220px;
  margin-top: 20px;
  position: relative;
}

/* Vitals & Water Tracker Grid */
.vitals-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

/* Water tracker */
.water-tracker-card {
  grid-column: span 6;
}

.water-glasses-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.glass-item {
  flex: 1;
  min-width: 32px;
  height: 60px;
  background-color: var(--bg-subtle);
  border: 2px solid var(--border-color);
  border-radius: 4px 4px 10px 10px;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: var(--transition);
}

.glass-item.filled {
  border-color: #38bdf8;
}

.glass-fill {
  width: 100%;
  height: 0%;
  background: linear-gradient(to top, #0284c7, #38bdf8);
  transition: height 0.3s ease;
}

.glass-item.filled .glass-fill {
  height: 100%;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.modal-backdrop.show {
  opacity: 1;
  pointer-events: auto;
}

.modal-box {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  transform: translateY(20px) scale(0.97);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-backdrop.show .modal-box {
  transform: translateY(0) scale(1);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Form Controls */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 14px;
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.92rem;
  font-family: inherit;
  transition: var(--transition);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--bg-surface);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

/* Live Dose Alert Toast / Popup Overlay with Urgent Pulsing */
.alarm-overlay {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1100;
  max-width: 440px;
  width: calc(100% - 48px);
  background-color: var(--bg-surface);
  border: 2px solid var(--danger);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 35px rgba(239, 68, 68, 0.45);
  padding: 22px;
  display: none;
  animation: slideUp 0.3s ease, beepPulse 1.2s infinite alternate;
}

.alarm-overlay.active {
  display: block;
}

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes beepPulse {
  0% { box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3); }
  100% { box-shadow: 0 10px 45px rgba(239, 68, 68, 0.7); }
}

.alarm-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.alarm-bell {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--danger-light);
  color: var(--danger);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ring 0.6s infinite alternate ease-in-out;
}

@keyframes ring {
  0% { transform: rotate(-20deg) scale(1); }
  100% { transform: rotate(20deg) scale(1.15); }
}

/* Print styles for Doctor / Pharmacy Prescription Summary */
@media print {
  body {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  .sidebar, .top-header, .btn, .icon-btn, .modal-backdrop, .alarm-overlay, .walking-sim-bar, #auth-gate-screen {
    display: none !important;
  }
  .main-wrapper {
    margin-left: 0 !important;
  }
  .content-area {
    padding: 0 !important;
  }
  .tab-pane {
    display: none !important;
  }
  #view-doctor-summary {
    display: block !important;
  }
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .stat-card { grid-column: span 6; }
  .next-dose-banner { grid-column: span 12; }
  .pedometer-mini-card { grid-column: span 12; }
  .schedule-section { grid-column: span 12; }
  .water-tracker-card { grid-column: span 12; }
  .activity-hero-card { grid-template-columns: 1fr; text-align: center; }
  .walking-sim-bar { flex-direction: column; gap: 14px; }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
    box-shadow: 20px 0 30px rgba(0,0,0,0.3);
  }
  .main-wrapper {
    margin-left: 0;
  }
  .menu-toggle-btn {
    display: block;
  }
  .top-header {
    padding: 0 16px;
  }
  .content-area {
    padding: 16px;
  }
  .stat-card { grid-column: span 12; }
  .activity-metrics-grid { grid-template-columns: 1fr; }
  .med-card { flex-direction: column; align-items: flex-start; gap: 14px; }
  .med-actions { width: 100%; justify-content: flex-end; }
  .form-row { flex-direction: column; gap: 0; }
  .auth-card { padding: 22px 18px; }
}
