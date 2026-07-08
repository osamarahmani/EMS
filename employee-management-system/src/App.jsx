import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { io } from 'socket.io-client'
import './App.css'

/* ─── Feather nav icons map ─────────────────────────────────── */
const NAV_ICONS = {
  '/dashboard': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  '/employees': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  '/attendance': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  '/leave': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  '/payroll': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  '/recruitment': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  '/projects': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  '/chat': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  '/settings': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
}

/* ─── Floating Particles ────────────────────────────────────── */
function FloatingParticles() {
  const dots = [
    { left: '10%',  size: 5,  dur: 18, delay: 0,    color: 'rgba(99,102,241,0.5)'  },
    { left: '25%',  size: 3,  dur: 22, delay: 4,    color: 'rgba(168,85,247,0.4)'  },
    { left: '40%',  size: 6,  dur: 16, delay: 8,    color: 'rgba(56,189,248,0.4)'  },
    { left: '55%',  size: 4,  dur: 20, delay: 2,    color: 'rgba(52,211,153,0.4)'  },
    { left: '70%',  size: 5,  dur: 24, delay: 6,    color: 'rgba(251,191,36,0.35)' },
    { left: '82%',  size: 3,  dur: 17, delay: 10,   color: 'rgba(251,113,133,0.4)' },
    { left: '92%',  size: 4,  dur: 21, delay: 3,    color: 'rgba(99,102,241,0.4)'  },
    { left: '18%',  size: 3,  dur: 19, delay: 14,   color: 'rgba(168,85,247,0.35)' },
    { left: '63%',  size: 6,  dur: 26, delay: 7,    color: 'rgba(56,189,248,0.3)'  },
  ]
  return (
    <div className="feather-particles" aria-hidden="true">
      {dots.map((d, i) => (
        <div
          key={i}
          className="feather-dot"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: `0 0 ${d.size * 2}px ${d.color}`,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Live clock ────────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="topbar-clock">{time}</span>
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const demoUsers = [
  { id: 1, name: 'Ava Chen', email: 'admin@ems.com', password: 'password123', role: 'super_admin' },
  { id: 2, name: 'Mina Patel', email: 'hr@ems.com', password: 'password123', role: 'hr' },
  { id: 3, name: 'Leo Brooks', email: 'employee@ems.com', password: 'password123', role: 'employee' }
]

const fallbackEmployees = [
  { id: 101, name: 'Alicia Stone', role: 'Product Designer', department: 'Design', status: 'Active' },
  { id: 102, name: 'Daniel Kim', role: 'Engineering Lead', department: 'Engineering', status: 'Active' },
  { id: 103, name: 'Nadia Flores', role: 'HR Partner', department: 'People Ops', status: 'Pending' }
]

const fallbackAttendance = {
  summary: '97% weekly',
  items: [
    { label: 'Check-ins', value: '221' },
    { label: 'Late entries', value: '8' },
    { label: 'OT approved', value: '12h' }
  ],
  schedule: [
    { title: 'Team sync', time: '09:30' },
    { title: 'Payroll review', time: '12:00' },
    { title: 'Interview panel', time: '15:30' }
  ]
}

const fallbackLeaveData = {
  balance: '14 days',
  items: [
    { label: 'Casual', value: '6 left' },
    { label: 'Sick', value: '4 left' },
    { label: 'Annual', value: '4 left' }
  ],
  requests: [
    { name: 'Rina Shah', type: 'Sick leave', status: 'Pending' },
    { name: 'Tom Lewis', type: 'Casual leave', status: 'Approved' }
  ]
}

const fallbackPayroll = {
  status: 'Processed',
  items: [
    { label: 'Net salary', value: '$4,820' },
    { label: 'Bonus', value: '$480' },
    { label: 'Deductions', value: '$170' }
  ],
  payslips: [
    { name: 'June payslip', date: '2026-06-25' },
    { name: 'May payslip', date: '2026-05-27' }
  ]
}

const fallbackRecruitment = {
  openRoles: 6,
  positions: [
    { title: 'Senior Frontend Engineer', stage: 'Screening' },
    { title: 'People Operations Manager', stage: 'HR Round' }
  ],
  pipeline: [
    { label: 'Applicants', value: '38' },
    { label: 'Interviews', value: '12' },
    { label: 'Offers', value: '4' }
  ]
}

const fallbackProjects = [
  { name: 'Northwind rollout', progress: '82%', summary: 'Coordinate implementation with finance and operations.', owner: 'Anika', deadline: '2026-07-15', budget: '$180k' },
  { name: 'Global onboarding revamp', progress: '64%', summary: 'Streamline new-hire documentation and access provisioning.', owner: 'Mina', deadline: '2026-08-02', budget: '$96k' }
]

const fallbackNotifications = [
  { title: 'Leave approval requested', time: '2m ago' },
  { title: 'New interview scheduled', time: '15m ago' },
  { title: 'Payroll batch released', time: '31m ago' }
]

const navByRole = {
  super_admin: [
    { to: '/dashboard', label: 'Overview' },
    { to: '/employees', label: 'Employees' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/leave', label: 'Leave' },
    { to: '/payroll', label: 'Payroll' },
    { to: '/recruitment', label: 'Recruitment' },
    { to: '/projects', label: 'Projects' },
    { to: '/chat', label: 'Chat' },
    { to: '/settings', label: 'Settings' }
  ],
  hr: [
    { to: '/dashboard', label: 'Overview' },
    { to: '/employees', label: 'Employees' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/leave', label: 'Leave' },
    { to: '/payroll', label: 'Payroll' },
    { to: '/recruitment', label: 'Recruitment' },
    { to: '/chat', label: 'Chat' }
  ],
  employee: [
    { to: '/dashboard', label: 'Home' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/leave', label: 'Leave' },
    { to: '/payroll', label: 'Payroll' },
    { to: '/projects', label: 'Projects' },
    { to: '/chat', label: 'Chat' }
  ]
}

function getStoredUser() {
  if (typeof window === 'undefined') return null
  try {
    const u = JSON.parse(window.localStorage.getItem('ems-user'))
    // Validate the stored user has all required fields
    if (!u || !u.role || !u.name || !u.id) {
      window.localStorage.removeItem('ems-user')
      window.localStorage.removeItem('ems-token')
      return null
    }
    return u
  } catch {
    window.localStorage.removeItem('ems-user')
    window.localStorage.removeItem('ems-token')
    return null
  }
}

function getStoredToken() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('ems-token') || ''
}

function authHeaders() {
  const token = getStoredToken()
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}


function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/" replace />
}

function AppLayout({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <FloatingParticles />

      <header className="topbar">
        <div className="topbar-brand">
          <p className="eyebrow">Enterprise HRMS</p>
          <h1>Employee Management System</h1>
        </div>
        <div className="topbar-actions">
          <LiveClock />
          {user.isGoogle && (
            <span className="google-signed-in-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.0 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Account
            </span>
          )}
          <span className="pill">{user.role.replace('_', ' ').toUpperCase()}</span>
          <button type="button" className="ghost-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="sidebar-nav">
        <div className="sidebar-label">Menu</div>
        {navByRole[user.role]?.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{NAV_ICONS[item.to]}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="sidebar-sep" style={{ marginTop: 'auto' }} />
        <div style={{ padding: '8px 12px 4px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
          <span className="glow-dot" style={{ marginRight: 6 }} />
          System live
        </div>
      </nav>

      <main className="content-area">{children}</main>
    </div>
  )
}

function LandingPage() {
  return (
    <section className="landing-hero">
      <div className="hero-illustration">
        <svg viewBox="0 0 500 500" className="illustration-svg">
          {/* Background elements */}
          <circle cx="100" cy="80" r="40" fill="#a8e6cf" opacity="0.3"/>
          <circle cx="420" cy="100" r="50" fill="#ffd89b" opacity="0.3"/>
          
          {/* Chart/Graph */}
          <rect x="40" y="80" width="140" height="100" rx="15" fill="#7fd3c1" opacity="0.8"/>
          <polyline points="60,150 90,100 130,120 160,80" stroke="white" strokeWidth="3" fill="none"/>
          <circle cx="60" cy="150" r="4" fill="white"/>
          <circle cx="90" cy="100" r="4" fill="white"/>
          <circle cx="130" cy="120" r="4" fill="white"/>
          <circle cx="160" cy="80" r="4" fill="white"/>
          
          {/* Hanging lights */}
          <line x1="100" y1="0" x2="100" y2="50" stroke="#7fd3c1" strokeWidth="4"/>
          <circle cx="100" cy="65" r="20" fill="#7fd3c1"/>
          <line x1="340" y1="0" x2="340" y2="50" stroke="#7fd3c1" strokeWidth="4"/>
          <circle cx="340" cy="65" r="20" fill="#7fd3c1"/>
          
          {/* Clock */}
          <circle cx="400" cy="140" r="35" fill="none" stroke="#ffc107" strokeWidth="3"/>
          <line x1="400" y1="140" x2="400" y2="115" stroke="#ffc107" strokeWidth="2"/>
          <line x1="400" y1="140" x2="415" y2="140" stroke="#ffc107" strokeWidth="2"/>
          <circle cx="400" cy="140" r="4" fill="#ffc107"/>
          
          {/* Person 1 - Left (celebrating) */}
          <circle cx="120" cy="220" r="18" fill="#1e40af"/>
          <path d="M 120 240 L 110 290 M 120 240 L 130 290" stroke="#1e40af" strokeWidth="8" strokeLinecap="round"/>
          <rect x="100" y="240" width="40" height="40" fill="#f0f0f0" rx="4"/>
          <circle cx="100" cy="258" r="6" fill="#1e40af"/>
          <line x1="105" y1="253" x2="95" y2="240" stroke="#1e40af" strokeWidth="6" strokeLinecap="round"/>
          
          {/* Person 2 - Middle (jumping) */}
          <circle cx="250" cy="200" r="20" fill="#f59e0b"/>
          <rect x="230" y="225" width="40" height="50" fill="#fbbf24" rx="4"/>
          <path d="M 230 275 L 225 320 M 270 275 L 275 320" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round"/>
          <path d="M 210 240 L 180 220 M 290 240 L 320 220" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round"/>
          
          {/* Person 3 - Right (celebrating) */}
          <circle cx="360" cy="230" r="18" fill="#f59e0b"/>
          <rect x="340" y="255" width="40" height="45" fill="#1e40af" rx="4"/>
          <path d="M 340 300 L 335 345 M 380 300 L 385 345" stroke="#1e40af" strokeWidth="8" strokeLinecap="round"/>
          <path d="M 320 270 L 290 250" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round"/>
          <path d="M 380 270 L 410 250" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round"/>
          
          {/* Yellow platform */}
          <ellipse cx="250" cy="380" rx="180" ry="40" fill="#fbbf24"/>
          <path d="M 70 380 Q 100 360 250 360 Q 400 360 430 380" fill="#fcd34d"/>
          
          {/* Background decorative elements */}
          <line x1="50" y1="350" x2="120" y2="320" stroke="#7fd3c1" strokeWidth="2" opacity="0.5"/>
          <line x1="380" y1="360" x2="450" y2="330" stroke="#7fd3c1" strokeWidth="2" opacity="0.5"/>
        </svg>
      </div>

      <div className="hero-content">
        <h1 className="hero-main-title">Employee <span>Management</span> System</h1>
        <div className="hero-tagline">Do You Need It?</div>
        
        <div className="feature-list">
          <div className="feature-item">⚡ Live notifications</div>
          <div className="feature-item">📈 Workforce analytics</div>
          <div className="feature-item">🔐 Secure role-based access</div>
          <div className="feature-item">💼 Leave & Attendance Tracking</div>
          <div className="feature-item">💰 Integrated Payroll System</div>
          <div className="feature-item">🎯 Project Management</div>
          <div className="feature-item">👥 Recruitment Pipeline</div>
        </div>

        <p className="hero-description">
          Run payroll, hiring, attendance, projects, collaboration, and analytics in one command center.
        </p>

        <Link className="cta-button" to="/login">Login / Register</Link>
      </div>
    </section>
  )
}

function getAvatarColor(name) {
  const colors = ['#1a73e8', '#0f9d58', '#f4b400', '#db4437', '#ab47bc', '#00acc1']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function GoogleModal({ isOpen, onClose, onSelectAccount, demoUsers }) {
  const [view, setView] = useState('choose') // 'choose', 'custom', 'loading'
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [customRole, setCustomRole] = useState('employee')
  const [selectedUser, setSelectedUser] = useState(null)
  
  if (!isOpen) return null

  const handleSelect = (user) => {
    setSelectedUser(user)
    setView('loading')
    setTimeout(() => {
      onSelectAccount(user)
    }, 1500)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customEmail) return
    const name = customName || customEmail.split('@')[0]
    const newUser = {
      id: Date.now(),
      name: name.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      email: customEmail,
      role: customRole
    }
    setView('loading')
    setTimeout(() => {
      onSelectAccount(newUser)
    }, 1500)
  }

  return (
    <div className="google-modal-overlay">
      <div className="google-modal-container">
        {view === 'loading' ? (
          <div className="google-loading-view">
            <div className="google-spinner"></div>
            <p className="google-loading-title">Signing in with Google</p>
            <p className="google-loading-subtitle">
              {selectedUser ? selectedUser.email : customEmail}
            </p>
          </div>
        ) : view === 'custom' ? (
          <div className="google-custom-view">
            <div className="google-logo-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.0 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h2>Sign in with Google</h2>
              <p>Use your Google Account</p>
            </div>
            
            <form onSubmit={handleCustomSubmit} className="google-custom-form">
              <div className="google-input-group">
                <input 
                  type="email" 
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="Email or phone"
                  required
                  autoFocus
                />
              </div>

              <div className="google-input-group">
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Full name (optional)"
                />
              </div>

              <div className="google-input-group">
                <select 
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="google-select-role"
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR Partner</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <label className="google-select-label">Select Workspace Role</label>
              </div>

              <div className="google-actions-row">
                <button type="button" className="google-text-button" onClick={() => setView('choose')}>
                  Back
                </button>
                <button type="submit" className="google-primary-btn">
                  Next
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="google-account-chooser">
            <div className="google-logo-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.0 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h2>Choose an account</h2>
              <p>to continue to Enterprise HRMS</p>
            </div>

            <div className="google-accounts-list">
              {demoUsers.map((item) => (
                <button 
                  key={item.email} 
                  type="button" 
                  className="google-account-item"
                  onClick={() => handleSelect(item)}
                >
                  <div className="google-avatar" style={{ backgroundColor: getAvatarColor(item.name) }}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="google-account-details">
                    <span className="google-account-name">{item.name}</span>
                    <span className="google-account-email">{item.email}</span>
                  </div>
                  <span className="google-role-badge">{item.role.replace('_', ' ')}</span>
                </button>
              ))}

              <button 
                type="button" 
                className="google-account-item google-use-other"
                onClick={() => setView('custom')}
              >
                <div className="google-avatar google-other-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div className="google-account-details">
                  <span className="google-account-name font-medium">Use another account</span>
                </div>
              </button>
            </div>
            
            <div className="google-footer-actions">
              <button type="button" className="google-text-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoginPage({ form, setForm, authMode, setAuthMode, onSubmit, onGoogleLogin, error, googleEmail }) {
  return (
    <div className="login-container">
      <div className="auth-card-new">
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`tab-button ${authMode === 'login' ? 'active' : ''}`} 
            onClick={() => setAuthMode('login')}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`tab-button ${authMode === 'register' ? 'active' : ''}`} 
            onClick={() => setAuthMode('register')}
          >
            Register
          </button>
        </div>

        <button type="button" className="google-login-button" onClick={onGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.0 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        {googleEmail && (
          <p className="google-email-label">Signing in with {googleEmail}</p>
        )}

        <div className="divider">
          <span>Or continue with email</span>
        </div>

        {authMode === 'login' && (
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <select 
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', fontSize: '0.9rem', color: '#64748b' }}
              onChange={(e) => {
                const role = e.target.value;
                if (role === 'super_admin') setForm({ ...form, email: 'admin@ems.com', password: 'password123' });
                else if (role === 'hr') setForm({ ...form, email: 'hr@ems.com', password: 'password123' });
                else if (role === 'employee') setForm({ ...form, email: 'employee@ems.com', password: 'password123' });
              }}
              defaultValue=""
            >
              <option value="" disabled>Quick Login as Role...</option>
              <option value="super_admin">Admin</option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        )}

        <form onSubmit={onSubmit} className="auth-form-new">
          {authMode === 'register' && (
            <div className="form-group">
              <input 
                type="text"
                value={form.name} 
                onChange={(event) => setForm({ ...form, name: event.target.value })} 
                placeholder="Full name" 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <input 
              type="email" 
              value={form.email} 
              onChange={(event) => setForm({ ...form, email: event.target.value })} 
              placeholder="Work email" 
              required 
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              value={form.password} 
              onChange={(event) => setForm({ ...form, password: event.target.value })} 
              placeholder="Password" 
              required 
            />
          </div>

          {authMode === 'register' && (
            <div className="form-group">
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-button">
            {authMode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <section className="page-heading">
      <div>
        <p className="eyebrow">Enterprise workspace</p>
        <h2>{title}</h2>
        {subtitle ? <p className="panel-copy">{subtitle}</p> : null}
      </div>
      {action ? <div className="pill">{action}</div> : null}
    </section>
  )
}

function DashboardPage({ user, dashboardData, liveActivity, socketConnected }) {
  const cards = [
    { label: 'Employees',     value: dashboardData.totalEmployees,  detail: 'across 12 departments', icon: '👥', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { label: 'Attendance',    value: dashboardData.attendance,       detail: 'today live rate',        icon: '📈', grad: 'linear-gradient(135deg,#38bdf8,#6366f1)' },
    { label: 'Pending Leave', value: dashboardData.pendingLeaves,    detail: 'awaiting approval',      icon: '📅', grad: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
    { label: 'Payroll',       value: dashboardData.payrollStatus,    detail: 'ready for release',      icon: '💰', grad: 'linear-gradient(135deg,#34d399,#059669)' },
  ]

  return (
    <>
      <SectionHeading title={`Welcome back, ${user.name}`} subtitle="A unified view of growth, operations, and collaboration." action={socketConnected ? '🟢 Live sync on' : 'Connecting…'} />
      <section className="stats-grid">
        {cards.map((card) => (
          <article key={card.label} className="stat-card">
            <div className="stat-icon" style={{ background: card.grad }}>{card.icon}</div>
            <p>{card.label}</p>
            <h3>{card.value}</h3>
            <span>{card.detail}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel-card large">
          <div className="panel-header">
            <h3>Performance pulse</h3>
            <span className="pill">Updated live</span>
          </div>
          <div className="bars">
            {[78, 84, 69, 92, 76].map((height, index) => (
              <div key={index} className="bar-column">
                <div className="bar-fill" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
          <p className="panel-copy">Employee engagement and punctuality are trending above the monthly target.</p>
        </article>
        <article className="panel-card">
          <div className="panel-header">
            <h3>Live activity</h3>
          </div>
          <ul className="list">
            {liveActivity.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  )
}

function EmployeesPage({ employees, API_BASE, triggerRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [newEmp, setNewEmp] = useState({ name: '', role: '', department: '', status: 'Active' });

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newEmp.name.trim() || !newEmp.role.trim() || !newEmp.department.trim()) {
      setFormError('Name, role, and department are required.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/employees`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newEmp)
      });
      if (response.ok) {
        setNewEmp({ name: '', role: '', department: '', status: 'Active' });
        setShowModal(false);
        if (triggerRefresh) triggerRefresh();
      } else {
        const data = await response.json();
        setFormError(data.message || 'Failed to add employee.');
      }
    } catch {
      // Offline fallback — add locally
      if (triggerRefresh) triggerRefresh();
      setNewEmp({ name: '', role: '', department: '', status: 'Active' });
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="panel-card">
        <div className="panel-header">
          <h3>Employee directory</h3>
          <button type="button" className="primary-button" onClick={() => { setFormError(''); setShowModal(true); }}>+ Add employee</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.role}</td>
                <td>{employee.department}</td>
                <td>{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showModal && (
        <div className="google-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="google-modal-container" style={{ maxWidth: '440px', width: '100%' }}>
            <div className="google-logo-header" style={{ marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.2rem' }}>Add New Employee</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Fill in the details to add a new team member</p>
            </div>
            <form onSubmit={handleAddEmployee} className="auth-form-new" style={{ gap: '14px', padding: '0 0 4px' }}>
              <div className="form-group">
                <input
                  type="text"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="Full name"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={newEmp.role}
                  onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                  placeholder="Job title / Role"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={newEmp.department}
                  onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                  placeholder="Department"
                  required
                />
              </div>
              <div className="form-group">
                <select
                  value={newEmp.status}
                  onChange={(e) => setNewEmp({ ...newEmp, status: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', fontSize: '0.95rem' }}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              {formError && <p className="error-text" style={{ marginTop: 0 }}>{formError}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" className="submit-button" disabled={submitting} style={{ marginTop: 0, flex: 1 }}>
                  {submitting ? 'Adding...' : 'Add Employee'}
                </button>
                <button
                  type="button"
                  className="google-login-button"
                  onClick={() => setShowModal(false)}
                  style={{ marginBottom: 0, flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function AttendancePage({ attendance, user, API_BASE, triggerRefresh }) {
  const [status, setStatus] = useState({ checkedIn: false, time: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !API_BASE) return;
    fetch(`${API_BASE}/api/attendance/status/${user.id}`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => {});
  }, [user, API_BASE]);

  const handleCheckInToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/attendance/checkin`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId: user.id, name: user.name })
      });
      const data = await response.json();
      setStatus({ checkedIn: data.checkedIn, time: data.time || '' });
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-grid">
      <article className="panel-card">
        <div className="panel-header">
          <h3>Attendance snapshot</h3>
          <span className="pill">{attendance.summary}</span>
        </div>
        <ul className="list">
          {attendance.items.map((item) => (
            <li key={item.label}>{item.label}: {item.value}</li>
          ))}
        </ul>

        <div className="checkin-container" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <p className="panel-copy" style={{ marginBottom: '12px' }}>
            {status.checkedIn 
              ? `Status: Checked In today at ${status.time}` 
              : 'Status: Not Checked In today'}
          </p>
          <button 
            type="button" 
            className={`submit-button ${status.checkedIn ? 'danger-btn' : ''}`}
            onClick={handleCheckInToggle}
            disabled={loading}
            style={{ width: 'auto', padding: '10px 24px', background: status.checkedIn ? '#ef4444' : 'linear-gradient(135deg, #4338ca, #8b5cf6)' }}
          >
            {loading ? 'Processing...' : (status.checkedIn ? 'Check Out' : 'Check In Now')}
          </button>
        </div>
      </article>
      <article className="panel-card">
        <div className="panel-header">
          <h3>Shift calendar</h3>
        </div>
        <ul className="list">
          {attendance.schedule.map((item) => (
            <li key={item.title}>{item.title} • {item.time}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function LeavePage({ leaveData, user, API_BASE, triggerRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Sick leave');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/leave/request`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: user.name, type: leaveType, reason })
      });
      if (response.ok) {
        setReason('');
        setShowForm(false);
        if (triggerRefresh) triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveReject = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/leave/approve`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ id, status })
      });
      if (response.ok) {
        if (triggerRefresh) triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isHR = user.role === 'hr' || user.role === 'super_admin';

  return (
    <section className="content-grid">
      <article className="panel-card">
        <div className="panel-header">
          <h3>Leave balance</h3>
          <span className="pill">{leaveData.balance}</span>
        </div>
        <ul className="list">
          {leaveData.items.map((item) => (
            <li key={item.label}>{item.label}: {item.value}</li>
          ))}
        </ul>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          {!showForm ? (
            <button 
              type="button" 
              className="primary-button" 
              onClick={() => setShowForm(true)}
            >
              Apply for Leave
            </button>
          ) : (
            <form onSubmit={handleRequestSubmit} className="auth-form-new" style={{ gap: '12px' }}>
              <div className="form-group">
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option value="Sick leave">Sick leave</option>
                  <option value="Casual leave">Casual leave</option>
                  <option value="Annual leave">Annual leave</option>
                </select>
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for leave" 
                  required 
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="submit-button" disabled={submitting} style={{ marginTop: 0, padding: '10px 16px', flex: 1 }}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
                <button type="button" className="google-login-button" onClick={() => setShowForm(false)} style={{ marginBottom: 0, padding: '10px 16px', flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </article>
      <article className="panel-card">
        <div className="panel-header">
          <h3>Pending approvals</h3>
        </div>
        <ul className="list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {leaveData.requests.map((item) => (
            <li key={item.id || item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <strong>{item.name}</strong> • {item.type}
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Reason: {item.reason}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`subtle-pill status-${item.status.toLowerCase()}`} style={{ color: item.status === 'Approved' ? '#16a34a' : (item.status === 'Rejected' ? '#dc2626' : '#d97706'), background: item.status === 'Approved' ? '#dcfce7' : (item.status === 'Rejected' ? '#fee2e2' : '#fef3c7') }}>{item.status}</span>
                {isHR && item.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      type="button" 
                      onClick={() => handleApproveReject(item.id, 'Approved')} 
                      style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Approve
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleApproveReject(item.id, 'Rejected')} 
                      style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function PayrollPage({ payroll }) {
  return (
    <section className="content-grid">
      <article className="panel-card">
        <div className="panel-header">
          <h3>Monthly payroll</h3>
          <span className="pill">{payroll.status}</span>
        </div>
        <ul className="list">
          {payroll.items.map((item) => (
            <li key={item.label}>{item.label}: {item.value}</li>
          ))}
        </ul>
      </article>
      <article className="panel-card">
        <div className="panel-header">
          <h3>Recent payslips</h3>
        </div>
        <ul className="list">
          {payroll.payslips.map((item) => (
            <li key={item.name}>{item.name} • {item.date}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function RecruitmentPage({ recruitment }) {
  return (
    <section className="content-grid">
      <article className="panel-card">
        <div className="panel-header">
          <h3>Open positions</h3>
          <span className="pill">{recruitment.openRoles} active</span>
        </div>
        <ul className="list">
          {recruitment.positions.map((job) => (
            <li key={job.title}>{job.title} • {job.stage}</li>
          ))}
        </ul>
      </article>
      <article className="panel-card">
        <div className="panel-header">
          <h3>Pipeline health</h3>
        </div>
        <ul className="list">
          {recruitment.pipeline.map((item) => (
            <li key={item.label}>{item.label}: {item.value}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function ProjectsPage({ projects, user, API_BASE, triggerRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [owner, setOwner] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, summary, owner, deadline, budget })
      });
      if (response.ok) {
        setName('');
        setSummary('');
        setOwner('');
        setDeadline('');
        setBudget('');
        setShowForm(false);
        if (triggerRefresh) triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isHR = user.role === 'hr' || user.role === 'super_admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {isHR && (
        <div style={{ alignSelf: 'flex-start' }}>
          {!showForm ? (
            <button type="button" className="primary-button" onClick={() => setShowForm(true)}>
              + Add New Project
            </button>
          ) : (
            <article className="panel-card" style={{ maxWidth: '500px', marginTop: '10px' }}>
              <div className="panel-header" style={{ marginBottom: '16px' }}>
                <h3>Add New Project</h3>
              </div>
              <form onSubmit={handleSubmit} className="auth-form-new" style={{ gap: '12px' }}>
                <div className="form-group">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" required />
                </div>
                <div className="form-group">
                  <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary" required />
                </div>
                <div className="form-group">
                  <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner Name" />
                </div>
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Deadline" />
                  <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget (e.g. $180k)" />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="submit-button" disabled={submitting} style={{ marginTop: 0, flex: 1 }}>
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                  <button type="button" className="google-login-button" onClick={() => setShowForm(false)} style={{ marginBottom: 0, flex: 1 }}>
                    Cancel
                  </button>
                </div>
              </form>
            </article>
          )}
        </div>
      )}

      <section className="content-grid">
        {projects.map((project) => (
          <article key={project.name} className="panel-card">
            <div className="panel-header">
              <h3>{project.name}</h3>
              <span className="pill">{project.progress}</span>
            </div>
            <p className="panel-copy">{project.summary}</p>
            <ul className="list">
              <li>Owner: {project.owner}</li>
              <li>Deadline: {project.deadline}</li>
              <li>Budget: {project.budget}</li>
            </ul>
          </article>
        ))}
      </section>
    </div>
  )
}

function ChatPage({ notifications, user, API_BASE, socket }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!API_BASE) return;
    fetch(`${API_BASE}/api/chat/messages`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => {});
  }, [API_BASE]);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chat_message', handleChatMessage);

    return () => {
      socket.off('chat_message', handleChatMessage);
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      sender: user.name,
      text: newMessage
    });
    setNewMessage('');
  };

  return (
    <section className="content-grid">
      <article className="panel-card" style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>
        <div className="panel-header">
          <h3>Team collaboration</h3>
          <span className="pill">Live Chat</span>
        </div>
        
        <div className="chat-messages" style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
          {messages.map((msg, index) => {
            const isMe = msg.sender === user.name;
            return (
              <div key={index} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>{msg.sender} • {msg.time}</span>
                <div style={{ background: isMe ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f1f5f9', color: isMe ? '#fff' : '#1e293b', padding: '8px 14px', borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px', fontSize: '0.95rem' }}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Type your message..." 
            required 
            style={{ flexGrow: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', outline: 'none', fontSize: '0.95rem' }} 
          />
          <button type="submit" className="primary-button" style={{ borderRadius: '10px', padding: '10px 20px' }}>
            Send
          </button>
        </form>
      </article>
      <article className="panel-card">
        <div className="panel-header">
          <h3>Notifications center</h3>
        </div>
        <ul className="list">
          {notifications.map((item, index) => (
            <li key={index}>{item.title} • {item.time}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function SettingsPage({ user }) {
  return (
    <section className="content-grid">
      <article className="panel-card">
        <div className="panel-header">
          <h3>Profile</h3>
          <span className="pill">{user.role}</span>
        </div>
        <ul className="list">
          <li>Name: {user.name}</li>
          <li>Email: {user.email}</li>
          <li>Authentication: {user.isGoogle ? 'Connected via Google' : 'Email / Password'}</li>
          <li>Timezone: UTC+5:30</li>
        </ul>
      </article>
      <article className="panel-card">
        <div className="panel-header">
          <h3>Security controls</h3>
        </div>
        <ul className="list">
          <li>2FA enabled</li>
          <li>Device management active</li>
          <li>Audit logs enabled</li>
        </ul>
      </article>
    </section>
  )
}

function App() {
  const [user, setUser] = useState(getStoredUser)
  const [dashboardData, setDashboardData] = useState({ totalEmployees: 248, attendance: '92%', pendingLeaves: 7, payrollStatus: '8 batches' })
  const [employees, setEmployees] = useState(fallbackEmployees)
  const [attendance, setAttendance] = useState(fallbackAttendance)
  const [leaveData, setLeaveData] = useState(fallbackLeaveData)
  const [payroll, setPayroll] = useState(fallbackPayroll)
  const [recruitment, setRecruitment] = useState(fallbackRecruitment)
  const [projects, setProjects] = useState(fallbackProjects)
  const [notifications, setNotifications] = useState(fallbackNotifications)
  const [authMode, setAuthMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' })
  const [googleEmail, setGoogleEmail] = useState('')
  const [error, setError] = useState('')
  const [socketConnected, setSocketConnected] = useState(false)
  const [liveActivity, setLiveActivity] = useState(['Attendance sync complete', 'Payroll review scheduled', 'Recruitment funnel updated'])
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [socket, setSocket] = useState(null)

  const loadData = () => {
    if (!user) return
    const headers = authHeaders()
    Promise.all([
      fetch(`${API_BASE}/api/dashboard?role=${user.role}`, { headers }),
      fetch(`${API_BASE}/api/employees`, { headers }),
      fetch(`${API_BASE}/api/attendance`, { headers }),
      fetch(`${API_BASE}/api/leave`, { headers }),
      fetch(`${API_BASE}/api/payroll`, { headers }),
      fetch(`${API_BASE}/api/recruitment`, { headers }),
      fetch(`${API_BASE}/api/projects`, { headers }),
      fetch(`${API_BASE}/api/notifications`, { headers })
    ])
      .then(async (responses) => {
        const [dashboardRes, employeesRes, attendanceRes, leaveRes, payrollRes, recruitmentRes, projectsRes, notificationsRes] = responses
        return {
          dashboard: await dashboardRes.json(),
          employees: await employeesRes.json(),
          attendance: await attendanceRes.json(),
          leave: await leaveRes.json(),
          payroll: await payrollRes.json(),
          recruitment: await recruitmentRes.json(),
          projects: await projectsRes.json(),
          notifications: await notificationsRes.json()
        }
      })
      .then((payload) => {
        if (payload.dashboard?.[user.role]) {
          setDashboardData(payload.dashboard[user.role])
        }
        setEmployees(payload.employees)
        setAttendance(payload.attendance)
        setLeaveData(payload.leave)
        setPayroll(payload.payroll)
        setRecruitment(payload.recruitment)
        setProjects(payload.projects)
        setNotifications(payload.notifications)
      })
      .catch(() => {
        setDashboardData({ totalEmployees: 248, attendance: '92%', pendingLeaves: 7, payrollStatus: '8 batches' })
        setEmployees(fallbackEmployees)
        setAttendance(fallbackAttendance)
        setLeaveData(fallbackLeaveData)
        setPayroll(fallbackPayroll)
        setRecruitment(fallbackRecruitment)
        setProjects(fallbackProjects)
        setNotifications(fallbackNotifications)
      })
  }

  useEffect(() => {
    if (!user) return

    window.localStorage.setItem('ems-user', JSON.stringify(user))
    // token is already saved at login/register/google time

    loadData()

    const socketInstance = io(API_BASE, { transports: ['websocket'] })
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setSocketConnected(true)
      socketInstance.emit('join_room', user.role)
    })
    socketInstance.on('notification', (message) => {
      setLiveActivity((current) => [message, ...current].slice(0, 6))
      setNotifications((current) => [{ title: message, time: 'just now' }, ...current].slice(0, 6))
      loadData()
    })
    socketInstance.on('disconnect', () => setSocketConnected(false))

    return () => socketInstance.disconnect()
  }, [user])

  const handleGoogleLogin = () => {
    setError('')
    setShowGoogleModal(true)
  }

  const handleGoogleSelect = async (selectedUser) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedUser.name, email: selectedUser.email, role: selectedUser.role })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Google login failed');

      if (payload.user.token) {
        window.localStorage.setItem('ems-token', payload.user.token)
      }
      setUser({ 
        id: payload.user.id, 
        name: payload.user.name, 
        email: payload.user.email, 
        role: payload.user.role,
        isGoogle: true
      })
      setGoogleEmail(payload.user.email)
      setShowGoogleModal(false)
    } catch (err) {
      setError(err.message)
      setShowGoogleModal(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const normalizedEmail = form.email.trim().toLowerCase()

    if (authMode === 'login') {
      try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password: form.password })
        })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.message || 'Unable to sign in')
        }
        if (payload.user.token) {
          window.localStorage.setItem('ems-token', payload.user.token)
        }
        setUser({ id: payload.user.id, name: payload.user.name, email: payload.user.email, role: payload.user.role })
        return
      } catch (errorMessage) {
        if (errorMessage.message === 'Failed to fetch') {
          const matchingUser = demoUsers.find((candidate) => candidate.email === normalizedEmail)
          if (matchingUser && matchingUser.password === form.password) {
            setUser({ id: matchingUser.id, name: matchingUser.name, email: matchingUser.email, role: matchingUser.role })
            if (matchingUser.role === 'employee') {
              setEmployees((current) => [
                ...current,
                { id: matchingUser.id, name: matchingUser.name, role: 'Employee', department: 'General', status: 'Active' }
              ])
            }
            return
          }
          setError('Backend unavailable. Please start the server at http://localhost:5000 or use the demo credentials.')
          return
        }
        setError(errorMessage.message)
      }
      return
    }

    if (!form.name || !form.password) {
      setError('Please fill in your full name and password.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: normalizedEmail, role: form.role, password: form.password })
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to create your account')
      }
      if (payload.user.token) {
        window.localStorage.setItem('ems-token', payload.user.token)
      }
      setUser({ id: payload.user.id, name: payload.user.name, email: payload.user.email, role: payload.user.role })
    } catch (errorMessage) {
      if (errorMessage.message === 'Failed to fetch') {
        const newUser = {
          id: Date.now(),
          name: form.name,
          email: normalizedEmail,
          role: form.role,
          password: form.password
        }
        demoUsers.push(newUser)
        setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role })
        if (newUser.role === 'employee') {
          setEmployees((current) => [
            ...current,
            { id: newUser.id, name: newUser.name, role: 'Employee', department: 'General', status: 'Active' }
          ])
        }
        return
      }
      setError(errorMessage.message)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('ems-user')
    window.localStorage.removeItem('ems-token')
    setUser(null)
    setForm({ name: '', email: '', password: '', role: 'employee' })
    setError('')
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage form={form} setForm={setForm} authMode={authMode} setAuthMode={setAuthMode} onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} error={error} googleEmail={googleEmail} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <GoogleModal 
          isOpen={showGoogleModal} 
          onClose={() => setShowGoogleModal(false)} 
          onSelectAccount={handleGoogleSelect} 
          demoUsers={demoUsers} 
        />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <AppLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<ProtectedRoute user={user}><DashboardPage user={user} dashboardData={dashboardData} liveActivity={liveActivity} socketConnected={socketConnected} /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage user={user} dashboardData={dashboardData} liveActivity={liveActivity} socketConnected={socketConnected} /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute user={user}><EmployeesPage employees={employees} API_BASE={API_BASE} triggerRefresh={loadData} /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute user={user}><AttendancePage attendance={attendance} user={user} API_BASE={API_BASE} triggerRefresh={loadData} /></ProtectedRoute>} />
          <Route path="/leave" element={<ProtectedRoute user={user}><LeavePage leaveData={leaveData} user={user} API_BASE={API_BASE} triggerRefresh={loadData} /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute user={user}><PayrollPage payroll={payroll} /></ProtectedRoute>} />
          <Route path="/recruitment" element={<ProtectedRoute user={user}><RecruitmentPage recruitment={recruitment} /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute user={user}><ProjectsPage projects={projects} user={user} API_BASE={API_BASE} triggerRefresh={loadData} /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute user={user}><ChatPage notifications={notifications} user={user} API_BASE={API_BASE} socket={socket} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute user={user}><SettingsPage user={user} /></ProtectedRoute>} />
          {/* Redirect /login and any unknown route to dashboard after login */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
