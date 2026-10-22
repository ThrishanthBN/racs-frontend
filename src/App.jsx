import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Activity, ArrowRight, ArrowUpRight, BadgeCheck, Bell, BriefcaseBusiness, Building2, CalendarDays,
  ChartNoAxesCombined, ChartPie, Check, ChevronsUpDown, ChevronDown, ChevronRight, CircleAlert, CircleCheck,
  CircleDashed, CircleX, ClipboardCheck, Clock3, CloudUpload, Code2, Copy, DatabaseZap, Download,
  Ellipsis, Eye, EyeOff, FileCheck2, FileText, FileType2, Files, Fingerprint, GitBranch, Heart, Info,
  KeyRound, LayoutDashboard, Link2, LockKeyhole, Mail, MailCheck, MapPin, Menu, MessageSquareText,
  MessagesSquare, Orbit, Palette, PartyPopper, Plus, RefreshCw, Save, Scale, ScanEye, Search, SearchX,
  Send, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Timer, Upload, UserPlus, UserRound,
  UsersRound, Wallet, Workflow, X, Zap,
} from 'lucide-react'
import { api, userIdByRole, workspaceId } from './api'
import { auditEvents, candidates as seedCandidates, jobs as seedJobs, navByRole, roles } from './data'

const iconComponents = {
  Activity, ArrowRight, ArrowUpRight, BadgeCheck, Bell, BriefcaseBusiness, Building2, CalendarDays,
  ChartNoAxesCombined, ChartPie, Check, ChevronsUpDown, ChevronDown, ChevronRight, CircleAlert, CircleCheck,
  CircleDashed, CircleX, ClipboardCheck, Clock3, CloudUpload, Code2, Copy, DatabaseZap, Download,
  Ellipsis, Eye, EyeOff, FileCheck2, FileText, FileType2, Files, Fingerprint, GitBranch, Heart, Info,
  KeyRound, LayoutDashboard, Link2, LockKeyhole, Mail, MailCheck, MapPin, Menu, MessageSquareText,
  MessagesSquare, Orbit, Palette, PartyPopper, Plus, RefreshCw, Save, Scale, ScanEye, Search, SearchX,
  Send, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Timer, Upload, UserPlus, UserRound,
  UsersRound, Wallet, Workflow, X, Zap,
}

const Icon = ({ name, size = 18, ...props }) => {
  const Component = iconComponents[name] || CircleCheck
  return <Component size={size} strokeWidth={1.8} aria-hidden="true" {...props} />
}

function Button({ children, icon, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {icon && <Icon name={icon} size={17} />}
      {children}
    </button>
  )
}

function Card({ children, className = '', ...props }) {
  return <section className={`card ${className}`} {...props}>{children}</section>
}

function SectionHeading({ title, detail, action }) {
  return <div className="section-heading"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div>
}

function Avatar({ initials, tone = 'lavender', small = false }) {
  return <span className={`avatar avatar-${tone}${small ? ' avatar-small' : ''}`}>{initials}</span>
}

function Badge({ children, tone = 'neutral', dot = false }) {
  return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>
}

function Metric({ label, value, change, icon, tone = 'indigo', footnote }) {
  return (
    <Card className="metric-card">
      <div className={`metric-icon metric-${tone}`}><Icon name={icon} size={19} /></div>
      <p className="metric-label">{label}</p>
      <div className="metric-value-row"><strong>{value}</strong>{change && <span className="metric-change"><Icon name="ArrowUpRight" size={14} />{change}</span>}</div>
      <p className="metric-footnote">{footnote || 'vs. previous 30 days'}</p>
    </Card>
  )
}

function Toast({ toast, onClose }) {
  if (!toast) return null
  return (
    <div className={`toast toast-${toast.tone}`} role="status" aria-live="polite">
      <Icon name={toast.tone === 'error' ? 'CircleAlert' : 'CircleCheck'} size={19} />
      <span>{toast.message}</span>
      <button className="icon-button toast-close" onClick={onClose} aria-label="Dismiss notification"><Icon name="X" size={16} /></button>
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState('ta')
  const [demoMode, setDemoMode] = useState(import.meta.env.VITE_USE_MOCK_DATA !== 'false')
  const [toast, setToast] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [candidateRows, setCandidateRows] = useState(seedCandidates)
  const [jobRows, setJobRows] = useState(seedJobs)

  useEffect(() => {
    const current = location.pathname.split('/')[1]
    if (roles[current]) setRole(current)
  }, [location.pathname])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const notify = (message, tone = 'success') => setToast({ message, tone })
  const act = async (label, request) => {
    if (demoMode) {
      notify(`${label} · Demo mode`)
      return { demo: true }
    }
    try {
      const result = await request()
      notify(`${label} completed`)
      return result
    } catch (error) {
      notify(`${label} failed: ${error.message}`, 'error')
      return null
    }
  }

  const switchRole = (nextRole) => {
    setRole(nextRole)
    setMobileNav(false)
    navigate(`/${nextRole}/dashboard`)
  }

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <aside className={`sidebar${mobileNav ? ' sidebar-open' : ''}`}>
        <Link to={`/${role}/dashboard`} className="brand-lockup" onClick={() => setMobileNav(false)}>
          <span className="brand-mark"><Icon name="Orbit" size={23} /></span>
          <span><strong>racs<span>ai</span></strong><small>HIRING, REIMAGINED</small></span>
        </Link>
        <div className="workspace-switch"><span className="workspace-logo">N</span><span className="workspace-copy"><strong>Northstar Labs</strong><small>Enterprise workspace</small></span><Icon name="ChevronsUpDown" size={16} /></div>
        <p className="nav-caption">WORKSPACE</p>
        <nav className="side-nav" aria-label="Workspace navigation">
          {navByRole[role].map(([path, label, icon]) => (
            <Link key={path} to={`/${role}/${path}`} onClick={() => setMobileNav(false)} className={`nav-link${location.pathname.endsWith(`/${path}`) ? ' nav-active' : ''}`}>
              <Icon name={icon} size={18} /><span>{label}</span>
              {path === 'audit' && role === 'hr' && <span className="nav-count">3</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="security-note"><Icon name="ShieldCheck" size={17} /><div><strong>SOC 2 Type II</strong><span>Workspace protected</span></div><span className="security-live" /></div>
          <button className="profile-button" onClick={() => notify('Profile settings are managed by your workspace administrator.', 'info')}>
            <Avatar initials={roles[role].initials} tone="blue" />
            <span className="profile-copy"><strong>{roles[role].name}</strong><small>{roles[role].short}</small></span>
            <Icon name="Ellipsis" size={19} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Icon name="Menu" /></button>
          <div className="breadcrumb"><span>Northstar Labs</span><Icon name="ChevronRight" size={14} /><strong>{navByRole[role].find(([path]) => location.pathname.endsWith(`/${path}`))?.[1] || 'Overview'}</strong></div>
          <div className="topbar-actions">
            <label className="mode-control"><span>{demoMode ? 'Demo data' : 'Live API'}</span><button className={`mode-switch${!demoMode ? ' mode-live' : ''}`} role="switch" aria-checked={!demoMode} aria-label="Toggle demo data and live API" onClick={() => setDemoMode(!demoMode)}><span /></button></label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You’re all caught up.', 'info')}><Icon name="Bell" size={19} /><span /></button>
            <span className="topbar-divider" />
            <label className="role-picker-label" htmlFor="role-picker">View as</label>
            <select id="role-picker" value={role} onChange={(event) => switchRole(event.target.value)} className="role-picker" aria-label="Switch active role">
              {Object.entries(roles).map(([key, value]) => <option value={key} key={key}>{value.label}</option>)}
            </select>
            <Avatar initials={roles[role].initials} tone="blue" small />
          </div>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/ta/dashboard" replace />} />
            <Route path="/:activeRole/:page" element={<WorkspacePage role={role} demoMode={demoMode} act={act} notify={notify} candidates={candidateRows} setCandidates={setCandidateRows} jobs={jobRows} setJobs={setJobRows} />} />
            <Route path="*" element={<Navigate to={`/${role}/dashboard`} replace />} />
          </Routes>
        </div>
      </main>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function WorkspacePage({ role, demoMode, act, notify, candidates, setCandidates, jobs, setJobs }) {
  const { activeRole, page } = useParams()
  const pageRole = roles[activeRole] ? activeRole : role
  const allowed = navByRole[pageRole].some(([slug]) => slug === page)
  if (!allowed) return <Navigate to={`/${pageRole}/dashboard`} replace />

  const common = { role: pageRole, demoMode, act, notify, candidates, setCandidates, jobs, setJobs }
  if (page === 'dashboard') return <Dashboard {...common} />
  if (role === 'ta' && page === 'requisitions') return <Requisitions {...common} />
  if (role === 'ta' && page === 'create-job') return <CreateJob {...common} />
  if (role === 'ta' && page === 'intake') return <ResumeIntake {...common} />
  if (page === 'pipeline') return <Pipeline {...common} />
  if (role === 'hm' && page === 'requisitions') return <HmRequisitions {...common} />
  if (role === 'hm' && page === 'scorecards') return <Scorecards {...common} />
  if (role === 'hm' && page === 'interviews') return <InterviewChecklistPage {...common} />
  if (role === 'hm' && page === 'handoff') return <Handoff {...common} />
  if (role === 'hr' && (page === 'approvals' || page === 'compensation')) return <OfferGovernance {...common} />
  if (page === 'audit') return <AuditDocket {...common} />
  if (page === 'analytics') return <Analytics {...common} />
  if (role === 'admin' && page === 'workspace') return <WorkspaceSettings {...common} />
  if (role === 'admin' && page === 'users') return <UserAccess {...common} />
  if (role === 'admin' && page === 'byok') return <ByokSettings {...common} />
  if (role === 'engagement' && (page === 'sequences' || page === 'preboarding')) return <Engagement {...common} preboarding={page === 'preboarding'} />
  return <Dashboard {...common} />
}

function mapJobRecord(job) {
  return {
    ...job,
    id: job.jobId,
    title: job.jobTitle,
    location: job.location || 'Location not specified',
    manager: job.createdBy?.fullName || 'Hiring manager',
    hires: 1,
    salary: job.compensationBand || 'Compensation not set',
    applicants: job.candidates?.length || 0,
    stage: job.status === 'Active' ? 'Actively sourcing' : job.status || 'Pending intake',
    score: job.scoringProfile || 'Role skills benchmark',
  }
}

function mapCandidateRecord(candidate) {
  const name = candidate.candidateName || 'Unnamed candidate'
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return {
    ...candidate,
    id: candidate.candidateId,
    name,
    initials,
    role: candidate.jobPosting?.jobTitle || 'Open requisition',
    score: candidate.aiEvaluation?.matchScorePercent || 0,
    stage: candidate.pipelineStatus || 'New Applied',
    location: candidate.location || 'Location not specified',
    skills: [],
    missing: [],
    source: candidate.source || 'Resume intake',
    lastActive: candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString() : 'Recently',
    jobId: candidate.jobPosting?.jobId,
  }
}

function PageTitle({ eyebrow, title, description, action }) {
  return <div className="page-title-row"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{action}</div>
}

function EmptyQueue({ title = 'No candidate records yet', detail = 'Load candidates from the connected workspace or switch back to demo data.' }) {
  return <Card className="empty-queue"><Icon name="UsersRound" size={25} /><strong>{title}</strong><span>{detail}</span></Card>
}

const dashboardMetrics = {
  admin: [['Active workspaces', '24', '+12.5%', 'Building2', 'indigo'], ['Platform availability', '99.98%', '+0.02%', 'Activity', 'green'], ['API calls this month', '2.4M', '+8.1%', 'Zap', 'cyan'], ['Security events', '0', 'All clear', 'ShieldCheck', 'green']],
  ta: [['Resumes ingested', '1,420', '+12.8%', 'Files', 'indigo'], ['AI match rate', '84.6%', '+4.2%', 'Sparkles', 'cyan'], ['Open requisitions', '18', '+2 roles', 'BriefcaseBusiness', 'violet'], ['Avg. time to shortlist', '4.2 days', '−0.8 days', 'Timer', 'green']],
  hm: [['Open requisitions', '06', '+1 this month', 'BriefcaseBusiness', 'indigo'], ['In evaluation', '24', '+8 candidates', 'UsersRound', 'cyan'], ['Average role match', '86%', '+3.4%', 'Sparkles', 'green'], ['SLA response time', '1.8 days', 'On target', 'Timer', 'violet']],
  hr: [['Committed base salaries', '$842k', 'Across 8 offers', 'Wallet', 'indigo'], ['Pay band alignment', '96%', '+2.1%', 'Scale', 'green'], ['Pending approvals', '03', 'Needs review', 'ClipboardCheck', 'violet'], ['Equity pool allocated', '18.4%', 'Within policy', 'ChartPie', 'cyan']],
  engagement: [['Candidates in sequence', '42', '+9 this week', 'UsersRound', 'indigo'], ['Messages delivered', '318', '+16.3%', 'Send', 'cyan'], ['Engagement rate', '74%', '+6.2%', 'Heart', 'green'], ['Pre-boarding ready', '08', '2 starting soon', 'PartyPopper', 'violet']],
}

function Dashboard({ role, notify, candidates, demoMode }) {
  const person = roles[role]
  const titles = {
    admin: ['Platform overview', 'Your workspace is secure, healthy, and ready to scale.'],
    ta: ['Good morning, Jordan', 'Here’s what’s happening across your hiring pipeline today.'],
    hm: ['Your hiring at a glance', 'Stay on top of open roles, candidate reviews, and your team’s next steps.'],
    hr: ['People operations overview', 'A clear view of offer approvals, pay alignment, and hiring governance.'],
    engagement: ['Candidate experience, in motion', 'Keep every candidate informed from offer acceptance to day one.'],
  }
  const data = dashboardMetrics[role]
  const shortcuts = {
    admin: [['Review security events', 'audit', 'ShieldCheck'], ['Manage your workspace', 'workspace', 'Settings2'], ['Configure AI key', 'byok', 'KeyRound']],
    ta: [['Create a new job', 'create-job', 'Plus'], ['Upload a resume batch', 'intake', 'Upload'], ['Review your pipeline', 'pipeline', 'GitBranch']],
    hm: [['Review candidate matches', 'scorecards', 'Sparkles'], ['Complete interview feedback', 'interviews', 'ClipboardCheck'], ['View HR handoffs', 'handoff', 'FileCheck2']],
    hr: [['Review pending offers', 'approvals', 'ClipboardCheck'], ['Check pay parity', 'compensation', 'Scale'], ['Open audit docket', 'audit', 'Fingerprint']],
    engagement: [['Edit email sequences', 'sequences', 'Mail'], ['Prepare new starters', 'preboarding', 'PartyPopper']],
  }
  const recent = role === 'admin' ? auditEvents : candidates.slice(0, 4)
  return <>
    <PageTitle eyebrow={`${person.team} · Tuesday, October 22`} title={titles[role][0]} description={titles[role][1]} action={<Button icon="Download" variant="secondary" onClick={() => notify('Your dashboard report is ready to export.')}>Export report</Button>} />
    <div className="metric-grid">{data.map(([label, value, change, icon, tone]) => <Metric key={label} {...{ label, value, change, icon, tone }} />)}</div>
    <div className="dashboard-grid">
      <Card className="pipeline-card">
        <div className="card-heading"><div><p className="eyebrow">LIVE OVERVIEW</p><h2>{role === 'admin' ? 'Platform health' : role === 'hr' ? 'Offer governance' : role === 'engagement' ? 'Engagement activity' : 'Hiring funnel'}</h2></div><Badge tone={demoMode ? 'info' : 'success'} dot>{demoMode ? 'Sample data' : 'Live data'}</Badge></div>
        {role === 'admin' ? <PlatformHealth /> : role === 'hr' ? <GovernanceBars /> : role === 'engagement' ? <EngagementBars /> : <FunnelChart />}
      </Card>
      <Card className="activity-card">
        <div className="card-heading"><div><p className="eyebrow">NEEDS YOUR ATTENTION</p><h2>Priority queue</h2></div><Badge tone="warning">{role === 'hr' ? '3 pending' : '4 items'}</Badge></div>
        <div className="priority-list">{recent.slice(0, 4).map((item, index) => {
          const name = role === 'admin' ? item.target : item.name
          const sub = role === 'admin' ? item.event : `${item.role} · ${item.score}% match`
          return <div className="priority-item" key={name}><Avatar initials={role === 'admin' ? ['AU', 'OP', 'TA'][index % 3] : item.initials} tone={['lavender', 'blue', 'peach', 'mint'][index]} small /><div className="priority-copy"><strong>{name}</strong><span>{sub}</span></div><Icon name="ChevronRight" size={17} className="muted-icon" /></div>
        })}</div>
        <Link to={`/${role}/${role === 'admin' ? 'audit' : role === 'hr' ? 'approvals' : role === 'engagement' ? 'sequences' : 'pipeline'}`} className="text-link">View all activity <Icon name="ArrowRight" size={15} /></Link>
      </Card>
    </div>
    <SectionHeading title="Quick actions" detail="Pick up where you left off." />
    <div className="quick-action-grid">{shortcuts[role].map(([label, path, icon]) => <Link to={`/${role}/${path}`} className="quick-action card" key={path}><span className="quick-icon"><Icon name={icon} /></span><strong>{label}</strong><Icon name="ArrowUpRight" size={17} className="quick-arrow" /></Link>)}</div>
  </>
}

function FunnelChart() {
  const stages = [['New applicants', 184, '100%', 'funnel-indigo'], ['AI screened', 142, '77%', 'funnel-purple'], ['HM review', 68, '54%', 'funnel-blue'], ['Interview', 32, '36%', 'funnel-cyan'], ['Offer', 12, '24%', 'funnel-green']]
  return <div className="funnel-chart">{stages.map(([label, count, pct, tone]) => <div className="funnel-row" key={label}><span>{label}</span><div className="funnel-track"><span className={tone} style={{ width: pct }} /></div><strong>{count}</strong></div>)}</div>
}

function PlatformHealth() {
  return <div className="platform-health"><div className="health-score"><span className="health-orbit"><Icon name="ShieldCheck" size={36} /></span><div><strong>All systems operational</strong><p>Last checked just now · 5 services healthy</p></div></div><div className="service-grid">{[['Candidate API', '99.99%'], ['AI evaluation', '99.97%'], ['Workspace DB', '100%'], ['Audit ledger', '100%']].map(([label, value]) => <div className="service-item" key={label}><span className="service-dot" /><span>{label}</span><strong>{value}</strong></div>)}</div></div>
}

function GovernanceBars() {
  return <div className="governance-bars">{[['Engineering approvals', 82, '19 / 23 approved'], ['Finance approvals', 68, '15 / 22 approved'], ['HR final review', 54, '12 / 22 approved']].map(([label, width, text]) => <div key={label} className="governance-row"><div><strong>{label}</strong><span>{text}</span></div><div className="progress-track"><span style={{ width: `${width}%` }} /></div></div>)}</div>
}

function EngagementBars() {
  return <div className="engagement-chart"><div className="engagement-legend"><span><i className="legend-dot legend-indigo" />Delivered</span><span><i className="legend-dot legend-cyan" />Opened</span></div><div className="week-bars">{[['Mon', 64, 42], ['Tue', 78, 51], ['Wed', 52, 38], ['Thu', 92, 60], ['Fri', 72, 46], ['Sat', 38, 22], ['Sun', 48, 31]].map(([day, first, second]) => <div className="week-day" key={day}><div className="bar-pair"><span style={{ height: `${first}%` }} /><span style={{ height: `${second}%` }} /></div><small>{day}</small></div>)}</div></div>
}

function Requisitions({ jobs, setJobs, act, notify }) {
  const refresh = async () => {
    const result = await act('Requisition retrieval', () => api.jobs(workspaceId))
    if (Array.isArray(result)) setJobs(result.map(mapJobRecord))
  }
  const [filter, setFilter] = useState('All roles')
  const filtered = filter === 'All roles' ? jobs : jobs.filter((job) => job.stage.toLowerCase().includes(filter.toLowerCase().split(' ')[0]))
  return <>
    <PageTitle eyebrow="TALENT ACQUISITION" title="Requisitions" description="Prioritize open roles, keep hiring managers aligned, and move sourcing forward." action={<div className="title-action-group"><Button icon="RefreshCw" variant="outline" onClick={refresh}>Refresh roles</Button><Button icon="Plus" onClick={() => notify('Choose “Create a job” from the sidebar to open a new requisition.')}>Log requisition</Button></div>} />
    <div className="filter-tabs">{['All roles', 'Pending intake', 'Actively sourcing', 'Shortlist in review'].map((value) => <button key={value} className={`filter-tab${filter === value ? ' filter-active' : ''}`} onClick={() => setFilter(value)}>{value}<span>{value === 'All roles' ? jobs.length : jobs.filter((job) => job.stage.toLowerCase().includes(value.toLowerCase().split(' ')[0])).length}</span></button>)}</div>
    <div className="requisition-grid">{filtered.map((job, index) => <Card className="requisition-card" key={job.id}>
      <div className="req-top"><Badge tone={index === 1 ? 'info' : 'success'} dot>{job.stage}</Badge><button className="icon-button" aria-label={`More actions for ${job.title}`} onClick={() => notify(`More options for ${job.title}`)}><Icon name="Ellipsis" /></button></div>
      <h2>{job.title}</h2><p className="req-department"><Icon name="Building2" size={15} />{job.department}<span>·</span><Icon name="MapPin" size={15} />{job.location}</p>
      <div className="req-manager"><Avatar initials={job.manager.split(' ').map((part) => part[0]).join('')} tone={index % 2 ? 'mint' : 'peach'} small /><div><small>HIRING MANAGER</small><strong>{job.manager}</strong></div></div>
      <div className="req-stats"><div><span>Target hires</span><strong>{job.hires} {job.hires === 1 ? 'hire' : 'hires'}</strong></div><div><span>Salary band</span><strong>{job.salary}</strong></div><div><span>Active candidates</span><strong>{job.applicants} in pipeline</strong></div></div>
      <div className="req-profile"><Icon name="Sparkles" size={16} /><span>AI scoring profile</span><strong>{job.score}</strong></div>
      <div className="req-actions"><Button variant="secondary" icon="Upload" onClick={() => notify(`Resume intake ready for ${job.title}.`)}>Attach batch</Button><Button variant="outline" icon="ArrowRight" onClick={() => notify(`Review queue opened for ${job.title}.`)}>Review role</Button></div>
    </Card>)}</div>
    <Card className="sla-card"><div className="sla-heading"><span className="quick-icon"><Icon name="Timer" /></span><div><h2>Sourcing SLA & integrations</h2><p>Keep candidate velocity and sync health in view.</p></div></div><div className="sla-metrics"><div><span>Avg. time to first batch</span><strong>3.8 <small>days</small></strong><Badge tone="success">−0.6 days</Badge></div><div className="ats-item"><span className="ats-logo ats-green">G</span><div><strong>Greenhouse</strong><small>Synced 4 min ago</small></div><Badge tone="success" dot>Connected</Badge></div><div className="ats-item"><span className="ats-logo ats-blue">in</span><div><strong>LinkedIn</strong><small>Synced 12 min ago</small></div><Badge tone="success" dot>Connected</Badge></div></div></Card>
  </>
}

function CreateJob({ act, jobs, setJobs }) {
  const [form, setForm] = useState({ jobTitle: '', department: '', minExperienceYears: '', requiredSkills: '', fullDescription: '', employmentType: 'Full-time' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const change = (key, value) => { setForm({ ...form, [key]: value }); setErrors({ ...errors, [key]: '' }) }
  const save = async (event) => {
    event.preventDefault()
    const next = {}
    if (!form.jobTitle.trim()) next.jobTitle = 'Add a job title to continue.'
    if (!form.department.trim()) next.department = 'Department is required.'
    if (!form.minExperienceYears || Number(form.minExperienceYears) < 0) next.minExperienceYears = 'Enter the minimum experience benchmark.'
    if (!form.requiredSkills.trim()) next.requiredSkills = 'Add at least one required skill.'
    if (!form.fullDescription.trim()) next.fullDescription = 'A role description is required.'
    setErrors(next)
    if (Object.keys(next).length) return
    const result = await act('Job creation', () => api.createJob({ ...form, minExperienceYears: Number(form.minExperienceYears) }, workspaceId, userIdByRole.ta))
    const newJob = { ...form, id: result?.jobId || `JOB-${Math.floor(2056 + Math.random() * 90)}`, title: form.jobTitle, manager: 'Sam Chen', hires: 1, salary: 'Set compensation band', applicants: 0, stage: 'Pending intake', score: 'Core skills profile', department: form.department }
    if (result) {
      setJobs([newJob, ...jobs])
      setSubmitted(true)
      setForm({ jobTitle: '', department: '', minExperienceYears: '', requiredSkills: '', fullDescription: '', employmentType: 'Full-time' })
    }
  }
  return <>
    <PageTitle eyebrow="TALENT ACQUISITION · JOB SETUP" title="Create a requisition" description="Set clear role benchmarks so candidate sourcing and AI screening start on the right foot." />
    {submitted && <div className="inline-success" role="status"><Icon name="CircleCheck" />Requisition created and added to your active roles.</div>}
    <form className="form-layout" onSubmit={save} noValidate>
      <Card className="form-card"><div className="form-section-title"><span className="step-number">01</span><div><h2>Role details</h2><p>Start with the essentials of this position.</p></div></div>
        <div className="form-grid"><Field label="Job title" required error={errors.jobTitle}><input value={form.jobTitle} onChange={(e) => change('jobTitle', e.target.value)} placeholder="e.g. Senior Product Designer" /></Field>
          <Field label="Department" required error={errors.department}><input value={form.department} onChange={(e) => change('department', e.target.value)} placeholder="e.g. Product & Design" /></Field>
          <Field label="Minimum experience (years)" required error={errors.minExperienceYears}><input type="number" min="0" value={form.minExperienceYears} onChange={(e) => change('minExperienceYears', e.target.value)} placeholder="e.g. 5" /></Field>
          <Field label="Employment type"><select value={form.employmentType} onChange={(e) => change('employmentType', e.target.value)}><option>Full-time</option><option>Contract</option><option>Part-time</option></select></Field>
          <Field label="Required skills" required full error={errors.requiredSkills}><input value={form.requiredSkills} onChange={(e) => change('requiredSkills', e.target.value)} placeholder="React, TypeScript, accessibility…" /><small>Separate skills with commas. These become explainable AI scorecard criteria.</small></Field>
          <Field label="Role description" required full error={errors.fullDescription}><textarea rows="5" value={form.fullDescription} onChange={(e) => change('fullDescription', e.target.value)} placeholder="Describe the role, responsibilities, and what success looks like…" /></Field>
        </div>
      </Card>
      <Card className="form-aside"><div className="aside-symbol"><Icon name="Sparkles" size={22} /></div><h3>Strong benchmarks, better matches</h3><p>Required skills and minimum experience power a transparent AI scorecard. Make the criteria specific and job-related.</p><div className="compliance-hint"><Icon name="ShieldCheck" size={17} />EEOC-aware screening · Human decisions stay human</div><Button icon="BriefcaseBusiness" type="submit" className="submit-job">Create requisition</Button></Card>
    </form>
  </>
}

function Field({ label, required, error, full, children }) {
  return <label className={`field${full ? ' field-full' : ''}${error ? ' field-error' : ''}`}><span>{label}{required && <i aria-hidden="true"> *</i>}</span>{children}{error && <small className="error-text" role="alert">{error}</small>}</label>
}

function ResumeIntake({ jobs, setJobs, demoMode, act, candidates, setCandidates }) {
  const [selectedJob, setSelectedJob] = useState(jobs[0]?.id || '')
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [inputKey, setInputKey] = useState(0)
  const selected = jobs.find((job) => job.id === selectedJob)
  const loadJobs = async () => {
    const result = await act('Requisition retrieval', () => api.jobs(workspaceId))
    if (Array.isArray(result)) {
      const records = result.map(mapJobRecord)
      setJobs(records)
      setSelectedJob(records[0]?.id || '')
    }
  }
  const acceptFiles = (fileList) => {
    setError('')
    const incoming = Array.from(fileList)
    const accepted = []
    const rejected = []
    for (const file of incoming) {
      const extensionOk = /\.(pdf|docx)$/i.test(file.name)
      if (!extensionOk) rejected.push(`${file.name}: use a PDF or DOCX file.`)
      else if (file.size > 5 * 1024 * 1024) rejected.push(`${file.name}: file exceeds the 5 MB limit.`)
      else accepted.push({ file, status: 'Ready to upload' })
    }
    if (files.length + accepted.length > 100) {
      setError('A batch can contain up to 100 files. Remove files before adding more.')
      return
    }
    if (rejected.length) setError(rejected.slice(0, 3).join(' '))
    if (accepted.length) setFiles((current) => [...current, ...accepted])
  }
  const startBatch = async () => {
    if (!selectedJob) { setError('Choose a requisition before submitting a batch.'); return }
    if (!files.length) { setError('Add at least one PDF or DOCX resume to the batch.'); return }
    setUploading(true)
    setFiles((current) => current.map((item) => ({ ...item, status: 'Parsing resume…' })))
    let processedFiles = files
    if (!demoMode) {
      const results = await Promise.all(files.map(({ file }) => api.uploadCandidate({
        candidateName: file.name.replace(/\.[^.]+$/, ''),
        originalFileUrl: file.name,
        fileType: file.name.split('.').pop().toUpperCase(),
        fileSizeKb: Math.ceil(file.size / 1024),
        processingStatus: 'Pending Parsing',
        pipelineStatus: 'New Applied',
      }, workspaceId, selectedJob, userIdByRole.ta).catch((requestError) => ({ error: requestError.message }))))
      const failures = results.filter((result) => result.error)
      if (failures.length) setError(`${failures.length} resume record(s) could not be sent: ${failures[0].error}`)
      processedFiles = files.filter((_, index) => !results[index].error)
    } else {
      await act('Resume batch submitted', async () => ({}))
    }
    setTimeout(() => {
      setFiles((current) => current.map((item, index) => ({ ...item, status: processedFiles.includes(files[index]) ? 'Queued for AI screening' : 'Upload failed' })))
      setUploading(false)
      if (!processedFiles.length) return
      const additions = processedFiles.map(({ file }, index) => ({ ...seedCandidates[0], id: `CAN-${Math.floor(9000 + Math.random() * 900) + index}`, name: file.name.replace(/\.[^.]+$/, ''), initials: file.name.slice(0, 2).toUpperCase(), role: selected?.title || 'New applicant', score: 0, stage: 'Parsing', source: 'Resume batch' }))
      setCandidates([...additions, ...candidates])
    }, 1000)
  }
  return <>
    <PageTitle eyebrow="TALENT ACQUISITION · CANDIDATE INGESTION" title="Resume intake" description="Route a batch to an open requisition. Each file is validated before it enters the AI screening queue." />
    <div className="intake-layout">
      <div className="intake-main">
        <Card className="intake-job-card"><div className="section-heading"><div><h2>01 · Choose a requisition</h2><p>Every resume is attached to one active role.</p></div><div className="title-action-group"><Badge tone="info">{jobs.length} open roles</Badge><Button variant="outline" icon="RefreshCw" onClick={loadJobs}>Load roles</Button></div></div><Field label="Active requisition" required><select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title} · {job.id}</option>)}</select></Field>{selected && <div className="selected-job"><span className="quick-icon"><Icon name="BriefcaseBusiness" /></span><div><strong>{selected.title}</strong><span>{selected.department} · {selected.applicants} candidates in pipeline</span></div><Badge tone="success" dot>Active</Badge></div>}</Card>
        <Card className="upload-card"><div className="section-heading"><div><h2>02 · Add resume files</h2><p>Bulk upload up to 100 resumes in one batch.</p></div></div>
          <div className={`dropzone${dragging ? ' dropzone-active' : ''}`} onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFiles(e.dataTransfer.files) }}>
            <input key={inputKey} id="resume-files" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" multiple onChange={(e) => { acceptFiles(e.target.files); setInputKey(inputKey + 1) }} aria-label="Choose resume files" />
            <span className="upload-symbol"><Icon name="CloudUpload" size={25} /></span><strong>Drop resumes here, or <label htmlFor="resume-files" className="upload-browse">browse files</label></strong><p>PDF or DOCX · Up to 5 MB per file · 100 files per batch</p><div className="file-trust"><Icon name="ShieldCheck" size={15} />Files are tenant-isolated and excluded from model training</div>
          </div>
          {error && <p className="error-banner" role="alert"><Icon name="CircleAlert" size={17} />{error}</p>}
          {files.length > 0 && <div className="file-list"><div className="file-list-head"><strong>{files.length} files in this batch</strong><button className="text-link" onClick={() => setFiles([])} disabled={uploading}>Remove all</button></div>{files.map(({ file, status }, index) => <div className="file-row" key={`${file.name}-${index}`}><span className="file-icon"><Icon name={file.name.endsWith('.pdf') ? 'FileText' : 'FileType2'} /></span><div className="file-name"><strong>{file.name}</strong><span>{(file.size / 1024).toFixed(0)} KB</span></div><Badge tone={status.includes('Queued') ? 'success' : status.includes('Parsing') ? 'info' : 'neutral'}>{status}</Badge><button className="icon-button" onClick={() => setFiles(files.filter((_, fileIndex) => fileIndex !== index))} disabled={uploading} aria-label={`Remove ${file.name}`}><Icon name="X" size={16} /></button></div>)}</div>}
          <div className="upload-footer"><span><Icon name="Info" size={16} />AI scoring starts after secure extraction.</span><Button icon="Upload" onClick={startBatch} disabled={uploading || !files.length}>{uploading ? 'Processing batch…' : 'Submit batch'}</Button></div>
        </Card>
      </div>
      <Card className="batch-aside"><div className="aside-icon-cyan"><Icon name="Workflow" /></div><h3>Batch processing stream</h3><p>Follow each resume from secure upload through AI scoring and into the candidate pipeline.</p><div className="batch-steps">{[['1', 'Resume received', 'File type and size verified'], ['2', 'Text extraction', 'OCR and resume parsing'], ['3', 'Skill matching', 'Compared against role benchmarks'], ['4', 'Review queue', 'Ready for hiring manager']].map(([n, title, copy], index) => <div className="batch-step" key={title}><span className={`step-dot${index < 2 ? ' step-complete' : ''}`}>{index < 2 ? <Icon name="Check" size={13} /> : n}</span><div><strong>{title}</strong><span>{copy}</span></div></div>)}</div><div className="batch-privacy"><Icon name="LockKeyhole" size={16} />Zero-data retention policy active</div></Card>
    </div>
  </>
}

function Pipeline({ candidates, setCandidates, setJobs, act }) {
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('All candidates')
  const rows = candidates.filter((candidate) => candidate.name.toLowerCase().includes(search.toLowerCase()) && (stage === 'All candidates' || candidate.stage.toLowerCase() === stage.toLowerCase()))
  const loadPipeline = async () => {
    const result = await act('Candidate pipeline retrieval', async () => {
      const records = await api.jobs(workspaceId)
      const candidateBatches = await Promise.all(records.map((job) => api.candidatesForJob(job.jobId, workspaceId)))
      return { jobs: records, candidates: candidateBatches.flat() }
    })
    if (result?.candidates) {
      setJobs(result.jobs.map(mapJobRecord))
      setCandidates(result.candidates.map(mapCandidateRecord))
    }
  }
  const stages = ['New Applied', 'Parsing', 'Sourcing', 'AI Scored', 'Shortlisted', 'HM review', 'Interview', 'HR approval', 'Offer Accepted']
  const move = async (candidate, nextStatus) => {
    const result = await act(`Move ${candidate.name} to ${nextStatus}`, () => api.updatePipeline(candidate.id, workspaceId, userIdByRole.ta, nextStatus))
    if (result) setCandidates((items) => items.map((item) => item.id === candidate.id ? { ...item, stage: nextStatus } : item))
  }
  return <>
    <PageTitle eyebrow="TALENT ACQUISITION · PIPELINE" title="Candidate pipeline" description="Scan candidates at every stage, compare explainable match scores, and keep handoffs moving." action={<div className="title-action-group"><Button icon="RefreshCw" variant="outline" onClick={loadPipeline}>Load pipeline</Button><Button icon="Download" variant="secondary" onClick={() => act('Pipeline export', () => api.exportAnalytics(workspaceId, userIdByRole.ta, { startDate: '2026-09-22', endDate: '2026-10-22', exportFormat: 'CSV' }))}>Export CSV</Button></div>} />
    <div className="pipeline-summary"><div><span>All candidates</span><strong>{candidates.length}</strong></div><div><span>Average AI match</span><strong>82%</strong></div><div><span>Needs review</span><strong>08</strong></div><div><span>Pipeline velocity</span><strong>4.2 <small>days</small></strong></div></div>
    <Card className="pipeline-table-card"><div className="table-toolbar"><div className="filter-tabs">{['All candidates', 'HM review', 'Interview', 'HR approval'].map((value) => <button key={value} className={`filter-tab${stage === value ? ' filter-active' : ''}`} onClick={() => setStage(value)}>{value}</button>)}</div><label className="search-field"><Icon name="Search" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates" aria-label="Search candidates" /></label></div><div className="table-scroll"><table><thead><tr><th>Candidate</th><th>Role</th><th>AI match</th><th>Pipeline stage</th><th>Source</th><th>Last active</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{rows.map((candidate, index) => <tr key={candidate.id}><td><div className="candidate-cell"><Avatar initials={candidate.initials} tone={['lavender', 'peach', 'mint', 'blue'][index % 4]} small /><div><strong>{candidate.name}</strong><span>{candidate.id}</span></div></div></td><td>{candidate.role}</td><td><div className="match-cell"><strong>{candidate.score ? `${candidate.score}%` : 'Pending'}</strong><div className="mini-progress"><span style={{ width: `${candidate.score}%` }} /></div></div></td><td><Badge tone={candidate.stage === 'HR approval' ? 'success' : candidate.stage === 'Parsing' ? 'info' : 'neutral'} dot>{candidate.stage}</Badge></td><td>{candidate.source}</td><td>{candidate.lastActive}</td><td><select className="stage-select" value={candidate.stage} onChange={(e) => move(candidate, e.target.value)} aria-label={`Change stage for ${candidate.name}`}>{stages.map((item) => <option key={item}>{item}</option>)}</select></td></tr>)}</tbody></table>{rows.length === 0 && <div className="empty-state"><Icon name="SearchX" size={27} /><strong>No candidates match those filters</strong><button className="text-link" onClick={() => { setSearch(''); setStage('All candidates') }}>Clear filters</button></div>}</div><div className="table-footer"><span>Showing {rows.length} of {candidates.length} candidates</span><span>Updated just now</span></div></Card>
  </>
}

function HmRequisitions({ jobs, setJobs, act }) {
  const refreshJobs = async () => {
    const result = await act('Requisition retrieval', () => api.jobs(workspaceId))
    if (Array.isArray(result)) setJobs(result.map(mapJobRecord))
  }
  return <>
    <PageTitle eyebrow="HIRING MANAGER · DEPARTMENT PORTFOLIO" title="My requisitions" description="Review role specs and candidate intake progress. Job criteria are read-only after approval." action={<div className="title-action-group"><Badge tone="info"><Icon name="LockKeyhole" size={14} />Read-only job specs</Badge><Button variant="outline" icon="RefreshCw" onClick={refreshJobs}>Refresh roles</Button></div>} />
    <div className="metric-grid">{[['Open roles', '06', '2 in active sourcing', 'BriefcaseBusiness', 'indigo'], ['In evaluation', '24', 'Across your team', 'UsersRound', 'cyan'], ['Average role match', '86%', '+3.4% this month', 'Sparkles', 'green'], ['SLA response time', '1.8 days', 'Target: under 2 days', 'Timer', 'violet']].map(([label, value, change, icon, tone]) => <Metric key={label} {...{ label, value, change, icon, tone }} />)}</div>
    <SectionHeading title="Active requisitions" detail="Candidate batches and role-specific AI ingestion progress." />
    <div className="hm-job-grid">{jobs.map((job, index) => <Card className="hm-job-card" key={job.id}><div className="hm-job-head"><div className="job-icon"><Icon name={index % 2 ? 'Palette' : 'Code2'} /></div><Badge tone="success" dot>{job.stage}</Badge></div><h2>{job.title}</h2><p>{job.department} · {job.location}</p><div className="job-specs"><div><span>Compensation band</span><strong>{job.salary}</strong></div><div><span>Target headcount</span><strong>{job.hires} {job.hires === 1 ? 'hire' : 'hires'}</strong></div></div><div className="read-only-note"><Icon name="LockKeyhole" size={14} />Approved job specification · read-only</div><div className="ingestion-title"><span>Active ingestion funnel</span><strong>{job.applicants} candidates</strong></div><div className="mini-progress ingestion-progress"><span style={{ width: `${Math.max(18, 92 - index * 20)}%` }} /></div><div className="funnel-labels"><span>AI parsed</span><span>HM review</span><span>Interview</span></div><Button variant="secondary" icon="Eye" className="full-width-button">Review batch</Button></Card>)}</div>
    <Card className="collaboration-card"><span className="quick-icon"><Icon name="MessagesSquare" /></span><div><h2>Updates from your talent partner</h2><p>“The first resume batch for Senior React Engineer is ready to review. 12 candidates scored above the 80% match threshold.”</p><span className="collab-by">Jordan Miller · 18 minutes ago</span></div><div className="response-sla"><strong>1.8 days</strong><span>Your avg. response time</span><Badge tone="success">On track</Badge></div></Card>
  </>
}

function Scorecards({ candidates, notify, act, demoMode }) {
  const [selectedId, setSelectedId] = useState(candidates[0]?.id)
  const [scoreOverride, setScoreOverride] = useState(null)
  const selected = candidates.find((candidate) => candidate.id === selectedId) || candidates[0]
  const score = selected ? scoreOverride ?? selected.score : 0
  const refreshScorecard = async () => {
    if (!selected) return
    const result = await act('AI scorecard retrieval', () => api.scorecard(selected.id, workspaceId))
    if (Number.isFinite(result?.matchScorePercent)) setScoreOverride(result.matchScorePercent)
  }
  if (!selected) return <EmptyQueue title="No scorecards are available" detail="Load the candidate pipeline after connecting your workspace." />
  return <>
    <PageTitle eyebrow="HIRING MANAGER · AI-ASSISTED REVIEW" title="Candidate reviews" description="Understand why each candidate matches. Scores and model recommendations are immutable." action={<div className="title-action-group"><Badge tone="info"><Icon name="LockKeyhole" size={14} />AI score · read-only</Badge><Button variant="outline" icon="RefreshCw" onClick={refreshScorecard}>Refresh scorecard</Button></div>} />
    <div className="scorecard-layout"><Card className="review-queue"><div className="queue-heading"><h2>Review queue</h2><Badge tone="neutral">{candidates.length} candidates</Badge></div><div className="queue-sla"><Icon name="Timer" size={16} />Average review time <strong>1.8 days</strong></div>{candidates.map((candidate, index) => <button className={`queue-candidate${selected.id === candidate.id ? ' queue-selected' : ''}`} key={candidate.id} onClick={() => setSelectedId(candidate.id)}><Avatar initials={candidate.initials} tone={['lavender', 'peach', 'mint', 'blue'][index % 4]} small /><span className="queue-candidate-copy"><strong>{candidate.name}</strong><span>{candidate.role}</span></span><strong className="queue-score">{candidate.score}%</strong></button>)}</Card>
      <div className="score-detail"><Card className="candidate-dossier"><div className="dossier-header"><Avatar initials={selected.initials} tone="lavender" /><div><h2>{selected.name}</h2><p>{selected.role} · {selected.location}</p></div><Badge tone="info" dot>HM review</Badge><button className="icon-button" aria-label="More candidate actions" onClick={() => notify('Candidate actions are available from the pipeline.') }><Icon name="Ellipsis" /></button></div><div className="dossier-tags"><span><Icon name="MapPin" size={14} />{selected.location}</span><span><Icon name="BriefcaseBusiness" size={14} />5 years experience</span><span><Icon name="Link2" size={14} />{selected.source}</span></div><div className="summary-box"><div className="summary-title"><Icon name="Sparkles" size={17} /><strong>AI-synthesized executive summary</strong><Badge tone="success">Explainable</Badge></div><p>{selected.name.split(' ')[0]} brings strong hands-on experience in React and TypeScript, with a track record of building accessible component systems. Their profile aligns closely with the core requirements for this role.</p></div></Card>
      <Card className="fit-card"><div className="fit-header"><div><p className="eyebrow">EXPLAINABLE AI SCORECARD</p><h2>Role fit analysis</h2></div><span className="read-only-chip"><Icon name="LockKeyhole" size={14} />Locked</span></div><div className="fit-content"><div className="fit-ring" style={{ '--score': `${score * 3.6}deg` }}><div><strong>{score}%</strong><span>role match</span></div></div><div className="competency-list">{[['Core technical proficiency', score - 3], ['Architecture & distributed scale', score - 12], ['Framework recency', Math.min(98, score + 2)]].map(([name, value]) => <div className="competency-row" key={name}><div><span>{name}</span><strong>{value}%</strong></div><div className="progress-track"><span style={{ width: `${value}%` }} /></div></div>)}</div></div><div className="skills-grid"><div className="skill-group skill-matched"><h3><Icon name="CircleCheck" size={17} />Matched skills</h3>{selected.skills.map((skill) => <Badge tone="success" key={skill}>{skill}</Badge>)}</div><div className="skill-group skill-missing"><h3><Icon name="CircleX" size={17} />Areas to explore</h3>{selected.missing.map((skill) => <Badge tone="danger" key={skill}>{skill}</Badge>)}</div></div><div className="ai-rationale"><strong>Match rationale</strong><p>Strong evidence for role-critical frontend delivery, type safety, and accessible UI. Explore distributed architecture depth in the technical interview; this gap is not a disqualifying signal.</p></div><div className="score-actions"><Button variant="outline" icon="ClipboardCheck" onClick={() => notify('Interview checklist opened.')}>Interview checklist</Button><Button icon="ArrowRight" onClick={async () => { const notes = `Recommend ${selected.name} for next-stage review.`; const result = await act('Candidate recommended for HR review', () => api.createHandoff(selected.id, selected.jobId || 'job-react-2048', userIdByRole.hm, workspaceId, notes)); if (result && result.reportId) { localStorage.setItem(`racs.handoff.${selected.id}.reportId`, result.reportId); localStorage.setItem(`racs.handoff.${selected.id}.sealed`, 'true') } else if (result && demoMode) { sessionStorage.setItem(`racs.handoff.${selected.id}.notes`, notes); sessionStorage.setItem(`racs.handoff.${selected.id}.sealed`, 'true') } }}>Recommend to HR</Button></div></Card>
      <Card className="debrief-card"><div className="card-heading"><div><p className="eyebrow">STRUCTURED INTERVIEW FEEDBACK</p><h2>Interview debrief</h2></div><Badge tone="success">Strong hire</Badge></div><div className="debrief-scores">{[['Live coding', 4.5], ['System architecture', 4.1], ['Communication', 4.7]].map(([label, score]) => <div key={label}><span>{label}</span><strong>{score}<small> / 5</small></strong></div>)}</div><details className="transcript-details"><summary><span><Icon name="MessageSquareText" size={17} />Timestamped interviewer notes</span><Icon name="ChevronDown" size={16} /></summary><blockquote>“Explained trade-offs clearly and identified an accessibility edge case before it was raised.”<cite>10:24 AM · Morgan Lee, Engineering</cite></blockquote></details></Card>
      </div>
    </div>
  </>
}

function InterviewChecklistPage({ candidates, act, demoMode, notify }) {
  const candidate = candidates[0]
  const defaultQuestions = ['How would you approach rendering performance for a large, virtualized React table?', 'Describe a time you influenced an architectural decision across teams.', 'What accessibility checks do you include in your component delivery workflow?']
  const [questions, setQuestions] = useState(defaultQuestions.map((questionText) => ({ questionId: null, questionText })))
  const [answers, setAnswers] = useState({})
  const [notes, setNotes] = useState({})
  const loadChecklist = async () => {
    const result = await act('Interview checklist retrieval', () => api.checklist(candidate.id, workspaceId))
    if (Array.isArray(result)) {
      setQuestions(result.map((question) => ({ questionId: question.questionId, questionText: question.questionText })))
      setAnswers(Object.fromEntries(result.map((question, index) => [index, question.isPassed ?? null])))
    }
  }
  const generateChecklist = async () => {
    const result = await act('Interview checklist generation', () => api.generateChecklist(candidate.id, candidate.jobId || 'job-react-2048', userIdByRole.hm, workspaceId, defaultQuestions))
    if (result) {
      const records = Array.isArray(result) ? result : result.questions || []
      if (records.length) {
        setQuestions(records.map((question) => ({ questionId: question.questionId, questionText: question.questionText })))
        setAnswers(Object.fromEntries(records.map((question, index) => [index, question.isPassed ?? null])))
      }
    }
  }
  const setAnswer = async (question, index, value) => {
    if (!demoMode && !question.questionId) {
      notify('Load or generate this candidate’s checklist before saving a grade.', 'error')
      return
    }
    const result = await act('Interview feedback saved', () => api.gradeQuestion(question.questionId, workspaceId, value))
    if (result) setAnswers({ ...answers, [index]: value })
  }
  if (!candidate) return <EmptyQueue title="No candidate is ready for interview" />
  return <>
    <PageTitle eyebrow="HIRING MANAGER · INTERVIEW" title="Interview checklist" description="Capture structured, job-related feedback. Each answer is tied to its question and candidate record." action={<div className="title-action-group"><Button icon="RefreshCw" variant="outline" onClick={loadChecklist}>Load saved checklist</Button><Button icon="Sparkles" variant="secondary" onClick={generateChecklist}>Generate checklist</Button></div>} />
    <div className="interview-layout"><Card className="interview-candidate"><Avatar initials={candidate.initials} tone="lavender" /><p className="eyebrow">TECHNICAL INTERVIEW</p><h2>{candidate.name}</h2><p>{candidate.role}</p><div className="interview-meta"><span><Icon name="CalendarDays" size={16} />Today · 10:00 AM</span><span><Icon name="Clock3" size={16} />45 minutes</span><span><Icon name="UserRound" size={16} />Interviewer: Morgan Lee</span></div><div className="interview-match"><span>AI role match</span><strong>{candidate.score}%</strong><div className="mini-progress"><span style={{ width: `${candidate.score}%` }} /></div></div><div className="interview-policy"><Icon name="ShieldCheck" size={17} /><span>Evaluate consistently against role-specific criteria. Do not record protected characteristics.</span></div></Card><div className="questions-panel"><div className="card-heading"><div><p className="eyebrow">GENERATED FOR SENIOR REACT ENGINEER</p><h2>Technical evaluation</h2></div><Badge tone="neutral">{questions.length} questions</Badge></div>{questions.map((question, index) => <Card className="question-card" key={question.questionId || `question-${index}`}><div className="question-number">0{index + 1}</div><div className="question-content"><p>{question.questionText}</p><label className="field"><span>Interviewer notes <small>(local draft; backend stores grades only)</small></span><textarea rows="2" placeholder="Capture evidence and examples…" value={notes[index] || ''} onChange={(e) => setNotes({ ...notes, [index]: e.target.value })} /></label><div className="grade-row"><span>Assessment</span><div className="grade-buttons"><button className={answers[index] === true ? 'grade-selected grade-pass' : ''} onClick={() => setAnswer(question, index, true)}><Icon name="CircleCheck" size={16} />Meets criteria</button><button className={answers[index] === false ? 'grade-selected grade-fail' : ''} onClick={() => setAnswer(question, index, false)}><Icon name="CircleX" size={16} />Needs follow-up</button></div></div></div></Card>)}</div></div>
  </>
}

function Handoff({ candidates, act, notify, demoMode }) {
  const candidate = candidates.find((item) => item.stage === 'HM review') || candidates[0]
  const lockKey = `racs.handoff.${candidate.id}`
  const defaultNotes = 'Strong technical alignment with our role requirements. Recommend proceeding based on demonstrated React architecture and accessibility experience.'
  const [submitted, setSubmitted] = useState(() => (demoMode ? sessionStorage : localStorage).getItem(`${lockKey}.sealed`) === 'true')
  const [notes, setNotes] = useState(() => demoMode ? sessionStorage.getItem(`${lockKey}.notes`) || defaultNotes : defaultNotes)
  const submit = async () => {
    const result = await act('Immutable HR handoff', () => api.createHandoff(candidate.id, candidate.jobId || 'job-react-2048', userIdByRole.hm, workspaceId, notes))
    if (result) {
      if (result.reportId) localStorage.setItem(`${lockKey}.reportId`, result.reportId)
      ;(demoMode ? sessionStorage : localStorage).setItem(`${lockKey}.sealed`, 'true')
      if (demoMode) sessionStorage.setItem(`${lockKey}.notes`, notes)
      setSubmitted(true)
      notify('Handoff sealed. The HR record is now read-only.')
    }
  }
  const loadExisting = async () => {
    if (demoMode) {
      const savedNotes = sessionStorage.getItem(`${lockKey}.notes`)
      if (savedNotes) { setNotes(savedNotes); setSubmitted(true); notify('Demo handoff loaded and locked.') }
      else notify('No submitted handoff exists for this candidate yet.', 'info')
      return
    }
    const result = await act('Sealed handoff retrieval', () => api.handoffSummary(candidate.id, workspaceId))
    if (result?.finalHmNotes) {
      setNotes(result.finalHmNotes)
      setSubmitted(true)
      localStorage.setItem(`${lockKey}.sealed`, 'true')
    }
  }
  if (!candidate) return <EmptyQueue title="No candidate is ready for HR handoff" />
  return <>
    <PageTitle eyebrow="HIRING MANAGER · FORMAL RECOMMENDATION" title="HR handoff" description="Confirm your final recommendation. Once submitted, notes are sealed and cannot be edited." action={<Badge tone="success"><Icon name="LockKeyhole" size={14} />Immutable record</Badge>} />
    <div className="handoff-layout"><Card className="handoff-candidate"><Avatar initials={candidate.initials} tone="lavender" /><p className="eyebrow">CANDIDATE SUMMARY</p><h2>{candidate.name}</h2><p>{candidate.role}</p><div className="handoff-score"><div className="fit-ring fit-ring-small" style={{ '--score': `${candidate.score * 3.6}deg` }}><div><strong>{candidate.score}%</strong><span>role match</span></div></div><span>Explainable AI fit score<br /><Badge tone="info">Read-only</Badge></span></div><div className="audit-checks">{[['EEO-1 token masking', true], ['Salary band verified', true], ['References reviewed', true], ['Interview checklist complete', false]].map(([label, complete]) => <div key={label}><Icon name={complete ? 'CircleCheck' : 'CircleDashed'} size={17} className={complete ? 'text-green' : 'text-amber'} /><span>{label}</span><Badge tone={complete ? 'success' : 'warning'}>{complete ? 'Verified' : 'In progress'}</Badge></div>)}</div></Card><Card className="handoff-record"><div className="sealed-banner"><span><Icon name="Fingerprint" size={20} /></span><div><strong>Cryptographically sealed handoff</strong><p>This recommendation becomes immutable when submitted to HR.</p></div><Badge tone={submitted ? 'success' : 'warning'} dot>{submitted ? 'Verified' : 'Draft'}</Badge></div><Field label="Hiring Manager Formal Recommendation Notes" required><textarea className="locked-textarea" rows="6" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={submitted} readOnly={submitted} aria-describedby="immutability-hint" /></Field><div id="immutability-hint" className="immutable-hint"><Icon name="LockKeyhole" size={15} />{submitted ? 'Read-only · submitted recommendation cannot be changed or overwritten.' : 'You can review these notes before submitting. After submission they are permanently locked.'}</div><div className="hash-block"><div><Icon name="Fingerprint" size={17} /><span>SHA-256 audit signature</span></div><code>8e4a7f3c9d21b06a…f19d</code></div><div className="handoff-footer"><span><Icon name="ShieldCheck" size={16} />SOC 2 compliant audit trail</span><div>{submitted ? <Button variant="secondary" icon="Check" disabled>Recommendation submitted</Button> : <Button icon="LockKeyhole" onClick={submit}>Submit immutable handoff</Button>}</div></div><Button variant="outline" icon="RefreshCw" className="load-handoff" onClick={loadExisting}>{submitted ? 'Refresh sealed handoff' : 'Load existing sealed handoff'}</Button></Card></div>
  </>
}

function OfferGovernance({ candidates, demoMode, act, notify }) {
  const defaultIndex = Math.max(0, candidates.findIndex((item) => item.stage === 'HR approval'))
  const [candidateIndex, setCandidateIndex] = useState(defaultIndex)
  const [salary, setSalary] = useState(78)
  const [policy, setPolicy] = useState(false)
  const [notice, setNotice] = useState('')
  const candidate = candidates[candidateIndex % candidates.length]
  const lockKey = `racs.handoff.${candidate.id}`
  const [handoffNotes, setHandoffNotes] = useState('No Hiring Manager recommendation has been loaded for this candidate.')
  const authorize = async () => {
    if (!policy) { setNotice('Confirm the policy attestation before authorizing this offer.'); return }
    const reportId = demoMode ? candidate.id : localStorage.getItem(`${lockKey}.reportId`)
    if (!reportId) { setNotice('Load an existing sealed handoff before processing this offer.'); return }
    const result = await act('Offer authorization', () => api.processOffer(reportId, workspaceId))
    if (result) {
      setNotice('')
      notify(`Offer authorization recorded for ${candidate.name}.`)
    }
  }
  const loadHandoff = async () => {
    if (demoMode) {
      const savedNotes = sessionStorage.getItem(`${lockKey}.notes`)
      if (savedNotes) setHandoffNotes(savedNotes)
      else notify('No submitted handoff exists for this candidate yet.', 'info')
      return
    }
    const result = await act('Sealed handoff retrieval', () => api.handoffSummary(candidate.id, workspaceId))
    if (result?.finalHmNotes) {
      setHandoffNotes(result.finalHmNotes)
      localStorage.setItem(`${lockKey}.sealed`, 'true')
    }
  }
  if (!candidate) return <EmptyQueue title="No offers are ready for review" />
  return <>
    <PageTitle eyebrow="HR REPRESENTATIVE · OFFER GOVERNANCE" title="Offer approvals" description="Review compensation packages, verify pay parity, and record final approval with a cryptographic audit docket." action={<Badge tone="success" dot>Compliance controls active</Badge>} />
    <div className="metric-grid">{[['Committed base salaries', '$842k', '8 offers in review', 'Wallet', 'indigo'], ['Equity pool dilution', '18.4%', 'Within policy limits', 'ChartPie', 'cyan'], ['Pay band alignment', '96%', 'Across all regions', 'Scale', 'green'], ['Pending approvals', '03', 'Requires HR review', 'ClipboardCheck', 'violet']].map(([label, value, change, icon, tone]) => <Metric key={label} {...{ label, value, change, icon, tone }} />)}</div>
    <div className="offer-layout"><Card className="approval-queue"><div className="card-heading"><div><p className="eyebrow">PRIORITY QUEUE</p><h2>Pending HM approvals</h2></div><Badge tone="warning">3 pending</Badge></div>{candidates.slice(0, 4).map((item, index) => <button key={item.id} className={`approval-person${item.id === candidate.id ? ' approval-selected' : ''}`} onClick={() => setCandidateIndex(index)}><Avatar initials={item.initials} tone={['lavender', 'mint', 'peach', 'blue'][index]} small /><span><strong>{item.name}</strong><small>{item.role}</small></span><span className="approval-person-right"><strong>{item.score}%</strong><Badge tone={item.stage === 'HR approval' ? 'success' : 'warning'}>{item.stage === 'HR approval' ? 'Ready for HR' : 'Comp review'}</Badge></span></button>)}</Card>
      <Card className="compensation-card"><div className="card-heading"><div><p className="eyebrow">COMPENSATION GOVERNANCE</p><h2>Offer for {candidate.name}</h2><p>{candidate.role} · {candidate.location}</p></div><Badge tone="success" dot>Parity verified</Badge></div><div className="comp-table">{[['Base salary', '$188,000', '76th percentile'], ['Equity grant', '18,000 RSUs', '4-year vesting'], ['Sign-on bonus', '$15,000', 'One-time'], ['Year 1 target', '$237,500', 'Total compensation']].map(([label, value, meta]) => <div className="comp-row" key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></div>)}</div><div className="parity-box"><div className="parity-heading"><div><h3>Regional pay band</h3><p>California · CA SB 1162 compliant</p></div><Badge tone="success"><Icon name="CircleCheck" size={14} />Within range</Badge></div><div className="range-labels"><span>Min $165k</span><span>Median $192k</span><span>Max $220k</span></div><div className="range-track"><span className="range-low" /><span className="range-marker" style={{ left: `${salary}%` }}><span>$188k</span></span></div><label className="range-control"><span>Offer percentile</span><input type="range" min="0" max="100" value={salary} onChange={(e) => setSalary(Number(e.target.value))} aria-label="Offer position in salary band" /><strong>{salary}th</strong></label><p className="range-footnote"><Icon name="Info" size={14} />Offer is positioned within the approved regional compensation band.</p></div><div className="approval-chain"><h3>Authorization matrix</h3><div className="approval-steps">{[['Engineering', true], ['Finance', true], ['HR', false]].map(([name, complete]) => <div key={name}><span className={`approval-check${complete ? ' approval-done' : ''}`}>{complete && <Icon name="Check" size={13} />}</span><strong>{name}</strong><span>{complete ? 'Approved' : 'Your approval'}</span></div>)}</div></div><label className="policy-check"><input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} /><span>I confirm this offer complies with compensation, pay equity, and regional disclosure policies.</span></label>{notice && <p className="error-text" role="alert">{notice}</p>}<div className="offer-actions"><Button variant="outline" icon="MessageSquareText" onClick={() => notify('Compliance information request sent to the hiring manager.', 'info')}>Request more info</Button><Button icon="BadgeCheck" onClick={authorize}>Authorize & dispatch</Button></div></Card></div>
    <Card className="hr-locked-notes"><div className="card-heading"><div><p className="eyebrow">IMMUTABLE HR RECORD</p><h2>Hiring Manager Formal Recommendation Notes (Read-Only)</h2><p>Sealed notes are visible for governance and cannot be altered by HR.</p></div><Button variant="outline" icon="RefreshCw" onClick={loadHandoff}>Load sealed notes</Button></div><textarea className="locked-textarea" value={handoffNotes} readOnly disabled rows="4" aria-label="Hiring Manager Formal Recommendation Notes, read-only" /><div className="hash-block"><div><Icon name="Fingerprint" size={17} /><span>SHA-256 cryptographic audit signature</span></div><code>8e4a7f3c9d21b06a…f19d</code></div></Card>
    <Card className="sealed-reminder"><Icon name="Fingerprint" size={19} /><span><strong>Cryptographic handoff docket</strong><small>Hiring manager notes and recommendation remain immutable. SHA-256 signature is verified before every approval.</small></span><Badge tone="success" dot>Ledger verified</Badge></Card>
  </>
}

function AuditDocket({ role }) {
  const rows = auditEvents
  return <>
    <PageTitle eyebrow={role === 'hr' ? 'HR REPRESENTATIVE · COMPLIANCE' : 'SYSTEM ADMINISTRATOR · SECURITY'} title={role === 'hr' ? 'Cryptographic audit docket' : 'Audit trails'} description="Immutable, timestamped records across your tenant. Every change is traceable and tamper-evident." action={<Button icon="Download" variant="secondary">Export docket</Button>} />
    <div className="audit-metrics"><Metric label="Ledger integrity" value="100%" change="Verified" icon="ShieldCheck" tone="green" footnote="SHA-256 chain valid" /><Metric label="Events today" value="248" change="+18%" icon="Activity" tone="indigo" footnote="Across 6 event types" /><Metric label="Threat anomalies" value="0" change="No threats" icon="ScanEye" tone="cyan" footnote="Monitoring active" /></div>
    <Card className="audit-table-card"><div className="table-toolbar"><div><h2>Immutable activity ledger</h2><p>Hash-verified events in this workspace</p></div><label className="search-field"><Icon name="Search" size={17} /><input placeholder="Search the ledger" aria-label="Search audit ledger" /></label></div><div className="table-scroll"><table><thead><tr><th>Event</th><th>Actor</th><th>Candidate / target</th><th>Timestamp</th><th>SHA-256 signature</th><th>Verification</th></tr></thead><tbody>{[...rows, ...rows].map((item, index) => <tr key={`${item.event}-${index}`}><td><strong>{item.event}</strong></td><td>{item.actor}</td><td>{item.target}</td><td>{index ? 'Yesterday, 4:24 PM' : item.time}</td><td><code className="hash-inline">{index ? 'sha256:44d2…a651' : item.hash}</code></td><td><Badge tone="success"><Icon name="BadgeCheck" size={13} />Verified</Badge></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing 6 of 248 events</span><span>Ledger chain integrity: <strong className="text-green">100% verified</strong></span></div></Card>
    <div className="compliance-banner"><Icon name="Fingerprint" size={20} /><div><strong>Tamper-evident by design</strong><p>Audit artifacts are append-only, cryptographically chained, and preserved for SOC 2 Type II compliance.</p></div><Badge tone="success">SHA-256</Badge></div>
  </>
}

function Analytics({ role, act }) {
  const [range, setRange] = useState('Last 30 days')
  const startDate = range === 'Last 7 days' ? '2026-10-15' : '2026-09-22'
  return <>
    <PageTitle eyebrow="REPORTING & ANALYTICS" title={role === 'hr' ? 'People analytics' : 'Hiring analytics'} description="Track funnel conversion, sourcing velocity, and time-to-hire across your workspace." action={<Button icon="Download" onClick={() => act('Analytics export', () => api.exportAnalytics(workspaceId, userIdByRole[role], { startDate, endDate: '2026-10-22', exportFormat: 'CSV' }))}>Export CSV</Button>} />
    <div className="report-filters"><label className="field"><span>Date range</span><select value={range} onChange={(e) => setRange(e.target.value)}><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select></label><label className="field"><span>Pipeline status</span><select><option>All stages</option><option>Interview</option><option>Offer</option><option>Hired</option></select></label><Button icon="SlidersHorizontal" variant="secondary" onClick={() => act('Analytics refresh', () => api.analytics(workspaceId, startDate, '2026-10-22'))}>Apply filters</Button></div>
    <div className="metric-grid"><Metric label="Median time to hire" value="24 days" change="−3 days" icon="Timer" tone="indigo" /><Metric label="Funnel conversion" value="18.4%" change="+2.6%" icon="ChartNoAxesCombined" tone="green" /><Metric label="AI match average" value="84.6%" change="+4.2%" icon="Sparkles" tone="cyan" /><Metric label="Offers accepted" value="91%" change="+5.1%" icon="BadgeCheck" tone="violet" /></div>
    <div className="dashboard-grid"><Card className="pipeline-card"><div className="card-heading"><div><p className="eyebrow">CANDIDATE CONVERSION</p><h2>Hiring funnel</h2></div><Badge tone="neutral">{range}</Badge></div><FunnelChart /></Card><Card className="pipeline-card"><div className="card-heading"><div><p className="eyebrow">SOURCING PERFORMANCE</p><h2>Channel mix</h2></div><Icon name="Ellipsis" /></div><div className="channel-list">{[['Greenhouse ATS', 38, 'indigo'], ['LinkedIn', 31, 'blue'], ['Employee referrals', 19, 'cyan'], ['Careers page', 12, 'green']].map(([name, value, tone]) => <div className="channel-row" key={name}><div><span className={`channel-dot ${tone}`} /><strong>{name}</strong><span>{value}%</span></div><div className="progress-track"><span style={{ width: `${value * 2.1}%` }} /></div></div>)}</div></Card></div>
    <Card className="time-chart-card"><div className="card-heading"><div><p className="eyebrow">VELOCITY OVER TIME</p><h2>Time to first shortlist</h2></div><Badge tone="success">−0.8 days this month</Badge></div><div className="line-chart" aria-label="Time to first shortlist trend"><div className="chart-y-axis"><span>8 days</span><span>6 days</span><span>4 days</span><span>2 days</span></div><div className="chart-columns">{[68, 58, 72, 48, 55, 39, 32, 44, 25, 35, 20, 28].map((height, index) => <span className="chart-column" key={index} style={{ height: `${height}%` }} />)}</div><div className="chart-x-axis">{['Sep 22', 'Sep 29', 'Oct 06', 'Oct 13', 'Oct 20'].map((label) => <span key={label}>{label}</span>)}</div></div></Card>
  </>
}

function WorkspaceSettings({ act }) {
  const [settings, setSettings] = useState({ companyName: 'Northstar Labs', companyAddress: '548 Market Street, San Francisco, CA', companyPhone: '+1 (415) 555-0148', gstin: 'US-CA-8291' })
  const loadWorkspace = async () => {
    const result = await act('Workspace settings retrieval', () => api.workspace(workspaceId))
    if (result) setSettings((current) => ({ ...current, ...result }))
  }
  return <>
    <PageTitle eyebrow="SYSTEM ADMINISTRATOR · TENANT CONTROLS" title="Workspace settings" description="Manage organization details, workspace integrations, and privacy defaults." action={<Badge tone="success"><Icon name="Building2" size={14} />Isolated workspace</Badge>} />
    <div className="settings-layout"><Card className="settings-form-card"><div className="card-heading"><div><p className="eyebrow">ORGANIZATION PROFILE</p><h2>Company information</h2><p>Workspace identity and contact details.</p></div><Button variant="outline" icon="RefreshCw" onClick={loadWorkspace}>Load settings</Button></div><div className="form-grid">{[['Company name', 'companyName'], ['Company address', 'companyAddress'], ['Company phone', 'companyPhone'], ['Tax identifier', 'gstin']].map(([label, key]) => <Field key={key} label={label}><input value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} /></Field>)}</div><div className="settings-footer"><span><Icon name="Info" size={15} />Tenant ID: {workspaceId}</span><Button icon="Save" onClick={() => act('Workspace settings saved', () => api.updateWorkspace(workspaceId, settings))}>Save changes</Button></div></Card>
      <Card className="privacy-card"><div className="card-heading"><div><p className="eyebrow">PRIVACY & INTEGRATIONS</p><h2>Security defaults</h2><p>Apply data protection across this tenant.</p></div></div><Toggle label="Zero-data retention" detail="Resume content is not retained by external model providers." checked /><Toggle label="EEOC-aware token masking" detail="Protected attributes are masked before AI processing." checked /><Toggle label="ATS webhook sync" detail="Accept candidate updates from approved ATS platforms." checked /><div className="privacy-cert"><Icon name="ShieldCheck" size={18} /><span><strong>SOC 2 Type II</strong><small>Compliance monitoring enabled</small></span><Badge tone="success">Active</Badge></div></Card>
      <Card className="webhook-card"><div className="card-heading"><div><p className="eyebrow">CONNECTED SOURCES</p><h2>ATS integrations</h2><p>Inbound candidate streams and sync health.</p></div><Button icon="Plus" variant="secondary" onClick={() => act('Integration configuration opened', async () => ({}))}>Add integration</Button></div>{[['Greenhouse', 'Last sync 4 min ago', 'success'], ['LinkedIn Talent Hub', 'Last sync 12 min ago', 'success']].map(([name, detail, tone]) => <div className="integration-row" key={name}><span className="integration-icon"><Icon name="Workflow" /></span><strong>{name}</strong><span>{detail}</span><Badge tone={tone} dot>Connected</Badge></div>)}</Card></div>
  </>
}

function Toggle({ label, detail, checked: initial = false, onChange, controlled = false, ariaLabel = label || 'Toggle setting' }) {
  const [localChecked, setLocalChecked] = useState(initial)
  const checked = controlled ? initial : localChecked
  return <div className="setting-toggle"><span><strong>{label}</strong><small>{detail}</small></span><button type="button" role="switch" aria-label={ariaLabel} aria-checked={checked} className={`toggle-switch${checked ? ' toggle-on' : ''}`} onClick={() => { if (!controlled) setLocalChecked(!checked); onChange?.(!checked) }}><span /></button></div>
}

function UserAccess({ demoMode, act, notify }) {
  const [inviteRole, setInviteRole] = useState('TA')
  const [invites, setInvites] = useState([])
  const mockTeam = [{ userId: 'mock-user-jm', name: 'Jordan Miller', email: 'jordan.miller@northstar.io', role: 'Talent Acquisition', status: 'Active', initials: 'JM' }, { userId: 'mock-user-sc', name: 'Sam Chen', email: 'sam.chen@northstar.io', role: 'Hiring Manager', status: 'Active', initials: 'SC' }, { userId: 'mock-user-rp', name: 'Riley Patel', email: 'riley.patel@northstar.io', role: 'HR Representative', status: 'Active', initials: 'RP' }, { userId: 'mock-user-at', name: 'Avery Taylor', email: 'avery.taylor@northstar.io', role: 'Engagement Specialist', status: 'Active', initials: 'AT' }]
  const [team, setTeam] = useState(mockTeam)
  const loadDirectory = async () => {
    const result = await act('Workspace directory retrieval', () => api.team(workspaceId))
    if (Array.isArray(result)) setTeam(result.map((member) => ({
      userId: member.userId,
      name: member.fullName,
      email: member.email,
      role: member.role,
      status: member.accessStatus,
      initials: (member.fullName || member.email || 'NA').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
    })))
  }
  const createInvite = async () => {
    const result = await act('Role-specific invitation', () => api.inviteUser(workspaceId, userIdByRole.admin, inviteRole))
    if (result) setInvites([{ role: inviteRole, link: result.inviteUrl || `https://workspace.racs.ai/invite/${Math.random().toString(36).slice(2, 10)}` }, ...invites])
  }
  return <>
    <PageTitle eyebrow="SYSTEM ADMINISTRATOR · ACCESS CONTROL" title="User access" description="Manage workspace membership and invite people with role-specific, time-limited access." action={<Badge tone="info"><Icon name="UsersRound" size={14} />5 roles supported</Badge>} />
    <Card className="team-card"><div className="card-heading"><div><p className="eyebrow">WORKSPACE DIRECTORY</p><h2>Team members</h2><p>Access is isolated to Northstar Labs.</p></div><div className="title-action-group"><Badge tone="success">{team.length} active</Badge><Button variant="outline" icon="RefreshCw" onClick={loadDirectory}>Load directory</Button></div></div><div className="table-scroll"><table><thead><tr><th>Member</th><th>Assigned role</th><th>Access status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{team.map((member, index) => <tr key={member.email}><td><div className="candidate-cell"><Avatar initials={member.initials} tone={['lavender', 'blue', 'peach', 'mint'][index % 4]} small /><div><strong>{member.name}</strong><span>{member.email}</span></div></div></td><td>{member.role}</td><td><Badge tone={member.status === 'Active' ? 'success' : 'neutral'} dot>{member.status}</Badge></td><td><button className="text-link" onClick={() => { if (window.confirm(`Revoke ${member.name}'s workspace access?`)) { const result = act('User access revocation', () => api.revokeUser(member.userId, workspaceId)); Promise.resolve(result).then((response) => { if (response) setTeam((items) => items.filter((item) => item.userId !== member.userId)) }) } }}>Revoke access</button></td></tr>)}</tbody></table></div></Card>
    <Card className="invite-card"><div className="invite-heading"><span className="quick-icon"><Icon name="UserPlus" /></span><div><h2>Invite a teammate</h2><p>Invite links expire after 48 hours and provision only the selected role.</p></div></div><div className="invite-controls"><Field label="Workspace role"><select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}><option value="TA">Talent Acquisition</option><option value="HM">Hiring Manager</option><option value="HR">HR Representative</option><option value="ENGAGEMENT">Engagement Specialist</option></select></Field><Button icon="Send" onClick={createInvite}>Generate invite link</Button></div>{invites.map((invite, index) => <div className="invite-link-row" key={`${invite.link}-${index}`}><Icon name="Link2" size={17} /><span>{invite.role} invitation</span><code>{invite.link}</code><Button variant="secondary" icon="Copy" onClick={() => { navigator.clipboard?.writeText(invite.link); notify('Invitation link copied.') }}>Copy link</Button></div>)}</Card>
  </>
}

function ByokSettings({ act, demoMode }) {
  const [provider, setProvider] = useState('OpenAI')
  const [key, setKey] = useState('')
  const [configured, setConfigured] = useState(demoMode)
  const [showKey, setShowKey] = useState(false)
  const [logs, setLogs] = useState([{ provider: 'OpenAI', endpointCalled: 'resume-screening', responseStatus: '200 OK', time: 'Today, 10:42 AM' }, { provider: 'OpenAI', endpointCalled: 'candidate-scorecard', responseStatus: '200 OK', time: 'Today, 9:18 AM' }])
  useEffect(() => setConfigured(demoMode), [demoMode])
  const saveKey = async (event) => {
    event.preventDefault()
    if (!key.trim()) return
    const result = await act('Encrypted API key configuration', () => api.configureByok(workspaceId, userIdByRole.admin, provider, key))
    if (result) { setConfigured(true); setKey('') }
  }
  const loadLogs = async () => {
    const result = await act('API usage log refresh', () => api.byokLogs(workspaceId))
    if (result) setLogs(result.map((entry) => ({ ...entry, time: entry.createdAt || 'Recently' })))
  }
  return <>
    <PageTitle eyebrow="SYSTEM ADMINISTRATOR · AI SECURITY" title="BYOK security" description="Securely configure your enterprise AI provider. Keys are encrypted with AES-256 at rest." action={<Badge tone="success"><Icon name="LockKeyhole" size={14} />AES-256 encryption</Badge>} />
    <div className="byok-layout"><div className="byok-main"><Card className="byok-key-card"><div className="card-heading"><div><p className="eyebrow">BRING YOUR OWN KEY</p><h2>AI provider credentials</h2><p>Your credentials stay in your isolated workspace.</p></div><span className="key-icon"><Icon name="KeyRound" size={22} /></span></div><div className="provider-grid">{['OpenAI', 'Anthropic', 'Azure OpenAI'].map((name) => <button key={name} className={`provider-option${provider === name ? ' provider-selected' : ''}`} onClick={() => setProvider(name)}><span className="provider-check">{provider === name && <Icon name="Check" size={13} />}</span><strong>{name}</strong></button>)}</div><form onSubmit={saveKey}><Field label="API key" required><span className="secret-input"><Icon name="KeyRound" size={17} /><input value={key} onChange={(e) => setKey(e.target.value)} placeholder={configured ? '••••••••••••••••••••••••••••' : 'Paste your provider API key'} type={showKey ? 'text' : 'password'} autoComplete="new-password" /><button type="button" className="icon-button" onClick={() => setShowKey(!showKey)} aria-label={showKey ? 'Hide API key' : 'Show API key'}><Icon name={showKey ? 'EyeOff' : 'Eye'} size={17} /></button></span><small>Credentials are transmitted to your configured API and encrypted before storage.</small></Field><div className="byok-form-footer"><span><Icon name="ShieldCheck" size={15} />Never displayed again after saving</span><Button icon="LockKeyhole" type="submit">Encrypt & save key</Button></div></form><div className={`key-status${configured ? ' key-status-ready' : ''}`}><span className="status-indicator" /><div><strong>{configured ? `${provider} key configured` : 'No provider key configured'}</strong><small>{configured ? 'AES-256 encrypted · Verified for secure model calls' : 'Add a provider key to enable AI evaluation'}</small></div><Badge tone={configured ? 'success' : 'warning'}>{configured ? 'Verified' : 'Setup needed'}</Badge></div></Card>
      <Card className="usage-card"><div className="card-heading"><div><p className="eyebrow">PROVIDER CONSUMPTION</p><h2>API usage this month</h2></div><Badge tone="neutral">October 2026</Badge></div><div className="usage-total"><strong>2.4M</strong><span>tokens processed</span><Badge tone="success">+8.1%</Badge></div><div className="usage-bars">{[['Resume parsing', 76, '1.4M'], ['AI scorecards', 48, '680k'], ['Interview prompts', 26, '320k']].map(([label, value, text]) => <div className="usage-row" key={label}><div><span>{label}</span><strong>{text}</strong></div><div className="progress-track"><span style={{ width: `${value}%` }} /></div></div>)}</div></Card></div>
      <Card className="byok-side"><span className="byok-shield"><Icon name="ShieldCheck" size={28} /></span><h2>Your key. Your control.</h2><p>Provider credentials are encrypted using AES-256 and scoped to your tenant.</p><div className="security-point"><Icon name="LockKeyhole" /><span><strong>AES-256 at rest</strong><small>Encrypted before persisting to the tenant vault.</small></span></div><div className="security-point"><Icon name="EyeOff" /><span><strong>Never exposed to users</strong><small>Secrets are masked after initial configuration.</small></span></div><div className="security-point"><Icon name="DatabaseZap" /><span><strong>Zero-data retention</strong><small>Prompts are not stored by the external provider.</small></span></div><Button icon="Activity" variant="secondary" className="full-width-button" onClick={() => act('Provider usage log retrieval', () => api.byokLogs(workspaceId))}>Check provider activity</Button></Card></div>
    <Card className="usage-log-card"><div className="card-heading"><div><p className="eyebrow">AUDIT TRAIL</p><h2>Recent provider calls</h2></div><Button variant="outline" icon="RefreshCw" onClick={loadLogs}>Refresh log</Button></div><div className="usage-log">{logs.map((entry, index) => <div className="usage-log-row" key={`${entry.endpointCalled}-${index}`}><span className="service-dot" /><strong>{entry.provider}</strong><span>{entry.endpointCalled}</span><Badge tone="success">{entry.responseStatus}</Badge><small>{entry.time}</small></div>)}</div></Card>
  </>
}

function Engagement({ preboarding, act, notify }) {
  const [sequences, setSequences] = useState([{ id: 'seq-offer', name: 'Offer accepted → welcome', days: 0, active: true, text: 'Welcome aboard! We’re excited to have you join the team.' }, { id: 'seq-week', name: 'First week check-in', days: 5, active: true, text: 'Your first week is coming up. Here’s what to expect on day one.' }, { id: 'seq-month', name: '30-day milestone', days: 30, active: false, text: 'You’ve been with us for a month. Let us know how things are going.' }])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [days, setDays] = useState(7)
  const [templateText, setTemplateText] = useState('')
  const [triggered, setTriggered] = useState(false)
  const toggle = async (sequence) => {
    const result = await act('Sequence status updated', () => api.toggleSequence(sequence.id, workspaceId, !sequence.active))
    if (result) setSequences((items) => items.map((item) => item.id === sequence.id ? { ...item, active: !item.active } : item))
  }
  const create = async (event) => {
    event.preventDefault()
    if (!name.trim() || !templateText.trim()) return
    const result = await act('Email sequence created', () => api.createSequence(workspaceId, userIdByRole.engagement, { templateText, sequenceTimingDays: Number(days), isActive: true }))
    if (result) setSequences([{ id: result.sequenceId || `seq-${Date.now()}`, name, days: Number(days), active: true, text: templateText }, ...sequences])
    setName(''); setTemplateText(''); setShowForm(false)
  }
  return <>
    <PageTitle eyebrow="ENGAGEMENT SPECIALIST · CANDIDATE EXPERIENCE" title={preboarding ? 'Pre-boarding triggers' : 'Email sequences'} description={preboarding ? 'Automate helpful milestones so every new teammate feels ready for day one.' : 'Configure thoughtful, timely messages for candidates from offer acceptance through onboarding.'} action={!preboarding && <Button icon="Plus" onClick={() => setShowForm(!showForm)}>Create sequence</Button>} />
    {preboarding && <Card className="preboarding-banner"><span className="preboarding-icon"><Icon name="PartyPopper" size={24} /></span><div><h2>Make the first day feel like day one.</h2><p>Automated pre-boarding begins when HR confirms an accepted offer. Candidate enrollment is triggered by the secure offer workflow.</p></div><Button icon={triggered ? 'Check' : 'Zap'} variant="secondary" onClick={() => { setTriggered(true); act('Pre-boarding workflow checked', async () => ({})) }}>{triggered ? 'Triggers are active' : 'Check active triggers'}</Button></Card>}
    {showForm && <Card className="sequence-form-card"><div className="card-heading"><div><h2>New automated email</h2><p>Choose a clear trigger and write candidate-first copy.</p></div><button className="icon-button" aria-label="Close form" onClick={() => setShowForm(false)}><Icon name="X" /></button></div><form onSubmit={create} className="form-grid"><Field label="Sequence name" required><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Offer accepted welcome" required /></Field><Field label="Send after (days)" required><input type="number" min="0" value={days} onChange={(e) => setDays(e.target.value)} /></Field><Field label="Email template" required full><textarea value={templateText} onChange={(e) => setTemplateText(e.target.value)} rows="4" placeholder="Hi {{candidate_name}}, …" required /></Field><Button icon="Save" type="submit">Save sequence</Button></form></Card>}
    <div className="sequence-layout"><div className="sequence-main"><SectionHeading title={preboarding ? 'Pre-boarding timeline' : 'Automated journey'} detail="Messages send only when their trigger is reached." /><div className="sequence-timeline">{sequences.map((sequence, index) => <Card className="sequence-card" key={sequence.id}><span className={`timeline-marker${index === 0 ? ' timeline-start' : ''}`}>{index === 0 ? <Icon name="Zap" size={16} /> : <Icon name="Mail" size={16} />}</span><div className="sequence-main-copy"><div className="sequence-title-row"><div><Badge tone={index === 0 ? 'info' : 'neutral'}>DAY {sequence.days}</Badge><h3>{sequence.name}</h3></div><Toggle label="" checked={sequence.active} controlled ariaLabel={`Toggle ${sequence.name}`} onChange={() => toggle(sequence)} /></div><p>{sequence.text}</p><div className="sequence-meta"><span><Icon name="UsersRound" size={14} />{index === 0 ? '8' : '34'} candidates enrolled</span><span><Icon name="MailCheck" size={14} />{index === 0 ? '96%' : '74%'} open rate</span></div></div></Card>)}</div></div>
      <Card className="sequence-preview"><div className="card-heading"><div><p className="eyebrow">CANDIDATE PREVIEW</p><h2>Message delivery</h2></div><Badge tone="success" dot>Automated</Badge></div><div className="email-preview"><div className="email-brand"><span className="brand-mark brand-mark-small"><Icon name="Orbit" size={16} /></span><strong>Northstar Labs</strong><span>Now</span></div><h3>We’re excited to welcome you 🎉</h3><p>Hi Olivia,</p><p>We’re so glad you’re joining the team. Your onboarding partner will share everything you need before your first day.</p><p>We can’t wait to work together!</p><span className="email-signoff">The Northstar People team</span></div><div className="preview-stats"><div><strong>74%</strong><span>Average open rate</span></div><div><strong>3.2%</strong><span>Unsubscribe rate</span></div></div></Card></div>
  </>
}

export default App
