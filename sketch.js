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
const elementY = 50;
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

export function drawVis(allInputs) {
    actionN = 0;
    actionInfo = {};
    allRelations = [];

    svg.selectAll('*').remove();

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
            // console.log(allRelations);

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
                    } else {
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

    let updateRelateAction = [];
    let updateIndeAction = [].concat(indeAction);
    relateAction.forEach(action => {
        const actionKey = action.eleIndex + '_' + action.actIndex;
        const condition = allRelations[actionKey];

        if (condition.length > 1 || condition[0].ifEle != "0") {
            updateRelateAction.push(actionKey);
        } else {
            updateIndeAction.push(action);
        }
    });

    // relationbar = margin + size and space 
    const relationBar = 10 + relationSize * 1.6 * (updateRelateAction.length + 1);
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
    for (let i = 0; i < updateRelateAction.length; i++) {
        const actionKey = updateRelateAction[i];
        const x = 10 + 1.6 * relationSize * (i + 1);
        const condition = allRelations[actionKey];
        drawRelation(x, actionKey, condition, actionSize);
    }

    svg.insertAdjacentHTML('afterend', ' <button id="savePDF">Download</button>');
}

// order actions based on their condition 
function checkAction(oriEleIndex, oriActIndex, eleIndex, actIndex) {
    // console.log(eleIndex, actIndex);
    const ele = "element" + eleIndex;
    const act = "action" + actIndex;
    let action = {};

    const oriEle = "element" + oriEleIndex;
    const oriAct = "action" + oriActIndex;

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
            condition.forEach(cond => {
                if (cond.ifEle != 0) {
                    // if no looping situation
                    if (oriEleIndex != cond.ifEle || oriActIndex != cond.ifAct) {
                        checkAction(eleIndex, actIndex, cond.ifEle, cond.ifAct);
                    }
                }
                // if the condition contains self-initated
                else {
                    action = {};
                    action.eleIndex = eleIndex;
                    action.actIndex = actIndex;
                    relateAction.push(action);
                    allInputsCopy[ele][act].action = "123456";
                }
            });
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
    const len = actV.length;
    // console.log(len);
    // const scale = d3.scaleLog([1, 80], [0, 25]);
    // actionWidth = scale(len) * actionSize;
    actionWidth = len * actionSize / 1.5;
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

    drawAction(actionX, actionY, actionWidth, actionHeight, actionSize, actV);

    const comCount = allInputs[ele][act].comCount;

    if (comCount == 1) {
        const communication = allInputs[ele][act][comCount];
        const to = communication.to;
        if (communication.direct) {
            drawDirect(actionX, actionY, actionWidth, eleX[to - 1], actionY, comSize, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect);
        } else {
            const via = communication.via;
            drawMediated(actionX, actionY, actionWidth, eleX[via - 1], eleX[to - 1], actionY, comSize, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect);
        }
    } else {
        let turn = 'none';
        let prevTurn = 'none';
        let space = 8;
        for (let k = 0; k < comCount; k++) {
            const communication = allInputs[ele][act][k + 1];
            const to = communication.to;
            const comY = actionY - actionHeight / 2 - actionSize / 8 + (actionHeight / comCount) * (0.5 + k)
            if (communication.direct) {
                drawDirect(actionX, comY, actionWidth, eleX[to - 1], comY, comSize, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect);
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

                drawMediated(actionX, comY, actionWidth, viaX, toX, comY, comSize, space, communication.public, communication.configF, communication.configT, communication.comNum, communication.effect);
            }
        }
    }
}

function drawElement(x, y, w, h, s, info, count) {
    let g = svg.append('g')
        .attr('class', 'svg_element');

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

function drawAction(x, y, w, h, s, act) {
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
    let eleDist = eleX[1] - eleX[0];
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
        tcsx = csx - configR - 10 - s * 2;
        anchor = 'start';
        pathPoints = "M" + lsx + "," + y + "L" + ltx + "," + y;
    }
    // sx == tx
    else {
        if (effect.length > 60) {
            corner = actionSize + 20;
        } else {
            corner = actionSize + 10;
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
        tcsx = csx - configR - 10 - s * 2;
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
            tcsx = csx;
            lsx = csx - configR;
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
        else {
            csx = sx + w / 2 + configR;
            effectLen = ltx - csx;
            tsx = ltx + 10;
            anchor = 'start';
            tcsx = csx;
            lsx = csx + configR;
            ty = sy + corner;
            let lty = ty - s / 4;
            tsy = lty - tsyRatio * s;
            tcsy = sy - s / 1.5;
            ctx = tx + configR;
            ltx = ctx + configR;
            vx = lsx;
            let viaX = vx + configR + space;
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

function drawRelation(x, actionKey, condition, s) {
    const y0 = actionInfo[actionKey][0];
    const h0 = actionInfo[actionKey][1];
    let condY = [];
    let condH = [];
    let add = [];
    let dash = 0;
    let y1, y2;

    condition.forEach(cond => {
        if (cond.ifEle == "0") {
            drawSelfInitiate(10, y0, h0, actionSize);
        } else {
            const actionKey = cond.ifEle + '_' + cond.ifAct;
            const y = actionInfo[actionKey][0];
            const h = actionInfo[actionKey][1];
            condY.push(y);
            condH.push(h);
            add.push(cond.add);
            // console.log(cond.add);
        }
    });

    // check if current action is not a reaction
    if (condition.length > 1 || condition[0].ifEle != "0") {
        let g = svg.append('g')
            .attr('class', 'relation');

        // draw the current action, blue-ish 
        g.append('rect')
            .attr('x', x)
            .attr('y', y0 - h0 + s)
            .attr('width', relationSize)
            .attr('height', h0)
            .attr('stroke-width', 2)
            .attr('stroke', '#87CEFA') // light sky blue #87CEFA
            .attr('fill', '#87CEFA');

        // draw the condition
        for (let i = 0; i < condY.length; i++) {
            g.append('rect')
                .attr('x', x)
                .attr('y', condY[i] - condH[i] + s)
                .attr('width', relationSize)
                .attr('height', condH[i])
                .attr('stroke-width', 2)
                .attr('stroke', '#F08080') // pink #FFB6C1
                .attr('fill', '#F08080');

            if (add[i] == "0") {
                dash = 3;
            } else if (add[i] == "1") {
                dash = 0;
            }

            if (y0 < condY[i]) {
                y1 = condY[i] + s + 1;
                y2 = y0 - h0 + s - 1;
            } else {
                y1 = y0 + s + 1;
                y2 = condY[i] - condH[i] + s - 1;
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
}