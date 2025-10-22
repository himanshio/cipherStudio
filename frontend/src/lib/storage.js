const KEY = 'cipherstudio.projects';

export function saveLocalProject(id, data){
  const store = getStore();
  store[id] = data;
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function loadLocalProject(id){
  const store = getStore();
  return store[id];
}

export function listLocalProjects(){
  return Object.keys(getStore());
}

function getStore(){
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}
