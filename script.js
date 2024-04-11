import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { mainR, viaR1, viaR } from "./input.js"

const svg = d3.select('#container');
const width = +svg.attr('width');
const height = +svg.attr('height');
const centerX = width / 2, centerY = height / 2;

//adjust graph distribution 
let force = -6500;
let center = 2;
let xforce = 0.2;
let adjustmentFactor = 0.2;

//define arrow marker variables 
const markerBoxWidth = 10;
const markerBoxHeight = 10;
const refX = markerBoxWidth; // move the arrow to the end of the line 
const refY = markerBoxHeight / 2;
const arrowPoints = [[0, 0], [markerBoxWidth, markerBoxHeight / 2], [0, markerBoxHeight]];

export function drawVis(nodes, links) {
    svg.selectAll("*").remove();

    //adjust the parameters based on the number of links and nodes, now it exceeds the canvas when more than 4 main nodes
    if (links.length <= 6) {
        force = -10500;
        center = 1;
    } else {
        force = -5500;
    }

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

    //start force simulation 
    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(force))
        .force("link", d3.forceLink(links).distance(link => link.distance))
        .force("center", d3.forceCenter(centerX, centerY).strength(center))
        .force("x", d3.forceX().strength(xforce))
        .force("y", d3.forceY().strength((adjustmentFactor * width) / height))
        .stop();

    simulation.tick(Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())));

    // connect circles 
    svg.append('svg:g')
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('marker-end', 'url(#arrow)')
        .attr('stroke-dasharray', link => link.dash)
        .attr('d', link => drawLink(link));

    // draw circles 
    svg.selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('class', 'node')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('r', node => node.size)
        .attr('cx', node => node.x)
        .attr('cy', node => node.y);

    // annotate circles 
    svg.append('text').attr('class', 'element-name')
    svg.selectAll('.element-name')
        .data(nodes)
        .join('text')
        .text(node => node.text)
        .attr('class', 'element-name')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', (node) => node.x)
        .attr('y', (node) => node.y);
    // add number of elements annotation
    svg.append('text').attr('class', 'element-num')
    svg.selectAll('.element-num')
        .data(nodes)
        .join('text')
        .text(node => node.num)
        .attr('class', 'element-num')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', (node) => node.x)
        .attr('y', (node) => (node.y + 18));
}

function drawLink(link) {
    // console.log(link.source.size);
    let x1 = link.source.x,
        y1 = link.source.y,
        x2 = link.target.x,
        y2 = link.target.y,
        dx = x2 - x1,
        dy = y2 - y1,
        dist = Math.sqrt(dx * dx + dy * dy),
        sourceX = link.source.size * dx / dist + x1,
        sourceY = link.source.size * dy / dist + y1,
        targetX = x1 + (1 - link.target.size / dist) * dx,
        targetY = y2 - (link.target.size / dist) * dy,
        rX = dist / 2,
        rY = rX,
        xRotation = 0,
        largeArc = 0,
        sweep = 1; // flip the arc 0/1

    if (link.target.size == 0 || link.source.size == 0) {
        rX = (dist - mainR) / 2;
        rY = rX;
    }
    // check viaNode source and target 
    if (link.target.size == viaR1 || link.source.size == viaR1) {
        rX = (dist - mainR - viaR) / 2;
        rY = rX;
    }

    return "M" +
        sourceX + "," +
        sourceY + "A" +
        rX + "," + rY + " " + xRotation + "," + largeArc + "," + sweep + " " +
        targetX + "," +
        targetY;
}