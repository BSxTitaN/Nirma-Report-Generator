export interface ObjectivePoint {
  title: string;
  points: string[];
}

export interface ScopePoint {
  point: string;
}

export interface TestingPoint {
  point: string;
}

export interface QAPoint {
  point: string;
}

export interface ToolsetCategory {
  name: string;
  tools: string[];
}

interface PersonalDetails {
  address: string;
  distance: string;
  transport: string;
}

export interface PPRFormData {
  studentName: string;
  rollNo: string;
  guidedBy: string;
  department: string;
  objectives: ObjectivePoint[];
  scopePoints: ScopePoint[];
  testingPoints: TestingPoint[];
  qaPoints: QAPoint[];
  specifications: string;
  toolset: ToolsetCategory[];
  scheduleImage: File | null;
  personalDetails: PersonalDetails;
  date: string;
}
