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
   <span>If </span
   ><select
     class="if_ele"
     style="width: 80px"
     onchange="condition(this)"
   >
     <option value="">Element</option>
     <option value="0">Self-initiated</option>
     <option value="1">#1</option>
   </select>
   <div id="perform" style="display: inline">
     <span> performs </span>
     <select class="if_act" style="width: 110px">
       <option value="">Action</option>
     </select>
   </div>
 </div>
 <div class="act_block">
   <span>then:</span>
    <label for="actionV" id="actionIn">1</label>
      <input id="actionV" placeholder="Action"/>
    </div>
    <div class="act_block">COMMUNICATION:</div> 
    <div class="com">
    <div class="an_com">
      <div class="ancom_block">To:</div>
      <div class="ancom_block">Means:</div>
      <div class="ancom_block">&nbsp</div>
      <div class="ancom_block">Access:</div>
      <div class="ancom_block">&nbsp</div>
      <div class="ancom_block">Config:</div>
      <div class="ancom_block">Count:</div>
      <div class="ancom_block">Effect:</div>
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
        <input list="eCount" id="config_from" /><span>to</span
        ><input list="eCount" id="config_to" />
      </div>
      <div class="block"><input list="eCount" id="com_num" /></div>
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
    list.innerHTML = ` <option value="">Element</option>
    <option value="0">Self-initiated</option>`;

    for (let i = 0; i < allElements.length; i++) {
      const index = (i + 1).toString();
      list.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
    }
  });
}