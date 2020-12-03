import { makeAutoObservable } from "mobx";
import React from "react";
export class File {
  content: string;
  state: "saved" | "modified" = "saved";
  readonly isFile = true;
  constructor(public name: string) {
    this.content = "Content of " + name;
    makeAutoObservable(this);
  }

  updateContent(newContent: string) {
    this.content = newContent;
    this.state = "modified";
  }

  save() {
    this.state = "saved";
  }
}

export class Folder {
  readonly isFile = false;
  entries: Array<File | Folder> = [];
  constructor(public name: string, public parent: Folder | null) {
    makeAutoObservable(this);
  }

  addEntry(entry: File | Folder) {
    this.entries.push(entry);
  }

  removeEntry(name: string) {
    const ix = this.entries.findIndex((e) => e.name === name);
    this.entries.splice(ix, 1);
  }

  get unsavedFileCount() {
    console.log("Computing unsavedFileCount in " + this.name);
    let result = 0;
    this.entries.forEach((entry) => {
      if (entry.isFile) {
        if (entry.state === "modified") {
          result++;
        }
      } else {
        result += entry.unsavedFileCount;
      }
    });
    return result;
  }
}

export class FileSystem {
  folder: Folder[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  add(folder: Folder) {
    this.folder.push(folder);
  }
}

export function createDummyModel() {
  const fileSystem = new FileSystem();
  const homeKlaus = new Folder("klaus", null);
  fileSystem.add(homeKlaus);
  const klausF1 = new File("klaus.f1");
  homeKlaus.addEntry(klausF1);
  const klausF2 = new File("klaus.f2");
  homeKlaus.addEntry(klausF2);

  const klausMovies = new Folder("klaus.movies", homeKlaus);
  homeKlaus.addEntry(klausMovies);
  klausMovies.addEntry(new File("klaus.movies.movie1"));
  klausMovies.addEntry(new File("klaus.movies.movie2"));

  const homeSusi = new Folder("susi", null);
  fileSystem.add(homeSusi);
  const susiF1 = new File("susi.f1");
  homeSusi.addEntry(susiF1);
  const susiF2 = new File("susi.f2");
  homeSusi.addEntry(susiF2);

  const susiPictures = new Folder("susi.pictures", homeSusi);
  susiPictures.addEntry(new File("susi.pictures.p1"));
  susiPictures.addEntry(new File("susi.pictures.p2"));

  return fileSystem;
}

export type NavigationEntry = {
  label: string;
  dirty: boolean;
};

class Navigation {
  currentFolder: Folder | null = null;
  constructor(public readonly fileSystem: FileSystem) {
    makeAutoObservable(this);
    this.currentFolder = fileSystem.folder[0];
  }

  openFolder(folder: Folder) {
    this.currentFolder = folder;
  }

  get navigation() {
    console.log("compute navigation");
    const nav: NavigationEntry[] = [];

    this.fileSystem.folder.forEach((f) => {
      nav.push({
        label: f.name,
        dirty: f.unsavedFileCount > 0,
      });
    });

    return nav;
  }
}

const FSContext = React.createContext<{
  fileSystem: FileSystem;
  navigation: Navigation;
}>(null!);

type StoreContextProps = {
  children: React.ReactNode;
};

const fileSystem = createDummyModel();
const navigation = new Navigation(fileSystem);

const context = {
  fileSystem,
  navigation,
};

export function StoreContextProvider({ children }: StoreContextProps) {
  console.log(context);
  return <FSContext.Provider value={context}>{children}</FSContext.Provider>;
}

export function useFileSystem() {
  const storeContext = React.useContext(FSContext);
  return storeContext;
}
