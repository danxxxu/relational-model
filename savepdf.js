// import './node_modules/svg2pdf.js/dist/svg2pdf.umd.min.js';

document.querySelector('#savePDF').addEventListener('click', savePDF);

function savePDF() {

    const svgEle = document.getElementById('container');

    const width = svgEle.width.baseVal.value;
    const height = svgEle.height.baseVal.value;

    const pdf = new jspdf.jsPDF('l', 'pt', [width, height]); // https://artskydj.github.io/jsPDF/docs/jsPDF.html

    const name = document.querySelector('#name_interaction').value;

    pdf.svg(svgEle, {
        width: width,
        height: height
    }).then(() => {
        pdf.save(name + '.pdf');
    })
}