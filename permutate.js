///////////// PERMUTATE COMMUNICATION //////////////
let perComCount = 0;
let allPermutation = [];
let storeAllPermutation = {};

// update the communication pairs for the element
function updateCommunicationPair(e) {
  allPermutation = [];
  let iter = 1;
  const allEle = document.querySelectorAll(".element");
  const eleNum = allEle.length;
  for (let i = 0; i < eleNum * (eleNum + 1); i++) {
    let pair = {};
    if (i < eleNum * iter) {
      if (iter == 1) {
        pair.to = i + 1;
        pair.via = 0;
      } else {
        pair.to = iter - 1;
        pair.via = i - eleNum * (iter - 1) + 1;
      }
    }
    if (i == eleNum * iter - 1) {
      iter++;
    }
    allPermutation.push(pair);
  }
  shuffle(allPermutation);

  // store allPermutation in object with key 
  const com = e.parentNode.parentNode;
  const comIndex = com.querySelector("#comIn").innerText;
  const actIndex = com.parentNode.parentNode.querySelector("#actionIn").innerText;
  const eleIndex = com.parentNode.parentNode.parentNode.parentNode.querySelector("#index").innerText;
  const permutationKey = eleIndex + "_" + actIndex + "_" + comIndex;
  storeAllPermutation[permutationKey] = allPermutation;
  console.log(storeAllPermutation);
}

function permutateCommunication(e) {
  const com = e.parentNode.parentNode;
  const permutateCount = com.querySelector("#permutateCount");
  permutateCount.removeAttribute('disabled');
  perComCount = permutateCount.value;
  // update the communication pairs
  if (perComCount == 0) {
    updateCommunicationPair(e);
  }

  const comIndex = com.querySelector("#comIn").innerText;
  const actIndex = com.parentNode.parentNode.querySelector("#actionIn").innerText;
  const eleIndex = com.parentNode.parentNode.parentNode.parentNode.querySelector("#index").innerText;
  const permutationKey = eleIndex + "_" + actIndex + "_" + comIndex;
  const communicationPair = storeAllPermutation[permutationKey];
  const pairMax = communicationPair.length;
  permutateCount.setAttribute("max", pairMax);
  if (perComCount == pairMax) {
    perComCount = 0;
  }

  // set config 1 to 1 
  com.querySelector("#config_from").value = 1;
  com.querySelector("#config_to").value = 1;
  com.querySelector("#com_num").value = 1;
  // set iteraction 
  const to = com.querySelector("#to");
  const via = com.querySelector("#via");

  if (perComCount < pairMax) {
    to.selectedIndex = communicationPair[perComCount].to;
    via.selectedIndex = communicationPair[perComCount].via;
    if (communicationPair[perComCount].via == 0) {
      com.querySelector("#direct_means").checked = true;
    } else {
      com.querySelector("#via_means").checked = true;
    }
    perComCount++;
    permutateCount.value = perComCount;
  }
  permutateCount.setAttribute("min", 0);
}

function loadPermutation(e) {
  const com = e.parentNode.parentNode;
  const permutateCount = e.value;
  if (permutateCount == 0) {
    updateCommunicationPair(e);
  } else {
    const comIndex = com.querySelector("#comIn").innerText;
    const actIndex = com.parentNode.parentNode.querySelector("#actionIn").innerText;
    const eleIndex = com.parentNode.parentNode.parentNode.parentNode.querySelector("#index").innerText;
    const permutationKey = eleIndex + "_" + actIndex + "_" + comIndex;
    const communicationPair = storeAllPermutation[permutationKey];
    const selectPair = communicationPair[permutateCount - 1];

    if (selectPair.via == 0) {
      com.querySelector("#direct_means").checked = true;
      com.querySelector("#to").selectedIndex = selectPair.to;
      com.querySelector("#via").selectedIndex = selectPair.via;
    } else {
      com.querySelector("#via_means").checked = true;
      com.querySelector("#to").selectedIndex = selectPair.to;
      com.querySelector("#via").selectedIndex = selectPair.via;
    }
  }
}

///////////// PERMUTATE CONDITION //////////////
let perCondCount = 0;
let actionPair = [];
let conditionPair = [];
let allCondition = [];
let storeConditionPair = {};
let totalAction;

function updateConditionPair(e) {
  allCondition = [];
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

  for (let i = 0; i < totalCond; i++) {
    let cond = {};
    if (i < totalAction) {
      cond.add = "";
      cond.cond = actionPair[i];
      allCondition.push(cond);
    } else if (i < totalAction + conditionPair.length) {
      const count = i - totalAction;
      cond.add = 0;
      cond.cond = conditionPair[count];
      allCondition.push(cond);
    } else {
      const count = i - (totalAction + conditionPair.length);
      cond.add = 1;
      cond.cond = conditionPair[count];
      allCondition.push(cond);
    }
  }

  shuffle(allCondition);
  const index = eleIndex + "_" + actIndex;
  storeConditionPair[index] = allCondition;
  // console.log(storeConditionPair);
}

function permutateCondition(e) {
  const permutateCondCount = e.parentNode.querySelector("#permutateCondCount");
  perCondCount = permutateCondCount.value;
  if (perCondCount == 0) {
    updateConditionPair(e);
  }
  const actIndex = e.parentNode.parentNode.parentNode.querySelector("#actionIn").innerText;
  const eleIndex = e.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("#index").innerText.replace("#", "");
  const index = eleIndex + "_" + actIndex;
  const currentCondition = storeConditionPair[index];
  const totalCond = currentCondition.length;

  permutateCondCount.setAttribute("max", totalCond);
  permutateCondCount.setAttribute("min", 0);
  permutateCondCount.removeAttribute('disabled');

  if (perCondCount == totalCond) {
    perCondCount = 0;
  }

  loadCondition(e, perCondCount);

  perCondCount++;
  permutateCondCount.value = perCondCount;
}
// return a 2D array of pairs of actions
function getPairs(array) {
  return array.reduce(
    (previousValue, currentValue, index) =>
      previousValue.concat(
        array.slice(index + 1).map((value) => [currentValue, value]),
      ),
    [],
  );
}

function loadCondition(e, condCount) {
  const actIndex = e.parentNode.parentNode.parentNode.querySelector("#actionIn").innerText;
  const eleIndex = e.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("#index").innerText.replace("#", "");
  const index = eleIndex + "_" + actIndex;
  const currentCondition = storeConditionPair[index];
  const cond = currentCondition[condCount];

  const close = e.parentNode.parentNode.querySelectorAll(".close");
  close.forEach(c => {
    c.onclick();
  });

  if (cond.add === "") {
    e.parentNode.parentNode.querySelector("#add").value = "";
    const ifEle = e.parentNode.parentNode.querySelector(".if_ele");

    if (cond.cond.ele == 0) {
      ifEle.selectedIndex = 1;
      ifEle.onchange();
    } else {
      ifEle.value = cond.cond.ele;
      ifEle.onchange();
      const ifAct = e.parentNode.parentNode.querySelector(".if_act");
      ifAct.value = cond.cond.act;
    }
  } else {
    e.parentNode.parentNode.querySelector("#add").value = cond.add;
    e.parentNode.parentNode.querySelector("#add").onchange();
    const allIfEle = e.parentNode.parentNode.querySelectorAll(".if_ele");
    const allIfAct = e.parentNode.parentNode.querySelectorAll(".if_act");
    for (let i = 0; i < allIfEle.length; i++) {
      allIfEle[i].value = cond.cond[i].ele;
      allIfEle[i].onchange();
      allIfAct[i].value = cond.cond[i].act;
    }
  }
}

function loadCondPermutation(e) {
  if(e.value > 0){
    loadCondition(e, e.value - 1);
  } else {
    updateConditionPair(e);
  }
}

// shuffle an array 
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}