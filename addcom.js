let comCount = 0;

function addCommunication(element) {
  comCount++;

  const allElements = document.querySelectorAll(".element");
  let options = ``;
  for (let i = 1; i < (allElements.length + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }

  const eleIndex = element.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('#index').innerText;

  const actionIndex = element.parentNode.parentNode.parentNode.querySelector("#actionIn").innerText;

  let comHtml = `
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
    <select id="to" name="to_elements">
    <option value="">--To which element--</option>` + options + `
  </select>
      <span hidden id="comIn">` + comCount + `</span>
    </div>
    <div class="block">
      <input
        type="radio"
        id="direct_means"
        name="`+ eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"
        value="direct"
        checked
        onclick="checkDirect(this)"
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
    <textarea
    id="effect"
    rows="1"
    placeholder="Enter the effect(s) of this communication, each separated by ';'"
    oninput="OnInput(this)"
  ></textarea></div>
</div>    
</div>`;
  const previousCom = element.parentNode.parentNode.lastElementChild.previousElementSibling;
  previousCom.insertAdjacentHTML("afterend", comHtml);
  updateComIndex(element.parentNode.parentNode.parentNode);
}

function deleteCom(element) {
  // comCount ++;
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