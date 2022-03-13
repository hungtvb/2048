export default class Title {
    #titleElement
    #x
    #y
    #value

    constructor(titleContainer, value = Math.random() > .5 ? 2 : 4){
        this.#titleElement = document.createElement("div");
        this.#titleElement.classList.add("title");
        titleContainer.append(this.#titleElement);
        this.value = value;
    }

    get value(){
        return this.#value;
    }

    set x(value){
        this.#x = value;
        this.#titleElement.style.setProperty("--x", value);
    }

    set y(value){
        this.#y = value;
        this.#titleElement.style.setProperty("--y", value);
    }


    set value(value){
        this.#value = value;
        this.#titleElement.textContent = value;
        const power = Math.log2(value);
        const backgroundLigthness = 100 - power * 9;
        this.#titleElement.style.setProperty("--background-lightness", `${backgroundLigthness}%`);
        this.#titleElement.style.setProperty("--text-lightness", `${backgroundLigthness <= 50 ? 90 : 10}%`);
    }

    remove() {
        this.#titleElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#titleElement.addEventListener(animation ? "animationend" : "transitionend", resolve, {once: true});
        })
    }
}