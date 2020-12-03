import { makeAutoObservable } from "mobx";

export class ContainerInstance {
  readonly _id: string;
  title: string;

  constructor(id: string) {
    makeAutoObservable(this);

    this._id = id;
    this.title = `Title`;
  }
}

export class ContainerState {
  readonly _id: string;
  instances: ContainerInstance[] = [];

  constructor(id: string) {
    makeAutoObservable(this);
    this._id = id;
  }

  addContainer(id: string) {
    this.instances.push(new ContainerInstance(id));
  }
}

export class Wizard {
  states: ContainerState[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}
