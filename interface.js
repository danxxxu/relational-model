function showElementInfo(event, e) {
    // console.log("I move over");
    const eleInfo = e.querySelector(".element_info");

    eleInfo.style.display = "block";
    const index = e.querySelector("#index").innerText;
    const type = e.querySelector("#type").value;
    const count = e.querySelector("#ele_num").value;
    eleInfo.innerHTML = `<span>Element: ` + index + `</span>` + `<br>` + `<span>Type: ` + type + `</span>` + `<br>` + `<span>Count: ` + count + `</span>`;
    eleInfo.style.left = event.clientX + 5 + "px";
    eleInfo.style.top = event.clientY + 5 + "px";
}

function hideElementInfo(e) {
    // console.log("I move out");
    e.querySelector(".element_info").style.display = "none";
}

function showAll(element) {
    const eleList = element.parentNode.querySelector("#all_elements");

    const allElements = document.querySelectorAll(".element");
    allElements.forEach(element => {
        const index = element.querySelector("#index").innerText;
        const type = element.querySelector("#type").value;
        eleList.innerHTML += `<span>` + index + ` ` + type + `</span>`
    });

    if (eleList.style.display == "none" || !eleList.style.display) {
        eleList.style.display = "inline-flex";
        eleList.parentNode.querySelector("#element_list").innerText = "Hide all elements";
    } else {
        eleList.style.display = "none";
        eleList.innerHTML = "";
        eleList.parentNode.querySelector("#element_list").innerText = "Show all elements";
    }
}

function condition(element) {
    const index = element.value;
    const parent = element.parentNode;
    const allElements = document.querySelectorAll(".element");
    if (index === "0") {
        parent.querySelector("#perform").style.display = "none";
        element.style.width = "120px";
    } else if (index != "") {
        parent.querySelector("#perform").style.display = "inline";
        element.style.width = "80px";

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

function OnInput(e) {
    e.setAttribute("style", "height:" + (e.scrollHeight) + "px;overflow-y:hidden;");
    e.style.height = 'auto';
    e.style.height = (e.scrollHeight) + "px";
}

function checkDirect(e) {
    if (e.checked) {
        e.parentNode.parentNode.querySelector("#via").value = "";
    }
}
