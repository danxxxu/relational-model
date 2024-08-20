let comCount = 0;

function addCommunication(element) {
  // comCount++;

  const allElements = document.querySelectorAll(".element");
  let options = ``;
  for (let i = 1; i < (allElements.length + 1); i++) {
    const index = i.toString();
    options += `<option value="` + index + `">#` + index + `</option>`;
  }
  // class action
  const action = element.parentNode.parentNode;

  const eleIndex = action.parentNode.parentNode.querySelector('#index').innerText;

  const actionIndex = action.querySelector("#actionIn").innerText;

  const allcom = action.querySelectorAll(".communications");
  comCount = allcom.length + 1;

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
    <div class="effect_container">
                  <div
                    class="block"
                    style="position: relative; margin: 3px 3px 0 3px"
                  >
                  <input
                  list = "existEffect"
                  class="effect"
                  ></input>
                  <datalist id="existEffect"></datalist><button
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
                  <button class="generate" id="permutate_com" style="margin:0" onclick="permutateCommunication(this)">Permutate</button>
                </div>
</div>    
</div>`;
  const previousCom = element.parentNode.parentNode.lastElementChild.previousElementSibling;
  previousCom.insertAdjacentHTML("afterend", comHtml);
  // updateComIndex(action);
}

function deleteCom(element) {
  // comCount ++;
  // class="action"
  const action = element.parentNode.parentNode.parentNode;
  element.parentNode.parentNode.remove();
  updateComIndex(action);
}

function updateComIndex(element) {
  const coms = element.querySelectorAll(".communications");
  const eleIndex = element.parentNode.parentNode.querySelector("#index").innerText;
  const actionIndex = element.querySelector("#actionIn").innerText;
  for (let i = 0; i < coms.length; i++) {
    comCount = i + 1;
    coms[i].querySelector("#comIn").innerText = comCount;
    coms[i].querySelector("#direct_means").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"`;
    coms[i].querySelector("#via_means").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_means"`;
    coms[i].querySelector("#public_access").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"`;
    coms[i].querySelector("#private_access").name = `"` + eleIndex + `_act` + actionIndex + `_com` + comCount + `_access"`;
  }
}