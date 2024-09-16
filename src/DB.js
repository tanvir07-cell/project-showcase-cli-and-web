import View from "./platforms/web/view.js";

export const openDB = async () => {
  return await idb.openDB("project-showcase-web-app", 1, {
    async upgrade(db) {
      await db.createObjectStore("app:projects");
    },
  });
};

export const saveDB = async () => {
  const db = await openDB();
  await db.put("app:projects", JSON.stringify(app.state.projects), "projects");
};

export const loadDB = async () => {
  const db = await openDB();
  const projects = await db.get("app:projects", "projects");
  if (projects) {
    app.state.projects = JSON.parse(projects);

    const view = new View();

    app.state.projects.forEach((project) => {
      view.addProject(project);
    });
  }
};
