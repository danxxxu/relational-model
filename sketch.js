import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const svg = d3.select('#container');
const width = +svg.attr('width'); // + convert string to numbers 
const height = +svg.attr('height');
// fixed visualisation elements 
const elementWdith = 200;
const elementHeight = 60;
const elementSize = 18;
const actionSize = 16;
const configR = 8;
const comSize = 11;
const elementY = 60;
const relationSize = 10; // 2px line, 8px rect
const opacityV = 0.65;
// sort actions
let eleX = [];
let totalAction = 0;
let allInputsCopy = {};
let actionOrder = false;
let indeAction = [];
let relateAction = [];
let allAction = [];
//define arrow marker variables 
const markerBoxWidth = 15;
const markerBoxHeight = 15;
const refX = markerBoxWidth; // move the arrow to the end of the line 
const refY = markerBoxHeight / 2;
const arrowPoints = [[0, 0], [markerBoxWidth, markerBoxHeight / 2], [0, markerBoxHeight]];
// for draw actions
let actionN = 0;
let actionX = 0;
let actionY = 0;
let actionWidth = 0;
let actionHeight = 0;
let effectLen = 180;
let corner = 0;
let actionDist = 0;
// draw relatons 
let actionInfo = {}; // {actionKey: [y,height], ...}
let allRelations = {}; // {actionKey: condition, ...}

export function drawVis(name, allInputs) {
    // try {
    actionN = 0;
    actionInfo = {};
    allRelations = [];

    svg.selectAll('*').remove();
    addName(name);

    // define arrow 
    svg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth / 2)
        .attr('markerHeight', markerBoxHeight / 2)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'black')
        .attr('stroke-width', '2') // create line arrow
        .attr('fill', 'none')
        .attr('stroke-dasharray', 'none')

    const eleCount = allInputs.eleCount;
    eleX = [];
    totalAction = 0;
    let eleIndex = 0;
    let actIndex = 0;

    relateAction = [];
    indeAction = [];
    allAction = [];

    let action = {};
    allInputsCopy = structuredClone(allInputs);

    // draw elements and store actions 
    for (let i = 0; i < eleCount; i++) {
        eleIndex = i + 1;
        const ele = "element" + eleIndex;
        const actionCount = allInputs[ele].actionCount;
        totalAction += actionCount;

        // push the condition actions and their condition
        for (let j = 0; j < actionCount; j++) {
            actIndex = j + 1;
            const act = "action" + actIndex;
            let c = false;

            const actionKey = eleIndex + `_` + actIndex;
            allRelations[actionKey] = allInputs[ele][act].condition;

            if (allInputsCopy[ele][act].action != "123456") {
                const condition = allInputsCopy[ele][act].condition;
                condition.forEach(cond => {
                    // the current action can be self-initiated
                    if (cond.ifEle == "0") {

                        if (condition.length > 1) {
                            if (allInputsCopy[ele][act].action != "123456") {
                                action = {};
                                action.eleIndex = eleIndex;
                                action.actIndex = actIndex;
                                relateAction.push(action);
                                allInputsCopy[ele][act].action = "123456";
                            }
                        }
                    } else if (cond.ifEle == "") {
                        const ind = condition.indexOf(cond);
                        condition.splice(ind, 1);
                    } else if (cond.ifEle != "") {
                        // if current action has conditions, check conditional actions
                        checkAction(eleIndex, actIndex, cond.ifEle, cond.ifAct);
                        c = true;
                    }
                });
                if (c && allInputsCopy[ele][act].action != "123456") {
                    action = {};
                    action.eleIndex = eleIndex;
                    action.actIndex = actIndex;
                    relateAction.push(action);
                    allInputsCopy[ele][act].action = "123456";
                }
            }
        }
    }

    // find all the independent actions 
    for (let i = 0; i < eleCount; i++) {
        eleIndex = i + 1;
        const ele = "element" + eleIndex;
        const actionCount = allInputsCopy[ele].actionCount;
        for (let j = 0; j < actionCount; j++) {
            actIndex = j + 1;
            const act = "action" + actIndex;
            let actV = allInputsCopy[ele][act].action;
            if (actV != "123456") {
                if (j == 0) {
                    actionOrder = true;
                }
                let action = {};
                action.eleIndex = eleIndex;
                action.actIndex = actIndex;
                indeAction.push(action);
            }
        }
    }

    let condRes = [];
    let updateIndeAction = [].concat(indeAction);
    relateAction.forEach(action => {
        const actionKey = action.eleIndex + '_' + action.actIndex; // num_num
        const condition = allRelations[actionKey];

        if (condition.length > 1 || condition[0].ifEle != "0") {
            let relation = {};
            const ele = "element" + action.eleIndex;
            const act = "action" + action.actIndex;
            const response = allInputs[ele][act].response;

            relation.condition = condition;
            relation.response = response;

            condRes.push(relation);
        } else {
            updateIndeAction.push(action);
        }
    });

    // get unique condition-response pairs
    const objectsEqual = (o1, o2) =>
        Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => o1[p] === o2[p]);
    const arraysEqual = (a1, a2) =>
        a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

    let uniqRelation = [];
    uniqRelation.push(condRes[0]);
    let exist = false;

    for (let j = 0; j < condRes.length; j++) {
        for (let i = 0; i < uniqRelation.length; i++) {
            if (arraysEqual(condRes[j].condition, uniqRelation[i].condition)) {
                exist = true;
                break;
            } else {
                exist = false;
            }
        }
        if (!exist) {
            uniqRelation.push(condRes[j]);
        }
    }

    // relationbar = margin + size and space 
    const relationBar = 10 + relationSize * 1.6 * (uniqRelation.length + 1);

    // draw elements
    for (let i = 0; i < eleCount; i++) {
        const x = ((width - relationBar) / eleCount) * (0.5 + i) + relationBar;
        eleIndex = i + 1;
        const ele = "element" + eleIndex;
        drawElement(x, elementY, elementWdith, elementHeight, elementSize, allInputs[ele].type, allInputs[ele].eleNum);
        eleX.push(x);
    }

    // draw independent actions first if there are independent actions before the relational action
    if (actionOrder) {
        allAction = indeAction.concat(relateAction);
        actionOrder = false;
    } else {
        allAction = relateAction.concat(indeAction);
    }

    // draw actions 
    allAction.forEach(action => {
        processAction(allInputs, eleX, action.eleIndex, action.actIndex);
    });

    // draw independent relations first
    updateIndeAction.forEach(action => {
        const actionKey = action.eleIndex + '_' + action.actIndex;
        const y = actionInfo[actionKey][0];
        const h = actionInfo[actionKey][1];
        const x = 10;
        drawSelfInitiate(x, y, h, actionSize);
    });

    // then draw relations 
    for (let i = 0; i < uniqRelation.length; i++) {
        const x = 10 + 1.6 * relationSize * (i + 1);
        if (uniqRelation[i] != null) {
            drawRelation(x, uniqRelation[i], actionSize);
        }
    }
    // }
    // catch (err) {
    //     // alert(err.message);
    // }
}

// order actions based on their condition 
function checkAction(oriEleIndex, oriActIndex, eleIndex, actIndex) {
    // console.log(eleIndex, actIndex);
    const ele = "element" + eleIndex;
    const act = "action" + actIndex;
    let action = {};

    // const oriEle = "element" + oriEleIndex;
    // const oriAct = "action" + oriActIndex;

    if (allInputsCopy[ele][act].action != "123456") {

        const condition = allInputsCopy[ele][act].condition;
        // if current action has no condition, push current action to relateAction
        if (condition.length == 1 && condition[0].ifEle == "0") {
            action = {};
            action.eleIndex = eleIndex;
            action.actIndex = actIndex;
            relateAction.push(action);
            allInputsCopy[ele][act].action = "123456";
        } else {
            // if current action has condition, check conditional action until the initial action
            let self = false;
            condition.forEach(cond => {
                if (cond.ifEle == 0) {
                    self = true;
                } else if (cond.ifEle == "") {
                    const ind = condition.indexOf(cond);
                    condition.splice(ind, 1);
                }
            });
            if (self) {
                action = {};
                action.eleIndex = eleIndex;
                action.actIndex = actIndex;
                relateAction.push(action);
                allInputsCopy[ele][act].action = "123456";
            } else {
                condition.forEach(cond => {
                    if (cond.ifEle != 0 && cond.ifEle != "") {
                        // if no looping situation
                        if (oriEleIndex != cond.ifEle || oriActIndex != cond.ifAct) {
                            checkAction(eleIndex, actIndex, cond.ifEle, cond.ifAct);
                        }
                    }
                    // if the condition contains self-initated
                    // else {
                    //     action = {};
                    //     action.eleIndex = eleIndex;
                    //     action.actIndex = actIndex;
                    //     relateAction.push(action);
                    //     allInputsCopy[ele][act].action = "123456";
                    // }
                });
            }
            // push current action to the relate array
            if (allInputsCopy[ele][act].action != "123456") {
                action = {};
                action.eleIndex = eleIndex;
                action.actIndex = actIndex;
                relateAction.push(action);
                allInputsCopy[ele][act].action = "123456";
            }
        }
    }
}

function processAction(allInputs, eleX, eleIndex, actIndex) {
    const ele = "element" + eleIndex;
    const act = "action" + actIndex;
    actionN++;
    const actV = allInputs[ele][act].action;
    const intend = allInputs[ele][act].intention;
    const len = actV.length;
    if (len < 30) {
        actionWidth = len * actionSize / 1.5;
    } else {
        actionWidth = len * actionSize / 2;
    }
    actionHeight = actionSize * 2.5;
    actionDist = (height - elementY - 20 - elementHeight * 0.5 - actionHeight * totalAction) / (totalAction + 1);
    // corner = actionHeight / 2 + 20;
    actionX = eleX[eleIndex - 1];
    actionY = elementY + elementHeight / 2 + actionN * (actionHeight + actionDist) - 0.5 * actionHeight;
    const actionKey = eleIndex + `_` + actIndex;

    let info = [];
    info.push(actionY);
    info.push(actionHeight);
    actionInfo[actionKey] = info;
    // console.log(actionInfo);

    drawAction(actionX, actionY, actionWidth, actionHeight, actionSize, actV, intend);

    const comCount = allInputs[ele][act].comCount;
    let space = 8;

    if (comCount == 1) {
        const communication = allInputs[ele][act][comCount];
        const to = communication.to;
        if (to != 0) {
            if (communication.direct) {
                drawDirect(actionX, actionY, actionWidth, eleX[to - 1], actionY, comSize, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect.join('; '));
            } else {
                const via = communication.via;
                drawMediated(actionX, actionY, actionWidth, eleX[via - 1], eleX[to - 1], actionY, comSize, space, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect.join('; '));
            }
        }
    } else {
        let turn = 'none';
        let prevTurn = 'none';
        for (let k = 0; k < comCount; k++) {
            const communication = allInputs[ele][act][k + 1];
            const to = communication.to;
            const comY = actionY - actionHeight / 2 - actionSize / 8 + (actionHeight / comCount) * (0.5 + k);
            if (to != 0) {
                if (communication.direct) {
                    drawDirect(actionX, comY, actionWidth, eleX[to - 1], comY, comSize, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect.join('; '));
                } else {
                    const via = communication.via;
                    const toX = eleX[to - 1];
                    const viaX = eleX[via - 1];

                    if (actionX < viaX && viaX >= toX) {
                        turn = 'right';
                    } else if (actionX > viaX && viaX <= toX) {
                        turn = 'left';
                    } else {
                        turn = 'none';
                    }
                    if (turn == 'left' && turn == prevTurn) {
                        space += 8;
                    } else if (turn == 'right' && turn == prevTurn) {
                        space += 8;
                    } else {
                        space = 8;
                    }
                    prevTurn = turn;

                    drawMediated(actionX, comY, actionWidth, viaX, toX, comY, comSize, space, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect.join('; '));
                }
            }
        }
    }
}

function addName(name) {
    // console.log(name);

    svg.append('text')
        .attr('x', 0.01 * width)
        .attr('y', 0.99 * height)
        .attr('text-anchor', 'start')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('font-style', 'italic')
        .text(name);
}

function drawElement(x, y, w, h, s, info, count) {
    let g = svg.append('g')
        .attr('class', 'svg_element');

    if (count == "2") {
        g.append('rect')
            .attr('x', x - w / 2 + 5)
            .attr('y', y - h / 2 - 5)
            .attr('width', w)
            .attr('height', h)
            .attr('rx', 15)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .attr('fill', 'white');
    } else if (count.includes("+") || count != 1) {
        g.append('rect')
            .attr('x', x - w / 2 + 10)
            .attr('y', y - h / 2 - 10)
            .attr('width', w)
            .attr('height', h)
            .attr('rx', 15)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .attr('fill', 'white');

        g.append('rect')
            .attr('x', x - w / 2 + 5)
            .attr('y', y - h / 2 - 5)
            .attr('width', w)
            .attr('height', h)
            .attr('rx', 15)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .attr('fill', 'white');
    }

    g.append('rect')
        .attr('x', x - w / 2)
        .attr('y', y - h / 2)
        .attr('width', w)
        .attr('height', h)
        .attr('rx', 15)
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    g.append('text')
        .attr('x', x)
        .attr('y', y - s / 4)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .attr('font-weight', 'bold')
        .text(info);

    g.append('text')
        .attr('x', x)
        .attr('y', y + s)
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('font-size', s - 2)
        .text(count);

    g.append('line')
        .attr('x1', x)
        .attr('y1', y + h / 2)
        .attr('x2', x)
        .attr('y2', height - 20)
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '5')
}

function drawAction(x, y, w, h, s, act, intend) {
    let g = svg.append('g')
        .attr('class', 'svg_action');

    // draw grey background 
    g.append('rect')
        .attr('x', 0)
        .attr('y', y - h + s - 1)
        .attr('width', width)
        .attr('height', h + 2)
        .attr('stroke-width', 0)
        .attr('fill', '#D3D3D3')
        .attr('fill-opacity', "0.3");

    g.append('rect')
        .attr('x', x - w / 2)
        .attr('y', y - h + s)
        .attr('width', w)
        .attr('height', h)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    if (!intend) {
        g.append('rect')
            .attr('x', x - w / 2 + 3)
            .attr('y', y - h + s + 3)
            .attr('width', w - 6)
            .attr('height', h - 6)
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('fill', 'white');
    }

    g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(act);
}

function drawDirect(sx, sy, w, tx, ty, s, p, f, t, count, effect) {
    let opacity = 1;

    if (!p) {
        opacity = opacityV;
    }

    let g = svg.append('g')
        .attr('class', 'svg_direct')
        .attr('opacity', opacity);

    //connect with a line 
    let csx = sx;
    let ctx = tx;
    let lsx = sx;
    let ltx = tx;
    let tsx = sx;
    let tcsx = sx;
    let pathPoints = "";
    let y = sy - s / 4;
    let eleDist;
    if (eleX.length > 1) {
        eleDist = eleX[1] - eleX[0];
    } else {
        eleDist = width / 2.5;
    }
    let anchor = 'start';

    if (sx < tx) {
        csx = sx + w / 2 + configR;
        ctx = tx - configR;
        lsx = csx + configR;
        ltx = ctx - configR;
        tsx = ctx - configR - 10;
        tcsx = csx + configR + 10;
        effectLen = ltx - lsx - 10;
        anchor = 'end';
        pathPoints = "M" + lsx + "," + y + "L" + ltx + "," + y;
    } else if (sx > tx) {
        csx = sx - w / 2 - configR;
        ctx = tx + configR;
        lsx = csx - configR;
        ltx = ctx + configR;
        effectLen = lsx - ltx - 10;
        tsx = ctx + configR + 10;
        tcsx = csx - configR - 10 - s;
        anchor = 'start';
        pathPoints = "M" + lsx + "," + y + "L" + ltx + "," + y;
    }
    // sx == tx
    else {
        if (effect.length > 60) {
            corner = actionSize + 20;
        } else {
            corner = actionSize + 13;
        }

        if (sx == eleX[eleX.length - 1]) {
            csx = sx - w / 2 - configR;
            ctx = tx - configR;
            lsx = csx - configR;
            ltx = ctx - configR;
            ty = sy + corner;
            tsx = lsx - 10;
            tcsx = lsx - 10;
            effectLen = eleDist * 0.6;
            anchor = 'end';
            pathPoints = "M" + lsx + "," + y + "L" + (lsx - effectLen - 10) + "," + y + "L" + (lsx - effectLen - 10) + "," + (ty - s / 4) + "L" + ltx + "," + (ty - s / 4);
        } else {
            csx = sx + w / 2 + configR;
            ctx = tx + configR;
            lsx = csx + configR;
            ltx = ctx + configR;
            tsx = lsx + 10;
            tcsx = tsx;
            ty = sy + corner;
            effectLen = eleDist * 0.6;
            anchor = 'start';
            pathPoints = "M" + lsx + "," + y + "L" + (lsx + effectLen + 10) + "," + y + "L" + (lsx + effectLen + 10) + "," + (ty - s / 4) + "L" + ltx + "," + (ty - s / 4);
        }
    }

    // config from 
    g.append('circle')
        .attr('cx', csx)
        .attr('cy', sy - s / 4)
        .attr('r', configR)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    g.append('text')
        .attr('x', csx)
        .attr('y', sy)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(f);

    //config to 
    g.append('circle')
        .attr('cx', ctx)
        .attr('cy', ty - s / 4)
        .attr('r', configR)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    g.append('text')
        .attr('x', ctx)
        .attr('y', ty)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(t);

    g.append('path')
        .attr('d', pathPoints)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('stroke-linejoin', 'round')
        .attr('marker-end', 'url(#arrow)')
        .attr('fill', 'none');

    g.append('text')
        .attr('x', tsx)
        .attr('y', sy + s / 1.3)
        .attr('text-anchor', anchor)
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(effect)
        .call(wrap, effectLen);

    g.append('text')
        .attr('x', tcsx)
        .attr('y', sy - s / 1.5)
        .attr('text-anchor', 'start')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(count);
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr('x'),
            y = text.attr('y'),
            dy = 0, //parseFloat(text.attr('dy')),
            tspan = text.text(null)
                .append('tspan')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', dy + 'em');
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                    .text(word);
            }
        }
    });
}

function drawMediated(sx, sy, w, vx, tx, ty, s, space, p, f, t, count, effect) {
    let opacity = 1;

    if (!p) {
        opacity = opacityV;
    }

    let g = svg.append('g')
        .attr('class', 'svg_mediated')
        .attr('opacity', opacity);

    //connect with a line 
    let csx = sx;
    let ctx = tx;
    let lsx = sx;
    let ltx = tx;
    let tsx = sx;
    let tcsx = sx;
    let pathPoints = "";
    let y = sy - s / 4;
    let tsy = y + s;
    let tcsy = sy - s / 1.5;
    let anchor = 'start';
    let tsyRatio = 0.3;

    if (effect.length > 60) {
        corner = actionSize + 20;
    } else {
        corner = actionSize + 10;
    }

    // if sourceX is smaller than viaX
    if (sx < vx) {
        csx = sx + w / 2 + configR;
        tcsx = csx + configR + 10;
        lsx = csx + configR;
        // sx < vx < tx
        if (vx < tx) {
            ctx = tx - configR;
            ltx = ctx - configR;
            effectLen = ltx - lsx - 10;
            tsx = ctx - configR - 10;
            anchor = 'end';
            pathPoints = "M" + lsx + "," + y + "L" + (vx - configR) + "," + y + "L" + (vx - configR) + "," + (y - configR) + "L" + (vx + configR) + "," + (y - configR) + "L" + (vx + configR) + "," + y + "L" + ltx + "," + y;
        }
        // sx < tx < vx || tx < sx < vx || sx = tx < vx 
        else if (vx > tx) {
            ty = sy + corner;
            let lty = ty - s / 4;
            ctx = tx + configR;
            ltx = ctx + configR;
            let viaX = vx + space;
            tsy = lty - tsyRatio * s;
            anchor = 'start';
            //tx < sx < vx || sx < tx < vx
            if (tx != sx) {
                effectLen = vx - tx - 10;
                tsx = ltx + 10;
            }
            //sx = tx < vx 
            else {
                effectLen = vx - lsx;
                tsx = lsx;
            }
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
        // sx < vx = tx 
        else {
            ty = sy + corner;
            let lty = ty - s / 4;
            ctx = tx + configR;
            ltx = ctx + configR;
            let viaX = vx + configR * 2 + space * 2;
            effectLen = vx - lsx - 10;
            tsx = vx - 2;
            anchor = 'end';
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
    }
    // if sourceX is larger than viaX
    else if (sx > vx) {
        csx = sx - w / 2 - configR;
        tcsx = csx - configR - 10 - s;
        lsx = csx - configR;
        //tx < vx < sx 
        if (vx > tx) {
            ctx = tx + configR;
            ltx = ctx + configR;
            tsx = ltx + 10;
            anchor = 'start';
            effectLen = lsx - tx - 10;
            pathPoints = "M" + lsx + "," + y + "L" + (vx + configR) + "," + y + "L" + (vx + configR) + "," + (y - configR) + "L" + (vx - configR) + "," + (y - configR) + "L" + (vx - configR) + "," + y + "L" + ltx + "," + y;
        }
        // vx < tx < sx || vx < sx < tx || vx < sx = tx
        else if (vx < tx) {
            ty = sy + corner;
            let lty = ty - s / 4;
            ctx = tx - configR;
            ltx = ctx - configR;
            let viaX = vx - space;
            anchor = 'end';
            tsy = lty - tsyRatio * s;
            // vx < tx < sx || vx < sx < tx
            if (tx != sx) {
                effectLen = tx - vx - 10;
                tsx = ltx - 10;
            }
            // vx < sx = tx
            else {
                effectLen = lsx - vx - 10;
                tsx = lsx;
            }
            tsx = vx + 2;
            anchor = 'start';
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
        // vx = tx < sx
        else {
            ty = sy + corner;
            let lty = ty - s / 4;
            ctx = tx - configR;
            ltx = ctx - configR;
            let viaX = vx - configR * 2 - space * 2;
            effectLen = lsx - vx;
            tsx = vx + 2;
            anchor = 'start';
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
    }
    // if sourceX is equal to viaX 
    else {
        // sx = vx < tx 
        if (vx < tx) {
            csx = sx - w / 2 - configR;
            tsx = ltx - 10;
            anchor = 'end';
            lsx = csx - configR;
            tcsx = lsx - 10;
            ty = sy + corner;
            let lty = ty - s / 4;
            tsy = lty - tsyRatio * s;
            tcsy = sy - s / 1.5;
            ctx = tx - configR;
            ltx = ctx - configR;
            vx = lsx;
            let viaX = vx - configR - space;
            effectLen = tx - tsx;
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
        // tx < sx = vx
        else if (vx > tx) {
            csx = sx + w / 2 + configR;
            effectLen = ltx - csx;
            anchor = 'start';
            lsx = csx + configR;
            tcsx = lsx + 10;
            ty = sy + corner;
            let lty = ty - s / 4;
            tsy = lty - tsyRatio * s;
            tcsy = sy - s / 1.5;
            ctx = tx + configR;
            ltx = ctx + configR;
            tsx = ltx + 10;
            vx = lsx;
            let viaX = vx + configR + space;
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
        // tx = sx = vx 
        else {
            csx = sx + w / 2 + configR;
            effectLen = effect.length * 5;
            anchor = 'start';
            lsx = csx + configR;
            ty = sy + corner;
            let lty = ty - s / 4;
            tsy = lty - tsyRatio * s;
            tcsy = sy - s / 1.5;
            ctx = tx + configR;
            ltx = ctx + configR;
            vx = lsx;
            tsx = csx + 10;
            tcsx = lsx + 10;
            let viaX = vx + configR + effectLen + space;
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }

    }

    // config from 
    g.append('circle')
        .attr('cx', csx)
        .attr('cy', sy - s / 4)
        .attr('r', configR)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    g.append('text')
        .attr('x', csx)
        .attr('y', sy)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(f);

    //config to 
    g.append('circle')
        .attr('cx', ctx)
        .attr('cy', ty - s / 4)
        .attr('r', configR)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    g.append('text')
        .attr('x', ctx)
        .attr('y', ty)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(t);

    // draw connection 
    g.append('path')
        .attr('d', pathPoints)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('stroke-linejoin', 'round')
        .attr('marker-end', 'url(#arrow)')
        .attr('stroke-dasharray', '3')
        .attr('fill', 'none');

    g.append('text')
        .attr('x', tsx)
        .attr('y', tsy)
        .attr('text-anchor', anchor)
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(effect)
        .call(wrap, effectLen);

    g.append('text')
        .attr('x', tcsx)
        .attr('y', tcsy)
        .attr('text-anchor', 'start')
        .attr('font-family', 'Arial, Helvetica, sans-serif')
        .attr('font-size', s)
        .text(count);
}

function drawSelfInitiate(x, y, h, s) {
    let g = svg.append('g')
        .attr('class', 'self_initiate');

    g.append('rect')
        .attr('x', x)
        .attr('y', y - h + s)
        .attr('width', relationSize - 2)
        .attr('height', h)
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('fill', 'white');
}

// function drawRelation(x, actionKey, condition, s) {
function drawRelation(x, uniqR, s) {
    const condition = uniqR.condition;
    const response = uniqR.response;

    let actionKey = response[0].ifEle + '_' + response[0].ifAct;
    let y0 = actionInfo[actionKey][0];
    let h0 = actionInfo[actionKey][1];
    let resY = [];
    let resH = [];
    let resAdd = [];
    let resFn = [];

    let condY = [];
    let condH = [];
    let add = [];
    let fn = [];
    // let dash = 0;
    let y1, y2;

    response.forEach(res => {
        actionKey = res.ifEle + '_' + res.ifAct;
        const y = actionInfo[actionKey][0];
        const h = actionInfo[actionKey][1];
        resY.push(y);
        resH.push(h);
        resAdd.push(res.add);
        resFn.push(res.fnIndex);
    });

    condition.forEach(cond => {
        if (cond.ifEle == "0") {
            drawSelfInitiate(10, y0, h0, actionSize);
        } else if (cond.ifEle == "") {
            const ind = condition.indexOf(cond);
            condition.splice(ind, 1);
        } else {
            actionKey = cond.ifEle + '_' + cond.ifAct;
            const y = actionInfo[actionKey][0];
            const h = actionInfo[actionKey][1];
            condY.push(y);
            condH.push(h);
            add.push(cond.add);
            fn.push(cond.fnIndex);
        }
    });

    // check if current action is not a triggering action
    let g = svg.append('g')
        .attr('class', 'relation');

    // draw the reactions, blue-ish 
    drawBlock(g, x, s, resY, resH[0], '#87CEFA', resFn, resAdd)

    // draw the condition
    drawBlock(g, x, s, condY, condH[0], '#F08080', fn, add)

    // add footnote 
    condY = condY.sort((a, b) => a - b);
    const minCond = condY[0];
    const maxCond = condY[condY.length - 1];
    resY = resY.sort((a, b) => a - b);
    const minRes = resY[0];
    const maxRes = resY[resY.length - 1];

    drawFootnote(g, x, s, maxCond, fn);
    drawFootnote(g, x, s, maxRes, resFn);

    // connect response and condition 
    if (maxCond < minRes) {
        y1 = maxCond + s - 1;
        y2 = minRes + s + 1 - condH[0];
    } else if (maxRes < minCond) {
        y1 = maxRes + s - 1;
        y2 = minCond + s + 1 - condH[0];
    }

    g.append('line')
        .attr('x1', x)
        .attr('y1', y1)
        .attr('x2', x)
        .attr('y2', y2)
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('stroke-dasharray', 0)
        .attr('fill', 'none');
}

function drawBlock(g, x, s, arrayY, h, color, fn, add) {
    let dash = 0;
    let y1, y2;
    for (let i = 0; i < arrayY.length; i++) {
        g.append('rect')
            .attr('x', x)
            .attr('y', arrayY[i] - h + s)
            .attr('width', relationSize)
            .attr('height', h)
            .attr('stroke-width', 2)
            .attr('stroke', color) // #F08080
            .attr('fill', color);

        if (i < (arrayY.length - 1)) {
            if (arrayY[i] < arrayY[i + 1]) {
                y1 = arrayY[i] - h + s - 1;
                y2 = arrayY[i + 1] + s + 1;
            } else {
                y1 = arrayY[i + 1] - h + s - 1;
                y2 = arrayY[i] + s + 1;
            }
        } else if (arrayY.length == 1) {
            y1 = arrayY[i] - h + s - 1;
            y2 = arrayY[i] + s + 1;
            dash = 0;
        }

        if (arrayY.length > 1) {
            if (fn[i] != "") {
                dash = 0;
            } else {
                if (add[i] == "0") {
                    dash = 3;
                } else if (add[i] == "1") {
                    dash = 0;
                }
            }
        }

        g.append('line')
            .attr('x1', x)
            .attr('y1', y1)
            .attr('x2', x)
            .attr('y2', y2)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .attr('stroke-dasharray', dash)
            .attr('fill', 'none');
    }
}

function drawFootnote(g, x, s, y, fn) {
    fn.forEach(f => {
        if (f != "") {
            const fnText = "*" + f;
            g.append('text')
                .attr('x', x)
                .attr('y', y + s * 2)
                .attr('text-anchor', 'start')
                .attr('font-family', 'Arial, Helvetica, sans-serif')
                .attr('font-size', 11)
                .text(fnText);
        }
    });
}