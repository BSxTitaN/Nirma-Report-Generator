// utils/pdfGenerator.ts
import jsPDF from "jspdf";
import { FormData } from "../types/worksheet";
import { EngagementScheduleData } from "@/types/engagement";
import { ActivityReportData } from "@/types/activity";
import { AllotmentFormData } from "@/types/allotment";
import { PPRFormData } from "@/types/ppr";

export const generateWorksheetPDF = (formData: FormData): void => {
  const doc = new jsPDF();

  // Add Times New Roman font
  doc.setFont("times", "bold");

 // Header
 doc.setFontSize(16);
 doc.text("NIRMA UNIVERSITY", 105, 25, { align: "center" });
 doc.text("INSTITUTE OF TECHNOLOGY", 105, 35, { align: "center" });
 doc.text("COMPUTER SCIENCE ENGINEERING", 105, 45, { align: "center" });
 doc.text("DAILY WORKSHEET (DWS)", 105, 55, { align: "center" });

 // Add Doc No
 doc.setFontSize(12);
 doc.setFont("times", "bold");
 doc.text("DWS No -", 20, 70);
 doc.setFont("times", "normal");
 doc.text(formData.docNo, 60, 70);

 // Student Details
 doc.setFont("times", "bold");
 doc.text("NAME OF THE STUDENT", 20, 85);
 doc.text(":", 80, 85);
 doc.setFont("times", "normal");
 doc.text(formData.studentName, 85, 85);

 doc.setFont("times", "bold");
 doc.text("ROLL NO.", 20, 100);
 doc.text(":", 80, 100);
 doc.setFont("times", "normal");
 doc.text(formData.rollNo, 85, 100);

 doc.setFont("times", "bold");
 doc.text("NAME OF THE COMPANY", 20, 115);
 doc.text(":", 80, 115);
 doc.setFont("times", "normal");
 doc.text(formData.companyName, 85, 115);

 // Table Header
 doc.setFont("times", "bold");
 doc.setFillColor(240, 240, 240);
 doc.rect(20, 130, 40, 10, "F");
 doc.rect(60, 130, 130, 10, "F");
 doc.text("DATE", 30, 136);
 doc.text("TASK", 110, 136);

 // Update initial yPos for table content
 let yPos = 140;
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
  doc.text(
    `Date: ${new Date(formData.signatureDate).toLocaleDateString("en-GB")}`,
    20,
    yPos + 30
  );

  // Save PDF
  doc.save("daily_worksheet.pdf");
};

export const generateEngagementPDF = (data: EngagementScheduleData): void => {
  // Initialize PDF with A4 format
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Define page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margins = {
    top: 20,
    bottom: 20,
    left: 25,
    right: 25,
  };

  // Helper function for centered text
  const centeredText = (
    text: string,
    y: number,
    fontSize: number = 12,
    isBold: boolean = true
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("times", isBold ? "bold" : "normal");
    doc.text(text, pageWidth / 2, y, { align: "center" });
  };

  // Title Page - All bold
  centeredText("Major Project", 50, 24);
  centeredText("Student Engagement Schedule", 70, 20);

  // Submitted By section - Headers bold, content normal
  centeredText("Submitted By", 120, 16);
  centeredText(data.studentName, 130, 14, false);
  centeredText(`(${data.rollNo})`, 140, 14, false);

  // Guided By section - Headers bold, content normal
  centeredText("Guided By", 160, 16);
  centeredText(data.guidedBy, 170, 14, false);

  // University details - All bold with larger image
  doc.addImage("/Logo.png", "PNG", pageWidth / 2 - 40, 190, 80, 40);

  centeredText(data.department, 245, 12);
  centeredText("Institute of Technology", 252, 12);
  centeredText("Nirma University", 259, 12);
  centeredText("Ahmedabad - 382481", 266, 12);

  // Weekly Tasks Pages
  doc.addPage();
  let currentY = margins.top;

  // Week wise tasks header - Bold
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("Week wise tasks", margins.left, currentY);
  currentY += 15;

  // Create table
  const createCell = (
    x: number,
    y: number,
    width: number,
    text: string,
    isHeader: boolean = false
  ) => {
    doc.setFontSize(11); // Slightly smaller font for table content
    doc.setFont("times", isHeader ? "bold" : "normal");

    // Split text to fit within cell width (accounting for padding)
    const maxWidth = width - 10; // 5mm padding on each side
    const lines = doc.splitTextToSize(text, maxWidth);

    // Calculate required height based on number of lines
    const lineHeight = 5; // 5mm per line
    const textHeight = lines.length * lineHeight;
    const minHeight = isHeader ? 10 : Math.max(15, textHeight + 6); // minimum 15mm for content, 10mm for header

    // Draw cell background and border
    doc.setFillColor(isHeader ? 230 : 245, 245, 245);
    doc.rect(x, y, width, minHeight, "F");
    doc.setDrawColor(0);
    doc.rect(x, y, width, minHeight);

    // Draw text with proper line breaks
    lines.forEach((line: string, index: number) => {
      const textY = y + 5 + index * lineHeight; // 5mm initial padding
      doc.text(line, x + 5, textY);
    });

    return minHeight; // Return the height used
  };

  // Table headers
  const colWidths = [40, pageWidth - margins.left - margins.right - 40];
  const headerHeight = createCell(
    margins.left,
    currentY,
    colWidths[0],
    "Week",
    true
  );
  createCell(margins.left + colWidths[0], currentY, colWidths[1], "Task", true);
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
    doc.rect(margins.left, currentY, colWidths[0], rowHeight, "F");
    doc.rect(
      margins.left + colWidths[0],
      currentY,
      colWidths[1],
      rowHeight,
      "F"
    );
    doc.setDrawColor(0);
    doc.rect(margins.left, currentY, colWidths[0], rowHeight);
    doc.rect(margins.left + colWidths[0], currentY, colWidths[1], rowHeight);

    // Add text to both cells
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    weekLines.forEach((line: string, index: number) => {
      doc.text(line, margins.left + 5, currentY + 5 + index * 5);
    });

    taskLines.forEach((line: string, index: number) => {
      doc.text(line, margins.left + colWidths[0] + 5, currentY + 5 + index * 5);
    });

    currentY += rowHeight;
  });

  // Daily Schedule
  doc.addPage();
  currentY = margins.top;

  // Daily Schedule header - Bold
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("Daily Schedule", margins.left, currentY);
  currentY += 15;

  // Daily Schedule content - Normal with reduced spacing
  doc.setFont("times", "normal");
  doc.setFontSize(12);

  data.dailySchedule.forEach((item, index) => {
    const text = `${index + 1}. ${item.item}`;
    const lines = doc.splitTextToSize(
      text,
      pageWidth - margins.left - margins.right
    );

    if (currentY + lines.length * 5 > pageHeight - margins.bottom) {
      doc.addPage();
      currentY = margins.top;
    }

    doc.text(lines, margins.left, currentY);
    currentY += lines.length * 5 + 2; // Reduced spacing between items from 7+5 to 5+2
  });

  // Project Head details - Bold headers, normal content
  currentY += 20;
  doc.setFont("times", "bold");
  doc.text(data.projectHead.name, margins.left, currentY);
  currentY += 7;
  doc.setFont("times", "normal");
  doc.text(data.projectHead.designation, margins.left, currentY);
  currentY += 15;
  doc.setFont("times", "bold");
  doc.text(
    `Date: ${new Date(data.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`,
    margins.left,
    currentY
  );

  // Save PDF
  doc.save("student_engagement_schedule.pdf");
};

export const generateActivityReportPDF = (data: ActivityReportData): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Add Times New Roman font
  doc.setFont("times", "bold");

   // Header
   doc.setFontSize(16);
   doc.text("NIRMA UNIVERSITY", 105, 25, { align: "center" });
   doc.text("INSTITUTE OF TECHNOLOGY", 105, 35, { align: "center" });
   doc.text("COMPUTER SCIENCE ENGINEERING", 105, 45, { align: "center" });
   doc.text("PROJECT ACTIVITY REPORT (PAR)", 105, 55, { align: "center" });
 
   // Add Doc No
   doc.setFontSize(12);
   doc.setFont("times", "bold");
   doc.text("PAR No -", 20, 70);
   doc.setFont("times", "normal");
   doc.text(data.docNo, 60, 70);
 
   // Student Details
   doc.setFont("times", "bold");
   doc.text("NAME OF THE STUDENT", 20, 85);
   doc.text(":", 80, 85);
   doc.setFont("times", "normal");
   doc.text(data.studentName, 85, 85);
 
   doc.setFont("times", "bold");
   doc.text("ROLL NO.", 20, 100);
   doc.text(":", 80, 100);
   doc.setFont("times", "normal");
   doc.text(data.rollNo, 85, 100);
 
   doc.setFont("times", "bold");
   doc.text("NAME OF THE COMPANY", 20, 115);
   doc.text(":", 80, 115);
   doc.setFont("times", "normal");
   doc.text(data.companyName, 85, 115);
 
   // Start summary section at adjusted position
   let yPos = 135;

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

      yPos += pointLines.length * 7;
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
  yPos += approachLines.length * 7 + 15;

  // Add signature section
  doc.setFont("times", "normal");
  doc.text("Sign of Engineer In-charge / Project", 20, yPos);
  doc.text(
    `Date: ${new Date(data.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`,
    20,
    yPos + 10
  );

  // Save PDF
  doc.save("project_activity_report.pdf");
};

export const generateAllotmentPDF = (data: AllotmentFormData): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Define page dimensions
  const pageWidth = doc.internal.pageSize.width;

  // Helper function for centered text
  const centeredText = (
    text: string,
    y: number,
    fontSize: number = 12,
    isBold: boolean = true
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("times", isBold ? "bold" : "normal");
    doc.text(text, pageWidth / 2, y, { align: "center" });
  };

  // Title Page - All bold
  centeredText("Major Project", 50, 24);
  centeredText("Project Allotment Letter", 70, 20);

  // Submitted By section - Headers bold, content normal
  centeredText("Submitted By", 120, 16);
  centeredText(data.studentName, 130, 14, false);
  centeredText(`(${data.rollNo})`, 140, 14, false);

  // Guided By section - Headers bold, content normal
  centeredText("Guided By", 160, 16);
  centeredText(data.guidedBy, 170, 14, false);

  // University details - All bold with larger image
  doc.addImage("/Logo.png", "PNG", pageWidth / 2 - 40, 190, 80, 40);

  centeredText(data.department, 245, 12);
  centeredText("Institute of Technology", 252, 12);
  centeredText("Nirma University", 259, 12);
  centeredText("Ahmedabad - 382481", 266, 12);

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
    yPos += oldAddressLines.length * 7 + 15;

    doc.text("New Address:", 20, yPos);
    const newAddressLines = doc.splitTextToSize(data.companyAddress.new, 170);
    doc.text(newAddressLines, 20, yPos + 7);
    yPos += newAddressLines.length * 7 + 15;
  } else {
    // If there's only one address, show it without old/new label
    const addressLines = doc.splitTextToSize(data.companyAddress.old, 170);
    doc.text(addressLines, 20, yPos);
    yPos += addressLines.length * 7 + 15;
  }

  // Internship Duration
  doc.setFont("times", "bold");
  doc.text("Internship Duration", 20, yPos);
  yPos += 10;
  doc.setFont("times", "normal");

  const startDate = new Date(data.internshipDuration.start);
  const endDate = new Date(data.internshipDuration.end);
  const formattedStart = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedEnd = endDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
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
  yPos += aboutLines.length * 7 + 15;

  // Project Definition
  doc.setFont("times", "bold");
  doc.text("Project Definition", 20, yPos);
  yPos += 10;
  doc.setFont("times", "normal");

  data.projectPoints.forEach((point, index) => {
    const pointText = `${index + 1}. ${point.point}`;
    const pointLines = doc.splitTextToSize(pointText, 165);

    // Check if we need a new page
    if (yPos + pointLines.length * 7 > 280) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(pointLines, 20, yPos);
    yPos += pointLines.length * 7 + 5;
  });

  // Add signature section at the bottom
  yPos = Math.max(yPos + 20, 240); // Ensure minimum space for signature

  doc.setFont("times", "normal");
  doc.text(data.projectHead.name, 20, yPos);
  yPos += 7;
  doc.text(data.projectHead.designation, 20, yPos);
  yPos += 15;

  // Format and add date
  const formattedDate = new Date(data.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Date: ${formattedDate}`, 20, yPos);

  // Save PDF
  doc.save("project_allotment_letter.pdf");
};

export const generatePPRPDF = async (data: PPRFormData): Promise<void> => {
  // Initialize document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Track section pages for TOC
  const sectionPages = {
    objectives: 3,
    scope: 3,
    testing: 3,
    specs: 3,
    toolset: 3,
    personal: 3,
  };

  // Page dimensions and margins
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margins = {
    top: 20,
    bottom: 30, // Increased bottom margin for page numbers
    left: 20,
    right: 20,
  };

  // Spacing constants
  const SECTION_SPACING = 10;
  const SUBSECTION_SPACING = 8;
  const LINE_HEIGHT = 7;
  const PARAGRAPH_SPACING = 5;

  // Helper functions
  const addPageNumber = () => {
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    const pageNum = doc.getCurrentPageInfo().pageNumber;
    doc.text(String(pageNum), pageWidth / 2, pageHeight - margins.bottom / 2, {
      align: "center",
    });
  };

  const checkPageBreak = (requiredSpace: number, currentY: number): number => {
    if (currentY + requiredSpace > pageHeight - margins.bottom) {
      doc.addPage();
      addPageNumber();
      return margins.top;
    }
    return currentY;
  };

  const centeredText = (
    text: string,
    y: number,
    fontSize: number = 12,
    isBold: boolean = true
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("times", isBold ? "bold" : "normal");
    doc.text(text, pageWidth / 2, y, { align: "center" });
  };

  // Calculate content height before adding to page
  const calculateContentHeight = (
    text: string,
    maxWidth: number,
    fontSize: number = 12
  ): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    return lines.length * LINE_HEIGHT;
  };

  // Start building PDF
  // Cover Page
  centeredText("Major Project", 50, 24);
  centeredText("Preliminary Project Information Report", 70, 20);
  centeredText("Submitted By", 120, 16);
  centeredText(data.studentName, 130, 14, false);
  centeredText(`(${data.rollNo})`, 140, 14, false);
  centeredText("Guided By", 160, 16);
  centeredText(data.guidedBy, 170, 14, false);

  // Add university logo
  doc.addImage("/Logo.png", "PNG", pageWidth / 2 - 40, 190, 80, 40);

  // University details
  centeredText(data.department, 245, 12);
  centeredText("Institute of Technology", 252, 12);
  centeredText("Nirma University", 259, 12);
  centeredText("Ahmedabad - 382481", 266, 12);

  addPageNumber();

  // Create temporary TOC page
  doc.addPage();
  addPageNumber();

  // Objectives Section
  doc.addPage();
  sectionPages.objectives = doc.getCurrentPageInfo().pageNumber;
  let yPos = margins.top;

  // Objectives Header
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Objectives", margins.left, yPos);
  yPos += SECTION_SPACING;

  // Objectives Content
  data.objectives.forEach((objective, index) => {
    // Calculate total height needed for this objective
    let objectiveHeight = calculateContentHeight(
      objective.title,
      pageWidth - margins.left - margins.right
    );
    objective.points.forEach((point) => {
      objectiveHeight += calculateContentHeight(
        point,
        pageWidth - margins.left - margins.right - 15
      );
    });
    objectiveHeight += objective.points.length * PARAGRAPH_SPACING;

    yPos = checkPageBreak(objectiveHeight + SECTION_SPACING, yPos);

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${objective.title}`, margins.left, yPos);
    yPos += SUBSECTION_SPACING;

    doc.setFont("times", "normal");
    objective.points.forEach((point) => {
      const pointLines = doc.splitTextToSize(
        `• ${point}`,
        pageWidth - margins.left - margins.right - 15
      );
      doc.text(pointLines, margins.left + 15, yPos);
      yPos += pointLines.length * LINE_HEIGHT + PARAGRAPH_SPACING;
    });
  });

  // Update scope page number based on content
  if (yPos > pageHeight - margins.bottom - 50) {
    doc.addPage();
    sectionPages.scope = doc.getCurrentPageInfo().pageNumber;
    yPos = margins.top;
  } else {
    sectionPages.scope = sectionPages.objectives;
    yPos += SECTION_SPACING * 2;
  }

  // Scope Section
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Scope of Project", margins.left, yPos);
  yPos += SECTION_SPACING;

  // Calculate total scope content height
  let scopeHeight = 0;
  data.scopePoints.forEach((scope) => {
    scopeHeight += calculateContentHeight(
      scope.point,
      pageWidth - margins.left - margins.right
    );
    scopeHeight += PARAGRAPH_SPACING;
  });

  if (yPos + scopeHeight > pageHeight - margins.bottom - 50) {
    doc.addPage();
    sectionPages.scope = doc.getCurrentPageInfo().pageNumber;
    yPos = margins.top;
  }

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  data.scopePoints.forEach((scope, index) => {
    const scopeLines = doc.splitTextToSize(
      `${index + 1}. ${scope.point}`,
      pageWidth - margins.left - margins.right
    );
    doc.text(scopeLines, margins.left, yPos);
    yPos += scopeLines.length * LINE_HEIGHT + PARAGRAPH_SPACING;
  });

  // Testing Section with similar height calculations and spacing management
  yPos += SECTION_SPACING;
  let testingHeight = calculateContentHeight(
    "Software Testing and Quality Assurance",
    pageWidth - margins.left - margins.right,
    14
  );

  data.testingPoints.forEach((point) => {
    testingHeight += calculateContentHeight(
      point.point,
      pageWidth - margins.left - margins.right
    );
    testingHeight += PARAGRAPH_SPACING;
  });

  data.qaPoints.forEach((point) => {
    testingHeight += calculateContentHeight(
      point.point,
      pageWidth - margins.left - margins.right
    );
    testingHeight += PARAGRAPH_SPACING;
  });

  if (yPos + testingHeight > pageHeight - margins.bottom - 50) {
    doc.addPage();
    sectionPages.testing = doc.getCurrentPageInfo().pageNumber;
    yPos = margins.top;
  } else {
    sectionPages.testing = sectionPages.scope;
  }

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Software Testing and Quality Assurance", margins.left, yPos);
  yPos += SECTION_SPACING;

  doc.setFontSize(12);
  doc.text("Software Testing", margins.left, yPos);
  yPos += SUBSECTION_SPACING;

  doc.setFont("times", "normal");
  data.testingPoints.forEach((point, index) => {
    const testLines = doc.splitTextToSize(
      `${index + 1}. ${point.point}`,
      pageWidth - margins.left - margins.right
    );
    doc.text(testLines, margins.left, yPos);
    yPos += testLines.length * LINE_HEIGHT + PARAGRAPH_SPACING;
  });

  yPos += SUBSECTION_SPACING;
  doc.setFont("times", "bold");
  doc.text("Quality Assurance", margins.left, yPos);
  yPos += SUBSECTION_SPACING;

  doc.setFont("times", "normal");
  data.qaPoints.forEach((point, index) => {
    const qaLines = doc.splitTextToSize(
      `${index + 1}. ${point.point}`,
      pageWidth - margins.left - margins.right
    );
    doc.text(qaLines, margins.left, yPos);
    yPos += qaLines.length * LINE_HEIGHT + PARAGRAPH_SPACING;
  });

  // Specifications and Schedule Section
  doc.addPage();
  sectionPages.specs = doc.getCurrentPageInfo().pageNumber;
  yPos = margins.top;

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Specifications of the Project", margins.left, yPos);
  yPos += SECTION_SPACING;

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  const specLines = doc.splitTextToSize(
    data.specifications,
    pageWidth - margins.left - margins.right
  );
  doc.text(specLines, margins.left, yPos);
  yPos += specLines.length * LINE_HEIGHT + SECTION_SPACING;

  // Project Schedule with image
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Project Schedule", margins.left, yPos);
  yPos += SECTION_SPACING;

  // Handle schedule image with better space management
  if (data.scheduleImage) {
    const reader = new FileReader();
    await new Promise((resolve) => {
      reader.onload = () => {
        if (data.scheduleImage) {
          // Calculate appropriate image height
          const remainingSpace = pageHeight - margins.bottom - yPos;
          const maxImageHeight = Math.min(80, remainingSpace - 20); // Max 80mm or remaining space

          if (remainingSpace < maxImageHeight + 20) {
            doc.addPage();
            yPos = margins.top;
          }

          doc.addImage(
            reader.result as string,
            "JPEG",
            margins.left,
            yPos,
            pageWidth - margins.left - margins.right,
            maxImageHeight
          );
          yPos += maxImageHeight + SECTION_SPACING;
        }
        resolve(true);
      };
      if (data.scheduleImage) {
        reader.readAsDataURL(data.scheduleImage);
      }
    });
  }

  // Toolset Section
  if (yPos > pageHeight - margins.bottom - 100) {
    doc.addPage();
    sectionPages.toolset = doc.getCurrentPageInfo().pageNumber;
    yPos = margins.top;
  } else {
    sectionPages.toolset = sectionPages.specs;
    yPos += SECTION_SPACING;
  }

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Toolset Used", margins.left, yPos);
  yPos += SECTION_SPACING;

  doc.setFontSize(12);
  data.toolset.forEach((category, index) => {
    const totalHeight =
      LINE_HEIGHT + category.tools.length * (LINE_HEIGHT + PARAGRAPH_SPACING);
    yPos = checkPageBreak(totalHeight + SUBSECTION_SPACING, yPos);

    doc.setFont("times", "bold");
    doc.text(`${index + 1}. ${category.name}`, margins.left, yPos);
    yPos += SUBSECTION_SPACING;

    doc.setFont("times", "normal");
    category.tools.forEach((tool) => {
      doc.text(`• ${tool}`, margins.left + 15, yPos);
      yPos += LINE_HEIGHT + PARAGRAPH_SPACING;
    });
  });

  // Personal Details Section
  doc.addPage();
  sectionPages.personal = doc.getCurrentPageInfo().pageNumber;
  yPos = margins.top;

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Personal Details", margins.left, yPos);
  yPos += SECTION_SPACING;

  doc.setFontSize(12);
  doc.text("Address of stay:", margins.left, yPos);
  yPos += SUBSECTION_SPACING;

  doc.setFont("times", "normal");
  const addressLines = doc.splitTextToSize(
    data.personalDetails.address,
    pageWidth - margins.left - margins.right
  );
  doc.text(addressLines, margins.left, yPos);
  yPos += addressLines.length * LINE_HEIGHT + SECTION_SPACING;

  doc.setFont("times", "bold");
  doc.text("Distance from company:", margins.left, yPos);
  yPos += SUBSECTION_SPACING;
  doc.setFont("times", "normal");
  doc.text(data.personalDetails.distance, margins.left, yPos);
  yPos += SECTION_SPACING;

  doc.setFont("times", "bold");
  doc.text("Mode of Transport:", margins.left, yPos);
  yPos += SUBSECTION_SPACING;
  doc.setFont("times", "normal");
  doc.text(data.personalDetails.transport, margins.left, yPos);

  // Signature section at bottom of page
  yPos = pageHeight - margins.bottom - 140; // Increased space for head details

  // Project Head details
  doc.setFont("times", "normal");
  doc.text(data.projectHead.name, margins.left, yPos);
  yPos += SUBSECTION_SPACING;
  doc.text(data.projectHead.designation, margins.left, yPos);
  yPos += SECTION_SPACING;

  // Date
  doc.text(
    `Date: ${new Date(data.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`,
    margins.left,
    yPos
  );

  // Generate final TOC with correct page numbers
  doc.setPage(2);
  yPos = margins.top;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Table of contents", margins.left, yPos);
  yPos += SECTION_SPACING;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  const tocItems = [
    { text: "Objectives", page: sectionPages.objectives },
    { text: "Scope of Project", page: sectionPages.scope },
    {
      text: "Software Testing and Quality Assurance",
      page: sectionPages.testing,
    },
    { text: "Specifications of the Project", page: sectionPages.specs },
    { text: "Project Schedule", page: sectionPages.specs },
    { text: "Toolset Used", page: sectionPages.toolset },
    { text: "Personal Details", page: sectionPages.personal },
  ];

  tocItems.forEach((item) => {
    // Calculate space needed for dots
    const textWidth = doc.getTextWidth(item.text);
    const pageNumWidth = doc.getTextWidth(item.page.toString());
    const availableWidth = pageWidth - margins.left - margins.right - 20; // 20mm buffer
    const dotsWidth = availableWidth - textWidth - pageNumWidth;
    const dotCount = Math.floor(dotsWidth / doc.getTextWidth("."));
    const dots = ".".repeat(Math.max(3, dotCount));

    // Draw text and page number with dots
    doc.text(item.text, margins.left, yPos);
    doc.text(dots, margins.left + textWidth + 2, yPos);
    doc.text(
      item.page.toString(),
      pageWidth - margins.right - pageNumWidth,
      yPos
    );
    yPos += LINE_HEIGHT;
  });

  addPageNumber();

  // Save PDF
  doc.save("preliminary_project_information_report.pdf");
};
