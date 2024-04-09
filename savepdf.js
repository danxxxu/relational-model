// import './node_modules/svg2pdf.js/dist/svg2pdf.umd.min.js';

document.querySelector('#savePDF').addEventListener('click', savePDF);

function savePDF() {

    const svgEle = document.getElementById('container');

    const pdf = new jspdf.jsPDF();

    pdf.svg(svgEle, {
        x: 0,
        y: 0,
        width: 960,
        height: 500
    }).then(() => {
        pdf.save('visualisation.pdf');
    })
}