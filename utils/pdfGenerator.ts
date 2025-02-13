// utils/pdfGenerator.ts
import jsPDF from "jspdf";
import { FormData } from "../types/worksheet";
import { EngagementScheduleData } from "@/types/engagement";
import { ActivityReportData } from "@/types/activity";
import { AllotmentFormData } from "@/types/allotment";

export const generateWorksheetPDF = (formData: FormData): void => {
  const doc = new jsPDF();

  // Add Times New Roman font
  doc.setFont("times", "bold");

  // Header
  doc.setFontSize(16);
  doc.text("NIRMA UNIVERSITY", 105, 20, { align: "center" });
  doc.text("INSTITUTE OF TECHNOLOGY", 105, 30, { align: "center" });
  doc.text("COMPUTER SCIENCE ENGINEERING", 105, 40, { align: "center" });
  doc.text("DAILY WORKSHEET (DWS)", 105, 50, { align: "center" });

  // Student Details
  doc.setFontSize(12);
  doc.text("NAME OF THE STUDENT", 20, 70);
  doc.text(":", 80, 70);
  doc.setFont("times", "normal");
  doc.text(formData.studentName, 85, 70);

  doc.setFont("times", "bold");
  doc.text("ROLL NO.", 20, 80);
  doc.text(":", 80, 80);
  doc.setFont("times", "normal");
  doc.text(formData.rollNo, 85, 80);

  doc.setFont("times", "bold");
  doc.text("NAME OF THE COMPANY", 20, 90);
  doc.text(":", 80, 90);
  doc.setFont("times", "normal");
  doc.text(formData.companyName, 85, 90);

  // Table Header
  doc.setFont("times", "bold");
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 110, 40, 10, "F");
  doc.rect(60, 110, 130, 10, "F");
  doc.text("DATE", 30, 116);
  doc.text("TASK", 110, 116);

  // Table Content
  let yPos = 120;
  const pageHeight = doc.internal.pageSize.height;
  const dateColWidth = 40;
  const taskColWidth = 130;

  formData.entries.forEach((entry) => {
    // Prepare date
    const formattedDate = entry.date
      ? new Date(entry.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

    // Split task into multiple lines
    const splitTask = doc.splitTextToSize(entry.task || "", taskColWidth - 10);

    // Calculate row height based on content
    const lineHeight = 6;
    const dateLines = 1;
    const taskLines = splitTask.length;
    const rowHeight = Math.max(dateLines, taskLines) * lineHeight + 4;

    // Check if we need a new page
    if (yPos + rowHeight > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }

    // Draw cell borders with dynamic height
    doc.rect(20, yPos, dateColWidth, rowHeight);
    doc.rect(60, yPos, taskColWidth, rowHeight);

    // Add content
    doc.setFont("times", "normal");

    // Date
    doc.text(formattedDate, 25, yPos + lineHeight);

    // Task
    doc.text(splitTask, 65, yPos + lineHeight);

    // Move to next row
    yPos += rowHeight;
  });

  // Add signature section
  doc.setFont("times", "normal");
  doc.text("Sign of Engineer In-charge / Project", 20, yPos + 20);
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 20, yPos + 30);

  // Save PDF
  doc.save("daily_worksheet.pdf");
};

export const generateEngagementPDF = (data: EngagementScheduleData): void => {
  // Initialize PDF with A4 format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Define page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margins = {
    top: 20,
    bottom: 20,
    left: 25,
    right: 25
  };

  // Helper function for centered text
  const centeredText = (text: string, y: number, fontSize: number = 12, isBold: boolean = true) => {
    doc.setFontSize(fontSize);
    doc.setFont('times', isBold ? 'bold' : 'normal');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };

  // Title Page - All bold
  centeredText('Major Project', 50, 24);
  centeredText('Student Engagement Schedule', 70, 20);

  // Submitted By section - Headers bold, content normal
  centeredText('Submitted By', 120, 16);
  centeredText(data.studentName, 130, 14, false);
  centeredText(`(${data.rollNo})`, 140, 14, false);

  // Guided By section - Headers bold, content normal
  centeredText('Guided By', 160, 16);
  centeredText(data.guidedBy, 170, 14, false);

  // University details - All bold with larger image
  doc.addImage('/Logo.png', 'PNG', pageWidth/2 - 40, 190, 80, 40);
  
  centeredText(data.department, 245, 12);
  centeredText('Institute of Technology', 252, 12);
  centeredText('Nirma University', 259, 12);
  centeredText('Ahmedabad - 382481', 266, 12);

  // Weekly Tasks Pages
  doc.addPage();
  let currentY = margins.top;
  
  // Week wise tasks header - Bold
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('Week wise tasks', margins.left, currentY);
  currentY += 15;

  // Create table
  const createCell = (x: number, y: number, width: number, text: string, isHeader: boolean = false) => {
    doc.setFontSize(11); // Slightly smaller font for table content
    doc.setFont('times', isHeader ? 'bold' : 'normal');
    
    // Split text to fit within cell width (accounting for padding)
    const maxWidth = width - 10; // 5mm padding on each side
    const lines = doc.splitTextToSize(text, maxWidth);
    
    // Calculate required height based on number of lines
    const lineHeight = 5; // 5mm per line
    const textHeight = lines.length * lineHeight;
    const minHeight = isHeader ? 10 : Math.max(15, textHeight + 6); // minimum 15mm for content, 10mm for header
    
    // Draw cell background and border
    doc.setFillColor(isHeader ? 230 : 245, 245, 245);
    doc.rect(x, y, width, minHeight, 'F');
    doc.setDrawColor(0);
    doc.rect(x, y, width, minHeight);
    
    // Draw text with proper line breaks
    lines.forEach((line: string, index: number) => {
      const textY = y + 5 + (index * lineHeight); // 5mm initial padding
      doc.text(line, x + 5, textY);
    });
    
    return minHeight; // Return the height used
  };

  // Table headers
  const colWidths = [40, pageWidth - margins.left - margins.right - 40];
  const headerHeight = createCell(margins.left, currentY, colWidths[0], 'Week', true);
  createCell(margins.left + colWidths[0], currentY, colWidths[1], 'Task', true);
  currentY += headerHeight;

  // Table content
  data.weeklyTasks.forEach((task) => {
    if (currentY > pageHeight - margins.bottom - 15) {
      doc.addPage();
      currentY = margins.top;
    }

    // Pre-calculate the heights needed for both cells
    const weekLines = doc.splitTextToSize(task.week, colWidths[0] - 10);
    const taskLines = doc.splitTextToSize(task.task, colWidths[1] - 10);
    
    const weekHeight = Math.max(15, weekLines.length * 5 + 6);
    const taskHeight = Math.max(15, taskLines.length * 5 + 6);
    
    // Use the larger height for both cells
    const rowHeight = Math.max(weekHeight, taskHeight);
    
    // Create both cells with the same height
    doc.setFillColor(245, 245, 245);
    doc.rect(margins.left, currentY, colWidths[0], rowHeight, 'F');
    doc.rect(margins.left + colWidths[0], currentY, colWidths[1], rowHeight, 'F');
    doc.setDrawColor(0);
    doc.rect(margins.left, currentY, colWidths[0], rowHeight);
    doc.rect(margins.left + colWidths[0], currentY, colWidths[1], rowHeight);
    
    // Add text to both cells
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    weekLines.forEach((line: string, index: number) => {
      doc.text(line, margins.left + 5, currentY + 5 + (index * 5));
    });
    
    taskLines.forEach((line: string, index: number) => {
      doc.text(line, margins.left + colWidths[0] + 5, currentY + 5 + (index * 5));
    });
    
    currentY += rowHeight;
  });

  // Daily Schedule
  doc.addPage();
  currentY = margins.top;

  // Daily Schedule header - Bold
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('Daily Schedule', margins.left, currentY);
  currentY += 15;

  // Daily Schedule content - Normal with reduced spacing
  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  data.dailySchedule.forEach((item, index) => {
    const text = `${index + 1}. ${item.item}`;
    const lines = doc.splitTextToSize(text, pageWidth - margins.left - margins.right);
    
    if (currentY + (lines.length * 5) > pageHeight - margins.bottom) {
      doc.addPage();
      currentY = margins.top;
    }

    doc.text(lines, margins.left, currentY);
    currentY += lines.length * 5 + 2; // Reduced spacing between items from 7+5 to 5+2
  });

  // Project Head details - Bold headers, normal content
  currentY += 20;
  doc.setFont('times', 'bold');
  doc.text(data.projectHead.name, margins.left, currentY);
  currentY += 7;
  doc.setFont('times', 'normal');
  doc.text(data.projectHead.designation, margins.left, currentY);
  currentY += 15;
  doc.setFont('times', 'bold');
  doc.text(`Date: ${new Date(data.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })}`, margins.left, currentY);

  // Save PDF
  doc.save('student_engagement_schedule.pdf');
};

export const generateActivityReportPDF = (data: ActivityReportData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
    
  // Add Times New Roman font
  doc.setFont("times", "bold");

  // Header
  doc.setFontSize(16);
  doc.text("NIRMA UNIVERSITY", 105, 20, { align: "center" });
  doc.text("INSTITUTE OF TECHNOLOGY", 105, 30, { align: "center" });
  doc.text("COMPUTER SCIENCE ENGINEERING", 105, 40, { align: "center" });
  doc.text("PROJECT ACTIVITY REPORT (PAR)", 105, 50, { align: "center" });

  // Student Details
  doc.setFontSize(12);
  doc.text("NAME OF THE STUDENT", 20, 70);
  doc.text(":", 80, 70);
  doc.setFont("times", "normal");
  doc.text(data.studentName, 85, 70);

  doc.setFont("times", "bold");
  doc.text("ROLL NO.", 20, 80);
  doc.text(":", 80, 80);
  doc.setFont("times", "normal");
  doc.text(data.rollNo, 85, 80);

  doc.setFont("times", "bold");
  doc.text("NAME OF THE COMPANY", 20, 90);
  doc.text(":", 80, 90);
  doc.setFont("times", "normal");
  doc.text(data.companyName, 85, 90);

  let yPos = 110;

  // Summary header with proper underline
  doc.setFont("times", "bold");
  doc.text("Summary", 20, yPos);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 70, yPos + 2); // Underline below text
  yPos += 10;

  // Weekly Content under Summary with bullet points
  data.weeklyContent.forEach((week) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Week header
    doc.setFont("times", "bold");
    doc.text(week.week + " :", 20, yPos);
    yPos += 10;

    // Week content points with bullet points
    doc.setFont("times", "normal");
    week.content.forEach((point) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Add bullet point
      doc.text("•", 25, yPos);
      
      // Handle text wrapping for content
      const pointLines = doc.splitTextToSize(point, 150);
      doc.text(pointLines, 35, yPos);
      
      yPos += (pointLines.length * 7);
    });

    yPos += 5;
  });

  // Working Approach
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFont("times", "bold");
  doc.text("Working Approach:", 20, yPos);
  yPos += 10;

  doc.setFont("times", "normal");
  const approachLines = doc.splitTextToSize(data.workingApproach, 170);
  doc.text(approachLines, 20, yPos);
  yPos += (approachLines.length * 7) + 15;

  // Add signature section
  doc.setFont("times", "normal");
  doc.text("Sign of Engineer In-charge / Project", 20, yPos);
  doc.text(`Date: ${new Date(data.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })}`, 20, yPos + 10);

  // Save PDF
  doc.save("project_activity_report.pdf");
};

export const generateAllotmentPDF = (data: AllotmentFormData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Define page dimensions
  const pageWidth = doc.internal.pageSize.width;

  // Helper function for centered text
  const centeredText = (text: string, y: number, fontSize: number = 12, isBold: boolean = true) => {
    doc.setFontSize(fontSize);
    doc.setFont('times', isBold ? 'bold' : 'normal');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };

  // Title Page - All bold
  centeredText('Major Project', 50, 24);
  centeredText('Project Allotment Letter', 70, 20);

  // Submitted By section - Headers bold, content normal
  centeredText('Submitted By', 120, 16);
  centeredText(data.studentName, 130, 14, false);
  centeredText(`(${data.rollNo})`, 140, 14, false);

  // Guided By section - Headers bold, content normal
  centeredText('Guided By', 160, 16);
  centeredText(data.guidedBy, 170, 14, false);

  // University details - All bold with larger image
  doc.addImage('/Logo.png', 'PNG', pageWidth/2 - 40, 190, 80, 40);
  
  centeredText(data.department, 245, 12);
  centeredText('Institute of Technology', 252, 12);
  centeredText('Nirma University', 259, 12);
  centeredText('Ahmedabad - 382481', 266, 12);

  // Second Page
  doc.addPage();
  
  // Reset to normal font settings
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  let yPos = 20;

  // Company Name
  doc.text("Company Name", 20, yPos);
  yPos += 10;
  doc.setFont("times", "normal");
  doc.text(data.companyName, 20, yPos);
  yPos += 20;

  // Company Address
  doc.setFont("times", "bold");
  doc.text("Company Address", 20, yPos);
  yPos += 10;
  doc.setFont("times", "normal");
  
  if (data.companyAddress.new) {
    // If there's a new address, show both old and new
    doc.text("Old Address:", 20, yPos);
    const oldAddressLines = doc.splitTextToSize(data.companyAddress.old, 170);
    doc.text(oldAddressLines, 20, yPos + 7);
    yPos += (oldAddressLines.length * 7) + 15;

    doc.text("New Address:", 20, yPos);
    const newAddressLines = doc.splitTextToSize(data.companyAddress.new, 170);
    doc.text(newAddressLines, 20, yPos + 7);
    yPos += (newAddressLines.length * 7) + 15;
  } else {
    // If there's only one address, show it without old/new label
    const addressLines = doc.splitTextToSize(data.companyAddress.old, 170);
    doc.text(addressLines, 20, yPos);
    yPos += (addressLines.length * 7) + 15;
  }

  // Internship Duration
  doc.setFont("times", "bold");
  doc.text("Internship Duration", 20, yPos);
  yPos += 10;
  doc.setFont("times", "normal");
  
  const startDate = new Date(data.internshipDuration.start);
  const endDate = new Date(data.internshipDuration.end);
  const formattedStart = startDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedEnd = endDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  doc.text(`${formattedStart} to ${formattedEnd}`, 20, yPos);
  yPos += 20;

  // About the Company
  doc.setFont("times", "bold");
  doc.text("About the company", 20, yPos);
  yPos += 10;
  doc.setFont("times", "normal");
  const aboutLines = doc.splitTextToSize(data.aboutCompany, 170);
  doc.text(aboutLines, 20, yPos);
  yPos += (aboutLines.length * 7) + 15;

  // Project Definition
  doc.setFont("times", "bold");
  doc.text("Project Definition", 20, yPos);
  yPos += 10;
  doc.setFont("times", "normal");

  data.projectPoints.forEach((point, index) => {
    const pointText = `${index + 1}. ${point.point}`;
    const pointLines = doc.splitTextToSize(pointText, 165);
    
    // Check if we need a new page
    if (yPos + (pointLines.length * 7) > 280) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(pointLines, 20, yPos);
    yPos += (pointLines.length * 7) + 5;
  });

  // Add signature section at the bottom
  yPos = Math.max(yPos + 20, 240); // Ensure minimum space for signature

  doc.setFont("times", "normal");
  doc.text(data.projectHead.name, 20, yPos);
  yPos += 7;
  doc.text(data.projectHead.designation, 20, yPos);
  yPos += 15;
  
  // Format and add date
  const formattedDate = new Date(data.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  doc.text(`Date: ${formattedDate}`, 20, yPos);

  // Save PDF
  doc.save("project_allotment_letter.pdf");
};