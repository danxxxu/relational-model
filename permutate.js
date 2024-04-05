const mainR = 55;
const dirR = 0;
const viaR = 15;
const viaR1 = viaR - 1;
const mainDist = 50;
const viaDist = -10;
const dirDist = - 50;

let allInputs = {};
let node = {};
let link = {};

// let nodes = [];
// let links = [];

let counter = 0;

export { mainR, viaR1, viaR };
import { drawVis } from "./script.js"

document.querySelector("#permutate").addEventListener("click", permutate);

function permutate() {
    counter++;

    const allElements = document.querySelectorAll(".element");
    allElements.forEach(element => {
        node = {};
        link = {};

        const index = element.querySelector("#index").innerText;
        allInputs[index] = {};
        allInputs[index].type = element.querySelector("#type").value;
        allInputs[index].eleNum = element.querySelector("#ele_num").value;

        // add main nodes
        // node.id = index;
        // node.size = mainR;
        // node.text = index + ` ` + allInputs[index].type;
        // node.num = `(` + allInputs[index].eleNum + `)`;
        // nodes.push(node);
    });

    // console.log(nodes);
    // console.log(counter);
}