const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function request(path, { method = 'GET', params, body, headers = {} } = {}) {
  const url = new URL(`${API_BASE}/api${path}`, window.location.origin)
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value)
  })

  const response = await fetch(url, {
    method,
    headers: body instanceof FormData ? headers : { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  })
  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!response.ok) {
    const message = typeof data === 'object' && data?.error ? data.error : `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}

export const api = {
  createJob: (job, workspaceId, userId) => request('/jobs', { method: 'POST', params: { workspaceId, createdByUserId: userId }, body: job }),
  jobs: (workspaceId) => request(`/jobs/workspace/${encodeURIComponent(workspaceId)}`),
  uploadCandidate: (candidate, workspaceId, jobId, userId) => request('/candidates', { method: 'POST', params: { workspaceId, jobId, uploadedByUserId: userId }, body: candidate }),
  candidatesForJob: (jobId, workspaceId) => request(`/candidates/job/${encodeURIComponent(jobId)}`, { params: { workspaceId } }),
  scorecard: (candidateId, workspaceId) => request(`/evaluations/scorecard/${encodeURIComponent(candidateId)}`, { params: { workspaceId } }),
  updatePipeline: (candidateId, workspaceId, userId, newStatus) => request(`/pipeline/${encodeURIComponent(candidateId)}/status`, { method: 'PUT', params: { workspaceId, userId }, body: { newStatus } }),
  pipeline: (workspaceId, status) => request('/pipeline/filter', { params: { workspaceId, status } }),
  generateChecklist: (candidateId, jobId, userId, workspaceId, questions) => request('/interviews/generate', { method: 'POST', params: { workspaceId, candidateId, jobId, generatedByUserId: userId }, body: { questions } }),
  gradeQuestion: (questionId, workspaceId, isPassed) => request(`/interviews/questions/${encodeURIComponent(questionId)}`, { method: 'PUT', params: { workspaceId }, body: { isPassed } }),
  checklist: (candidateId, workspaceId) => request(`/interviews/candidate/${encodeURIComponent(candidateId)}`, { params: { workspaceId } }),
  createHandoff: (candidateId, jobId, userId, workspaceId, finalHmNotes) => request('/handoffs', { method: 'POST', params: { workspaceId, candidateId, jobId, hiringManagerId: userId }, body: { finalHmNotes } }),
  handoffSummary: (candidateId, workspaceId) => request(`/handoffs/candidate/${encodeURIComponent(candidateId)}/summary`, { params: { workspaceId } }),
  processOffer: (reportId, workspaceId) => request(`/handoffs/${encodeURIComponent(reportId)}/process`, { method: 'PUT', params: { workspaceId } }),
  analytics: (workspaceId, startDate, endDate) => request('/analytics/time-to-hire', { params: { workspaceId, startDate, endDate } }),
  exportAnalytics: (workspaceId, userId, body) => request('/analytics/export', { method: 'POST', params: { workspaceId, userId }, body }),
  configureByok: (workspaceId, userId, providerName, rawApiKey) => request('/byok/configure', { method: 'POST', params: { workspaceId, userId }, body: { providerName, rawApiKey } }),
  byokLogs: (workspaceId) => request('/byok/logs', { params: { workspaceId } }),
  team: (workspaceId) => request(`/users/directory/${encodeURIComponent(workspaceId)}`),
  inviteUser: (workspaceId, userId, invitedRole) => request('/invitations/generate', { method: 'POST', body: { workspaceId, createdByUserId: userId, invitedRole } }),
  revokeUser: (userId, workspaceId) => request(`/users/${encodeURIComponent(userId)}/revoke`, { method: 'PUT', params: { workspaceId } }),
  workspace: (workspaceId) => request(`/workspaces/${encodeURIComponent(workspaceId)}`),
  updateWorkspace: (workspaceId, values) => request(`/workspaces/${encodeURIComponent(workspaceId)}`, { method: 'PUT', body: values }),
  toggleSequence: (sequenceId, workspaceId, isActive) => request(`/engagements/sequences/${encodeURIComponent(sequenceId)}/toggle`, { method: 'PUT', params: { workspaceId }, body: { isActive } }),
  createSequence: (workspaceId, userId, sequence) => request('/engagements/sequences', { method: 'POST', params: { workspaceId, userId }, body: sequence }),
}

export const workspaceId = import.meta.env.VITE_WORKSPACE_ID || 'ws-northstar'
export const userIdByRole = {
  admin: import.meta.env.VITE_ADMIN_USER_ID || 'user-admin-01',
  ta: import.meta.env.VITE_TA_USER_ID || 'user-ta-01',
  hm: import.meta.env.VITE_HM_USER_ID || 'user-hm-01',
  hr: import.meta.env.VITE_HR_USER_ID || 'user-hr-01',
  engagement: import.meta.env.VITE_ENGAGEMENT_USER_ID || 'user-engagement-01',
}
