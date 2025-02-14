// types/worksheet.ts
export interface TaskEntry {
  date: string;
  task: string;
}

export interface FormData {
  studentName: string;
  rollNo: string;
  companyName: string;
  docNo: string;
  entries: TaskEntry[];
  signatureDate: string; // Add this new field
}

export interface TaskEntryProps {
  entry: TaskEntry;
  index: number;
  onEntryChange: (index: number, field: keyof TaskEntry, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}