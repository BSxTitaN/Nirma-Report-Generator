export interface WeeklyContent {
  week: string;
  content: string[];
}

export interface ActivityReportData {
  studentName: string;
  rollNo: string;
  companyName: string;
  docNo: string;
  weeklyContent: WeeklyContent[];
  workingApproach: string;
  date: string;
}
