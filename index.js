#!/usr/bin/env node
import { loadDB } from "./src/DB.js";
import Controller from "./src/shared/controller.js";

const platforms = globalThis.window ? "web" : "cli";

const { default: View } = await import(`./src/platforms/${platforms}/view.js`);

if (platforms === "web") {
  globalThis.app = {
    state: {
      projects: [],
    },
  };
  await loadDB();
}

Controller.init({ view: new View() });
