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
  // types/worksheet.ts
export interface TaskEntry {
    date: string;
    task: string;
  }
  
  export interface FormData {
    studentName: string;
    rollNo: string;
    companyName: string;
    entries: TaskEntry[];
  }
  
  export interface TaskEntryProps {
    entry: TaskEntry;
    index: number;
    onEntryChange: (index: number, field: keyof TaskEntry, value: string) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
  }