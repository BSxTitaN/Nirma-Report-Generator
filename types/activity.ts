export interface WeeklyContent {
    week: string;
    content: string[];
  }
  
export interface ActivityReportData {
    studentName: string;
    rollNo: string;
    companyName: string;
    weeklyContent: WeeklyContent[];
    workingApproach: string;
    date: string;
  }