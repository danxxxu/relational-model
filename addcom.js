function addCommunication(element) {
  const allElements = document.querySelectorAll(".element");
  let options = ``;
  for (let i = 1; i < (allElements.length + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }
  let comHtml = `<div class="communications">
    <div class="block">
    <select id="to" name="to_elements">
    <option value="">--Select an element--</option>` + options + `
  </select>
      <button id="add_com" onclick="addCommunication(this)">
        add
      </button>
      <button id="delete_com" onclick="deleteCom(this)">delete</button>
    </div>
    <div class="block">
      <input
        type="checkbox"
        id="direct_means"
        name="means"
        value="direct"
        checked
      /><label for="direct_means">Direct</label>
    </div>
    <div class="block">
      <input
        type="checkbox"
        id="via_means"
        name="means"
        value="via"
      /><label for="via_means">Via </label
      ><select id="via" name="via_elements">       
      <option value="">--Select an element--</option>` + options + `
    </select>
    </div>
    <div class="block">
      <input
        type="checkbox"
        id="public_access"
        name="access"
        value="public"
        checked
      /><label for="public_access">Public</label>
    </div>
    <div class="block">
      <input
        type="checkbox"
        id="private_access"
        name="access"
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

}

function deleteCom(element) {
  element.parentNode.parentNode.remove();
}