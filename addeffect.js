// auto resize textarea
// function OnInput(e) {
//     e.setAttribute("style", "height:" + (e.scrollHeight) + "px;overflow-y:hidden;");
//     e.style.height = 'auto';
//     e.style.height = (e.scrollHeight) + "px";
// }

function addEffect(e) {
    const effectHTML = '<div class="block" style="position: relative; margin: 3px 3px 0 3px"><input list = "existEffect" class="effect"></input><datalist id="existEffect"></datalist><button class="close" name="delete_effect" style="width:13px; height: 15px; font-size: 11px; right: 0" onclick="deleteEffect(this)"> X</button></div>';

    e.parentNode.insertAdjacentHTML("beforebegin", effectHTML);
}

function deleteEffect(e) {
    e.parentNode.remove();
}