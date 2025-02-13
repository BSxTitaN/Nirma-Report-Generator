// components/EngagementSchedule/EngagementForm.tsx
import React, { useState } from "react";
import { Plus, FileDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateEngagementPDF } from "@/utils/pdfGenerator";
import { EngagementScheduleData, WeeklyTask } from "@/types/engagement";

export const EngagementForm: React.FC = () => {
    const [formData, setFormData] = useState<EngagementScheduleData>({
    studentName: "",
    rollNo: "",
    guidedBy: "",
    department: "Department of Computer Science and Engineering",
    weeklyTasks: [{ week: "Week 1", task: "" }],
    dailySchedule: [{ item: "" }],
    date: new Date().toISOString().split("T")[0],
    projectHead: {
      name: "",
      designation: "",
    },
  });
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newFormData;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      newFormData = {
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<
            string,
            unknown
          >),
          [child]: value,
        },
      };
    } else {
      newFormData = { ...formData, [name]: value };
    }

    setFormData(newFormData);
    setIsDirty(true);
  };

  const handleWeeklyTaskChange = (
    index: number,
    field: keyof WeeklyTask,
    value: string
  ) => {
    const newTasks = [...formData.weeklyTasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setFormData((prev) => ({ ...prev, weeklyTasks: newTasks }));
    setIsDirty(true);
  };

  const handleDailyScheduleChange = (index: number, value: string) => {
    const newSchedule = [...formData.dailySchedule];
    newSchedule[index] = { item: value };
    setFormData((prev) => ({ ...prev, dailySchedule: newSchedule }));
    setIsDirty(true);
  };

  const addWeeklyTask = () => {
    const newWeek = `Week ${formData.weeklyTasks.length + 1}`;
    setFormData((prev) => ({
      ...prev,
      weeklyTasks: [...prev.weeklyTasks, { week: newWeek, task: "" }],
    }));
    setIsDirty(true);
    toast.success("New week added");
  };

  const addDailyScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      dailySchedule: [...prev.dailySchedule, { item: "" }],
    }));
    setIsDirty(true);
    toast.success("New daily schedule item added");
  };

  const removeWeeklyTask = (index: number) => {
    if (formData.weeklyTasks.length > 1) {
      setFormData((prev) => ({
        ...prev,
        weeklyTasks: prev.weeklyTasks.filter((_, i) => i !== index),
      }));
      setIsDirty(true);
      toast.success("Week removed");
    }
  };

  const removeDailyScheduleItem = (index: number) => {
    if (formData.dailySchedule.length > 1) {
      setFormData((prev) => ({
        ...prev,
        dailySchedule: prev.dailySchedule.filter((_, i) => i !== index),
      }));
      setIsDirty(true);
      toast.success("Daily schedule item removed");
    }
  };

  const handleSave = () => {
    setIsDirty(false);
    toast.success("Changes saved successfully");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isDirty) {
        handleSave();
      }
      generateEngagementPDF(formData);
      toast.success("Engagement Schedule PDF generated successfully");
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
          <p className="text-xl font-semibold">Student Engagement Schedule</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Weekly Tasks</h3>
                <Button
                  type="button"
                  onClick={addWeeklyTask}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Week
                </Button>
              </div>

              {formData.weeklyTasks.map((task, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <Input
                    value={task.week}
                    onChange={(e) =>
                      handleWeeklyTaskChange(index, "week", e.target.value)
                    }
                    className="w-1/4"
                    required
                  />
                  <Textarea
                    value={task.task}
                    onChange={(e) =>
                      handleWeeklyTaskChange(index, "task", e.target.value)
                    }
                    className="w-full"
                    placeholder="Enter task description"
                    required
                  />
                  {formData.weeklyTasks.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeWeeklyTask(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Daily Schedule</h3>
                <Button
                  type="button"
                  onClick={addDailyScheduleItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </Button>
              </div>

              {formData.dailySchedule.map((scheduleItem, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-8 text-sm text-gray-500 pt-2">
                    {index + 1}.
                  </div>
                  <Textarea
                    value={scheduleItem.item}
                    onChange={(e) =>
                      handleDailyScheduleChange(index, e.target.value)
                    }
                    className="w-full"
                    placeholder="Enter daily schedule item"
                    required
                  />
                  {formData.dailySchedule.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeDailyScheduleItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Project Head Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="projectHead.name"
                  value={formData.projectHead.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full"
                  required
                />
                <Input
                  name="projectHead.designation"
                  value={formData.projectHead.designation}
                  onChange={handleInputChange}
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              disabled={!isDirty}
              className="w-full md:w-auto flex items-center gap-2"
            >
              Save
            </Button>
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
