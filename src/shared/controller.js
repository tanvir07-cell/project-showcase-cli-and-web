// dynamically import the fs module if the platform is cli

const platforms = globalThis.window ? "web" : "cli";

if (platforms === "cli") {
  globalThis.fs = await import("fs/promises");
}

// Controller.init()

/**
 * @typedef {import('./contract.js').default} View
 */
export default class Controller {
  /** @type {View} */
  #view;
  /** @param { {view: View} } deps */
  constructor({ view }) {
    this.#view = view;
  }

  static init(deps) {
    const controller = new Controller(deps);
    controller.#init();
    return controller;
  }

  #isValid(data) {
    return data.name && data.image && data.description;
  }

  #onSubmit({ name, image, description, github, live }) {
    if (!name || !image || !description || !github || !live) {
      this.#view.notify({ msg: "Please fill in all fields" });
      return;
    }

    this.#view.addProject({ name, image, description, github, live });

    this.#view.resetForm();

    // for only the web:
    if (globalThis.app) {
      app.state.projects.push({
        name,
        image,
        description: description.trim(),
        github,
        live,
      });
    }
  }

  #init() {
    this.#view.formSubmit(this.#onSubmit.bind(this));

    // for only the web:

    this.#view.render([]);

    // for cli get the data from lowdb;

    if (!globalThis.app) {
      (async () => {
        try {
          const data = await fs.readFile(
            new URL("../platforms/cli/projects.json", import.meta.url).pathname,
            "utf-8"
          );
          this.#view.render(JSON.parse(data).projects);
        } catch (err) {
          this.#view.notify({ msg: err.message });
        }
      })();
    }
  }
}
