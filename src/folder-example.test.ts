import {
  action,
  autorun,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";
import { useObserver } from "mobx-react-lite";

type Attribute = {
  attr: boolean;
};

class File {
  content: string;
  state: "saved" | "modified" = "saved";
  attributes: Record<string, Attribute>;
  readonly isFile = true;
  constructor(public name: string) {
    this.content = "Content of " + name;
    this.attributes = observable({});
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

class Folder {
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

test("bla", () => {
  const root = new Folder("root", null);
  const f1 = new File("root.f1");
  root.addEntry(f1);

  const home = new Folder("home", root);
  root.addEntry(home);
  const homeF1 = new File("root.home.f1");
  home.addEntry(homeF1);
  const homeF2 = new File("root.home.f2");
  home.addEntry(homeF2);

  const homeKlaus = new Folder("klaus", home);
  home.addEntry(homeKlaus);
  const klausF1 = new File("root.home.klaus.f1");
  homeKlaus.addEntry(klausF1);
  const klausF2 = new File("root.home.klaus.f2");
  homeKlaus.addEntry(klausF2);

  const homeSusi = new Folder("susi", home);
  home.addEntry(homeSusi);
  const susiF1 = new File("root.home.susi.f1");
  homeSusi.addEntry(susiF1);
  const susiF2 = new File("root.home.susi.f2");
  homeSusi.addEntry(susiF2);

  autorun(() => {
    console.log("unsaved: ", root.unsavedFileCount);
  });

  susiF1.updateContent("huhu");

  autorun(() => {
    console.log("home entries: ", home.entries.length);
  });

  home.removeEntry("root.home.f2");

  autorun(() => {
    console.log("attributes", susiF1.attributes, susiF1.attributes["ro"]);
  });

  runInAction(() => (susiF1.attributes["ro"] = { attr: true }));
});
