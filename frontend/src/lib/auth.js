const AUTH_KEY = 'cipherstudio.auth.token';
const USER_KEY = 'cipherstudio.auth.user';

export function setToken(t){
  localStorage.setItem(AUTH_KEY, t);
}
export function getToken(){
  return localStorage.getItem(AUTH_KEY) || '';
}
export function clearToken(){
  localStorage.removeItem(AUTH_KEY);
}
export function isAuthed(){
  return Boolean(getToken());
}

export function setUser(u){
  localStorage.setItem(USER_KEY, JSON.stringify(u || {}));
}
export function getUser(){
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || null } catch { return null }
}
export function clearUser(){
  localStorage.removeItem(USER_KEY);
}
