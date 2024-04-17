document.querySelector("#display_interaction").addEventListener("click", getInteraction);

function getInteraction() {
    const selectID = document.querySelector("#select_interaction").value;
    db.collection('interactions').doc(selectID).get().then((doc) => {
        const selected = doc.data()
        console.log(selected);
    });
};