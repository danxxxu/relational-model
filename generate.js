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
const db = firebase.firestore();
const existData = db.collection('data').doc('data');

let existType = [];
let existAction = [];
let countV = ["1", "2", "3", "4", "5", "1+", "2+", "3+", "4+", "5+"];

window.addEventListener("load", loadData, false);

async function loadData() {
    const allData = await existData.get();
    existType = allData.data().type;
    existAction = allData.data().action;
}

// generate new elements
function generateElement(e) {
    // console.log(existType[getRandomInt(existType.length)]);
    const element = e.parentNode.parentNode;

    const eleType = element.querySelector("#type");
    eleType.value = existType[getRandomInt(existType.length)];

    const eleCount = element.querySelector("#ele_num");
    eleCount.value = countV[getRandomInt(countV.length)];

    const allAct = element.querySelectorAll(".action");
    allAct.forEach(action => {
        const actV = action.querySelector("#actionV");
        actV.value = existAction[getRandomInt(existAction.length)];
    });
}

// fill the emptied element fields
function completeElement(e) {
    // console.log(existType[getRandomInt(existType.length)]);
    const element = e.parentNode.parentNode;

    const eleType = element.querySelector("#type");
    if (eleType.value == "") {
        eleType.value = existType[getRandomInt(existType.length)];
    }

    const eleCount = element.querySelector("#ele_num");
    if (eleCount.value == "") {
        eleCount.value = countV[getRandomInt(countV.length)];
    }

    const allAct = element.querySelectorAll(".action");
    allAct.forEach(action => {
        const actV = action.querySelector("#actionV");
        if (actV.value == "") {
            actV.value = existAction[getRandomInt(existAction.length)];
        }
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}   