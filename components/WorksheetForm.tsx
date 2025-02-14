// components/WorksheetForm.tsx
import React, { useState } from "react";
import { Plus, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskEntry as TaskEntryComponent } from "./TaskEntry";
import { generateWorksheetPDF } from "@/utils/pdfGenerator";

interface TaskEntry {
  date: string;
  task: string;
}

interface FormData {
  studentName: string;
  rollNo: string;
  companyName: string;
  docNo: string;
  entries: TaskEntry[];
  signatureDate: string; // Add this new field
}

export const WorksheetForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    rollNo: "",
    companyName: "",
    docNo: "",
    entries: [{ date: "", task: "" }],
    signatureDate: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEntryChange = (
    index: number,
    field: keyof TaskEntry,
    value: string
  ) => {
    const newEntries = [...formData.entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      entries: newEntries,
    }));
  };

  const addEntry = () => {
    let nextDate = "";
    const lastEntry = formData.entries[formData.entries.length - 1];

    if (lastEntry.date) {
      const lastDate = new Date(lastEntry.date);
      const nextDay = new Date(lastDate);
      nextDay.setDate(lastDate.getDate() + 1);

      // Skip weekends
      while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
        nextDay.setDate(nextDay.getDate() + 1);
      }

      nextDate = nextDay.toISOString().split("T")[0];
    }

    setFormData((prev) => ({
      ...prev,
      entries: [...prev.entries, { date: nextDate, task: "" }],
    }));
    toast.success("New entry added");
  };

  const removeEntry = (index: number) => {
    if (formData.entries.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index),
    }));
    toast.success("Entry removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates are in sequence
    const isValidSequence = formData.entries.every((entry, index) => {
      if (index === 0) return true;
      const currentDate = new Date(entry.date);
      const prevDate = new Date(formData.entries[index - 1].date);
      return currentDate > prevDate;
    });

    if (!isValidSequence) {
      toast.error("Please ensure dates are in sequential order");
      return;
    }

    try {
      generateWorksheetPDF(formData);
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
          <p className="text-lg font-semibold">DAILY WORKSHEET (DWS)</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <span className="text-sm font-medium">DWS - </span>
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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Daily Tasks</h3>
              <Button
                type="button"
                onClick={addEntry}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Entry
              </Button>
            </div>

            {formData.entries.map((entry: TaskEntry, index: number) => (
              <TaskEntryComponent
                key={index}
                entry={entry}
                index={index}
                onEntryChange={handleEntryChange}
                onRemove={removeEntry}
                canRemove={formData.entries.length > 1}
              />
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Signature Date</label>
            <Input
              type="date"
              name="signatureDate"
              value={formData.signatureDate}
              onChange={handleInputChange}
              className="w-full"
              required
            />
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
