import { getToken } from './auth.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function registerUser(payload){
  const r = await fetch(`${API_BASE}/api/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, body: await r.text() }));
  return r.json();
}

export async function loginUser(payload){
  const r = await fetch(`${API_BASE}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, body: await r.text() }));
  return r.json();
}

export async function listProjects(){
  const r = await fetch(`${API_BASE}/api/projects`, { headers: { ...authHeaders() } });
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, body: await r.text() }));
  return r.json();
}

export async function createProject(payload){
  const r = await fetch(`${API_BASE}/api/projects`, { method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify(payload)});
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, body: await r.text() }));
  return r.json();
}

export async function getProject(projectId){
  const r = await fetch(`${API_BASE}/api/projects/${projectId}`, { headers: { ...authHeaders() } });
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, body: await r.text() }));
  return r.json();
}

export async function updateProject(projectId, payload){
  const r = await fetch(`${API_BASE}/api/projects/${projectId}`, { method:'PUT', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify(payload)});
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, body: await r.text() }));
  return r.json();
}

export async function deleteProject(projectId){
  const r = await fetch(`${API_BASE}/api/projects/${projectId}`, { method:'DELETE', headers: { ...authHeaders() } });
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, body: await r.text() }));
  return r.json();
}
