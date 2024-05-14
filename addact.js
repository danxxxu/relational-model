let actCount = 0;

function addAction(element) {
  const allElements = document.querySelectorAll(".element");

  // count dropdown list of elements
  let options = ``;
  for (let i = 1; i < (allElements.length + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }

  const eleIndex = element.parentNode.parentNode.parentNode.parentNode.querySelector('#index').innerText;

  actCount++;

  let actHtml = `<div class="action">
   <button class="close" name="delete_action" onclick="deleteAction(this)">X</button>
   <div class="act_block">
   <label for="actionV" id="actionIn">1</label>
   <input list="existAction" id="actionV" placeholder="Action" />
   <datalist id="existAction"></datalist>
   </div>
   <div id="condition" style="width: 100%">
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
 <div
 class="ancom_block"
 style="text-align: left; width: 98%; margin: 3px"
>
 COMMUNICATION:
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
   <div class="ancom_block" style="margin-top: 8px">
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
   <div class="ancom_block">
     Effect:<span class="info">STILL WORKING ON THIS !!! </span>
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
      <div class="block">                  
      <textarea
      id="effect"
      rows="1"
      placeholder="Enter the effect(s) of this communication, each separated by ';'"
      oninput="OnInput(this)"
    ></textarea></div>
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
  </div>  `
  const previousAction = element.parentNode.parentNode.lastElementChild.previousElementSibling;
  previousAction.insertAdjacentHTML("afterend", actHtml);
  updateActionList(element.parentNode.parentNode.parentNode);
  updateActionIndex(element.parentNode.parentNode.parentNode);
}

function deleteAction(element) {
  // actCount++;
  const allAct = element.parentNode.parentNode;
  element.parentNode.remove();
  updateActionIndex(allAct);
}

function updateActionIndex(element) {
  const actions = element.querySelectorAll(".action");
  for (let i = 0; i < actions.length; i++) {
    actions[i].querySelector("#actionIn").innerText = i + 1;
  }
}

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