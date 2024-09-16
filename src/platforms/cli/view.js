import Contract from "../../shared/contract.js";
import LayoutBuilder from "./layout.js";

import { JSONFilePreset } from "lowdb/node";

const defaultData = { projects: [] };

const db = await JSONFilePreset(
  new URL("./projects.json", import.meta.url).pathname,
  defaultData
);
await db.read();
export default class View extends Contract {
  #layoutBuilder;
  #components;
  #onFormSubmit = () => {};
  #data = [];
  #headers = [];

  constructor(layoutBuilder = new LayoutBuilder()) {
    super();
    this.#layoutBuilder = layoutBuilder;
  }

  #prepareData(items) {
    if (!items.length) {
      return {
        headers: this.#headers,
        data: [],
      };
    }

    this.#headers = Object.keys(items[0]);
    return {
      headers: this.#headers,
      data: items.map((item) => Object.values(item)),
    };
  }

  addProject(item) {
    this.#data.push(item);
    const items = this.#prepareData(this.#data);
    this.#components.table.setData(items);
    this.#components.screen.render();
  }

  notify({ msg, isError }) {
    this.#components.alert.setMessage(msg);
  }

  formSubmit(fn) {
    this.#onFormSubmit = (data) => {
      if (
        !data.name ||
        !data.image ||
        !data.description ||
        !data.github ||
        !data.live
      ) {
        return;
      }
      db.data.projects.push({
        name: data.name,
        image: data.image,
        description: data.description,
        github: data.github,
        live: data.live,
      });
      db.write();
      this.#components.screen.render();
      return fn(data);
    };
  }
  resetForm() {
    this.#components.form.reset();
    this.#components.screen.render();
  }

  render(items) {
    this.#components = this.#layoutBuilder
      .setScreen({ title: "Project Showcase" })
      .setLayout()
      .setFormComponent({
        onSubmit: this.#onFormSubmit.bind(this),
      })
      .setAlertComponent()
      .setTable({
        numColumns: 5,
      })
      .build();

    items.forEach((item) => this.addProject(item));
  }
}
