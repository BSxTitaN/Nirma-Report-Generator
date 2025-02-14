import React, { useState } from "react";
import { Plus, FileDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateActivityReportPDF } from "@/utils/pdfGenerator";

interface WeeklyContent {
  week: string;
  content: string[];
}

interface FormData {
  studentName: string;
  rollNo: string;
  companyName: string;
  docNo: string;
  weeklyContent: WeeklyContent[];
  workingApproach: string;
  date: string;
}

export const ActivityReportForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    rollNo: "",
    companyName: "",
    docNo: "",
    weeklyContent: [{ week: "Week 1", content: [""] }],
    workingApproach: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWeeklyContentChange = (
    weekIndex: number,
    contentIndex: number,
    value: string
  ) => {
    const newWeeklyContent = [...formData.weeklyContent];
    newWeeklyContent[weekIndex].content[contentIndex] = value;
    setFormData((prev) => ({
      ...prev,
      weeklyContent: newWeeklyContent,
    }));
  };

  const addWeek = () => {
    const nextWeekNumber = formData.weeklyContent.length + 1;
    setFormData((prev) => ({
      ...prev,
      weeklyContent: [
        ...prev.weeklyContent,
        { week: `Week ${nextWeekNumber}`, content: [""] },
      ],
    }));
    toast.success("New week added");
  };

  const removeWeek = (weekIndex: number) => {
    if (formData.weeklyContent.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      weeklyContent: prev.weeklyContent.filter((_, i) => i !== weekIndex),
    }));
    toast.success("Week removed");
  };

  const addPoint = (weekIndex: number) => {
    const newWeeklyContent = [...formData.weeklyContent];
    newWeeklyContent[weekIndex].content.push("");
    setFormData((prev) => ({
      ...prev,
      weeklyContent: newWeeklyContent,
    }));
    toast.success("New point added");
  };

  const removePoint = (weekIndex: number, pointIndex: number) => {
    if (formData.weeklyContent[weekIndex].content.length <= 1) return;
    const newWeeklyContent = [...formData.weeklyContent];
    newWeeklyContent[weekIndex].content = newWeeklyContent[
      weekIndex
    ].content.filter((_, i) => i !== pointIndex);
    setFormData((prev) => ({
      ...prev,
      weeklyContent: newWeeklyContent,
    }));
    toast.success("Point removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      generateActivityReportPDF(formData);
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
          <p className="text-lg font-semibold">INSTITUTE OF TECHNOLOGY</p>
          <p className="text-lg font-semibold">COMPUTER SCIENCE ENGINEERING</p>
          <p className="text-lg font-semibold">PROJECT ACTIVITY REPORT (PAR)</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  NAME OF THE STUDENT
                </label>
                <Input
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ROLL NO.</label>
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
              <label className="text-sm font-medium">NAME OF THE COMPANY</label>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Doc No</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">PAR - </span>
                <Input
                  name="docNo"
                  value={formData.docNo}
                  onChange={handleInputChange}
                  className="w-24"
                  required
                />
              </div>
            </div>
          </div>

          {/* Summary Section with Weekly Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold underline">Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addWeek}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Week
                </Button>
              </div>

              {formData.weeklyContent.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="space-y-2 p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <Input
                      value={week.week}
                      onChange={(e) => {
                        const newWeeklyContent = [...formData.weeklyContent];
                        newWeeklyContent[weekIndex].week = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          weeklyContent: newWeeklyContent,
                        }));
                      }}
                      className="w-1/3"
                      required
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => addPoint(weekIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      {formData.weeklyContent.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeWeek(weekIndex)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {week.content.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex gap-2">
                      <div className="w-8 text-sm text-gray-500 pt-2">
                        {pointIndex + 1}.
                      </div>
                      <Textarea
                        value={point}
                        onChange={(e) =>
                          handleWeeklyContentChange(
                            weekIndex,
                            pointIndex,
                            e.target.value
                          )
                        }
                        className="flex-1"
                        required
                      />
                      {week.content.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removePoint(weekIndex, pointIndex)}
                          size="icon"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Working Approach */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Working Approach</label>
            <Textarea
              name="workingApproach"
              value={formData.workingApproach}
              onChange={handleInputChange}
              className="w-full min-h-32"
              required
            />
          </div>

          {/* Date */}
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

          {/* Submit Button */}
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

export default ActivityReportForm;
