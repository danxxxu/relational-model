import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const svg = d3.select('#vis_anno');
const width = +svg.attr('width'); // + convert string to numbers 
// const height = +svg.attr('height');
const height = 679;

const opacityV = 0.65;

//define arrow marker variables 
const markerBoxWidth = 15;
const markerBoxHeight = 15;
const refX = markerBoxWidth; // move the arrow to the end of the line 
const refY = markerBoxHeight / 2;
const arrowPoints = [[0, 0], [markerBoxWidth, markerBoxHeight / 2], [0, markerBoxHeight]];

svg.append('text')
    .attr('x', 0.05 * width)
    .attr('y', 23)
    .attr('text-anchor', 'start')
    .attr('font-size', 16)
    .attr('font-weight', 'bold')
    .text("Annotation:");

// annotate element 
let ele = svg.append('g')
    .attr('class', 'annoELe');

const eleW = 0.4 * width;
const eleX = 0.5 * width - 0.5 * eleW;
const eleH = 0.2 * width;
const eleY = height / 9 - eleH + 10;
const actW = 0.25 * width;
const actH = actW * 0.6;

ele.append('rect')
    .attr('x', eleX)
    .attr('y', eleY)
    .attr('width', eleW)
    .attr('height', eleH)
    .attr('rx', 15)
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
    .attr('fill', 'white');

ele.append('text')
    .attr('x', 0.05 * width)
    .attr('y', eleY + 14)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("Element");

ele.append('text')
    .attr('x', eleX + eleW * 0.5)
    .attr('y', eleY + 18)
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text("Type");

ele.append('text')
    .attr('x', eleX + eleW * 0.5)
    .attr('y', eleY + 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text("Count");

ele.append('line')
    .attr('x1', eleX + eleW * 0.5)
    .attr('y1', eleY + eleH)
    .attr('x2', eleX + eleW * 0.5)
    .attr('y2', 2 * height / 9)
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
    .attr('stroke-dasharray', '5')

// annotate action 
ele.append('rect')
    .attr('x', eleX + eleW * 0.5 - actW * 0.5)
    .attr('y', eleY + eleH + 15)
    .attr('width', actW)
    .attr('height', actH)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

ele.append('text')
    .attr('x', eleX + eleW * 0.5)
    .attr('y', eleY + eleH + 38)
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text("Action");

//annotate condition
let cond = svg.append('g')
    .attr('class', 'annoCond');

cond.append('text')
    .attr('x', 0.05 * width)
    .attr('y', 2 * height / 9 + 14)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("Condition");

const condH = height / 9 - 50;
const condW = condH / 4;

cond.append('rect')
    .attr('x', 0.05 * width)
    .attr('y', 2 * height / 9 + 23)
    .attr('width', condW)
    .attr('height', condH)
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
    .attr('fill', 'white');

cond.append('text')
    .attr('x', 0.05 * width + condW + 5)
    .attr('y', 2 * height / 9 + condH + 15)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("Self-initated");

cond.append('rect')
    .attr('x', 0.5 * width)
    .attr('y', 2 * height / 9 + 23)
    .attr('width', condW)
    .attr('height', condH)
    .attr('stroke-width', 2)
    .attr('stroke', '#F08080')
    .attr('fill', '#F08080');

cond.append('text')
    .attr('x', 0.5 * width + condW + 5)
    .attr('y', 2 * height / 9 + condH + 15)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .attr('stroke', '#F08080')
    .attr('fill', '#F08080')
    .text("If");

cond.append('rect')
    .attr('x', 0.725 * width)
    .attr('y', 2 * height / 9 + 23)
    .attr('width', condW)
    .attr('height', condH)
    .attr('stroke-width', 2)
    .attr('stroke', '#87CEFA')
    .attr('fill', '#87CEFA');

cond.append('text')
    .attr('x', 0.725 * width + condW + 5)
    .attr('y', 2 * height / 9 + condH + 15)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .attr('stroke', '#87CEFA')
    .attr('fill', '#87CEFA')
    .text("Then");

// AND / OR
cond.append('line')
    .attr('x1', width / 6)
    .attr('y1', height / 3 - 20)
    .attr('x2', width / 6)
    .attr('y2', height / 3 - 20 + condH)
    .attr('stroke-width', 2)
    .attr('stroke', 'black');

cond.append('text')
    .attr('x', width / 6 + 5)
    .attr('y', height / 3 - 5)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("AND");

cond.append('line')
    .attr('x1', 2 * width / 3)
    .attr('y1', height / 3 - 20)
    .attr('x2', 2 * width / 3)
    .attr('y2', height / 3 - 20 + condH)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', 3)
    .attr('stroke', 'black');

cond.append('text')
    .attr('x', 2 * width / 3 + 5)
    .attr('y', height / 3 - 5)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("OR");

//annotate communication 
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

let com = svg.append('g')
    .attr('class', 'annoCom');

const comY = height / 3 + 28;

com.append('text')
    .attr('x', 0.05 * width)
    .attr('y', comY)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("Communication");

// Direct, Public
com.append('text')
    .attr('x', 0.05 * width)
    .attr('y', comY + 20)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("Direct, Public:");


let comForm = com.append('g')
const configR = 0.065 * width;
const sx = 0.05 * width + configR;
const tx = 0.95 * width - configR;
const y1 = comY + 28 + configR;
const path1 = "M" + (sx + configR) + "," + y1 + "L" + (tx - configR) + "," + y1

comForm.append('circle')
    .attr('cx', sx)
    .attr('cy', y1)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm.append('text')
    .attr('x', sx)
    .attr('y', y1 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('From');

comForm.append('circle')
    .attr('cx', tx)
    .attr('cy', y1)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm.append('text')
    .attr('x', tx)
    .attr('y', y1 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('To');

comForm.append('path')
    .attr('d', path1)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('stroke-linejoin', 'round')
    .attr('marker-end', 'url(#arrow)')
    .attr('fill', 'none');

comForm.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y1 - 5)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Count');

comForm.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y1 + 13)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Effect');

//Direct, Private
com.append('text')
    .attr('x', 0.05 * width)
    .attr('y', y1 + configR + 20)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .attr('opacity', opacityV)
    .text("Direct, Private:");


let comForm2 = com.append('g')
    .attr('opacity', opacityV)
const y2 = y1 + configR * 2 + 28;
const path2 = "M" + (sx + configR) + "," + y2 + "L" + (tx - configR) + "," + y2

comForm2.append('circle')
    .attr('cx', sx)
    .attr('cy', y2)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm2.append('text')
    .attr('x', sx)
    .attr('y', y2 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('From');

comForm2.append('circle')
    .attr('cx', tx)
    .attr('cy', y2)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm2.append('text')
    .attr('x', tx)
    .attr('y', y2 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('To');

comForm2.append('path')
    .attr('d', path2)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('stroke-linejoin', 'round')
    .attr('marker-end', 'url(#arrow)')
    .attr('fill', 'none');

comForm2.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y2 - 5)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Count');

comForm2.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y2 + 13)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Effect');

// Mediated, Public
com.append('text')
    .attr('x', 0.05 * width)
    .attr('y', y2 + configR + 20)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .text("Mediated, Public:");


let comForm3 = com.append('g')
const y3 = y2 + configR * 2 + 28;
const path3 = "M" + (sx + configR) + "," + y3 + "L" + (tx - configR) + "," + y3

comForm3.append('circle')
    .attr('cx', sx)
    .attr('cy', y3)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm3.append('text')
    .attr('x', sx)
    .attr('y', y3 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('From');

comForm3.append('circle')
    .attr('cx', tx)
    .attr('cy', y3)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm3.append('text')
    .attr('x', tx)
    .attr('y', y3 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('To');

comForm3.append('path')
    .attr('d', path3)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('stroke-linejoin', 'round')
    .attr('marker-end', 'url(#arrow)')
    .attr('stroke-dasharray', '3')
    .attr('fill', 'none');

comForm3.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y3 - 5)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Count');

comForm3.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y3 + 13)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Effect');


// Mediated, Private
com.append('text')
    .attr('x', 0.05 * width)
    .attr('y', y3 + configR + 20)
    .attr('text-anchor', 'start')
    .attr('font-size', 14)
    .attr('opacity', opacityV)
    .text("Mediated, Private:");


let comForm4 = com.append('g')
    .attr('opacity', opacityV)
const y4 = y3 + configR * 2 + 28;
const path4 = "M" + (sx + configR) + "," + y4 + "L" + (tx - configR) + "," + y4

comForm4.append('circle')
    .attr('cx', sx)
    .attr('cy', y4)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm4.append('text')
    .attr('x', sx)
    .attr('y', y4 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('From');

comForm4.append('circle')
    .attr('cx', tx)
    .attr('cy', y4)
    .attr('r', configR)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('fill', 'white');

comForm4.append('text')
    .attr('x', tx)
    .attr('y', y4 + 4)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('To');

comForm4.append('path')
    .attr('d', path4)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('stroke-linejoin', 'round')
    .attr('marker-end', 'url(#arrow)')
    .attr('stroke-dasharray', '3')
    .attr('fill', 'none');

comForm4.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y4 - 5)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Count');

comForm4.append('text')
    .attr('x', sx + configR * 2)
    .attr('y', y4 + 13)
    .attr('text-anchor', 'start')
    .attr('font-family', 'Arial, Helvetica, sans-serif')
    .attr('font-size', 11)
    .text('Effect');
