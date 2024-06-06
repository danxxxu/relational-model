const firebaseConfig = {
    authDomain: "relational-model-data.firebaseapp.com",
    projectId: "relational-model-data",
    storageBucket: "relational-model-data.appspot.com",
    messagingSenderId: "845462482682",
    appId: "1:845462482682:web:3fd7c8be3bf7ac09e1e343",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = firebase.firestore();


// access collection 'interactions'
const interactions = db.collection('interactions');
export let snapshot;
const interactionID = db.collection('data').doc('interactionID');
let existingID = [];
export const existData = db.collection('data').doc('data');

let existType = [];
let existAction = [];
let existEffect = [];

let allInputs = {};

import { drawVis } from "./sketch.js"

document.querySelector("#visualise").addEventListener("click", visualise);
document.querySelector("#submit").addEventListener("click", submitDB);
document.querySelector("#delete").addEventListener("click", deleteDB);

window.addEventListener('load', loadData, false);

async function loadData() {
    snapshot = await interactions.get();

    const allData = await existData.get();
    existType = allData.data().type;
    existAction = allData.data().action;
    existEffect = allData.data().effect;

    const allId = await interactionID.get();
    existingID = allId.data().ids;

    displayID();
    const allEles = document.querySelectorAll(".element");
    allEles.forEach(element => {
        displaySelect(element);
        const allActs = element.querySelectorAll(".action");
        allActs.forEach(act => {
            displayAction(act);
            const allCom = act.querySelectorAll(".communications");
            allCom.forEach(com => {
                displayEffect(com);
            });
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

function displayEffect(e) {
    const eEffect = e.querySelector("#existEffect");
    existEffect.forEach(effect => {
        eEffect.innerHTML += `<option value="` + effect + `"></option>`;
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
    const msg = 'Are you sure to delete "' + getID + '" from the database?'
    check = confirm(msg);
    if (check) {
        interactions.doc(getID).delete().then(() => {
            console.log("Deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        interactionID.update({
            ids: firebase.firestore.FieldValue.arrayRemove(getID)
        }).then(() => {
            console.log("removed");
            location.reload();
            document.querySelector("#name_interaction").value = "";
        });
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
            existData.update({
                type: firebase.firestore.FieldValue.arrayUnion(allInputs[index].type)
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
                existData.update({
                    action: firebase.firestore.FieldValue.arrayUnion(actionVal)
                });
                existAction.push(actionVal);
            }

            // allInputs[index].actions.push(actionVal);
            const actionIndex = "action" + actionC;
            allInputs[index][actionIndex] = {};
            allInputs[index][actionIndex].action = actionVal;

            allInputs[index][actionIndex].intention = action.querySelector("#intentional").checked;

            const condition = action.querySelector("#condition");
            allInputs[index][actionIndex].condition = [];

            const allIf = condition.querySelectorAll(".if_ele");
            const allIfAct = condition.querySelectorAll(".if_act");

            for (let i = 0; i < allIf.length; i++) {
                let cond = {};
                cond.ifEle = allIf[i].value;
                cond.ifAct = allIfAct[i].value;
                cond.add = allIf[i].parentNode.querySelector("#add").value;
                //save footnote index
                if (allIf.length > 2) {
                    cond.fnIndex = condition.querySelector(".selectFootnote").value;
                } else {
                    cond.fnIndex = "";
                }
                allInputs[index][actionIndex].condition.push(cond);
            }

            const allCom = action.querySelectorAll(".communications");
            allInputs[index][actionIndex].comCount = allCom.length;
            // allInputs[index].comCount.push(allCom.length);
            for (let i = 0; i < allCom.length; i++) {
                allInputs[index][actionIndex][i + 1] = {};
                // const toElement = "#" + allCom[i].querySelector("#to").value;
                allInputs[index][actionIndex][i + 1].to = allCom[i].querySelector("#to").value;
                allInputs[index][actionIndex][i + 1].direct = allCom[i].querySelector(`#direct_means`).checked;

                if (!allInputs[index][actionIndex][i + 1].direct) {
                    allInputs[index][actionIndex][i + 1].via = allCom[i].querySelector("#via").value;
                }
                allInputs[index][actionIndex][i + 1].public = allCom[i].querySelector('#public_access').checked;
                allInputs[index][actionIndex][i + 1].configF = allCom[i].querySelector(`#config_from`).value;
                allInputs[index][actionIndex][i + 1].configT = allCom[i].querySelector(`#config_to`).value;
                allInputs[index][actionIndex][i + 1].comNum = allCom[i].querySelector(`#com_num`).value;

                // gather effects
                let allEffect = [];
                const effectTexts = allCom[i].querySelectorAll(`.effect`);
                effectTexts.forEach(effect => {
                    let effectV = effect.value.toLowerCase().trim();
                    allEffect.push(effectV);

                    let Eexist = false;
                    for (let i = 0; i < existEffect.length; i++) {
                        if (effectV == existEffect[i]) {
                            Eexist = true;
                            break;
                        }
                    }
                    if (!Eexist) {
                        existData.update({
                            effect: firebase.firestore.FieldValue.arrayUnion(effectV)
                        });
                        existEffect.push(actionVal);
                    }
                });
                allInputs[index][actionIndex][i + 1].effect = allEffect;
            }
        });
    });

    //save footnote texts
    const footnoteContainer = document.querySelector("#footnote_container");
    const allFootnote = footnoteContainer.querySelectorAll(".footnote_text");
    let fnTexts = [];

    if (allFootnote.length > 0) {
        allFootnote.forEach(fn => {
            fnTexts.push(fn.querySelector('input').value);
        });
        allInputs.footnote = fnTexts;
    } else {
        allInputs.footnote = [];
    }
}
