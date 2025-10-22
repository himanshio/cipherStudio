import React, { useMemo } from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'

export default function IDE({ files, setFiles, theme }) {
  const sandpackFiles = useMemo(() => {
    const mapped = {};
    for (const [path, code] of Object.entries(files)) mapped[path] = { code };
    return mapped;
  }, [files]);

  return (
    <div className="ide">
      <div className="filetree">
        <FileList files={files} onSelect={() => {}} onDelete={(p)=>{
          const { [p]:_, ...rest } = files; setFiles(rest);
        }} onCreate={(p)=>{
          if (files[p]) return; setFiles({ ...files, [p]: '' });
        }} />
      </div>
      <div className="editor">
        <SandpackProvider template="react" files={sandpackFiles} theme={theme === 'dark' ? 'dark' : 'light'} options={{ recompileMode: 'immediate' }}>
          <SandpackLayout>
            <BoundEditor setFiles={setFiles} />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  )
}

function BoundEditor({ setFiles }){
  const { sandpack } = useSandpack();
  const active = sandpack.activeFile;
  return (
    <SandpackCodeEditor showTabs showLineNumbers wrapContent onChange={(code)=>{
      if (active) setFiles((f)=> ({ ...f, [active]: code }));
    }} />
  );
}

function FileList({ files, onSelect, onDelete, onCreate }){
  const paths = Object.keys(files).sort();
  return (
    <div>
      <div className="ft-header">
        <span>Files</span>
        <button onClick={() => {
          const p = prompt('New file path (e.g., /New.js)');
          if (p) onCreate(p);
        }}>+ New</button>
      </div>
      <ul className="ft-list">
        {paths.map((p) => (
          <li key={p} className="ft-item">
            <span>{p}</span>
            <div>
              <button onClick={() => {
                const np = prompt('Rename to path:', p);
                if (np && np !== p) {
                  onCreate(np);
                  onDelete(p);
                }
              }}>Rename</button>
              <button onClick={() => onDelete(p)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
