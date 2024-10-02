// const elementType = db.collection('data').doc('elementType');
let existType = [];
// const allAction = db.collection('data').doc('action');
let existAction = [];
// const allEffect = db.collection('data').doc('effect');
let existEffect = [];

import { snapshot, existData } from "./input.js";

// download data
// document.querySelector("#saveData").addEventListener("click", saveData);
document.querySelector("#updateType").addEventListener("click", updateType);
document.querySelector("#updateAction").addEventListener("click", updateAction);
document.querySelector("#updateEffect").addEventListener("click", updateEffect);

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

// get list of all existing types; DOESN'T REMOVE
function updateType() {
    const allData = snapshot.docs;
    allData.forEach(doc => {
        const data = doc.data();
        const eleCount = data.eleCount;

        for (let i = 0; i < eleCount; i++) {
            const eleIndex = i + 1;
            const ele = "element" + eleIndex;
            const eleType = data[ele].type;
            let exist = false;

            for (let j = 0; j < existType.length; j++) {
                if (existType[j] == eleType) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                existType.push(eleType);
            }
        }
    });
    console.log("update type!")
    let allType = {};
    allType.type = existType;
    existData.update(allType);
}

// update action list 
function updateAction() {
    const allData = snapshot.docs;
    allData.forEach(doc => {
        const data = doc.data();
        const eleCount = data.eleCount;

        for (let i = 0; i < eleCount; i++) {
            const eleIndex = i + 1;
            const ele = "element" + eleIndex;
            const actCount = data[ele].actionCount;
            for (let j = 0; j < actCount; j++) {
                const actIndex = j + 1;
                const act = "action" + actIndex;
                const actV = data[ele][act].action;
                let exist = false;

                for (let k = 0; k < existAction.length; k++) {
                    if (existAction[k] == actV) {
                        console.log("same action")
                        exist = true;
                        break
                    }
                }
                if (!exist) {
                    existAction.push(actV);
                }
            }

        }
    });
    console.log("update action!")
    let allAct = {};
    allAct.action = existAction;
    existData.update(allAct);
}

// update effect list
function updateEffect() {
    const allData = snapshot.docs;
    allData.forEach(doc => {
        const data = doc.data();
        const eleCount = data.eleCount;

        for (let i = 0; i < eleCount; i++) {
            const eleIndex = i + 1;
            const ele = "element" + eleIndex;
            const actCount = data[ele].actionCount;
            for (let j = 0; j < actCount; j++) {
                const actIndex = j + 1;
                const act = "action" + actIndex;
                const comCount = data[ele][act].comCount;

                for (let k = 0; k < comCount; k++) {
                    const com = k + 1;
                    const effectList = data[ele][act][com].effect;

                    effectList.forEach(effect => {
                        let exist = false;
                        for (let l = 0; l < existEffect.length; l++) {
                            if (existEffect[l] == effect) {
                                console.log("same effect")
                                exist = true;
                                break;
                            }
                        }
                        if (!exist) {
                            existEffect.push(effect);
                        }
                    });
                }
            }
        }
    });
    console.log("update effect!")
    let allEffect = {};
    allEffect.effect = existEffect;
    existData.update(allEffect);
}