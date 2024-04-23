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
    <div class="act_block">
    <label for="actionV" id="actionIn">1</label>
      <input id="actionV" />
      <button name="delete_action" onclick="deleteAction(this)">Delete action</button>
    </div>
    <div class="act_block" style="width: 98%;">COMMUNICATION:</div> 
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
      <div class="block"><input id="effect" /></div>
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
  updateActionIndex(element.parentNode.parentNode.parentNode);
}

function deleteAction(element) {
  // actCount++;
  const allAct = element.parentNode.parentNode.parentNode;
  element.parentNode.parentNode.remove();
  updateActionIndex(allAct);
}

function updateActionIndex(element) {
  const actions = element.querySelectorAll(".action");
  for (let i = 0; i < actions.length; i++) {
    actions[i].querySelector("#actionIn").innerText = i + 1;
  }
}