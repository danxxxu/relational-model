let eleIndex, actIndex;

document.querySelector("#display_interaction").addEventListener("click", getInteraction);
document.querySelector("#open_new").addEventListener("click", openNewTab);

function openNewTab() {
    window.open(window.location.href, "_blank");
}

function getInteraction() {
    const selectID = document.querySelector("#select_interaction").value;

    if (selectID == 0) {
        location.reload();
    } else {
        db.collection('interactions').doc(selectID).get().then((doc) => {
            displayInteraction(doc.data());
        });
    }
};

function displayInteraction(doc) {
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
    //  update elements
    allElements = document.querySelectorAll(".element");
    for (let i = 0; i < allElements.length; i++) {
        eleIndex = String("element" + (i + 1));
        allElements[i].querySelector("#type").value = doc[eleIndex].type;
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
                    allCom[k - 1].remove();
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
                allCom[k].querySelector('#effect').value = doc[eleIndex][actIndex][k + 1].effect;
            }
        }
    }
}
