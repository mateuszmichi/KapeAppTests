import React, { Component } from "react";

// import Charts from "./Charts/LineChart";

import jsPDF from "jspdf";

import canvg from "canvg";

class PDFGeneration extends Component {
  chartRef = null;

  render() {
    return (
      <div>
        <div>{/* <Charts ref={(input) => {this.chartRef = input }} /> */}</div>
        <div>
          <button onClick={this.generatedPDF}>Generate PDF!</button>
        </div>
      </div>
    );
  }

  generatedPDF() {
    fetch("http://localhost:9000/api/render", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: "http://localhost:3000" }) // body data type must match "Content-Type" header
    })
      .then(response => response.blob())
      .then(blob => {
        var newBlob = new Blob([blob], { type: "application/pdf" });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement("a");
        link.href = data;
        link.download = "file.pdf";
        link.click();
        setTimeout(function() {
          window.URL.revokeObjectURL(data);
        }, 100);
      });
  }
  generatePdf() {
    alert("blick!");
    const element = document.getElementsByClassName("recharts-surface")[0];
    if (element) {
      console.log(element);
      const svg = new XMLSerializer().serializeToString(element);
      const svg64 =
        "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
      const canvas = document.createElement("canvas");
      canvas.height = 600;
      canvas.width = 1000;
      const ctx = canvas.getContext("2d");
      ctx.drawSvg(svg64, 0, 0, 1000, 600);

      const png = canvas.toDataURL("image/png");

      // const image = new Image(500,300)
      // image.src = png;
      // document.body.append(image);

      const doc = new jsPDF("portrait", "mm", "a4");
      doc.setFontSize(20);
      doc.text(15, 15, "Super Cool Chart");
      doc.addImage(png, "PNG", 20, 20, 210 - 20 * 2, ((210 - 20 * 2) * 6) / 10);
      doc.save("new-canvas.pdf");
    }
  }
}

export default PDFGeneration;
