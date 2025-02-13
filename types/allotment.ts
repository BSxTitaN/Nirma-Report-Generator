export interface ProjectPoint {
  point: string;
}

export interface AllotmentFormData {
  studentName: string;
  rollNo: string;
  guidedBy: string;
  department: string;
  companyName: string;
  companyAddress: {
    old: string;
    new?: string;
  };
  internshipDuration: {
    start: string;
    end: string;
  };
  aboutCompany: string;
  projectPoints: ProjectPoint[];
  date: string;
  projectHead: {
    name: string;
    designation: string;
  };
}
