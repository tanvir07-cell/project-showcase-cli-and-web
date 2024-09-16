import { saveDB } from "../../DB.js";
import Contract from "../../shared/contract.js";

export default class View extends Contract {
  #form = document.querySelector("#form");
  #name = document.querySelector("#name");
  #image = document.querySelector("#image");
  #github = document.querySelector("#github");
  #live = document.querySelector("#live");
  #description = document.querySelector("#description");
  #card = document.querySelector(".card");

  /**
   * Form submission behavior.
   * When the form is submitted, the provided callback function is executed with the form data.
   * @param {Function} fn - The callback function to execute on form submission.
   * @returns {void}
   */

  formSubmit(fn) {
    this.#form.addEventListener("submit", (event) => {
      event.preventDefault();

      const file = this.#image.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fn({
            name: this.#name.value,
            image: event.target.result,
            description: this.#description.value,
            github: this.#github.value,
            live: this.#live.value,
          });

          saveDB();
        };
        reader.readAsDataURL(file);

        return;
      }

      fn({
        name: this.#name.value,
        image: "",
        description: this.#description.value,
        github: this.#github.value,
        live: this.#live.value,
      });
    });
  }

  /**
   * Adds a new row of data to the display.
   * This method can be adapted to render data in different ways.
   * @param {FormData} data - The data to add.
   * @returns {void}
   */
  addProject(data) {
    const row = document.createElement("div");
    row.classList.add("card-body-item");

    row.innerHTML = `
    <div class="card-body-item-image">
        <img src="${data.image}" alt="${data.name}" />
      </div>
      <div class="card-body-item-name">${data.name}</div>
      
      <div class="card-body-item-description">${data.description}.</div>

        <div class="card-body-item-actions">

<a href = '${
      this.#github.value || data.github
    }' target="_blank"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 30 30">
    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
</a>
</button>

<a href = "${this.#live.value || data.live}" ||  target = "_blank">
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
<path d="M 8.0136719 7.0292969 A 1.0001 1.0001 0 0 0 7.3222656 7.3222656 C 2.7995047 11.846068 -1.1842379e-15 18.102792 0 25 C 0 31.897208 2.7995047 38.153932 7.3222656 42.677734 A 1.0001 1.0001 0 0 0 8.7363281 42.677734 L 11.570312 39.84375 A 1.0001 1.0001 0 0 0 11.570312 38.429688 C 8.1286602 34.987084 6 30.242812 6 25 C 6 19.757188 8.1297921 15.013788 11.572266 11.572266 A 1.0001 1.0001 0 0 0 11.572266 10.158203 L 8.7363281 7.3222656 A 1.0001 1.0001 0 0 0 8.0136719 7.0292969 z M 41.957031 7.0292969 A 1.0001 1.0001 0 0 0 41.263672 7.3222656 L 38.427734 10.158203 A 1.0001 1.0001 0 0 0 38.427734 11.572266 C 41.870208 15.013788 44 19.757188 44 25 C 44 30.242812 41.870208 34.986212 38.427734 38.427734 A 1.0001 1.0001 0 0 0 38.427734 39.841797 L 41.263672 42.677734 A 1.0001 1.0001 0 0 0 42.677734 42.677734 C 47.201645 38.154865 50 31.897208 50 25 C 50 18.102792 47.200495 11.846068 42.677734 7.3222656 A 1.0001 1.0001 0 0 0 41.957031 7.0292969 z M 8.0976562 9.5117188 L 9.5195312 10.933594 C 6.1269359 14.664061 4 19.575176 4 25 C 4 30.424712 6.1260807 35.337173 9.5175781 39.068359 L 8.0976562 40.488281 C 4.3450168 36.394537 2 30.995061 2 25 C 2 19.004939 4.3450168 13.605463 8.0976562 9.5117188 z M 41.902344 9.5117188 C 45.654983 13.605463 48 19.004939 48 25 C 48 30.995061 45.655695 36.395442 41.902344 40.488281 L 40.480469 39.066406 C 43.873064 35.335939 46 30.424824 46 25 C 46 19.575176 43.873064 14.664061 40.480469 10.933594 L 41.902344 9.5117188 z M 14.382812 13.398438 A 1.0001 1.0001 0 0 0 13.691406 13.691406 C 10.796092 16.587786 9 20.593819 9 25 C 9 29.406181 10.796092 33.412214 13.691406 36.308594 A 1.0001 1.0001 0 0 0 15.105469 36.308594 L 17.931641 33.482422 A 1.0001 1.0001 0 0 0 17.931641 32.068359 C 16.119902 30.255711 15 27.761761 15 25 C 15 22.238239 16.119902 19.744289 17.931641 17.931641 A 1.0001 1.0001 0 0 0 17.931641 16.517578 L 15.105469 13.691406 A 1.0001 1.0001 0 0 0 14.382812 13.398438 z M 35.587891 13.398438 A 1.0001 1.0001 0 0 0 34.894531 13.691406 L 32.068359 16.517578 A 1.0001 1.0001 0 0 0 32.068359 17.931641 C 33.880098 19.744289 35 22.238239 35 25 C 35 27.761761 33.880098 30.255711 32.068359 32.068359 A 1.0001 1.0001 0 0 0 32.068359 33.482422 L 34.894531 36.308594 A 1.0001 1.0001 0 0 0 36.308594 36.308594 C 39.203908 33.412214 41 29.406181 41 25 C 41 20.593819 39.203908 16.587786 36.308594 13.691406 A 1.0001 1.0001 0 0 0 35.587891 13.398438 z M 14.466797 15.880859 L 15.947266 17.361328 C 14.184764 19.450917 13 22.061346 13 25 C 13 27.938654 14.184764 30.549083 15.947266 32.638672 L 14.466797 34.119141 C 12.335969 31.66133 11 28.50273 11 25 C 11 21.49727 12.335969 18.33867 14.466797 15.880859 z M 35.533203 15.880859 C 37.664031 18.33867 39 21.49727 39 25 C 39 28.50273 37.664031 31.66133 35.533203 34.119141 L 34.052734 32.638672 C 35.815236 30.549083 37 27.938654 37 25 C 37 22.061346 35.815236 19.450917 34.052734 17.361328 L 35.533203 15.880859 z M 25 18 C 21.134 18 18 21.134 18 25 C 18 28.866 21.134 32 25 32 C 28.866 32 32 28.866 32 25 C 32 21.134 28.866 18 25 18 z M 25 20 C 27.757 20 30 22.243 30 25 C 30 27.757 27.757 30 25 30 C 22.243 30 20 27.757 20 25 C 20 22.243 22.243 20 25 20 z"></path>
</svg>
</a>
       </div>
    `;
    this.#card.appendChild(row);
  }

  resetForm() {
    this.#form.reset();
  }

  /**
   * Displays a notification to the user.
   * This method can be overridden to change how notifications are presented.
   * @param {Object} notification - The notification to display.
   * @param {string} notification.msg - The message to display to the user.
   * @param {boolean} notification.isError - Whether the message is an error.
   * @returns {void}
   */
  notify({ msg, isError }) {
    alert(msg);
  }

  /**
   * Adds a new row of data to the display.
   * This method can be adapted to render data in different ways.
   * @param {FormData[]} items - The data to add.
   * @returns {void}
   */

  render(items) {
    items.forEach((item) => this.addProject(item));
  }
}
