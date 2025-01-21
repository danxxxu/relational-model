let eleIndex, actIndex;

import { drawVis } from "./sketch.js"
import { db } from "./input.js"

document.querySelector("#select_interaction").addEventListener("change", function () { getInteraction(document.querySelector("#select_interaction").value) });
document.querySelector("#open_new").addEventListener("click", openNewTab);

function openNewTab() {
    // get the current url with window.location.href
    window.open(window.location.href, "_blank");
}

// add url queries for ArtsIT2024; {artwork:name}
const searchParams = new URLSearchParams(window.location.search);
document.addEventListener('DOMContentLoaded', function () {
    if (searchParams.get('artwork')) {
        let name = '';
        // co-located interaction 
        if (searchParams.get('artwork') == "brainball") {
            name = 'Brainball (2003) by Smart Studio';
        }
        if (searchParams.get('artwork') == "randomly") {
            name = 'Randomly Generated Social Interactions (2016) by Anastasis Germanidis';
        }
        if (searchParams.get('artwork') == "worldskin") {
            name = 'World Skin (1997) by Maurice Benayoun';
        }
        if (searchParams.get('artwork') == "zoom") {
            name = 'Zoom Pavilion (2015) by Rafael Lozano-Hemmer';
        }
        if (searchParams.get('artwork') == "boundary") {
            name = 'Boundary Functions (1998) by Scott Snibbe';
        }
        if (searchParams.get('artwork') == "spatialsounds1") {
            name = 'Mode 1 - Spatial Sounds (100dB at 100kmh) (2000) by Marnix de Nijs and Edwin van der Heide';
        }
        if (searchParams.get('artwork') == "spatialsounds2") {
            name = 'Mode 2 - Spatial Sounds (100dB at 100kmh) (2000) by Marnix de Nijs and Edwin van der Heide';
        }
        if (searchParams.get('artwork') == "spatialsounds3") {
            name = 'Mode 3 - Spatial Sounds (100dB at 100kmh) (2000) by Marnix de Nijs and Edwin van der Heide';
        }
        if (searchParams.get('artwork') == "spatialsounds4") {
            name = 'Mode 4 - Spatial Sounds (100dB at 100kmh) (2000) by Marnix de Nijs and Edwin van der Heide';
        }
        if (searchParams.get('artwork') == "lights") {
            name = 'Lights Contacts (2009) by Scenocosme';
        }
        if (searchParams.get('artwork') == "bodymovies") {
            name = 'Body Movies (2001) by Rafael Lozano-Hemmer';
        }
        // more-than-human interaction
        if (searchParams.get('artwork') == "mouse") {
            name = 'Mouse Coach (2023) by Jiabao Li';
        }
        if (searchParams.get('artwork') == "intrafacing") {
            name = 'IntraFacing (2022) by Alinta Krauth';
        }
        if (searchParams.get('artwork') == "rocksalt") {
            name = 'Playful Rocksalt System (2015) by Hiroki Kobayashi, et al.';
        }
        if (searchParams.get('artwork') == "encounters") {
            name = 'Encounters of a Domestic Nature (2013) by Amy M Youngs';
        }
        if (searchParams.get('artwork') == "myconnect") {
            name = 'Myconnect (2013) by Saša Spačal, et al.';
        }
        // beyond interactive art
        if (searchParams.get('artwork') == "vibecheck") {
            name = 'Vibe Check (2020) by Lauren Lee McCarthy and Kyle McDonald';
        }
        if (searchParams.get('artwork') == "iwish") {
            name = 'I Wish You Knew That You Are Me (2024) by Dan Xu, Jonathan Thaw, Lauren Wedderburn';
        }
        getInteraction(name);
    }
})

function getInteraction(selectID) {
    // const selectID = document.querySelector("#select_interaction").value;
    const name = document.querySelector("#name_interaction");

    if (selectID == 0) {
        location.reload();
        name.value = '';
    } else {
        name.value = selectID;
        db.collection('interactions').doc(selectID).get().then((doc) => {
            displayInteraction(selectID, doc.data());
        });
    }

    const eleList = document.querySelector("#all_elements");
    eleList.style.display = "none";
    eleList.innerHTML = "";
    eleList.parentNode.querySelector("#element_list").innerText = "Show all elements";
};

let prevLock = false;
function displayInteraction(name, doc) {
    // check lock state, if not and previous sheet is locked, uplock all elements 
    if (!doc.lock) {
        const editable = document.querySelector('#editable');
        editable.disabled = true;

        const save = document.querySelector('#submit');
        save.disabled = false;
        const deleteB = document.querySelector('#delete');
        deleteB.disabled = false;
        if (prevLock) {
            const inputFields = document.querySelector("#input");
            const textarea = inputFields.getElementsByTagName('textarea');
            for (let i = 0; i < textarea.length; i++) {
                textarea[i].disabled = false;
            }

            const inputs = inputFields.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = false;
            }

            const selects = inputFields.getElementsByTagName('select');
            for (let i = 0; i < selects.length; i++) {
                selects[i].disabled = false;
            }

            const buttons = inputFields.getElementsByTagName('button');
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].disabled = false;
            }
        }
        prevLock = false;
    }
    // display additional info 
    const additionalInfo = document.querySelector("#additional_info");
    additionalInfo.value = doc.info;
    additionalInfo.oninput();
    // check number of elements to display
    const eleCount = doc.eleCount;
    let allElements = document.querySelectorAll(".element");
    const existEle = allElements.length;
    if (existEle < eleCount) {
        for (let i = existEle; i < eleCount; i++) {
            document.querySelector("#add_element").onclick();
        }
    } else if (existEle > eleCount) {
        for (let i = existEle; i > eleCount; i--) {
            allElements[i - 1].remove();
        }
    }
    allElements = document.querySelectorAll(".element");
    for (let i = 0; i < allElements.length; i++) {
        eleIndex = String("element" + (i + 1));
        allElements[i].querySelector("#type").value = doc[eleIndex].type;
        allElements[i].querySelector("#type").onchange();
    }
    //update footnotes and index selection list
    const footnoteContainer = document.querySelector("#footnote_container");
    const allFn = doc.footnote;
    if (allFn) {
        if (allFn.length > 0) {
            for (let i = 0; i < allFn.length; i++) {
                let fnCount = i + 1;
                let fnID = "footnote" + (i + 1);

                let footnoteHtml = '<div class="footnote_text"> <label style="font-weight: bold">*' + fnCount + ' ' + '</label><input id="' + fnID + '" oninput="resizeInput(this)"/> <button class="close" name="delete_fn" style="width:13px; height: 15px; font-size: 11px; right: 0" onclick="deleteFootnote(this)"> X</button></div>';

                footnoteContainer.insertAdjacentHTML("beforeend", footnoteHtml);

                fnID = "#" + fnID;
                footnoteContainer.querySelector(fnID).value = allFn[i];
                footnoteContainer.querySelector(fnID).oninput();
            }
        } else {
            footnoteContainer.innerHTML = "";
        }
    }

    //  update elements
    for (let i = 0; i < allElements.length; i++) {
        eleIndex = String("element" + (i + 1));
        // allElements[i].querySelector("#type").value = doc[eleIndex].type;
        allElements[i].querySelector("#ele_num").value = doc[eleIndex].eleNum;
        //check number of actions for each element
        const actCount = doc[eleIndex].actionCount;
        let allActions = allElements[i].querySelectorAll(".action");
        const existAct = allActions.length;
        if (existAct < actCount) {
            for (let j = existAct; j < actCount; j++) {
                allElements[i].querySelector("#add_action").onclick();
            }
        } else if (existAct > actCount) {
            for (let j = existAct; j > actCount; j--) {
                allActions[j - 1].remove();
            }
        }
        //update actions 
        allActions = allElements[i].querySelectorAll(".action");
        for (let j = 0; j < allActions.length; j++) {
            actIndex = "action" + (j + 1);
            allActions[j].querySelector("#actionV").value = doc[eleIndex][actIndex].action;
            if (doc[eleIndex][actIndex].intention) {
                allActions[j].querySelector("#intentional").checked = true;
            } else {
                allActions[j].querySelector("#unintentional").checked = true;
            }
            // check number of communications for each action 
            const comCount = doc[eleIndex][actIndex].comCount;
            let allCom = allActions[j].querySelectorAll(".communications");
            const existCom = allCom.length;
            if (existCom < comCount) {
                for (let k = existCom; k < comCount; k++) {
                    allActions[j].querySelector("#add_com").onclick();
                }
            } else if (existCom > comCount) {
                for (let k = existCom; k > comCount; k--) {
                    allCom[k - 1].parentNode.remove();
                }
            }
            allCom = allActions[j].querySelectorAll(".communications");
            for (let k = 0; k < allCom.length; k++) {
                // console.log(allCom[k].querySelector("#to"))
                allCom[k].querySelector("#to").value = doc[eleIndex][actIndex][k + 1].to;
                if (doc[eleIndex][actIndex][k + 1].direct) {
                    allCom[k].querySelector('#direct_means').checked = true;
                } else {
                    allCom[k].querySelector('#via_means').checked = true;
                    allCom[k].querySelector('#via').value = doc[eleIndex][actIndex][k + 1].via;
                }
                if (doc[eleIndex][actIndex][k + 1].public) {
                    allCom[k].querySelector('#public_access').checked = true;
                } else {
                    allCom[k].querySelector('#private_access').checked = true;
                }
                allCom[k].querySelector('#config_from').value = doc[eleIndex][actIndex][k + 1].configF;
                allCom[k].querySelector('#config_to').value = doc[eleIndex][actIndex][k + 1].configT;
                allCom[k].querySelector('#com_num').value = doc[eleIndex][actIndex][k + 1].comNum;

                //display effects
                const allEffect = doc[eleIndex][actIndex][k + 1].effect;
                let effectTexts = allCom[k].querySelectorAll(".effect");
                if (effectTexts.length < allEffect.length) {
                    for (let l = effectTexts.length; l < allEffect.length; l++) {
                        allCom[k].querySelector('.add_effect').onclick();
                    }
                } else if (effectTexts.length > allEffect.length) {
                    for (let l = effectTexts.length; l > allEffect.length; l--) {
                        effectTexts[l - 1].parentNode.remove();
                    }
                }
                effectTexts = allCom[k].querySelectorAll(".effect");
                for (let l = 0; l < allEffect.length; l++) {
                    effectTexts[l].value = allEffect[l];
                }
            }
        }
    }
    //add conditions 
    allElements = document.querySelectorAll(".element");
    for (let i = 0; i < allElements.length; i++) {
        eleIndex = String("element" + (i + 1));
        const allActions = allElements[i].querySelectorAll(".action");
        for (let j = 0; j < allActions.length; j++) {
            actIndex = "action" + (j + 1);

            //update condition field
            //display triggers 
            displayCondition(doc[eleIndex][actIndex].condition, allActions[j].querySelector("#trigger"), allFn);
            //display response
            displayCondition(doc[eleIndex][actIndex].response, allActions[j].querySelector("#response"), allFn);
        }
    }

    drawVis(name, doc);
    // lock all inputs if true
    if (doc.lock) {
        const save = document.querySelector('#submit');
        save.disabled = true;
        const deleteB = document.querySelector('#delete');
        deleteB.disabled = true;
        const editable = document.querySelector('#editable');
        editable.disabled = false;

        const inputFields = document.querySelector("#input");
        const textarea = inputFields.getElementsByTagName('textarea');
        for (let i = 0; i < textarea.length; i++) {
            textarea[i].disabled = true;
        }

        const inputs = inputFields.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }

        const selects = inputFields.getElementsByTagName('select');
        for (let i = 0; i < selects.length; i++) {
            selects[i].disabled = true;
        }

        const buttons = inputFields.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        prevLock = true;
    }
}

function displayCondition(condValue, condition, allFn) {
    let allBlock = condition.querySelectorAll(".act_block");

    if (allBlock.length < condValue.length) {
        for (let k = allBlock.length; k < condValue.length; k++) {
            allBlock[0].querySelector("#add").value = condValue[k - 1].add;
            allBlock[0].querySelector("#add").onchange();
        }
    } else if (allBlock.length > condValue.length) {
        for (let k = allBlock.length; k > condValue.length; k--) {
            allBlock[k - 1].remove();
        }
    }

    allBlock = condition.querySelectorAll(".act_block");

    for (let k = 0; k < allBlock.length; k++) {

        if (k == 0) {
            allBlock[k].querySelector("#add").value = condValue[k].add;
        }

        if (allBlock[k].querySelector(".if_ele")) {
            allBlock[k].querySelector(".if_ele").value = condValue[k].ifEle;
            allBlock[k].querySelector(".if_ele").onchange();
            allBlock[k].querySelector(".if_act").value = condValue[k].ifAct;
            allBlock[k].querySelector("#add").value = condValue[k].add;

            //update footnote 
            if (condValue[k].fnIndex != "") {
                for (let i = 0; i < allFn.length; i++) {
                    const fnCount = i + 1;
                    const option = '<option value="' + fnCount + '">*' + fnCount + '</option>';
                    condition.querySelector(".selectFootnote").insertAdjacentHTML("beforeend", option);
                }

                condition.querySelector(".selectFootnote").value = condValue[k].fnIndex;
            }
        }
    }
}