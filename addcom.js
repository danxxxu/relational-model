let comCount;

function addCommunication(element) {
  const allElements = document.querySelectorAll(".element");
  let options = ``;
  for (let i = 1; i < (allElements.length + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }

  const eleIndex = element.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('#index').innerText;

  const actionIndex = element.parentNode.parentNode.parentNode.querySelector("#actionIn").innerText;

  comCount = element.parentNode.parentNode.parentNode.querySelectorAll(".communications").length;

  let comHtml = `<div class="communications">
    <div class="block">
    <select id="to" name="to_elements">
    <option value="">--Select an element--</option>` + options + `
  </select>
      <button id="add_com" onclick="addCommunication(this)">
        add
      </button>
      <span hidden id="comIn">` + comCount + `</span>
      <button id="delete_com" onclick="deleteCom(this)">delete</button>
    </div>
    <div class="block">
      <input
        type="radio"
        id="direct_means"
        name="`+ eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"
        value="direct"
        checked
      /><label for="direct_means">Direct</label>
    </div>
    <div class="block">
      <input
        type="radio"
        id="via_means"
        name="`+ eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"
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
        name="`+ eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"
        value="public"
        checked
      /><label for="public_access">Public</label>
    </div>
    <div class="block">
      <input
        type="radio"
        id="private_access"
        name="`+ eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"
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
  element.parentNode.parentNode.insertAdjacentHTML("afterend", comHtml);

  updateComIndex(element.parentNode.parentNode.parentNode);
}

function deleteCom(element) {
  const allCom = element.parentNode.parentNode.parentNode;
  element.parentNode.parentNode.remove();
  updateComIndex(allCom);
}

function updateComIndex(element) {
  const coms = element.querySelectorAll(".communications");
  for (let i = 0; i < coms.length; i++) {
    coms[i].querySelector("#comIn").innerText = i + 1;
  }
}