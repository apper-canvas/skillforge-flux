import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificate = async (certificateRef, course, studentName = 'Student') => {
  try {
    if (!certificateRef.current) {
      throw new Error('Certificate template not found');
    }

    // Generate canvas from the certificate template
    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: 600
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);

    // Generate filename
    const sanitizedCourseTitle = course.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Certificate_${sanitizedCourseTitle}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Save the PDF
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    throw new Error('Failed to generate certificate. Please try again.');
  }
};

export const certificateService = {
  generateCertificate
};