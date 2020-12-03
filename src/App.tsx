import {
  Folder,
  useFileSystem as useAppStore,
  NavigationEntry,
  StoreContextProvider,
  File,
} from "folder-model";
import { action } from "mobx";
import { observer, useObserver } from "mobx-react-lite";
import React from "react";
import "./App.css";

function App() {
  return (
    <StoreContextProvider>
      <div className="Flex">
        <Sidebar />
        <Main />
        <RightSide />
        <RightSideWithObserver />
        <RightBottomSide />
      </div>
    </StoreContextProvider>
  );
}

function useFileName() {
  const x = useAppStore();
  const entry = x.fileSystem.folder[0].entries[0];
  const label = entry.isFile ? entry.content : "no content";
  return label;
}

const RightSide = function RightSide() {
  const fileName = useFileName();

  return (
    <div>
      <h1>Filename</h1>
      <p>{fileName}</p>
    </div>
  );
};

const RightSideWithObserver = observer(RightSide);

const RightBottomSide = observer(function RightBottomSide() {
  const x = useAppStore();
  const entry = x.fileSystem.folder[0].entries[0];
  const label = entry.isFile ? entry.content : "no content";

  return (
    <div>
      <h1>Filename</h1>
      <p>{label}</p>
    </div>
  );
});

const Main = observer(function Main() {
  const { navigation } = useAppStore();
  const currentFolder = navigation.currentFolder;

  if (!currentFolder) {
    return <div>"No Folder open!"</div>;
  }

  return (
    <div style={{ marginLeft: "2rem" }}>
      <FolderUi folder={currentFolder} />
    </div>
  );
});

const FolderUi = observer(function FolderUi({ folder }: { folder: Folder }) {
  return (
    <div>
      <h1>{folder.name}</h1>

      <div>
        {folder.entries.map((e) => {
          return e.isFile ? (
            <FileUi key={e.name} file={e} />
          ) : (
            <FolderUi key={e.name} folder={e} />
          );
        })}
      </div>
    </div>
  );
});

const FileUi = observer(function FileUi({ file }: { file: File }) {
  return (
    <div>
      <h2>
        {file.name} {file.state}
      </h2>

      <input
        value={file.content}
        onChange={(e) => file.updateContent(e.target.value)}
      />
      <button onClick={() => file.save()}>Save</button>
    </div>
  );
});

const Sidebar = observer(function Sidebar() {
  const { navigation } = useAppStore();

  const nav = navigation.navigation;

  return (
    <div>
      <h1>Sidebar</h1>
      <ul>
        {nav.map((entry) => (
          <Nav key={entry.label} entry={entry} />
        ))}
      </ul>
    </div>
  );
});

const Nav = observer(function Nav({ entry }: { entry: NavigationEntry }) {
  return (
    <li style={{ marginBottom: "1rem" }}>
      {entry.label} {entry.dirty ? "Dirty" : "Clean"}
    </li>
  );
});

export default App;
