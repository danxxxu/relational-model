import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const svg = d3.select('#container');
const width = +svg.attr('width'); // + convert string to numbers 
const height = +svg.attr('height');
const elementWdith = 200;
const elementHeight = 60;
const elementSize = 18;
const actionSize = 16;
const configR = 8;
const comSize = 11;
const elementY = 50;

let eleX = [];
let totalAction = 0;

//define arrow marker variables 
const markerBoxWidth = 15;
const markerBoxHeight = 15;
const refX = markerBoxWidth; // move the arrow to the end of the line 
const refY = markerBoxHeight / 2;
const arrowPoints = [[0, 0], [markerBoxWidth, markerBoxHeight / 2], [0, markerBoxHeight]];

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

let actionN = 0;
let actionX = 0;
let actionY = 0;
let actionWidth = 0;
let actionHeight = 0;
const effectLen = 180;
let corner = 0;
let actionDist = 0;

export function drawVis(allInputs) {
    actionN = 0;

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

    for (let i = 0; i < eleCount; i++) {
        const x = (width / eleCount) * (0.5 + i);
        eleIndex = i + 1;
        const ele = "element" + eleIndex;
        drawElement(x, elementY, elementWdith, elementHeight, elementSize, allInputs[ele].type, allInputs[ele].eleNum);
        eleX.push(x);
        totalAction += allInputs[ele].actionCount;
    }

    for (let i = 0; i < eleCount; i++) {
        eleIndex = i + 1;
        const ele = "element" + eleIndex;
        const actionCount = allInputs[ele].actionCount;
        for (let j = 0; j < actionCount; j++) {
            const act = "action" + (j + 1);
            let actV = allInputs[ele][act].action;
            if (actV != "123456") {
                const condition = allInputs[ele][act].condition;
                condition.forEach(cond => {
                    if (cond.ifEle == 0) {
                        processAction(allInputs, eleX, eleIndex, act, actV);
                        allInputs[ele][act].action = "123456";
                    } else {
                        //draw conditional action first 
                        const ifEle = "element" + cond.ifEle;
                        const ifAct = "action" + cond.ifAct;
                        const ifActV = allInputs[ifEle][ifAct].action;
                        if (ifActV != "123456") {
                            processAction(allInputs, eleX, cond.ifEle, ifAct, ifActV);
                            allInputs[ifEle][ifAct].action = "123456";
                        }
                        actV = allInputs[ele][act].action;
                        if (actV != "123456") {
                            processAction(allInputs, eleX, eleIndex, act, actV);
                            // console.log(allInputs[ele][act].action);
                            allInputs[ele][act].action = "123456";
                        }
                    }
                });
            }
        }
    }
}

function processAction(allInputs, eleX, eleIndex, act, actV) {
    const ele = "element" + eleIndex;
    actionN++;
    const len = actV.length;
    console.log(len);
    // const scale = d3.scaleLog([1, 80], [0, 25]);
    // actionWidth = scale(len) * actionSize;
    actionWidth = len * actionSize / 1.5;
    actionHeight = actionSize * 2.5;
    actionDist = (height - elementY - 20 - elementHeight * 0.5 - actionHeight * totalAction) / (totalAction + 1);
    corner = actionHeight / 2 + 20;
    actionX = eleX[eleIndex - 1];
    actionY = elementY + elementHeight / 2 + actionN * (actionHeight + actionDist) - 0.5 * actionHeight;
    drawAction(actionX, actionY, actionWidth, actionHeight, actionSize, actV);

    const comCount = allInputs[ele][act].comCount;
    if (comCount == 1) {
        const communication = allInputs[ele][act][comCount];
        const to = communication.to;
        if (communication.direct) {
            drawDirect(actionX, actionY, actionWidth, eleX[to - 1], actionY, comSize, communication.configF, communication.configT, communication.comNum, communication.effect);
        } else {
            const via = communication.via;
            drawMediated(actionX, actionY, actionWidth, eleX[via - 1], eleX[to - 1], actionY, comSize, communication.configF, communication.configT, communication.comNum, communication.effect);
        }
    } else {
        for (let k = 0; k < comCount; k++) {
            const communication = allInputs[ele][act][k + 1];
            const to = communication.to;
            const comY = actionY - actionHeight / 2 - actionSize / 8 + (actionHeight / comCount) * (0.5 + k)
            if (communication.direct) {
                drawDirect(actionX, comY, actionWidth, eleX[to - 1], comY, comSize, communication.configF, communication.configT, communication.comNum, communication.effect);
            } else {
                const via = communication.via;
                drawMediated(actionX, comY, actionWidth, eleX[via - 1], eleX[to - 1], comY, comSize, communication.configF, communication.configT, communication.comNum, communication.effect);
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
        .attr('font-size', s)
        .attr('font-weight', 'bold')
        .text(info);

    g.append('text')
        .attr('x', x)
        .attr('y', y + s)
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
        .attr('font-size', s)
        .text(act);
}

function drawDirect(sx, sy, w, tx, ty, s, f, t, count, effect) {
    let g = svg.append('g')
        .attr('class', 'svg_direct');

    //connect with a line 
    let csx = sx;
    let ctx = tx;
    let lsx = sx;
    let ltx = tx;
    let tsx = sx;
    let tcsx = sx;
    let pathPoints = "";
    let y = sy - s / 4;

    if (sx < tx) {
        csx = sx + w / 2 + configR;
        ctx = tx - configR;
        lsx = csx + configR;
        ltx = ctx - configR;
        tsx = csx + configR + 10;
        tcsx = tsx;
        pathPoints = "M" + lsx + "," + y + "L" + ltx + "," + y;
    } else if (sx > tx) {
        csx = sx - w / 2 - configR;
        ctx = tx + configR;
        lsx = csx - configR;
        ltx = ctx + configR;
        tsx = csx - configR - effectLen - 10;
        tcsx = csx - configR - 10 - s * 2;
        pathPoints = "M" + lsx + "," + y + "L" + ltx + "," + y;
    } else {
        csx = sx + w / 2 + configR;
        ctx = tx + configR;
        lsx = csx + configR;
        ltx = ctx + configR;
        tsx = lsx + 10;
        tcsx = tsx;
        ty = y + corner + s / 4;
        pathPoints = "M" + lsx + "," + y + "L" + (lsx + effectLen + 10) + "," + y + "L" + (lsx + effectLen + 10) + "," + (y + corner) + "L" + ltx + "," + (y + corner);
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
        .attr('font-size', s)
        .text(t);

    g.append('path')
        .attr('d', pathPoints)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('stroke-linejoin', 'round')
        .attr('marker-end', 'url(#arrow)')
        .attr('fill', 'none')

    g.append('text')
        .attr('x', tsx)
        .attr('y', sy + s)
        .attr('text-anchor', 'start')
        .attr('font-size', s)
        .text(effect)
        .call(wrap, effectLen);

    g.append('text')
        .attr('x', tcsx)
        .attr('y', sy - s / 1.5)
        .attr('text-anchor', 'start')
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

function drawMediated(sx, sy, w, vx, tx, ty, s, f, t, count, effect) {
    let g = svg.append('g')
        .attr('class', 'svg_mediated');

    //connect with a line 
    let csx = sx;
    let ctx = tx;
    let lsx = sx;
    let ltx = tx;
    let tsx = sx;
    let tcsx = sx;
    let pathPoints = "";
    let y = sy - s / 4;
    let tsy = sy + s;
    let tcsy = sy - s / 1.5;

    // if sourceX is smaller than viaX
    if (sx < vx) {
        csx = sx + w / 2 + configR;
        tsx = csx + configR + 10;
        tcsx = tsx;
        lsx = csx + configR;

        if (vx < tx) {
            ctx = tx - configR;
            ltx = ctx - configR;
            pathPoints = "M" + lsx + "," + y + "L" + ltx + "," + y;
        } else {
            ty = sy + corner;
            let lty = ty - s / 4;
            ctx = tx + configR;
            ltx = ctx + configR;
            let viaX = vx + 8;
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
    }
    // if sourceX is larger than viaX
    else if (sx > vx) {
        csx = sx - w / 2 - configR;
        tsx = csx - configR - effectLen - 10;
        tcsx = csx - configR - 10 - s * 2;
        lsx = csx - configR;

        if (vx > tx) {
            ctx = tx + configR;
            ltx = ctx + configR;
            pathPoints = "M" + lsx + "," + y + "L" + ltx + "," + y;
        } else {
            ty = sy + corner;
            let lty = ty - s / 4;
            ctx = tx - configR;
            ltx = ctx - configR;
            let viaX = vx - 8;
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        }
    }
    // if sourceX is equal to viaX 
    else {
        if (vx < tx) {
            csx = sx - w / 2 - configR;
            tsx = csx;
            tcsx = csx;
            lsx = csx - configR;
            ty = sy + corner;
            let lty = ty - s / 4;
            tsy = lty + 1.5 * s;
            tcsy = lty - 0.8 * s;
            ctx = tx - configR;
            ltx = ctx - configR;
            vx = lsx;
            let viaX = vx - 8;
            pathPoints = "M" + lsx + "," + y + "L" + viaX + "," + y + "L" + viaX + "," + lty + "L" + ltx + "," + lty;
        } else {
            csx = sx + w / 2 + configR;
            tsx = csx - effectLen;
            tcsx = csx;
            lsx = csx + configR;
            ty = sy + corner;
            let lty = ty - s / 4;
            tsy = lty + 1.5 * s;
            tcsy = lty - 0.8 * s;
            ctx = tx + configR;
            ltx = ctx + configR;
            vx = lsx;
            let viaX = vx + 8;
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
        .attr('fill', 'none')

    g.append('text')
        .attr('x', tsx)
        .attr('y', tsy)
        .attr('text-anchor', 'start')
        .attr('font-size', s)
        .text(effect)
        .call(wrap, effectLen);

    g.append('text')
        .attr('x', tcsx)
        .attr('y', tcsy)
        .attr('text-anchor', 'start')
        .attr('font-size', s)
        .text(count);
}