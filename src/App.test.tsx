import {
  action,
  autorun,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";

class Person {
  constructor(public vorname: string, public nachname: string) {}
}

export class A {
  constructor(public values: Person[], public x: string) {
    makeAutoObservable(this);
  }

  get valueCount() {
    console.log("computed");
    return this.values.length;
  }

  updateX(newX: string) {
    this.x = newX;
  }
  addValue(p: Person) {
    this.values.push(p);
  }
}

test("AUTORUN", async () => {
  const a = new A([], "moin");

  // autorun(() => {
  //   console.log(
  //     "eins",
  //     a.x,
  //     a.values.length,
  //     a.values.length > 0 ? a.values[0].nachname : null
  //   );
  // });
  // const p = new Person("Klaus", "Dieter");
  // a.addValue(p);
  // a.updateX("fasfasdfa");
  // runInAction(() => {
  //   p.nachname = "NACHNAHME!!!!!!!!!!!!!!!!";
  // });
  // a.updateX(">>>>>>>>>>>>>>>>>>>>>>>><");
  // action(() => {
  //   a.x = "HEHEHEHEHEH";
  // })();

  // pause(200);
  // a.addValue(new Person("Susi", "Mueller"));
  // pause(200);

  autorun(() => {
    console.log("a.valueCount", a.valueCount, a.x);
  });

  runInAction(() => {
    a.addValue(new Person("Klaus Dieter", "Mueller"));
  });

  a.updateX("fasfasdf");

  a.updateX("2222");

  a.addValue(new Person("Susi", "Meier"));
});

function pause(l: number) {
  return new Promise((res) => setTimeout(() => res(), l));
}
