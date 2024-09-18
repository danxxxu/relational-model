let eleCount = 0;

function addElement(element) {
  const allElements = document.querySelectorAll(".element");
  eleCount = allElements.length + 1;

  let eleHtml = `
    <div class="element"         
    onmouseenter="showElementInfo(event, this)"
    onmouseleave="hideElementInfo(this)">
    <div class="element_info"></div>
    <button class="close" name="delete_element" onclick="deleteElement(this)">X</button>
    <div class="block" style="width:100%"><span id="index">#1</span></div>
    <div class="block"><input list="existTypes" id="type" placeholder="Type/role (if applicable)"/><datalist id="existTypes"></datalist></div>
    <div class="block"><input list="eCount" id="ele_num" placeholder="Count"/><datalist id="eCount"><datalist id="eCount">
    <option value="1"></option>
    <option value="2"></option>
    <option value="3"></option>
    <option value="4"></option>
    <option value="5"></option>
    <option value="1+"></option>
    <option value="2+"></option>
    <option value="3+"></option>
    <option value="4+"></option>
    <option value="5+"></option>
  </datalist></datalist></div>
    <div class="allactions">
    <div></div>
      <div class="action">
      <button class="close" name="delete_action" onclick="deleteAction(this)">X</button>
      <div class="act_block">
      <label for="actionV" id="actionIn">1</label>
      <input list="existAction" id="actionV" placeholder="Action" />
              <datalist id="existAction"></datalist>
    </div>
    <div class="act_block">
   <input
         type="radio"
         id="intentional"
         name="` + eleCount + `_intention"
         value="intentional"
         checked
       /><label for="intentional">Intented</label>
       <input
       type="radio"
       id="unintentional"
       name="` + eleCount + `_intention"
       value="unintentional"
     /><label for="unintentional">Unintented</label>
 </div>
    <div id="condition" style="width: 100%">
    <div id="trigger">
      <div class="act_block">
              <span>If </span
              ><select
                class="if_ele"
                style="width: 50px"
                onchange="condition(this)"
              >
                <option value="">Element</option>
                <option value="0">Self-initiated</option>
                <option value="1">#1</option>
              </select>
              <div id="perform" style="display: inline">
                <span> do(es) </span>
                <select class="if_act" style="width: 95px">
                  <option value="">Action</option>
                </select>
              </div>
              <select id="add" style="width: 50px" onchange="addCondition(this)">
              <option value="">+</option>
              <option value="0">OR</option>
              <option value="1">AND</option>
            </select>
            </div>
            </div>
             <div id="response">  
                <div class="act_block">           
                  <span>Then this action</span> <select
                  id="add"
                  style="width: 50px"
                  onchange="addCondition(this)"
                >
                  <option value="">+</option>
                  <option value="0">OR</option>
                  <option value="1">AND</option>
                </select>
              </div>
            </div>
            </div>
            <div class="act_block">
              <div class="ancom_block" style="margin: 0">COMMUNICATION:
            <span class="info"
              >A form of communication is created when an action is done to an
              element. An action can be directed at different elements thus
              creating multiple forms of communication.
              <br />
              <br />
              Please enter the communication in a logical or chronological
              order if such relationships are present.
            </span>
            </div>
          </div>
          <div class="com">
            <div class="an_com">
              <div class="ancom_block">
                To:
                <span class="info"
                  >To which element the action is directed at.
                </span>
              </div>
              <div class="ancom_block">
                Means:<span class="info"
                  >The means by which the action reaches the receiving
                  element.
                  <ul>
                    <li>
                      Direct: the action is performed to the receiving element
                      directly without any intermediate element involved.
                    </li>
                    <li>
                      Via (intermediate element): The action is performed to
                      an intermediate element and reaches the receiving
                      element via the intermediate element. This type of
                      communication is often termed mediated communication.
                    </li>
                  </ul>
                </span>
              </div>
              <div class="ancom_block" style="cursor: default">&nbsp</div>
              <div class="ancom_block" style="margin-top: 8px">
                Config:<span class="info"
                  >Short for 'configuration'; indicates the number of elements
                  at both ends of the communication.
                  <ul>
                    <li>
                      From: the number of elements it takes to perform the
                      action.
                    </li>
                    <li>
                      To: the number of elements that can receive the
                      communication.
                    </li>
                  </ul>
                </span>
              </div>
              <div class="ancom_block" style="margin-top: 5px">
                Count:<span class="info"
                  >The number of communication of the same form that can take
                  place simultaneously.
                </span>
              </div>
              <div class="ancom_block">
                Access:<span class="info"
                  >The degree to which the communication is accessible or
                  perceivable to all elements.
                  <ul>
                    <li>
                      Private: the communication can only be perceived by the
                      communicating elements.
                    </li>
                    <li>
                      Public: the communication can also be perceived by
                      elements or spectators beyond the communicating
                      elements.
                    </li>
                  </ul>
                </span>
              </div>
              <div class="ancom_block" style="cursor: default">&nbsp</div>
              <div class="ancom_block" style="margin-top: 2px">
                Effect:<span class="info">The function(s), consequence(s) of the communication, how it influences and relates to the receiving elements.</span>
              </div>
            </div>
        <div class="communications">
        <button class="close" id="delete_com" onclick="deleteCom(this)">X</button>
          <div class="block">
          <select id="to" name="to_elements" style="float: left;">
          <option value="">--To which element--</option>
          <option value="1">#1</option>
        </select>
            <span hidden id="comIn">0</span>
          </div>
          <div class="block">
            <input
              type="radio"
              id="direct_means"
              name="` + eleCount + `_means"
              value="direct"
              checked
              onclick="checkDirect(this)"
            /><label for="direct_means">Direct</label>
          </div>
          <div class="block">
            <input
              type="radio"
              id="via_means"
              name="` + eleCount + `_means"
              value="via"
            /><label for="via_means">Via </label
            >        <select id="via" name="via_elements">
            <option value="">--Select an element--</option>
            <option value="1">#1</option>
          </select>
          </div>
          <div class="block">
                  <input
                    list="eCount"
                    id="config_from"
                    placeholder="From"
                  /><span style="font-size: 25px">&rarr;</span
                  ><input list="eCount" id="config_to" placeholder="To" />
                </div>
          <div class="block"><input list="eCount" id="com_num" /></div>
          <div class="block">
            <input
              type="radio"
              id="public_access"
              name="` + eleCount + `_access"
              value="public"
              checked
            /><label for="public_access">Public</label>
          </div>
          <div class="block">
            <input
              type="radio"
              id="private_access"
              name="` + eleCount + `_access"
              value="private"
            /><label for="private_access">Private</label>
          </div>
          <div class="effect_container">
          <div
            class="block"
            style="position: relative; margin: 3px 3px 0 3px"
          >
          <input
          list = "existEffect"
          class="effect"
          ></input>
          <datalist id="existEffect"></datalist>
          <button
              class="close"
              name="delete_effect"
              style="
                width: 13px;
                height: 15px;
                font-size: 11px;
                right: 0;
              "
              onclick="deleteEffect(this)"
            >
              X
            </button>
          </div>
          <div class="block">
            <button class="add_effect" onclick="addEffect(this)">
              +
            </button>
          </div>
        </div>
        </div>
        </div>
        <div class="add_communication">
        <button
          id="add_com"
          onclick="addCommunication(this)"
        >
          Add communication
        </button>
      </div>
      </div>
      <div class="add_action">
      <button id="add_action" onclick="addAction(this)">
        Add action
      </button>
    </div>
    </div>
  </div> `
  element.parentNode.insertAdjacentHTML("beforebegin", eleHtml);
  updateIndex();
  updateDropdown();

  const eleList = document.querySelector("#all_elements");
  eleList.style.display = "none";
  eleList.innerHTML = "";
  eleList.parentNode.querySelector("#element_list").innerText = "Show all elements";
}

function addGenerateElement(element) {
  const allElements = document.querySelectorAll(".element");
  eleCount = allElements.length + 1;

  let generateEleHtml = `
    <div class="element"         
    onmouseenter="showElementInfo(event, this)"
    onmouseleave="hideElementInfo(this)">
    <div class="element_info"></div>
    <button class="close" name="delete_element" onclick="deleteElement(this)">X</button>
    <div class="block" style="width:100%"><span id="index">#1</span><button class="generate" onclick="generateElement(this)">Generate element</button><button class="generate" onclick="completeElement(this)">Complete element</button></div>
    <div class="block"><input list="existTypes" id="type" placeholder="Type/role (if applicable)"/><datalist id="existTypes"></datalist></div>
    <div class="block"><input list="eCount" id="ele_num" placeholder="Count"/><datalist id="eCount"><datalist id="eCount">
    <option value="1"></option>
    <option value="2"></option>
    <option value="3"></option>
    <option value="4"></option>
    <option value="5"></option>
    <option value="1+"></option>
    <option value="2+"></option>
    <option value="3+"></option>
    <option value="4+"></option>
    <option value="5+"></option>
  </datalist></datalist></div>
    <div class="allactions">
    <div></div>
      <div class="action">
      <button class="close" name="delete_action" onclick="deleteAction(this)">X</button>
      <div class="act_block">
      <label for="actionV" id="actionIn">1</label>
      <input list="existAction" id="actionV" placeholder="Action" />
              <datalist id="existAction"></datalist>
    </div>
    <div class="act_block">
   <input
         type="radio"
         id="intentional"
         name="` + eleCount + `_intention"
         value="intentional"
         checked
       /><label for="intentional">Intented</label>
       <input
       type="radio"
       id="unintentional"
       name="` + eleCount + `_intention"
       value="unintentional"
     /><label for="unintentional">Unintented</label>
 </div>
    <div id="condition" style="width: 100%">
    <div id="trigger">
      <div class="act_block">
              <span>If </span
              ><select
                class="if_ele"
                style="width: 50px"
                onchange="condition(this)"
              >
                <option value="">Element</option>
                <option value="0">Self-initiated</option>
                <option value="1">#1</option>
              </select>
              <div id="perform" style="display: inline">
                <span> do(es) </span>
                <select class="if_act" style="width: 95px">
                  <option value="">Action</option>
                </select>
              </div>
              <select id="add" style="width: 50px" onchange="addCondition(this)">
              <option value="">+</option>
              <option value="0">OR</option>
              <option value="1">AND</option>
            </select>
            </div>
            </div>
             <div id="response">  
                <div class="act_block">           
                  <span>Then this action</span> <select
                  id="add"
                  style="width: 50px"
                  onchange="addCondition(this)"
                >
                  <option value="">+</option>
                  <option value="0">OR</option>
                  <option value="1">AND</option>
                </select>
              </div>
            </div>
            <div class="act_block">
               <button class="generate" id="randomise_cond" style="margin:0" onclick="randomiseCondition(this)">Randomise</button>
              <button class="permutate" id="permutate_cond" style="margin:0" onclick="permutateCondition(this)">Permutate</button>
            </div>
            </div>
            <div class="act_block">
              <div class="ancom_block" style="margin: 0">COMMUNICATION:
            <span class="info"
              >A form of communication is created when an action is done to an
              element. An action can be directed at different elements thus
              creating multiple forms of communication.
              <br />
              <br />
              Please enter the communication in a logical or chronological
              order if such relationships are present.
            </span>
            </div>
          </div>
          <div class="com">
            <div class="an_com">
              <div class="ancom_block">
                To:
                <span class="info"
                  >To which element the action is directed at.
                </span>
              </div>
              <div class="ancom_block">
                Means:<span class="info"
                  >The means by which the action reaches the receiving
                  element.
                  <ul>
                    <li>
                      Direct: the action is performed to the receiving element
                      directly without any intermediate element involved.
                    </li>
                    <li>
                      Via (intermediate element): The action is performed to
                      an intermediate element and reaches the receiving
                      element via the intermediate element. This type of
                      communication is often termed mediated communication.
                    </li>
                  </ul>
                </span>
              </div>
              <div class="ancom_block" style="cursor: default">&nbsp</div>
              <div class="ancom_block" style="margin-top: 8px">
                Config:<span class="info"
                  >Short for 'configuration'; indicates the number of elements
                  at both ends of the communication.
                  <ul>
                    <li>
                      From: the number of elements it takes to perform the
                      action.
                    </li>
                    <li>
                      To: the number of elements that can receive the
                      communication.
                    </li>
                  </ul>
                </span>
              </div>
              <div class="ancom_block" style="margin-top: 5px">
                Count:<span class="info"
                  >The number of communication of the same form that can take
                  place simultaneously.
                </span>
              </div>
              <div class="ancom_block">
                Access:<span class="info"
                  >The degree to which the communication is accessible or
                  perceivable to all elements.
                  <ul>
                    <li>
                      Private: the communication can only be perceived by the
                      communicating elements.
                    </li>
                    <li>
                      Public: the communication can also be perceived by
                      elements or spectators beyond the communicating
                      elements.
                    </li>
                  </ul>
                </span>
              </div>
              <div class="ancom_block" style="cursor: default">&nbsp</div>
              <div class="ancom_block" style="margin-top: 2px">
                Effect:<span class="info">The function(s), consequence(s) of the communication, how it influences and relates to the receiving elements.</span>
              </div>
            </div>
        <div class="communications">
        <button class="close" id="delete_com" onclick="deleteCom(this)">X</button>
          <div class="block">
          <select id="to" name="to_elements" style="float: left;">
          <option value="">--To which element--</option>
          <option value="1">#1</option>
        </select>
            <span hidden id="comIn">0</span>
          </div>
          <div class="block">
            <input
              type="radio"
              id="direct_means"
              name="` + eleCount + `_means"
              value="direct"
              checked
              onclick="checkDirect(this)"
            /><label for="direct_means">Direct</label>
          </div>
          <div class="block">
            <input
              type="radio"
              id="via_means"
              name="` + eleCount + `_means"
              value="via"
            /><label for="via_means">Via </label
            >        <select id="via" name="via_elements">
            <option value="">--Select an element--</option>
            <option value="1">#1</option>
          </select>
          </div>
          <div class="block">
                  <input
                    list="eCount"
                    id="config_from"
                    placeholder="From"
                  /><span style="font-size: 25px">&rarr;</span
                  ><input list="eCount" id="config_to" placeholder="To" />
                </div>
          <div class="block"><input list="eCount" id="com_num" /></div>
          <div class="block">
            <input
              type="radio"
              id="public_access"
              name="` + eleCount + `_access"
              value="public"
              checked
            /><label for="public_access">Public</label>
          </div>
          <div class="block">
            <input
              type="radio"
              id="private_access"
              name="` + eleCount + `_access"
              value="private"
            /><label for="private_access">Private</label>
          </div>
          <div class="effect_container">
          <div
            class="block"
            style="position: relative; margin: 3px 3px 0 3px"
          >
          <input
          list = "existEffect"
          class="effect"
          ></input>
          <datalist id="existEffect"></datalist>
          <button
              class="close"
              name="delete_effect"
              style="
                width: 13px;
                height: 15px;
                font-size: 11px;
                right: 0;
              "
              onclick="deleteEffect(this)"
            >
              X
            </button>
          </div>
          <div class="block">
            <button class="add_effect" onclick="addEffect(this)">
              +
            </button>
          </div>
        </div>
                        <div class="block">
                  <button class="generate" id="randomise_com" style="margin:0" onclick="randomiseCommunication(this)">Randomise</button>
                  <button class="permutate" id="permutate_com" style="margin:0" onclick="permutateCommunication(this)">Permutate</button>
                  <input type="number" id="permutateCount" name="permutateCount" min="0" max="" value="0" onchange="loadPermutation(this)" disabled/>
                </div>
        </div>
        </div>
        <div class="add_communication">
        <button
          id="add_com"
          onclick="addGenerateCommunication(this)"
        >
          Add communication
        </button>
      </div>
      </div>
      <div class="add_action">
      <button id="add_action" onclick="addGenerateAction(this)">
        Add action
      </button>
    </div>
    </div>
  </div> `
  element.parentNode.insertAdjacentHTML("beforebegin", generateEleHtml);
  updateIndex();
  updateDropdown();

  const eleList = document.querySelector("#all_elements");
  eleList.style.display = "none";
  eleList.innerHTML = "";
  eleList.parentNode.querySelector("#element_list").innerText = "Show all elements";

  updateAllPermutation();
}

function deleteElement(element) {
  element.parentNode.remove();
  updateIndex();
  updateDropdown();

  const eleList = document.querySelector("#all_elements");
  eleList.style.display = "none";
  eleList.innerHTML = "";
  eleList.parentNode.querySelector("#element_list").innerText = "Show all elements";

  updateAllPermutation();
}

function updateIndex() {
  const allElements = document.querySelectorAll(".element");
  for (let i = 0; i < allElements.length; i++) {
    const eleIndex = `#` + (i + 1);
    allElements[i].querySelector("#index").innerText = eleIndex;

    const allactions = allElements[i].querySelectorAll(".action");
    for (let j = 0; j < allactions.length; j++) {
      const actionIndex = j + 1;
      allactions[j].querySelector("#intentional").name = `"` + eleIndex + `_act` + actionIndex + `_intention"`;
      allactions[j].querySelector("#unintentional").name = `"` + eleIndex + `_act` + actionIndex + `_intention"`;

      const coms = allactions[j].querySelectorAll(".communications");
      for (let k = 0; k < coms.length; k++) {
        const comCount = k + 1;
        coms[k].querySelector("#comIn").innerText = comCount;
        coms[k].querySelector("#direct_means").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"`;
        coms[k].querySelector("#via_means").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"`;
        coms[k].querySelector("#public_access").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"`;
        coms[k].querySelector("#private_access").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"`;
        if(window.location.href.includes("generate")) {
        coms[k].querySelector("#permutateCount").value = 0;
        }
      }
    }
  }
}

function updateDropdown() {
  const allElements = document.querySelectorAll(".element");

  const allIfEle = document.querySelectorAll(".if_ele");
  allIfEle.forEach(element => {
    const eleIndex = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("#index").innerHTML.replace("#", "");
    const actNum = element.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".action").length;

    const oldSelect = element.value;
    const ifID = element.parentNode.parentNode.id;
    if (ifID == "trigger") {
      element.innerHTML = ` <option value="">Element</option>
    <option value="0">Self-initiated</option>`;
    } else if (ifID == "response") {
      element.innerHTML = ` <option value="">Element</option>`;
    }
    for (let i = 0; i < allElements.length; i++) {
      if (actNum > 1) {
        const index = (i + 1).toString();
        element.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
      } else if (allElements.length > 1) {
        const index = (i + 1).toString();
        if (eleIndex != index) {
          element.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
        }
      }
    }
    element.value = oldSelect;
  });

  allElements.forEach(element => {
    const allCommunications = element.querySelectorAll(".communications");
    allCommunications.forEach(element => {
      const toEle = element.querySelector("#to");
      const oldTo = toEle.value;
      toEle.innerHTML = `<option value="">--To which element--</option>`;

      const viaEle = element.querySelector("#via");
      const oldVia = viaEle.value;
      viaEle.innerHTML = `<option value="">--Select an element--</option>`;

      for (let i = 0; i < allElements.length; i++) {
        const index = (i + 1).toString();
        toEle.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
        viaEle.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
      }

      toEle.value = oldTo;
      viaEle.value = oldVia;
    });
  });
}

///////////// PERMUTATE //////////////
let perComCount = 0;
let allPermutation = [];

window.addEventListener("load", updateAllPermutation);
document.querySelector("#add_element").addEventListener("click", updateAllPermutation);

function updateAllPermutation() {
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
}

function permutateCommunication(e) {
  const com = e.parentNode.parentNode;
  const permutateCount = com.querySelector("#permutateCount");
  const allEle = document.querySelectorAll(".element");
  const eleNum = allEle.length;
  permutateCount.setAttribute("max", eleNum * (eleNum + 1));
  permutateCount.removeAttribute('disabled');
  perComCount = permutateCount.value;
  if (perComCount == eleNum * (eleNum + 1)) {
    perComCount = 0;
  }
  // set config 1 to 1 
  com.querySelector("#config_from").value = 1;
  com.querySelector("#config_to").value = 1;
  com.querySelector("#com_num").value = 1;
  // set iteraction 
  const to = com.querySelector("#to");
  const via = com.querySelector("#via");

  if (perComCount < eleNum * (eleNum + 1)) {
    to.selectedIndex = allPermutation[perComCount].to;
    via.selectedIndex = allPermutation[perComCount].via;
    if (allPermutation[perComCount].via == 0) {
      com.querySelector("#direct_means").checked = true;
    } else {
      com.querySelector("#via_means").checked = true;
    }
    perComCount++;
    permutateCount.value = perComCount;
    if (perComCount == eleNum * (eleNum + 1)) {
      perComCount = 0;
    }
  }
  permutateCount.setAttribute("min", 1);
}

function loadPermutation(e) {
  const com = e.parentNode.parentNode;
  const permutateCount = e.value;
  const selectPair = allPermutation[permutateCount - 1];

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