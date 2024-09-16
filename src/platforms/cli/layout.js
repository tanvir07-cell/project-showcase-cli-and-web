import blessed from "blessed";
import contrib from "blessed-contrib";

export default class LayoutBuilder {
  #screen;
  #layout;
  #form;
  #alert;
  #inputs = {};
  #buttons = {};
  #table;

  setScreen({ title }) {
    this.#screen = blessed.screen({
      smartCSR: true,
      title,
    });
    this.#screen.key(["escape", "q", "C-c"], () => process.exit(0));

    return this;
  }

  #createButton({ parent, name, content, bg, fg, left, bottom }) {
    return blessed.button({
      parent,
      name,
      content,
      left,
      bottom,
      style: {
        bg,
        fg,
        focus: { bg: `light${bg}` },
        hover: { bg: `light${bg}` },
      },
      mouse: true,
      keys: true,
      shrink: true,
      padding: { left: 1, right: 1 },
      width: "shrink",
    });
  }

  setLayout() {
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: "100%",
      height: "100%",
    });

    return this;
  }

  #createInputField({ parent, name, top, label }) {
    const input = blessed.textbox({
      parent,
      name,
      top,
      label,
      inputOnFocus: true,
      left: "center",
      width: "60%",
      height: "25%",
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "blue",
        focus: { bg: "lightblue" },
      },
    });

    return input;
  }

  setAlertComponent() {
    this.#alert = blessed.box({
      parent: this.#form,
      width: "40%",
      height: "25%",
      bottom: 0,
      border: {
        type: "line",
      },
      style: {
        bg: "red",
        fg: "black",
      },
      content: "",
      tags: true,
      align: "center",
      hidden: true,
    });

    this.#alert.setMessage = (msg) => {
      this.#alert.setContent(`{bold}${msg}{/bold}`);
      this.#alert.show();
      this.#screen.render();

      setTimeout(() => {
        this.#alert.hide();
        this.#screen.render();
      }, 3000);
    };

    return this;
  }

  setFormComponent({ onSubmit }) {
    const form = blessed.form({
      parent: this.#layout,
      keys: true,
      vi: false,
      width: "100%",
      height: "60%",
      top: 0,
      left: "center",
      label: "Project Showcase",
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "black",
      },
    });

    const nameInput = this.#createInputField({
      parent: form,
      name: "name",
      top: 1,
      label: "Name:",
    });

    // after focusing one time don't need to
    // focus multiple time like githubInput.focus()
    nameInput.focus();

    const githubInput = this.#createInputField({
      parent: form,
      name: "github",
      top: 4,
      label: "Github:",
    });

    const liveInput = this.#createInputField({
      parent: form,
      name: "live",
      top: 7,
      label: "Live:",
    });

    const descriptionInput = this.#createInputField({
      parent: form,
      name: "description",
      top: 10,
      label: "Description:",
    });

    const imageInput = this.#createInputField({
      parent: form,
      name: "image",
      top: 13,
      label: "Image:",
    });

    const submitButton = this.#createButton({
      parent: form,
      name: "submit",
      content: "Submit",
      bg: "green",
      fg: "black",
      left: "45%",
      bottom: 1,
    });

    submitButton.on("press", () => form.submit());
    form.on("submit", (data) => onSubmit(data));

    this.#form = form;
    this.#inputs.name = nameInput;
    this.#inputs.githubInput = githubInput;

    this.#inputs.liveInput = liveInput;

    this.#inputs.descriptionInput = descriptionInput;

    this.#inputs.imageInput = imageInput;

    this.#buttons.submit = submitButton;

    return this;
  }

  setTable({ numColumns }) {
    const columnWidth = Math.floor(this.#layout.width / numColumns);
    const minColumnWidth = 10;
    const columnWidths = Array(numColumns)
      .fill(columnWidth)
      .map((width) => Math.max(width, minColumnWidth));

    this.#table = contrib.table({
      parent: this.#layout,
      mouse: true,
      scrollbar: {
        ch: " ",
        inverse: true,
      },
      tags: true,
      keys: true,
      fg: "white",
      selectedFg: "white",
      selectedBg: "blue",
      interactive: true,
      label: "Projects",
      width: "100%",
      height: "50%",
      top: 0,
      left: 0,
      border: { type: "line", fg: "cyan" },
      columnSpacing: 2,
      columnWidth: columnWidths,
    });

    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      layout: this.#layout,
      form: this.#form,
      alert: this.#alert,
      table: this.#table,
    };

    components.screen.render();

    return components;
  }
}
