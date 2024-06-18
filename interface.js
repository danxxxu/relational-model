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

    setTimeout(function () { hideElementInfo(e) }, 2000);
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

function checkDirect(e) {
    if (e.checked) {
        e.parentNode.parentNode.querySelector("#via").value = "";
    }
}

function showInstruction(e) {
    e.parentNode.querySelector("#instruction_text").style.display = "block";
}

function closeInstruction(e) {
    e.parentNode.style.display = "none";
}

function OnInput(e) {
  e.style.height = 'auto';
  e.style.height = (e.scrollHeight) + "px";
}