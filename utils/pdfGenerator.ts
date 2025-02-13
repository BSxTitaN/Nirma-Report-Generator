// utils/pdfGenerator.ts
import jsPDF from "jspdf";
import { FormData } from "../types/worksheet";
import { EngagementScheduleData } from "@/types/engagement";

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
  const doc = new jsPDF();

  // Set font to Times New Roman
  doc.setFont("times", "normal");

  // Header
  doc.setFontSize(20);
  doc.setFont("times", "bold");
  doc.text("Major Project", 105, 30, { align: "center" });

  doc.setFontSize(18);
  doc.text("Student Engagement Schedule", 105, 45, { align: "center" });

  // Student Details
  doc.setFontSize(14);
  doc.text("Submitted By", 105, 70, { align: "center" });
  doc.text(data.studentName, 105, 85, { align: "center" });
  doc.text(`(${data.rollNo})`, 105, 95, { align: "center" });

  // Guide Details
  doc.text("Guided By", 105, 115, { align: "center" });
  doc.text(data.guidedBy, 105, 130, { align: "center" });

  // Department Details
  doc.setFontSize(12);
  doc.text(data.department, 105, 155, { align: "center" });
  doc.text("Institute of Technology", 105, 165, { align: "center" });
  doc.text("Nirma University", 105, 175, { align: "center" });
  doc.text("Ahmedabad - 382481", 105, 185, { align: "center" });

  // Add new page for weekly tasks
  doc.addPage();

  // Weekly Tasks Table
  doc.setFontSize(16);
  doc.text("Week wise tasks", 20, 20);

  let yPos = 40;
  const pageHeight = doc.internal.pageSize.height;

  // Table headers
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.rect(20, yPos - 10, 40, 10);
  doc.rect(60, yPos - 10, 130, 10);
  doc.text("Week", 30, yPos - 3);
  doc.text("Task", 110, yPos - 3);

  // Table content
  doc.setFont("times", "normal");
  data.weeklyTasks.forEach((task) => {
    // Check if we need a new page
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }

    doc.rect(20, yPos, 40, 20);
    doc.rect(60, yPos, 130, 20);

    // Week
    doc.text(task.week, 25, yPos + 10);

    // Task (with word wrap)
    const splitTask = doc.splitTextToSize(task.task, 120);
    doc.text(splitTask, 65, yPos + 10);

    yPos += 20;
  });

  // Add Daily Schedule on new page
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("times", "bold");
  doc.text("Daily Schedule", 20, 20);

  yPos = 40;
  doc.setFontSize(12);
  doc.setFont("times", "normal");

  data.dailySchedule.forEach((item, index) => {
    const number = `${index + 1}.`;
    const splitText = doc.splitTextToSize(item.item, 150);

    doc.text(number, 20, yPos);
    doc.text(splitText, 35, yPos);

    yPos += 10 * splitText.length + 5;
  });

  // Project Head details
  yPos += 20;
  doc.text(data.projectHead.name, 20, yPos);
  doc.text(data.projectHead.designation, 20, yPos + 10);
  doc.text(
    `Date: ${new Date(data.date).toLocaleDateString("en-GB")}`,
    20,
    yPos + 20
  );

  // Save the PDF
  doc.save("student_engagement_schedule.pdf");
};
