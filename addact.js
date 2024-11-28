let actCount = 0;

function addAction(element) {
  const allElements = document.querySelectorAll(".element");

  // count dropdown list of elements
  let options = ``;
  for (let i = 1; i < (allElements.length + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }

  // class allactions 
  const allactions = element.parentNode.parentNode;
  const eleIndex = allactions.parentNode.querySelector('#index').innerText;
  const allact = allactions.querySelectorAll(".action");
  actCount = allact.length + 1;

  let actHtml = `<div class="action">
   <button class="close" name="delete_action" onclick="deleteAction(this)">X</button>
   <div class="act_block">
   <label for="actionV" id="actionIn">`+ actCount + `</label>
   <input list="existAction" id="actionV" placeholder="Action" />
   <datalist id="existAction"></datalist>
   </div>
   <div class="act_block">
   <input
         type="radio"
         id="intentional"
         name="` + eleIndex + `_act` + actCount + `_intention"
         value="intentional"
         checked
       /><label for="intentional">Intented</label>
       <input
       type="radio"
       id="unintentional"
       name="` + eleIndex + `_act` + actCount + `_intention"
       value="unintentional"
     /><label for="unintentional">Unintented</label>
 </div>
   <div id="condition" style="width: 100%">
   <div class="act_block">CONDITION:</div>
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
      <option value="">--To which element--</option> `+ options + `
    </select>
        <span hidden id="comIn">0</span>
      </div>
      <div class="block">
        <input
          type="radio"
          id="direct_means"
          name="` + eleIndex + `_act` + actCount + `_means"
          value="direct"
          checked
          onclick="checkDirect(this)"
        /><label for="direct_means">Direct</label>
      </div>
      <div class="block">
        <input
          type="radio"
          id="via_means"
          name="` + eleIndex + `_act` + actCount + `_means"          
          value="via"
        /><label for="via_means">Via </label
        ><select id="via" name="via_elements">
        <option value="">--Select an element--</option> `+ options + `
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
        name="` + eleIndex + `_act` + actCount + `_access"
        value="public"
        checked
      /><label for="public_access">Public</label>
    </div>
    <div class="block">
      <input
        type="radio"
        id="private_access"
        name="` + eleIndex + `_act` + actCount + `_access"
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
  </div>  `;
  const previousAction = allactions.lastElementChild.previousElementSibling;
  previousAction.insertAdjacentHTML("afterend", actHtml);
  updateActionList(allactions);
  // updateActionIndex(allactions);
}

function addGenerateAction(element) {
  const allElements = document.querySelectorAll(".element");

  // count dropdown list of elements
  let options = ``;
  for (let i = 1; i < (allElements.length + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }

  // class allactions 
  const allactions = element.parentNode.parentNode;
  const eleIndex = allactions.parentNode.querySelector('#index').innerText;
  const allact = allactions.querySelectorAll(".action");
  actCount = allact.length + 1;

  let generateActHtml = `<div class="action">
   <button class="close" name="delete_action" onclick="deleteAction(this)">X</button>
   <div class="act_block">
   <label for="actionV" id="actionIn">`+ actCount + `</label>
   <input list="existAction" id="actionV" placeholder="Action" />
   <datalist id="existAction"></datalist>
   </div>
   <div class="act_block">
   <input
         type="radio"
         id="intentional"
         name="` + eleIndex + `_act` + actCount + `_intention"
         value="intentional"
         checked
       /><label for="intentional">Intented</label>
       <input
       type="radio"
       id="unintentional"
       name="` + eleIndex + `_act` + actCount + `_intention"
       value="unintentional"
     /><label for="unintentional">Unintented</label>
 </div>
   <div id="condition" style="width: 100%; background-color: #cdcffc;">
            <div class="act_block">CONDITION:</div>
               <div class="act_block">
              <button class="generate" id="permutate_cond" style="margin:0" onclick="permutateCondition(this)">Generate<span class="info"
                    >Randomly generate a condition.
                  </span></button>
              <input type="number" id="permutateCondCount" name="permutateCondCount" min="0" max="" value="0" onchange="loadCondPermutation(this)" disabled/>
            </div>
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
   <div class="ancom_block" style="height: 20px;"></div>
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
                  <button class="generate" id="permutate_com" style="margin:0" onclick="permutateCommunication(this)">Generate<span class="info"
                    >Randomly generate a form of communication.
                  </span></button>
                  <input type="number" id="permutateCount" name="permutateCount" min="0" max="" value="0" onchange="loadPermutation(this)" disabled/>
                </div>
      <div class="block">
      <select id="to" name="to_elements" style="float: left;">
      <option value="">--To which element--</option> `+ options + `
    </select>
        <span hidden id="comIn">0</span>
      </div>
      <div class="block">
        <input
          type="radio"
          id="direct_means"
          name="` + eleIndex + `_act` + actCount + `_means"
          value="direct"
          checked
          onclick="checkDirect(this)"
        /><label for="direct_means">Direct</label>
      </div>
      <div class="block">
        <input
          type="radio"
          id="via_means"
          name="` + eleIndex + `_act` + actCount + `_means"          
          value="via"
        /><label for="via_means">Via </label
        ><select id="via" name="via_elements">
        <option value="">--Select an element--</option> `+ options + `
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
        name="` + eleIndex + `_act` + actCount + `_access"
        value="public"
        checked
      /><label for="public_access">Public</label>
    </div>
    <div class="block">
      <input
        type="radio"
        id="private_access"
        name="` + eleIndex + `_act` + actCount + `_access"
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
      onclick="addGenerateCommunication(this)"
    >
      Add communication
    </button>
  </div>
  </div>  `;
  const previousAction = allactions.lastElementChild.previousElementSibling;
  previousAction.insertAdjacentHTML("afterend", generateActHtml);
  updateActionList(allactions);
  // updateActionIndex(allactions);
}

function deleteAction(element) {
  const allactions = element.parentNode.parentNode;
  element.parentNode.remove();
  updateActionIndex(allactions);
  updateActionList(allactions);
}

// element = allactions
function updateActionIndex(element) {
  const eleIndex = element.parentNode.querySelector("#index").innerText;
  const actions = element.querySelectorAll(".action");
  for (let i = 0; i < actions.length; i++) {
    const actionIndex = i + 1;
    actions[i].querySelector("#actionIn").innerText = actionIndex;
    actions[i].querySelector("#intentional").name = `"` + eleIndex + `_act` + actionIndex + `_intention"`;
    actions[i].querySelector("#unintentional").name = `"` + eleIndex + `_act` + actionIndex + `_intention"`;

    const coms = actions[i].querySelectorAll(".communications");
    for (let j = 0; j < coms.length; j++) {
      const comCount = j + 1;
      coms[j].querySelector("#comIn").innerText = comCount;
      coms[j].querySelector("#direct_means").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"`;
      coms[j].querySelector("#via_means").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"`;
      coms[j].querySelector("#public_access").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"`;
      coms[j].querySelector("#private_access").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"`;
    }
  }
}

// element = allactions
function updateActionList(element) {
  const allElements = document.querySelectorAll(".element");

  const AllList = element.querySelectorAll(".if_ele");

  AllList.forEach(list => {
    const oldEle = list.value;
    list.innerHTML = ` <option value="">Element</option>
    <option value="0">Self-initiated</option>`;

    for (let i = 0; i < allElements.length; i++) {
      const index = (i + 1).toString();
      list.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
    }

    list.value = oldEle;
  });
}