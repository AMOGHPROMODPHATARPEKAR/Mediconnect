import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Report = () => {

    const doctor =  JSON.parse(localStorage.getItem('user'));
    console.log(doctor);
  const [formData, setFormData] = useState({
    patientName: '',
    symptoms: '',
    diagnosis: '',
    medication: '',
    remarks: ''
  });

  const [reportGenerated, setReportGenerated] = useState(false);
  const reportRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    setReportGenerated(true);
  };

  const handleDownloadPDF = async () => {
    const element = reportRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Patient_Report_${formData.patientName || 'Unknown'}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Generate Patient Report</h2>
      <form onSubmit={handleGenerateReport} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Symptoms</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Prescribed Medication</label>
          <textarea
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
        >
          Generate Report
        </button>
      </form>

      {reportGenerated && (
        <div className="mt-8">
            <div
    ref={reportRef}
    className="bg-white border border-gray-300 text-gray-800 p-6 rounded-lg shadow-md space-y-4"
    >
    <h3 className="text-2xl font-semibold text-blue-700 border-b pb-2 mb-4">
        📝 Patient Medical Report
    </h3>

    <div>
        <p className="font-medium text-gray-600">Doctor Name:</p>
        <p className="text-lg font-semibold">{doctor?.name}</p>
    </div>
    <div>
        <p className="font-medium text-gray-600">Patient Name:</p>
        <p className="text-lg font-semibold">{formData.patientName}</p>
    </div>

    <div>
        <p className="font-medium text-gray-600">Symptoms:</p>
        <p>{formData.symptoms}</p>
    </div>

    <div>
        <p className="font-medium text-gray-600">Diagnosis:</p>
        <p>{formData.diagnosis}</p>
    </div>

    <div>
        <p className="font-medium text-gray-600">Prescribed Medication:</p>
        <p>{formData.medication}</p>
    </div>

    <div>
        <p className="font-medium text-gray-600">Remarks:</p>
        <p>{formData.remarks}</p>
    </div>
    </div>

          <button
            onClick={handleDownloadPDF}
            className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700"
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Report;

