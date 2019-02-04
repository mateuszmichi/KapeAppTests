import React, { Component } from 'react';

import Charts from './Charts';

import jsPDF from 'jspdf';

import canvg from 'canvg'

class PDFGeneration extends Component {
    chartRef = null;
    

    render() {
        return(
            <div>
                <div>
                    <Charts ref={(input) => {this.chartRef = input }} />
                </div>
                <div>
                    <button onClick={this.generatePdf}>
                        Generate PDF!
                    </button>
                </div>
                <canvas height={300} width={500} id="canvas"/>
            </div>
        );
    }

    generatePdf() {
        alert('blick!');
        const element = document.getElementsByClassName('recharts-surface')[0];
        if(element) {
            console.log(element);
            const svg = new XMLSerializer().serializeToString(element);
            const svg64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            var c = document.getElementById('canvas');
            var ctx = c.getContext('2d');
            ctx.drawSvg(svg64, 0, 0, 500, 300);

            const png = c.toDataURL("image/png");

            const image = new Image(500,300)
            image.src = png;
            document.body.append(image);
            
            const doc = new jsPDF('landscape');
            doc.setFontSize(20);
            doc.text(15, 15, "Super Cool Chart");
            doc.addImage(png, 'PNG', 20, 20, 250, 150);
            doc.save('new-canvas.pdf');
        }
    }
}

export default PDFGeneration
