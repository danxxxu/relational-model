const firebaseConfig = {
    apiKey: "AIzaSyBovR4YJ6RTEBWgAVnZ0Yb_ryFjk7zuzwA",
    authDomain: "relational-model-data.firebaseapp.com",
    projectId: "relational-model-data",
    storageBucket: "relational-model-data.appspot.com",
    messagingSenderId: "845462482682",
    appId: "1:845462482682:web:3fd7c8be3bf7ac09e1e343",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();
// access collection 'interactions'
const interactions = db.collection('interactions');

let allInputs = {};

const mainR = 55;
const dirR = 0;
const viaR = 15;
const viaR1 = viaR - 1;
const mainDist = 50;
const viaDist = -10;
const dirDist = - 50;

let node = {};
let link = {};

let nodes = [];
let links = [];

export { mainR, viaR1, viaR };
import { drawVis } from "./script.js"

document.querySelector("#visualise").addEventListener("click", visualise);
document.querySelector("#submit").addEventListener("click", submitDB);

// visualise
function visualise() {
    collectAllInputs();
    // console.log(nodes);
    // console.log(links);
    drawVis(nodes, links);
}

// submit all inputs to database
function submitDB() {
    let interactionID = prompt('Please name the interaction (avoid using . and /), e.g. "artwork title (year) by artist" or "ddmmyyyy short description"');

    // check whether id already exist 
    if (interactionID) {
        collectAllInputs();

        try {
            interactions.doc(interactionID).set(allInputs).then(console.log("submitted"));
        }
        catch (err) {
            alert("Please fill in all the input areas and submit again!");
        }
    } else {
        alert("Please name the interaction and submit again!");
    }
}

function collectAllInputs() {
    allInputs = {};
    nodes = []; // {id, index, num, size, text}
    links = []; // {source, target, index, distance, dash}

    // getting all the inputs
    const allElements = document.querySelectorAll(".element");
    allElements.forEach(element => {
        node = {};
        link = {};

        const index = element.querySelector("#index").innerText;
        allInputs[index] = {};
        allInputs[index].id = index;
        allInputs[index].type = element.querySelector("#type").value;
        allInputs[index].eleNum = element.querySelector("#ele_num").value;

        // add main nodes
        node.id = index;
        node.size = mainR;
        node.text = index + ` ` + allInputs[index].type;
        node.num = `(` + allInputs[index].eleNum + `)`;
        nodes.push(node);

        // allInputs[index].actions = [];
        // allInputs[index].comCount = [];

        // get all actions from the selected element 
        const allActions = element.querySelectorAll(".action");
        allActions.forEach(action => {
            const actionVal = action.querySelector("#actionV").value;
            // allInputs[index].actions.push(actionVal);
            allInputs[index][actionVal] = {};

            const allCom = action.querySelectorAll(".communications");
            // allInputs[index].comCount.push(allCom.length);
            for (let i = 0; i < allCom.length; i++) {
                allInputs[index][actionVal][i + 1] = {};
                const toElement = allInputs[index][actionVal][i + 1].to = '#' + allCom[i].querySelector("#to").value;
                allInputs[index][actionVal][i + 1].direct = allCom[i].querySelector(`#direct_means`).checked;

                // add direct links 
                if (allInputs[index][actionVal][i + 1].direct) {
                    if (toElement != index) {
                        link = {};
                        link.source = index;
                        link.target = toElement;
                        link.distance = mainDist;
                        link.dash = `none`;
                        links.push(link);
                    } else {
                        node = {};
                        node.id = index + `_to_` + toElement;
                        node.size = dirR;
                        node.text = ``;
                        node.num = ``;
                        nodes.push(node);

                        link = {};
                        link.source = index;
                        link.target = node.id;
                        link.distance = dirDist;
                        link.dash = `none`;
                        links.push(link);

                        link = {};
                        link.source = node.id;
                        link.target = toElement;
                        link.distance = dirDist;
                        link.dash = `none`;
                        links.push(link);
                    }
                } else {
                    // add via links 
                    const viaElement = '#' + allCom[i].querySelector("#via").value;
                    // console.log(viaElement);

                    if (toElement != index) {
                        node = {};
                        node.id = index + `_via_` + viaElement + `_to_` + toElement;
                        node.size = viaR;
                        node.text = viaElement;
                        node.num = ``;
                        nodes.push(node);

                        link = {};
                        link.source = index;
                        link.target = node.id;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link);

                        link = {};
                        link.source = node.id;
                        link.target = toElement;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link)
                    } else {
                        node = {};
                        node.id = index + `_via_` + viaElement + `_to_` + toElement;
                        node.size = viaR1;
                        node.text = viaElement;
                        node.num = ``;
                        nodes.push(node);

                        link = {};
                        link.source = index;
                        link.target = node.id;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link);

                        link = {};
                        link.source = node.id;
                        link.target = toElement;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link)
                    }
                }
                if (!allInputs[index][actionVal][i + 1].direct) {
                    allInputs[index][actionVal][i + 1].via = '#' + allCom[i].querySelector("#via").value;
                }
                allInputs[index][actionVal][i + 1].public = allCom[i].querySelector('#public_access').checked;
                allInputs[index][actionVal][i + 1].configF = allCom[i].querySelector(`#config_from`).value;
                allInputs[index][actionVal][i + 1].configT = allCom[i].querySelector(`#config_to`).value;
                allInputs[index][actionVal][i + 1].comNum = allCom[i].querySelector(`#com_num`).value;
                allInputs[index][actionVal][i + 1].effect = allCom[i].querySelector(`#effect`).value;

            }

        });
    });

    for (let i = 0; i < nodes.length; i++) {
        links.forEach(link => {
            if (nodes[i].id == link.source) {
                link.source = i;
            }
            if (nodes[i].id == link.target) {
                link.target = i;
            }
        });
    }
}