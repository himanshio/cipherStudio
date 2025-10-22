import React from 'react'

export default function Toolbar({ name, setName, projectId, setProjectId, theme, setTheme, autosave, setAutosave, onSave, onLoad, onLogout, user, authed }){
  return (
    <div className="toolbar">
      <div className="left">
        <span className="brand">🔐 CipherStudio</span>
        <input className="name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="pid" value={projectId} onChange={e=>setProjectId(e.target.value)} />
      </div>
      <div className="center">
        <button onClick={onSave}>Save</button>
        <button onClick={onLoad}>Load</button>
      </div>
      <div className="right">
        <label className="row">
          <span>Autosave</span>
          <input type="checkbox" checked={autosave} onChange={e=>setAutosave(e.target.checked)} />
        </label>
        <label className="row">
          <span>Theme</span>
          <select value={theme} onChange={e=>setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
        {user && (
          <div className="userpill">
            <div className="avatar">{(user.name || user.email || '?').charAt(0).toUpperCase()}</div>
            <div className="uinfo">
              <div className="uname">{user.name || user.email}</div>
              {user.name && <div className="uemail">{user.email}</div>}
            </div>
            {onLogout && <button className="logout" onClick={onLogout}>Logout</button>}
          </div>
        )}
        {!user && authed && (
          <div className="userpill">
            <div className="avatar">U</div>
            <div className="uinfo">
              <div className="uname">Logged in</div>
            </div>
            {onLogout && <button className="logout" onClick={onLogout}>Logout</button>}
          </div>
        )}
        {!user && !authed && onLogout && <button className="logout" onClick={onLogout}>Logout</button>}
      </div>
    </div>
  )
}
