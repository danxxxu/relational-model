let perCondCount = 0;
let actionPair = [];
let conditionPair = [];
let totalAction;

function permutateCondition(e) {
    actionPair = [{ ele: 0, act: 0 }];
    const actIndex = e.parentNode.parentNode.parentNode.querySelector("#actionIn").innerText;
    const eleIndex = e.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("#index").innerText.replace("#", "");

    const allEle = document.querySelectorAll(".element");
    allEle.forEach(element => {
        const eleIn = element.querySelector("#index").innerText.replace("#", "");
        const allActions = element.querySelectorAll(".action");
        allActions.forEach(action => {
            const actIn = action.querySelector("#actionIn").innerText;
            let pair = {};
            if (eleIn != eleIndex || actIn != actIndex) {
                pair.ele = eleIn;
                pair.act = actIn;
                actionPair.push(pair);
            }
        });
    });

    totalAction = actionPair.length;
    conditionPair = getPairs(actionPair);
    const totalCond = totalAction + conditionPair.length * 2;

    const permutateCondCount = e.parentNode.querySelector("#permutateCondCount");
    perCondCount = permutateCondCount.value;
    permutateCondCount.setAttribute("max", totalCond);
    permutateCondCount.setAttribute("min", 1);
    permutateCondCount.removeAttribute('disabled');

    if (perCondCount == totalCond) {
        perCondCount = 0;
    }

    loadCondition(e, perCondCount, totalAction, conditionPair, totalCond);

    perCondCount++;
    permutateCondCount.value = perCondCount;
}

function getPairs(array) {
    return array.reduce(
        (previousValue, currentValue, index) =>
            previousValue.concat(
                array.slice(index + 1).map((value) => [currentValue, value]),
            ),
        [],
    );
}

function loadCondition(e, condCount, totalAction, conditionPair, totalCond) {
    if (condCount < totalAction) {
        const close = e.parentNode.parentNode.querySelectorAll(".close");
        close.forEach(c => {
            c.onclick();
        });
        e.parentNode.parentNode.querySelector("#add").value = ""; //AND

        const ifEle = e.parentNode.parentNode.querySelector(".if_ele");

        if (actionPair[condCount].ele == 0) {
            ifEle.selectedIndex = 1;
            ifEle.onchange();
        } else {
            ifEle.value = actionPair[condCount].ele;
            ifEle.onchange();
            const ifAct = e.parentNode.parentNode.querySelector(".if_act");
            ifAct.value = actionPair[condCount].act;
        }
    }
    else if (condCount < totalAction + conditionPair.length) {
        if (condCount == totalAction) {
            const close = e.parentNode.parentNode.querySelectorAll(".close");
            close.forEach(c => {
                c.onclick();
            });
            e.parentNode.parentNode.querySelector("#add").value = 0; //OR
            e.parentNode.parentNode.querySelector("#add").onchange();
        }
        const allIfEle = e.parentNode.parentNode.querySelectorAll(".if_ele");
        const allIfAct = e.parentNode.parentNode.querySelectorAll(".if_act");
        let count = condCount - totalAction;

        allIfEle[0].value = conditionPair[count][0].ele;
        allIfEle[0].onchange();
        if (conditionPair[count][0].ele != 0) {
            allIfAct[0].value = conditionPair[count][0].act;
        }

        allIfEle[1].value = conditionPair[count][1].ele;
        allIfEle[1].onchange();
        if (conditionPair[count][1].ele != 0) {
            allIfAct[1].value = conditionPair[count][1].act;
        }
    } else if (condCount < totalCond) {
        if (condCount == totalAction + conditionPair.length) {
            const close = e.parentNode.parentNode.querySelectorAll(".close");
            close.forEach(c => {
                c.onclick();
            });
            e.parentNode.parentNode.querySelector("#add").value = 1; //AND
            e.parentNode.parentNode.querySelector("#add").onchange();
        }
        const allIfEle = e.parentNode.parentNode.querySelectorAll(".if_ele");
        const allIfAct = e.parentNode.parentNode.querySelectorAll(".if_act");
        let count = condCount - (totalAction + conditionPair.length);

        allIfEle[0].value = conditionPair[count][0].ele;
        allIfEle[0].onchange();
        if (conditionPair[count][0].ele != 0) {
            allIfAct[0].value = conditionPair[count][0].act;
        }

        allIfEle[1].value = conditionPair[count][1].ele;
        allIfEle[1].onchange();
        if (conditionPair[count][1].ele != 0) {
            allIfAct[1].value = conditionPair[count][1].act;
        }
    }
}

function loadCondPermutation(e) {
    loadCondition(e, e.value - 1, totalAction, conditionPair, e.getAttribute("max"));
}