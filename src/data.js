export const roles = {
  admin: { label: 'System Administrator', short: 'Admin', initials: 'AK', name: 'Alex Kim', team: 'Platform operations' },
  ta: { label: 'Talent Acquisition', short: 'Talent team', initials: 'JM', name: 'Jordan Miller', team: 'Talent acquisition' },
  hm: { label: 'Hiring Manager', short: 'Hiring manager', initials: 'SC', name: 'Sam Chen', team: 'Engineering' },
  hr: { label: 'HR Representative', short: 'People team', initials: 'RP', name: 'Riley Patel', team: 'People & culture' },
  engagement: { label: 'Engagement Specialist', short: 'Engagement', initials: 'AT', name: 'Avery Taylor', team: 'Candidate experience' },
}

export const navByRole = {
  admin: [
    ['dashboard', 'Overview', 'LayoutDashboard'],
    ['workspace', 'Workspace settings', 'Building2'],
    ['users', 'User access', 'UsersRound'],
    ['byok', 'BYOK security', 'KeyRound'],
    ['audit', 'Audit trails', 'ShieldCheck'],
    ['analytics', 'Analytics', 'ChartNoAxesCombined'],
  ],
  ta: [
    ['dashboard', 'Overview', 'LayoutDashboard'],
    ['requisitions', 'Requisitions', 'BriefcaseBusiness'],
    ['create-job', 'Create a job', 'Plus'],
    ['intake', 'Resume intake', 'Files'],
    ['pipeline', 'Candidate pipeline', 'GitBranch'],
    ['analytics', 'Analytics', 'ChartNoAxesCombined'],
  ],
  hm: [
    ['dashboard', 'Overview', 'LayoutDashboard'],
    ['requisitions', 'My requisitions', 'BriefcaseBusiness'],
    ['scorecards', 'Candidate reviews', 'Sparkles'],
    ['interviews', 'Interview checklist', 'ClipboardCheck'],
    ['handoff', 'HR handoff', 'FileCheck2'],
  ],
  hr: [
    ['dashboard', 'Overview', 'LayoutDashboard'],
    ['approvals', 'Offer approvals', 'BadgeCheck'],
    ['compensation', 'Compensation governance', 'Scale'],
    ['audit', 'Audit docket', 'Fingerprint'],
    ['analytics', 'People analytics', 'ChartNoAxesCombined'],
  ],
  engagement: [
    ['dashboard', 'Overview', 'LayoutDashboard'],
    ['sequences', 'Email sequences', 'Mail'],
    ['preboarding', 'Pre-boarding', 'PartyPopper'],
  ],
}

export const jobs = [
  { id: 'JOB-2048', title: 'Senior React Engineer', department: 'Engineering', location: 'San Francisco, CA', manager: 'Sam Chen', hires: 2, salary: '$165k – $205k', applicants: 48, stage: 'Actively sourcing', score: 'React Enterprise Matrix' },
  { id: 'JOB-2051', title: 'Product Design Lead', department: 'Design', location: 'Remote · US', manager: 'Morgan Lee', hires: 1, salary: '$145k – $180k', applicants: 26, stage: 'Shortlist in review', score: 'Design Leadership v2' },
  { id: 'JOB-2055', title: 'Staff Data Engineer', department: 'Data', location: 'New York, NY', manager: 'Priya Shah', hires: 1, salary: '$180k – $225k', applicants: 32, stage: 'Pending intake', score: 'Data Platform Core' },
]

export const candidates = [
  { id: 'CAN-8841', name: 'Olivia Rhye', role: 'Senior React Engineer', email: 'olivia.rhye@email.com', initials: 'OR', score: 92, stage: 'HM review', location: 'San Francisco, CA', skills: ['React', 'TypeScript', 'Design systems', 'Accessibility'], missing: ['GraphQL federation'], source: 'Greenhouse', lastActive: '12 min ago' },
  { id: 'CAN-8838', name: 'Phoenix Baker', role: 'Senior React Engineer', email: 'phoenix.baker@email.com', initials: 'PB', score: 88, stage: 'Interview', location: 'Austin, TX', skills: ['React', 'TypeScript', 'Node.js'], missing: ['Distributed systems'], source: 'LinkedIn', lastActive: '38 min ago' },
  { id: 'CAN-8834', name: 'Lana Steiner', role: 'Senior React Engineer', email: 'lana.steiner@email.com', initials: 'LS', score: 84, stage: 'Shortlisted', location: 'Seattle, WA', skills: ['React', 'JavaScript', 'Testing'], missing: ['TypeScript', 'GraphQL'], source: 'ATS webhook', lastActive: '1 hr ago' },
  { id: 'CAN-8829', name: 'Demi Wilkinson', role: 'Product Design Lead', email: 'demi.wilkinson@email.com', initials: 'DW', score: 76, stage: 'Parsing', location: 'Remote, US', skills: ['Figma', 'Research', 'Prototyping'], missing: ['Design systems leadership'], source: 'Referral', lastActive: '2 hr ago' },
  { id: 'CAN-8821', name: 'Candice Wu', role: 'Staff Data Engineer', email: 'candice.wu@email.com', initials: 'CW', score: 71, stage: 'HR approval', location: 'New York, NY', skills: ['Python', 'Spark', 'SQL'], missing: ['Kafka', 'AWS'], source: 'Greenhouse', lastActive: '3 hr ago' },
  { id: 'CAN-8817', name: 'Drew Cano', role: 'Senior React Engineer', email: 'drew.cano@email.com', initials: 'DC', score: 63, stage: 'Sourcing', location: 'Denver, CO', skills: ['JavaScript', 'CSS'], missing: ['React', 'TypeScript'], source: 'LinkedIn', lastActive: 'Yesterday' },
]

export const auditEvents = [
  { event: 'Handoff record sealed', actor: 'Sam Chen', target: 'Olivia Rhye · CAN-8841', time: 'Today, 10:42 AM', hash: 'sha256:8e4a…c19d', status: 'Verified' },
  { event: 'Offer terms updated', actor: 'Riley Patel', target: 'Candice Wu · CAN-8821', time: 'Today, 9:18 AM', hash: 'sha256:b71c…0d42', status: 'Verified' },
  { event: 'Candidate status changed', actor: 'Jordan Miller', target: 'Phoenix Baker · CAN-8838', time: 'Today, 8:56 AM', hash: 'sha256:1a9f…ff08', status: 'Verified' },
]
