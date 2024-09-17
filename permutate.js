let condPermutation = [];
let perCondCount = 0;

function allCondPermutation() {
    condPermutation = [];
    const allEle = document.querySelectorAll(".element");
    const eleNum = allEle.length;
    let totalActCount = 0;
    allEle.forEach(element => {
        const allActions = element.querySelectorAll(".action");
        const actionCount = allActions.length;
        totalActCount += actionCount;
    });
    
}



function permutateCondition() {

}