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
    <div class="block">
    <label for="actionV" id="actionIn">1</label>
      <input id="actionV" />
      <button name="delete_action" onclick="deleteAction(this)">delete</button>
      <button name="add_action" onclick="addAction(this)">
        add
      </button>
    </div>
    <div class="block">&nbsp</div>
    <!-- action1_Communication1 -->
    <div class="communications">
      <div class="block">
      <select id="to" name="to_elements">
      <option value="">--Select an element--</option> `+ options + `
    </select>
        <button name="add_com" onclick="addCommunication(this)">
          add communication
        </button>
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
        <input id="config_from" /><span>to</span
        ><input id="config_to" />
      </div>
      <div class="block"><input id="com_num" /></div>
      <div class="block"><input id="effect" /></div>
    </div>
  </div>  `
  element.parentNode.parentNode.insertAdjacentHTML("afterend", actHtml);
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