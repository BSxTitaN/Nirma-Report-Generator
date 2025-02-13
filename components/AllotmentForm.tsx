import React, { useState } from "react";
import { Plus, FileDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateAllotmentPDF } from "@/utils/pdfGenerator";

interface ProjectPoint {
  point: string;
}

interface FormData {
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

export const AllotmentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    rollNo: "",
    guidedBy: "",
    department: "Department of Computer Science and Engineering",
    companyName: "",
    companyAddress: {
      old: "",
      new: "",
    },
    internshipDuration: {
      start: "",
      end: "",
    },
    aboutCompany: "",
    projectPoints: [{ point: "" }],
    date: new Date().toISOString().split("T")[0],
    projectHead: {
      name: "",
      designation: "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    nestedField?: string
  ) => {
    const { name, value } = e.target;
    
    if (nestedField) {
      setFormData((prev) => {
        const field = prev[nestedField as keyof typeof prev];
        // Ensure field is an object before spreading
        if (field && typeof field === 'object' && !Array.isArray(field)) {
          return {
            ...prev,
            [nestedField]: {
              ...field,
              [name]: value,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProjectPointChange = (index: number, value: string) => {
    const newPoints = [...formData.projectPoints];
    newPoints[index] = { point: value };
    setFormData((prev) => ({
      ...prev,
      projectPoints: newPoints,
    }));
  };

  const addProjectPoint = () => {
    setFormData((prev) => ({
      ...prev,
      projectPoints: [...prev.projectPoints, { point: "" }],
    }));
    toast.success("New project point added");
  };

  const removeProjectPoint = (index: number) => {
    if (formData.projectPoints.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      projectPoints: prev.projectPoints.filter((_, i) => i !== index),
    }));
    toast.success("Project point removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      generateAllotmentPDF(formData);
      toast.success("PDF generated successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-md border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">NIRMA UNIVERSITY</CardTitle>
        <div className="text-center space-y-1">
          <p className="text-xl font-semibold">Major Project</p>
          <p className="text-xl font-semibold">Project Allotment Letter</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Name</label>
                <Input
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll No.</label>
                <Input
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Guided By</label>
              <Input
                name="guidedBy"
                value={formData.guidedBy}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Company Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Address</label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Old Address</label>
                  <Textarea
                    name="old"
                    value={formData.companyAddress.old}
                    onChange={(e) => handleInputChange(e, "companyAddress")}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">New Address (Optional)</label>
                  <Textarea
                    name="new"
                    value={formData.companyAddress.new}
                    onChange={(e) => handleInputChange(e, "companyAddress")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Internship Duration</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Start Date</label>
                  <Input
                    type="date"
                    name="start"
                    value={formData.internshipDuration.start}
                    onChange={(e) => handleInputChange(e, "internshipDuration")}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">End Date</label>
                  <Input
                    type="date"
                    name="end"
                    value={formData.internshipDuration.end}
                    onChange={(e) => handleInputChange(e, "internshipDuration")}
                    className="w-full"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">About the Company</label>
              <Textarea
                name="aboutCompany"
                value={formData.aboutCompany}
                onChange={handleInputChange}
                className="w-full min-h-32"
                required
              />
            </div>

            {/* Project Definition */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Project Definition</label>
                <Button
                  type="button"
                  onClick={addProjectPoint}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Point
                </Button>
              </div>

              {formData.projectPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <div className="w-8 text-sm text-gray-500 pt-2">
                    {index + 1}.
                  </div>
                  <Textarea
                    value={point.point}
                    onChange={(e) => handleProjectPointChange(index, e.target.value)}
                    className="flex-1"
                    required
                  />
                  {formData.projectPoints.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeProjectPoint(index)}
                      size="icon"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Project Head Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Head Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  value={formData.projectHead.name}
                  onChange={(e) => handleInputChange(e, "projectHead")}
                  placeholder="Name"
                  className="w-full"
                  required
                />
                <Input
                  name="designation"
                  value={formData.projectHead.designation}
                  onChange={(e) => handleInputChange(e, "projectHead")}
                  placeholder="Designation"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Generate PDF
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AllotmentForm;