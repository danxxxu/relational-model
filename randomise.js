document.querySelector("#randomise").addEventListener("click", randomise);

let allInputs = [];
let input = {};
let options = ``;
let count = 0;

function randomise() {
  options = ``;
  const allElements = document.querySelectorAll(".element");
  const elementN = allElements.length;
  for (let i = 1; i < (elementN + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }
  // randomly assigning different number of communications to each element 
  allElements.forEach(element => {
    allInputs = []
    const eleIndex = element.querySelector("#index").innerText;
    const actionIndex = element.querySelector("#actionIn").innerText;
    let comN = Math.ceil(Math.random() * (elementN + elementN * elementN));
    // randomly select number of communications for the element, the max: elementN + elementN * elementN 
    let communications = element.querySelectorAll('.communications');
    let existComN = communications.length;
    if (existComN < comN) {
      for (let i = existComN; i < comN; i++) {
        addCom(options, eleIndex, actionIndex, count, communications[existComN - 1]);
        count ++;
      }
    } else if (existComN > comN) {
      for (let i = existComN; i > comN; i--) {
        communications[i - 1].remove();
      }
    }
  });

  allElements.forEach(element => {
    let communications = element.querySelectorAll('.communications');
    let index = 0;
    allInputs = [];

    communications.forEach(communication => {
      input = {};
      input.in = index;

      // select a random element from 'to' dropdown list 
      let randIndex = Math.ceil(Math.random() * elementN);
      communication.querySelector('#to').value = randIndex;
      input.to = randIndex;

      //select a random means 
      let randMeans = Math.random();
      if (randMeans < 0.5) {
        communication.querySelector('#direct_means').checked = true;
        input.direct = true;
        communication.querySelector('#via_means').checked = false;
        input.via = false;
        communication.querySelector('#via').value = '';
        input.viaE = '';
      } else {
        communication.querySelector('#direct_means').checked = false;
        input.direct = false;
        communication.querySelector('#via_means').checked = true;
        input.via = true;
        let randVia = Math.ceil(Math.random() * elementN);
        communication.querySelector('#via').value = randVia;
        input.viaE = randVia;
      }
      allInputs.push(input);
      index++;
    });
    removeDuplicates(element, allInputs);
  });
}

function addCom(options, eleIndex, actionIndex, comIndex, element) {
  let comHtml = `<div class="communications">
  <div class="block">
  <select id="to" name="to_elements">
  <option value="">--Select an element--</option>` + options + `
</select>
    <button id="add_com" onclick="addCommunication(this)">
      add
    </button>
    <span hidden id="comIn">0</span>
    <button id="delete_com" onclick="deleteCom(this)">delete</button>
  </div>
  <div class="block">
    <input
      type="radio"
      id="direct_means"
      name="`+ eleIndex + `_act` + actionIndex + `_com` + comIndex + `_means"
      value="direct"
      checked
    /><label for="direct_means">Direct</label>
  </div>
  <div class="block">
    <input
      type="radio"
      id="via_means"
      name="`+ eleIndex + `_act` + actionIndex + `_com` + comIndex + `_means"
      value="via"
    /><label for="via_means">Via </label
    ><select id="via" name="via_elements">       
    <option value="">--Select an element--</option>` + options + `
  </select>
  </div>
  <div class="block">
    <input
      type="radio"
      id="public_access"
      name="`+ eleIndex + `_act` + actionIndex + `_com` + comIndex + `_access"
      value="public"
      checked
    /><label for="public_access">Public</label>
  </div>
  <div class="block">
    <input
      type="radio"
      id="private_access"
      name="`+ eleIndex + `_act` + actionIndex + `_com` + comIndex + `_access"
      value="private"
    /><label for="private_access">Private</label>
  </div>
  <div class="block">
    <input id="config_from" /><span>to</span
    ><input id="config_to" />
  </div>
  <div class="block"><input id="com_num" /></div>
  <div class="block"><input id="effect" /></div>
</div>`;
  element.insertAdjacentHTML("afterend", comHtml);
}

function removeDuplicates(element, allInputs) {
  const communications = element.querySelectorAll(".communications");

  for (let i = allInputs.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      if (allInputs[i].to == allInputs[j].to && allInputs[i].direct == allInputs[j].direct && allInputs[i].via == allInputs[j].via && allInputs[i].viaE == allInputs[j].viaE) {
        const ind = allInputs[j].in;
        communications[ind].remove();
      }
    }
  }
}