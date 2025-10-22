import React, { useEffect, useMemo, useState } from 'react'
import IDE from './components/IDE.jsx'
import Toolbar from './components/Toolbar.jsx'
import Home from './components/Home.jsx'
import { loadLocalProject, saveLocalProject } from './lib/storage.js'
import { createProject, getProject, updateProject } from './lib/api.js'
import { isAuthed, clearToken, getUser as getStoredUser, clearUser as clearStoredUser } from './lib/auth.js'

export default function App() {
  const [authed, setAuthed] = useState(isAuthed());
  const [user, setUser] = useState(() => getStoredUser());
  const [projectId, setProjectId] = useState(() => new URLSearchParams(location.search).get('id') || 'local');
  const [theme, setTheme] = useState('dark');
  const [autosave, setAutosave] = useState(true);
  const [name, setName] = useState('My Project');
  const [files, setFiles] = useState(() => {
    const saved = loadLocalProject('local');
    return saved?.files || defaultFiles();
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (autosave) {
      if (projectId === 'local') {
        saveLocalProject(projectId, { name, files, settings: { theme, autosave } });
      } else {
        // best-effort autosave to backend
        const payload = { name, files: toArrayFiles(files), settings: { theme, autosave } };
        updateProject(projectId, payload).catch(() => {
          // attempt create if not exists
          createProject({ ...payload, projectId }).catch(() => {});
        });
      }
    }
  }, [projectId, name, files, theme, autosave]);

  const onSave = async () => {
    // If user is not authenticated, always save locally
    if (!authed) {
      saveLocalProject('local', { name, files, settings: { theme, autosave } });
      alert('Project saved locally');
      return;
    }

    // Authenticated: ensure a proper projectId
    let id = projectId;
    if (!id || id === 'local') {
      id = generateId();
      setProjectId(id);
      updateUrlId(id);
      // Also keep a local backup copy
      saveLocalProject(id, { name, files, settings: { theme, autosave } });
    }

    const payload = { name, files: toArrayFiles(files), settings: { theme, autosave } };
    try {
      await updateProject(id, payload);
      alert('Project saved');
    } catch (e) {
      try {
        await createProject({ ...payload, projectId: id });
        alert('Project created and saved');
      } catch (err) {
        showError(err);
      }
    }
  };
  const onLoad = async () => {
    if (!authed || projectId === 'local' || !projectId) {
      const loaded = loadLocalProject(projectId);
      if (loaded) applyLoaded(loaded);
      else alert('No local project found for this id');
      return;
    }
    try {
      const loaded = await getProject(projectId);
      if (loaded) {
        const map = fromArrayFiles(loaded.files || []);
        applyLoaded({ name: loaded.name, files: map, settings: loaded.settings });
        alert('Project loaded');
      }
    } catch (e) {
      // fallback try local
      const loaded = loadLocalProject(projectId);
      if (loaded) { applyLoaded(loaded); alert('Loaded local fallback'); }
      else showError(e);
    }
  };

  function applyLoaded(loaded){
    setName(loaded.name || 'My Project');
    setFiles(loaded.files || files);
    setTheme(loaded.settings?.theme || theme);
    setAutosave(Boolean(loaded.settings?.autosave));
  }

  function toArrayFiles(obj){
    return Object.entries(obj).map(([path, code]) => ({ path, code }));
  }
  function fromArrayFiles(arr){
    const map = {};
    for (const f of arr) map[f.path] = f.code;
    return map;
  }
  function generateId(){
    return 'proj-' + Math.random().toString(36).slice(2, 8);
  }
  function updateUrlId(id){
    const url = new URL(location.href);
    url.searchParams.set('id', id);
    history.replaceState(null, '', url.toString());
  }
  function showError(e){
    try {
      const parsed = JSON.parse(e.message);
      const body = JSON.parse(parsed.body);
      alert(body.error || `Request failed (${parsed.status})`);
    } catch {
      alert('Operation failed');
    }
  }

  if (!authed) {
    return (
      <div className="app">
        <Home onAuthed={(u) => { setUser(u); setAuthed(true); }} />
      </div>
    );
  }

  return (
    <div className="app">
      <Toolbar
        name={name}
        setName={setName}
        projectId={projectId}
        setProjectId={setProjectId}
        theme={theme}
        setTheme={setTheme}
        autosave={autosave}
        setAutosave={setAutosave}
        user={user}
        authed={authed}
        onSave={onSave}
        onLoad={onLoad}
        onLogout={() => { clearToken(); clearStoredUser(); setUser(null); setAuthed(false); }}
      />
      <IDE files={files} setFiles={setFiles} theme={theme} />
    </div>
  )
}

function defaultFiles() {
  return {
    '/index.js': `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.js';\nimport './styles.css';\n\ncreateRoot(document.getElementById('root')).render(<App />);`,
    '/App.js': `import React, { useState } from 'react';\nexport default function App(){\n  const [count, setCount] = useState(0);\n  return (<div className=\"container\">\n    <p>Edit files on the left. Preview updates live.</p>\n    <button onClick={() => setCount(c => c+1)}>Count: {count}</button>\n  </div>);\n}`,
    '/styles.css': `:root{ --bg:#0b0f14; --fg:#e6edf3; --panel:#111827; }\n[data-theme=light]{ --bg:#f8fafc; --fg:#0b1220; --panel:#eef2f7; }\n*{box-sizing:border-box} body{margin:0} .container{font-family:ui-sans-serif,system-ui; color:var(--fg);}\nbutton{ padding:.5rem .75rem; border-radius:8px; border:1px solid #334155; background:#1f2937; color:#e5e7eb; }\n`,
    '/index.html': `<!DOCTYPE html>\n<html><head><meta charset=\"UTF-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/></head><body><div id=\"root\"></div></body></html>`
  };
}
