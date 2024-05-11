// access collection 'interactions'
let interactions = db.collection('interactions');
let interactionID = db.collection('data').doc('interactionID');
let existingID = [];
let elementType = db.collection('data').doc('elementType');
let existType = [];

let allInputs = {};

import { drawVis } from "./sketch.js"


document.querySelector("#visualise").addEventListener("click", visualise);
document.querySelector("#submit").addEventListener("click", submitDB);
document.querySelector("#delete").addEventListener("click", deleteDB);

window.addEventListener('load', loadData, false);

document.querySelector("#add_element").addEventListener('click', displaySelect());

async function loadData() {
    const Etype = await elementType.get();
    existType = Etype.data().types;

    const allId = await interactionID.get();
    existingID = allId.data().ids;

    displayID()
    displaySelect();
}

function displayID() {
    let selectInteraction = document.querySelector("#select_interaction");
    existingID.forEach(id => {
        selectInteraction.innerHTML += `<option value="` + id + `">` + id + `</option>`;
    });
};

function updateID(id) {
    let selectInteraction = document.querySelector("#select_interaction");
    selectInteraction.innerHTML += `<option value="` + id + `">` + id + `</option>`;
}

function displaySelect() {
    const allEles = document.querySelectorAll(".element");
    allEles.forEach(element => {
        const eTypes = element.querySelector("#existTypes");
        existType.forEach(type => {
            eTypes.innerHTML += `<option value="` + type + `"></option>`
        });
    });
}

// visualise
function visualise() {
    collectAllInputs();
    // drawVis(nodes, links);
    drawVis(allInputs);
}

// submit all inputs to database
function submitDB() {
    // const inputID = prompt('Please name the worksheet (avoid using . and /), e.g. "artwork title (year) by artist" or "ddmmyyyy short description".');
    const getID = document.querySelector("#name_interaction").value;
    let exist = false;
    let check = false;

    const inputID = getID.replace("/", "_");

    if (inputID) {
        // check whether id already exist, get existing list and compare  
        interactionID.get().then((doc) => {
            existingID = doc.data().ids;
            for (let i = 0; i < existingID.length; i++) {
                if (existingID[i] == inputID) {
                    exist = true;
                    break;
                }
            }
            if (exist) {
                check = confirm("The name already exists, do you want to overwrite the existing data?");
            }
            if (!exist || check) {
                //if the name does not exist or to update the existing interaction, save the entry to the database
                collectAllInputs();
                try {
                    interactions.doc(inputID).set(allInputs).then(alert("Data saved!"));
                    if (!exist) {
                        interactionID.update({
                            ids: firebase.firestore.FieldValue.arrayUnion(inputID)
                        });
                        updateID(inputID);
                    }
                }
                catch (err) {
                    alert("Please fill in all the input areas and submit again!");
                }
            }
        });
    } else {
        alert("Please name the worksheet and submit again!");
    }
}

function deleteDB() {
    const getID = document.querySelector("#name_interaction").value;
    let check = false;
    const msg = 'Are you sure to delete"' + getID + '"from the database?'
    check = confirm(msg);
    if (check) {
        interactions.doc(getID).delete().then(() => {
            console.log("Deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        interactionID.update({
            ids: firebase.firestore.FieldValue.arrayRemove(getID)
        });
        location.reload();
    }
}

function collectAllInputs() {
    allInputs = {};

    // getting all the inputs
    const allElements = document.querySelectorAll(".element");
    allInputs.eleCount = allElements.length;
    allElements.forEach(element => {
        let exist = false;
        const nodeIndex = element.querySelector("#index").innerText;
        const index = nodeIndex.replace("#", "element");
        allInputs[index] = {};
        allInputs[index].id = index;

        allInputs[index].type = element.querySelector("#type").value;
        for (let i = 0; i < existType.length; i++) {
            if (allInputs[index].type == existType[i]) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            elementType.update({
                types: firebase.firestore.FieldValue.arrayUnion(allInputs[index].type)
            });
            existType.push(allInputs[index].type);
        }

        allInputs[index].eleNum = element.querySelector("#ele_num").value;

        // get all actions from the selected element 
        const allActions = element.querySelectorAll(".action");
        allInputs[index].actionCount = allActions.length;
        let actionC = 0;
        allActions.forEach(action => {
            actionC++;

            const actionVal = action.querySelector("#actionV").value;
            // allInputs[index].actions.push(actionVal);
            const actionIndex = "action" + actionC;
            allInputs[index][actionIndex] = {};
            allInputs[index][actionIndex].action = actionVal;

            const condition = action.querySelector("#condition");
            allInputs[index][actionIndex].condition = [];

            const allIf = condition.querySelectorAll(".if_ele");
            const allIfAct = condition.querySelectorAll(".if_act");

            for (let i = 0; i < allIf.length; i++) {
                let cond = {};
                cond.ifEle = allIf[i].value;
                cond.ifAct = allIfAct[i].value;
                cond.add = allIf[i].parentNode.querySelector("#add").value;
                allInputs[index][actionIndex].condition.push(cond);
            }

            const allCom = action.querySelectorAll(".communications");
            allInputs[index][actionIndex].comCount = allCom.length;
            // allInputs[index].comCount.push(allCom.length);
            for (let i = 0; i < allCom.length; i++) {
                allInputs[index][actionIndex][i + 1] = {};
                const toElement = "#" + allCom[i].querySelector("#to").value;
                allInputs[index][actionIndex][i + 1].to = allCom[i].querySelector("#to").value;
                allInputs[index][actionIndex][i + 1].direct = allCom[i].querySelector(`#direct_means`).checked;

                if (!allInputs[index][actionIndex][i + 1].direct) {
                    allInputs[index][actionIndex][i + 1].via = allCom[i].querySelector("#via").value;
                }
                allInputs[index][actionIndex][i + 1].public = allCom[i].querySelector('#public_access').checked;
                allInputs[index][actionIndex][i + 1].configF = allCom[i].querySelector(`#config_from`).value;
                allInputs[index][actionIndex][i + 1].configT = allCom[i].querySelector(`#config_to`).value;
                allInputs[index][actionIndex][i + 1].comNum = allCom[i].querySelector(`#com_num`).value;
                allInputs[index][actionIndex][i + 1].effect = allCom[i].querySelector(`#effect`).value;
            }

        });
    });
}