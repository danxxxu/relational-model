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

        const check = getRandomInt(2);
        if (check == 0) {
            action.querySelector("#intentional").checked = true;
        } else {
            action.querySelector("#unintentional").checked = true;
        }
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

const numOptions = ["1", "2", "3", "4", "5", "1+", "2+", "3+", "4+", "5+"]

function randomiseCommunication(e) {
    const com = e.parentNode.parentNode; // class=communications

    // direct at a random element
    const to = com.querySelector("#to");
    const options = to.getElementsByTagName('option');
    const index = getRandomInt(options.length - 1);
    to.selectedIndex = index + 1;

    // choose a random means
    const check = getRandomInt(2);
    if (check == 0) {
        com.querySelector("#direct_means").checked = true;
        com.querySelector("#via").value = "";
    } else {
        com.querySelector("#via_means").checked = true;

        const via = com.querySelector("#via");
        const options = via.getElementsByTagName('option');
        const index = getRandomInt(options.length - 1);
        via.selectedIndex = index + 1;
    }

    // choose random configuration 
    com.querySelector("#config_from").value = numOptions[getRandomInt(numOptions.length)];
    com.querySelector("#config_to").value = numOptions[getRandomInt(numOptions.length)];

    // choose random count 
    com.querySelector("#com_num").value = numOptions[getRandomInt(numOptions.length)];

    // choose random access
    const checkA = getRandomInt(2);
    if (checkA == 0) {
        com.querySelector("#public_access").checked = true;
    } else {
        com.querySelector("#private_access").checked = true;
    }
}

function randomiseAllCommunication() {
    // click Randomise for all communications 
    const allEle = document.body.querySelectorAll(".element");
    allEle.forEach(element => {
        const allAct = element.querySelectorAll(".action");
        allAct.forEach(action => {
            const allCom = action.querySelectorAll(".communications");
            allCom.forEach(com => {
                com.querySelector("#randomise_com").click();
            });
        });
    });

    document.body.querySelector("#visualise").click();
}


function randomiseCondition(e) {
    const cond = e.parentNode.parentNode; // id=condition
    const close = cond.querySelectorAll(".close");
    close.forEach(c => {
        c.onclick();
    });

    const triggerCond = cond.querySelector("#trigger");
    triggerCond.querySelector("#add").value = "";
    const responseCond = cond.querySelector("#response");
    responseCond.querySelector("#add").value = "";

    randmiseAdd(triggerCond.querySelector("#add"));
   
    const trigger = triggerCond.querySelectorAll(".if_ele");
    const acts = triggerCond.querySelectorAll(".if_act");
    let ind = 1;
    let then = false;

    let index = "";
    let preIndex = "";
    let actIndex = "";
    let preAct = "";
    let eleOpt, actOpt;
    // let triggerC = [];
    // let triggerEle = {};

    // const actionNum = document.querySelectorAll(".action");

    for (let i = 0; i < trigger.length; i++) {
        // triggerEle = {};

        eleOpt = trigger[i].getElementsByTagName('option');
        index = getRandomInt(eleOpt.length - 1) + 1;
        if (trigger.length == 1) {
            trigger[i].selectedIndex = index;
            trigger[i].onchange();

            // if not self-intiated, select action of the element
            if (index != ind) {
                actOpt = acts[i].getElementsByTagName('option');
                actIndex = getRandomInt(actOpt.length - 1) + 1;
                acts[i].selectedIndex = actIndex;

                // then = true;
                // triggerEle.if_ele = index - 1;
                // triggerEle.if_act = actIndex;
                // triggerC.push(triggerEle);
            }
        } else {
            if (eleOpt.length < 3) {
                if (i > 0) {
                    trigger[i].parentNode.remove();
                    trigger[i - 1].parentNode.querySelector("#add").value = "";
                }
            } else {
                // then = true;
                if (index != preIndex) {
                    trigger[i].selectedIndex = index;
                    trigger[i].onchange();
                    if (index != ind) {
                        actOpt = acts[i].getElementsByTagName('option');
                        actIndex = getRandomInt(actOpt.length - 1) + 1;
                        acts[i].selectedIndex = actIndex;
                        preAct = actIndex;

                        // if (actionNum.length < 4) {
                        //     then = false;
                        // }

                        // triggerEle.if_ele = index - 1;
                        // triggerEle.if_act = actIndex;
                        // triggerC.push(triggerEle);
                    }
                } else {
                    do { index = getRandomInt(eleOpt.length - 1) + 1; } while (index == 1);
                    trigger[i].selectedIndex = index;
                    trigger[i].onchange();
                    actOpt = acts[i].getElementsByTagName('option');
                    if (actOpt.length > 2) {
                        do { actIndex = getRandomInt(actOpt.length - 1) + 1; } while (actIndex == preAct);
                        acts[i].selectedIndex = actIndex;
                        preAct = actIndex;

                        // triggerEle.if_ele = index - 1;
                        // triggerEle.if_act = actIndex;
                        // triggerC.push(triggerEle);
                    } else {
                        do { index = getRandomInt(eleOpt.length - 1) + 1; } while (index == preIndex);
                        trigger[i].selectedIndex = index;
                        trigger[i].onchange();
                        if (index != ind) {
                            actOpt = acts[i].getElementsByTagName('option');
                            actIndex = getRandomInt(actOpt.length - 1) + 1;
                            acts[i].selectedIndex = actIndex;
                            preAct = actIndex;

                            // triggerEle.if_ele = index - 1;
                            // triggerEle.if_act = actIndex;
                            // triggerC.push(triggerEle);
                        }
                    }
                }
                preIndex = index;
            }
        }
    }
    // console.log(triggerC);
    // if (actionNum.length < 3) {
    //     then = false;
    // }

    // if (then) {
    //     randmiseAdd(responseCond.querySelector("#add"));
    // }
    // const response = responseCond.querySelectorAll(".if_ele");
    // if (response.length > 0) {
    //     const responseAct = responseCond.querySelectorAll(".if_act");
    //     for (let i = 0; i < response.length; i++) {
    //         let responseE = {};
    //         eleOpt = response[i].getElementsByTagName('option');
    //         actOpt = responseAct[i].getElementsByTagName('option');

    //         responseE.if_ele = getRandomInt(eleOpt.length - 1) + 1;
    //         response[i].selectedIndex = responseE.if_ele;
    //         response[i].onchange();
    //         responseE.if_act = getRandomInt(actOpt.length - 1) + 1;
    //         // console.log(responseE);

    //         let loop = containsObject(responseE, triggerC);
    //         do {
    //             responseE.if_ele = getRandomInt(eleOpt.length - 1) + 1;
    //             response[i].selectedIndex = responseE.if_ele;
    //             response[i].onchange();
    //             responseE.if_act = getRandomInt(actOpt.length - 1) + 1;

    //             loop = containsObject(responseE, triggerC);
    //         } while (loop);

    //         responseAct[i].selectedIndex = responseE.if_act;
    //     }
    // }
}


function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].if_ele == obj.if_ele && list[i].if_act == obj.if_act) {
            return true;
        }
    }
    return false;
}

function randmiseAdd(add) {
    // select combination 
    const addOptions = add.getElementsByTagName('option');
    const addIndex = getRandomInt(addOptions.length);
    add.selectedIndex = addIndex;
    add.onchange();
}

// function randomiseIf(trigger, acts, ind) {
//     let index = "";
//     let preIndex = "";
//     let actIndex = "";
//     let preAct = "";
//     let eleOpt, actOpt;

//     for (let i = 0; i < trigger.length; i++) {
//         eleOpt = trigger[i].getElementsByTagName('option');
//         index = getRandomInt(eleOpt.length - 1) + 1;
//         if (trigger.length == 1) {
//             trigger[i].selectedIndex = index;
//             trigger[i].onchange();

//             // if not self-intiated, select action of the element
//             if (index != ind) {
//                 actOpt = acts[i].getElementsByTagName('option');
//                 actIndex = getRandomInt(actOpt.length - 1) + 1;
//                 acts[i].selectedIndex = actIndex;
//             }
//         } else {
//             if (eleOpt.length < 3) {
//                 if (i > 0) {
//                     trigger[i].parentNode.remove();
//                     trigger[i - 1].parentNode.querySelector("#add").value = "";
//                 }
//             } else {
//                 if (index != preIndex) {
//                     trigger[i].selectedIndex = index;
//                     trigger[i].onchange();
//                     if (index != ind) {
//                         actOpt = acts[i].getElementsByTagName('option');
//                         actIndex = getRandomInt(actOpt.length - 1) + 1;
//                         acts[i].selectedIndex = actIndex;
//                         preAct = actIndex;
//                     }
//                 } else {
//                     do { index = getRandomInt(eleOpt.length - 1) + 1; } while (index == 1);
//                     trigger[i].selectedIndex = index;
//                     trigger[i].onchange();
//                     actOpt = acts[i].getElementsByTagName('option');
//                     if (actOpt.length > 2) {
//                         do { actIndex = getRandomInt(actOpt.length - 1) + 1; } while (actIndex == preAct);
//                         acts[i].selectedIndex = actIndex;
//                         preAct = actIndex;
//                     } else {
//                         do { index = getRandomInt(eleOpt.length - 1) + 1; } while (index == preIndex);
//                         trigger[i].selectedIndex = index;
//                         trigger[i].onchange();
//                         if (index != ind) {
//                             actOpt = acts[i].getElementsByTagName('option');
//                             actIndex = getRandomInt(actOpt.length - 1) + 1;
//                             acts[i].selectedIndex = actIndex;
//                             preAct = actIndex;
//                         }
//                     }
//                 }
//                 preIndex = index;
//             }
//         }
//     }
// }

function randomiseAllCondition() {
    // click Randomise for all communications 
    const allEle = document.body.querySelectorAll(".element");
    allEle.forEach(element => {
        const allAct = element.querySelectorAll(".action");
        allAct.forEach(action => {
            action.querySelector("#randomise_cond").click();
        });
    });

    document.body.querySelector("#visualise").click();
}