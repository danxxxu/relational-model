function condition(element) {
    const index = element.value;
    const parent = element.parentNode;
    const allElements = document.querySelectorAll(".element");
    if (index === "0") {
        parent.querySelector("#perform").style.display = "none";
        element.style.width = "120px";
    } else if (index != "") {
        parent.querySelector("#perform").style.display = "inline";
        element.style.width = "50px";

        const actionList = parent.querySelector(".if_act");
        actionList.innerHTML = `<option value="">Action</option>`;

        const disActions = allElements[index - 1].querySelectorAll(".action");
        disActions.forEach(action => {
            const actIndex = action.querySelector("#actionIn").innerText;
            const act = action.querySelector("#actionV").value;
            actionList.innerHTML += `<option value="` + actIndex + `">` + actIndex + ` ` + act + `</option>`;
        });
    }
}

let fnPresent = true;
function addCondition(element) {
    const condHtml = `
<div class="act_block">
              <span>If </span
              ><select
                class="if_ele"
                style="width: 50px;"
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
              <select
                id="add"
                style="width: 50px"
                onchange="addCondition(this)"
              >
                <option value="">+</option>
                <option value="0">OR</option>
                <option value="1">AND</option>
              </select>
              <button
              class="close"
              name="delete_cond"
              style="width:13px; height: 15px; font-size: 11px; right: 0"
              onclick="deleteCondition(this)"
            >
              X
            </button>
            </div>
`;
    if (element.value != "") {
        element.parentNode.insertAdjacentHTML("afterend", condHtml);
    }

    const allElements = document.querySelectorAll(".element");

    const allIfEle = document.querySelectorAll(".if_ele");
    allIfEle.forEach(element => {
        const oldSelect = element.value;
        element.innerHTML = ` <option value="">Element</option>
    <option value="0">Self-initiated</option>`;
        for (let i = 0; i < allElements.length; i++) {
            const index = (i + 1).toString();
            element.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
        }
        element.value = oldSelect;
    });

    const cond = element.parentNode.parentNode.querySelectorAll(".if_ele");

    if (cond.length == 3) {
        const condition = element.parentNode.parentNode;
        const fnSelectHTML = '<div class="act_block"><select class="selectFootnote" onchange="addFootnote(this)"><option value="">+Footnote</option><option value="0">add</option></select></div>'
        condition.insertAdjacentHTML("beforeend", fnSelectHTML);
        fnPresent = true;
    }
}

function deleteCondition(element) {
    const cond = element.parentNode.parentNode.querySelectorAll(".if_ele");

    if (cond.length < 4 && fnPresent) {
        element.parentNode.parentNode.querySelector(".selectFootnote").parentNode.remove();

        fnPresent = false;
    }

    element.parentNode.remove();
}

let fnCount = 0;
function addFootnote(e) {
    if (e.value == "0") {
        fnCount++;

        const footnoteContainer = document.querySelector("#footnote_container");

        let fnID = "footnote" + fnCount;

        let footnoteHtml = '<div class="footnote_text"> <label style="font-weight: bold">*' + fnCount + ' ' + '</label><input id="' + fnID + '" oninput="resizeInput(this)"/> <button class="close" name="delete_fn" style="width:13px; height: 15px; font-size: 11px; right: 0" onclick="deleteFootnote(this)"> X</button></div>';

        footnoteContainer.insertAdjacentHTML("beforeend", footnoteHtml);

        // add footnote number to the selection list
        const option = '<option value="' + fnCount + '">*' + fnCount + '</option>';
        const allSelectFN = document.querySelectorAll(".selectFootnote");
        allSelectFN.forEach(select => {
            select.insertAdjacentHTML("beforeend", option);
        });
        e.value = fnCount;

        // add condition description
        const ifEles = e.parentNode.parentNode.querySelectorAll(".if_ele");
        const ifActs = e.parentNode.parentNode.querySelectorAll(".if_act");
        const adds = e.parentNode.parentNode.querySelectorAll("#add");

        let condText = "";
        for (let i = 0; i < ifEles.length; i++) {
            if (ifEles[i].value != "") {
                if (ifEles[i].value == "0") {
                    condText += 'If self-initiated';
                } else {
                    const act = ifActs[i];
                    condText += 'If #' + ifEles[i].value + ' ' + act.options[act.selectedIndex].text.substring(2);
                }
                if (i != ifEles.length - 1) {
                    const add = adds[i];
                    condText += ' ' + add.options[add.selectedIndex].text + ' ';
                }
            }
        }

        fnID = "#" + fnID;
        footnoteContainer.querySelector(fnID).value = condText;
        resizeInput(footnoteContainer.querySelector(fnID));
    }
}

function resizeInput(input) {
    input.style.width = input.value.length * 0.9 + "ch";
}

function deleteFootnote(fn) {
    const fnIndex = fn.parentNode.querySelector("label").innerText;
    fn.parentNode.remove();
    updateFnIndex(fnIndex.replace("*", "").trim());
}

function updateFnIndex(removedFN) {
    fnCount--;
    const footnoteContainer = document.querySelector("#footnote_container");
    let allFootnote = footnoteContainer.querySelectorAll(".footnote_text");

    let optionHTML = '<option value="">+Footnote</option><option value="0">add</option>';
    for (let i = 0; i < allFootnote.length; i++) {
        const fnIndex = i + 1;
        allFootnote[i].querySelector("label").innerText = "*" + fnIndex;

        optionHTML += '<option value="' + fnIndex + '">*' + fnIndex + '</option>';
    }

    const allSelectFN = document.querySelectorAll(".selectFootnote");
    allSelectFN.forEach(select => {
        const prevSelect = select.value;
        select.innerHTML = optionHTML;

        if (prevSelect < removedFN) {
            select.value = prevSelect;
        } else if (prevSelect == removedFN) {
            select.value = "";
        } else {
            select.value = prevSelect - 1;
        }
    });
}