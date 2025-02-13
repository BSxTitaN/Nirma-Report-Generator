// types/engagement.ts
export interface WeeklyTask {
  week: string;
  task: string;
}

export interface DailyScheduleItem {
  item: string;
}

export interface EngagementScheduleData {
  studentName: string;
  rollNo: string;
  guidedBy: string;
  department: string;
  weeklyTasks: WeeklyTask[];
  dailySchedule: DailyScheduleItem[];
  date: string;
  projectHead: {
    name: string;
    designation: string;
  };
}
