// access collection 'interactions'
const interactions = db.collection('interactions');
let snapshot;
const interactionID = db.collection('data').doc('interactionID');
let existingID = [];
const elementType = db.collection('data').doc('elementType');
let existType = [];
const allAction = db.collection('data').doc('action');
let existAction = [];

let allInputs = {};

import { drawVis } from "./sketch.js"


document.querySelector("#visualise").addEventListener("click", visualise);
document.querySelector("#submit").addEventListener("click", submitDB);
document.querySelector("#delete").addEventListener("click", deleteDB);
// document.querySelector("#saveData").addEventListener("click", saveData);

window.addEventListener('load', loadData, false);

async function loadData() {
    // snapshot = await interactions.get();

    const allActions = await allAction.get();
    existAction = allActions.data().actions;

    const Etype = await elementType.get();
    existType = Etype.data().types;

    const allId = await interactionID.get();
    existingID = allId.data().ids;

    displayID()
    // displaySelect();
    const allEles = document.querySelectorAll(".element");
    allEles.forEach(element => {
        displaySelect(element);
        const allActs = element.querySelectorAll(".action");
        allActs.forEach(act => {
            displayAction(act);
        });
    });
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

function displaySelect(e) {
    const eTypes = e.querySelector("#existTypes");
    existType.forEach(type => {
        eTypes.innerHTML += `<option value="` + type + `"></option>`;
    });
}

function displayAction(e) {
    const eAction = e.querySelector("#existAction");
    existAction.forEach(action => {
        eAction.innerHTML += `<option value="` + action + `"></option>`;
    });
}

// visualise
function visualise() {
    collectAllInputs();
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
        document.querySelector("#name_interaction").value = "";
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
            let Aexist = false;

            let actionVal = action.querySelector("#actionV").value;
            actionVal = actionVal.toLowerCase().trim();
            for (let i = 0; i < existAction.length; i++) {
                if (actionVal == existAction[i]) {
                    Aexist = true;
                    break;
                }
            }
            if (!Aexist) {
                allAction.update({
                    actions: firebase.firestore.FieldValue.arrayUnion(actionVal)
                });
                existAction.push(actionVal);
            }

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

// function saveData() {
//     const allData = snapshot.docs;
//     let effects = [];
//     allData.forEach(doc => {
//         const data = doc.data();
//         for (let i = 0; i < data.eleCount; i++) {
//             const ele = "element" + (i + 1);
//             for (let j = 0; j < data[ele].actionCount; j++) {
//                 const act = "action" + (j + 1);
//                 for (let k = 0; k < data[ele][act].comCount; k++) {
//                     const com = k + 1;
//                     let line = data[ele][act][com].effect + '\n';
//                     effects.push(line);
//                 }
//             }
//         }
//     });
//     // console.log(effects);
//     let blob = new Blob(effects, {
//         type: "text/plain;charset=utf-8",
//      });
//      saveAs(blob, "data.txt");
// }