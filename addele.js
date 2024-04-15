let eleCount = 0;

function addElement(element) {
  const allElements = document.querySelectorAll(".element");
  eleCount ++;
  let eleHtml = `
    <div class="element">
    <div class="block"><span id="index">#1</span>
    <button name="delete_element" onclick="deleteElement(this)">delete</button></div>
    <div class="block"><input id="type" /></div>
    <div class="block"><input id="ele_num" /></div>
    <div class="allactions">
      <div class="action">
        <div class="act_block">
          <label for="actionV" id="actionIn">1</label>
          <input id="actionV" />
        </div>
        <div class="act_block">COMMUNICATION:</div>    
        <div class="communications">
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
          <div class="block">
            <input id="config_from" /><span>to</span
            ><input id="config_to" />
          </div>
          <div class="block"><input id="com_num" /></div>
          <div class="block"><input id="effect" /></div>
        </div>
        <div class="add_communication">
        <button
          id="add_com"
          onclick="addCommunication(this)"
        >
          add communication
        </button>
      </div>
      </div>
      <div class="add_action">
      <button name="add_action" onclick="addAction(this)">
        add action
      </button>
    </div>
    </div>
  </div> `
  element.parentNode.insertAdjacentHTML("beforebegin", eleHtml);
  updateIndex();
  updateDropdown();
}

function deleteElement(element) {
  // eleCount ++;
  element.parentNode.parentNode.remove();
  updateIndex();
  updateDropdown();
}

function updateIndex() {
  const allElements = document.querySelectorAll(".element");
  for (let i = 0; i < allElements.length; i++) {
    allElements[i].querySelector("#index").innerText = `#` + (i + 1);
  }
}

function updateDropdown() {
  const allElements = document.querySelectorAll(".element");

  allElements.forEach(element => {
    const allCommunications = element.querySelectorAll(".communications");
    allCommunications.forEach(element => {
      const toEle = element.querySelector("#to");
      toEle.innerHTML = `<option value="">--To which element--</option>`;
      const viaEle = element.querySelector("#via");
      viaEle.innerHTML = `<option value="">--Select an element--</option>`;

      for (let i = 0; i < allElements.length; i++) {
        const index = (i + 1).toString();
        toEle.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
        viaEle.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
      }
    });
  });

}