let perComCount = 0;
let iter = 2;
let store = [];
let add = true;

function permutateCommunication(e) {
    const com = e.parentNode.parentNode;
    let pair = {}; // {to: , via: }
    const permutateCount = com.querySelector("#permutateCount");

    // set config 1 to 1 
    com.querySelector("#config_from").value = 1;
    com.querySelector("#config_to").value = 1;
    com.querySelector("#com_num").value = 1;
    // set iteraction 
    const to = com.querySelector("#to");
    const via = com.querySelector("#via");
    const options = to.getElementsByTagName('option');
    // number of elements 
    const eleNum = options.length - 1;
    permutateCount.setAttribute("max", eleNum * (eleNum + 1));
    if (perComCount < eleNum * (eleNum + 1)) {
        if (perComCount < eleNum) {
            // all forms of direct communication
            com.querySelector("#direct_means").checked = true;
            via.selectedIndex = 0;
            to.selectedIndex = perComCount + 1;
            pair.to = perComCount + 1;
            pair.via = 0;
        } else {
            // all forms of mediated communication
            com.querySelector("#via_means").checked = true;
            // perComCount = perComCount - eleNum * iter;
            if (perComCount < eleNum * iter) {
                to.selectedIndex = iter - 1;
                via.selectedIndex = perComCount - eleNum * (iter - 1) + 1;
                pair.to = iter - 1;
                pair.via = perComCount - eleNum * (iter - 1) + 1;
            }
            if (perComCount == eleNum * iter - 1) {
                iter++;
            }
        }
        perComCount++;
        permutateCount.value = perComCount;
        if (add) {
            store.push(pair);
            // console.log(store);
        }
        if (perComCount == eleNum * (eleNum + 1)) {
            perComCount = 0;
            iter = 2;
            add = false;
        }
    }
}

function loadPermutation(e){
    const com = e.parentNode.parentNode;
    const permutateCount = e.value;
    const selectPair = store[permutateCount - 1];

    if(selectPair.via == 0) {
        com.querySelector("#direct_means").checked = true;
        com.querySelector("#to").selectedIndex = selectPair.to;
        com.querySelector("#via").selectedIndex = selectPair.via;
    } else {
        com.querySelector("#via_means").checked = true;
        com.querySelector("#to").selectedIndex = selectPair.to;
        com.querySelector("#via").selectedIndex = selectPair.via;
    }
}