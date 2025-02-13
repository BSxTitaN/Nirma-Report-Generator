import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, FileDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generatePPRPDF } from "@/utils/pdfGenerator";

interface ObjectivePoint {
  title: string;
  points: string[];
}

interface ScopePoint {
  point: string;
}

interface TestingPoint {
  point: string;
}

interface QAPoint {
  point: string;
}

interface ToolsetCategory {
  name: string;
  tools: string[];
}

interface PersonalDetails {
  address: string;
  distance: string;
  transport: string;
}

interface FormData {
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

type SectionType = 'objective' | 'scope' | 'testing' | 'qa' | 'toolset';

export const PPRForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    rollNo: "",
    guidedBy: "",
    department: "Department of Computer Science and Engineering",
    objectives: [{ title: "", points: [""] }],
    scopePoints: [{ point: "" }],
    testingPoints: [{ point: "" }],
    qaPoints: [{ point: "" }],
    specifications: "",
    toolset: [{ name: "", tools: [""] }],
    scheduleImage: null,
    personalDetails: {
      address: "",
      distance: "",
      transport: "",
    },
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleObjectiveChange = (
    index: number,
    field: "title" | "points",
    value: string | string[]
  ) => {
    const newObjectives = [...formData.objectives];
    if (field === "title") {
      newObjectives[index].title = value as string;
    } else {
      newObjectives[index].points = value as string[];
    }
    setFormData((prev) => ({ ...prev, objectives: newObjectives }));
  };

  const handlePointChange = (
    index: number,
    value: string,
    type: "scope" | "testing" | "qa"
  ) => {
    const field = type === "scope" 
      ? "scopePoints" 
      : type === "testing" 
      ? "testingPoints" 
      : "qaPoints";
    
    const newPoints = [...formData[field]];
    newPoints[index] = { point: value };
    setFormData((prev) => ({ ...prev, [field]: newPoints }));
  };

  const handleToolsetChange = (
    categoryIndex: number,
    toolIndex: number,
    value: string,
    isName: boolean = false
  ) => {
    const newToolset = [...formData.toolset];
    if (isName) {
      newToolset[categoryIndex].name = value;
    } else {
      newToolset[categoryIndex].tools[toolIndex] = value;
    }
    setFormData((prev) => ({ ...prev, toolset: newToolset }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, scheduleImage: file }));
      toast.success("Schedule image uploaded");
    }
  };

  const handlePersonalDetailsChange = (
    field: keyof PersonalDetails,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value,
      },
    }));
  };

  const addSection = (type: SectionType) => {
    switch (type) {
      case "objective":
        setFormData((prev) => ({
          ...prev,
          objectives: [...prev.objectives, { title: "", points: [""] }],
        }));
        break;
      case "scope":
        setFormData((prev) => ({
          ...prev,
          scopePoints: [...prev.scopePoints, { point: "" }],
        }));
        break;
      case "testing":
        setFormData((prev) => ({
          ...prev,
          testingPoints: [...prev.testingPoints, { point: "" }],
        }));
        break;
      case "qa":
        setFormData((prev) => ({
          ...prev,
          qaPoints: [...prev.qaPoints, { point: "" }],
        }));
        break;
      case "toolset":
        setFormData((prev) => ({
          ...prev,
          toolset: [...prev.toolset, { name: "", tools: [""] }],
        }));
        break;
    }
    toast.success(`New ${type} section added`);
  };

  const removeSection = (index: number, type: SectionType) => {
    const field = type === "objective"
      ? "objectives"
      : type === "scope"
      ? "scopePoints"
      : type === "testing"
      ? "testingPoints"
      : type === "qa"
      ? "qaPoints"
      : "toolset";

    if (formData[field].length <= 1) return;

    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
    toast.success(`${type} section removed`);
  };

  const addToolItem = (categoryIndex: number) => {
    const newToolset = [...formData.toolset];
    newToolset[categoryIndex].tools.push("");
    setFormData((prev) => ({ ...prev, toolset: newToolset }));
    toast.success("Tool item added");
  };

  const removeToolItem = (categoryIndex: number, toolIndex: number) => {
    const newToolset = [...formData.toolset];
    if (newToolset[categoryIndex].tools.length > 1) {
      newToolset[categoryIndex].tools = newToolset[categoryIndex].tools.filter(
        (_, index) => index !== toolIndex
      );
      setFormData((prev) => ({ ...prev, toolset: newToolset }));
      toast.success("Tool removed");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await generatePPRPDF(formData);
      toast.success("PDF generated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to generate PDF: ${error.message}`);
      } else {
        toast.error("Failed to generate PDF");
      }
      console.error("PDF generation error:", error);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-md border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">NIRMA UNIVERSITY</CardTitle>
        <div className="text-center space-y-1">
          <p className="text-xl font-semibold">Major Project</p>
          <p className="text-xl font-semibold">
            Preliminary Project Information Report
          </p>
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
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll No.</label>
                <Input
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  placeholder="Enter your roll number"
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
                placeholder="Enter guide's name"
                required
              />
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Objectives</h3>
              <Button
                type="button"
                onClick={() => addSection("objective")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Objective
              </Button>
            </div>

            {formData.objectives.map((obj, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  value={obj.title}
                  onChange={(e) =>
                    handleObjectiveChange(index, "title", e.target.value)
                  }
                  placeholder="Objective title"
                  required
                />
                {obj.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex gap-2">
                    <div className="w-8 text-sm text-gray-500 pt-2">•</div>
                    <Input
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...obj.points];
                        newPoints[pointIndex] = e.target.value;
                        handleObjectiveChange(index, "points", newPoints);
                      }}
                      placeholder="Enter objective point"
                      required
                    />
                  </div>
                ))}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => {
                      const newPoints = [...obj.points, ""];
                      handleObjectiveChange(index, "points", newPoints);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Add Point
                  </Button>
                  {formData.objectives.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSection(index, "objective")}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Project Schedule */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Project Schedule (Gantt Chart)
            </label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              {formData.scheduleImage && (
                <div className="text-sm text-green-600">
                  Image uploaded: {formData.scheduleImage.name}
                </div>
              )}
            </div>
          </div>

          {/* Project Scope */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scope of Project</h3>
              <Button
                type="button"
                onClick={() => addSection("scope")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Scope Point
              </Button>
            </div>

            {formData.scopePoints.map((scope, index) => (
              <div key={index} className="flex gap-2">
                <div className="w-8 text-sm text-gray-500 pt-2">
                  {index + 1}.
                </div>
                <Textarea
                  value={scope.point}
                  onChange={(e) =>
                    handlePointChange(index, e.target.value, "scope")
                  }
                  placeholder="Enter scope point"
                  className="flex-1"
                  required
                />
                {formData.scopePoints.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSection(index, "scope")}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Software Testing */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Software Testing</h3>
              <Button
                type="button"
                onClick={() => addSection("testing")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Testing Point
              </Button>
            </div>

            {formData.testingPoints.map((point, index) => (
              <div key={index} className="flex gap-2">
                <div className="w-8 text-sm text-gray-500 pt-2">
                  {index + 1}.
                </div>
                <Textarea
                  value={point.point}
                  onChange={(e) =>
                    handlePointChange(index, e.target.value, "testing")
                  }
                  placeholder="Enter testing point"
                  className="flex-1"
                  required
                />
                {formData.testingPoints.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSection(index, "testing")}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Quality Assurance */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Quality Assurance</h3>
              <Button
                type="button"
                onClick={() => addSection("qa")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add QA Point
              </Button>
            </div>

            {formData.qaPoints.map((point, index) => (
              <div key={index} className="flex gap-2">
                <div className="w-8 text-sm text-gray-500 pt-2">
                  {index + 1}.
                </div>
                <Textarea
                  value={point.point}
                  onChange={(e) =>
                    handlePointChange(index, e.target.value, "qa")
                  }
                  placeholder="Enter quality assurance point"
                  className="flex-1"
                  required
                />
                {formData.qaPoints.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSection(index, "qa")}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Project Specifications */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Specifications of the Project</h3>
            <Textarea
              name="specifications"
              value={formData.specifications}
              onChange={handleInputChange}
              className="w-full min-h-32"
              placeholder="Enter project specifications"
              required
            />
          </div>

          {/* Toolset Used */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Toolset Used</h3>
              <Button
                type="button"
                onClick={() => addSection("toolset")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </div>

            {formData.toolset.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="space-y-2 p-4 border rounded-lg"
              >
                <div className="flex gap-2">
                  <div className="w-8 text-sm text-gray-500 pt-2">
                    {categoryIndex + 1}.
                  </div>
                  <Input
                    value={category.name}
                    onChange={(e) =>
                      handleToolsetChange(
                        categoryIndex,
                        0,
                        e.target.value,
                        true
                      )
                    }
                    placeholder="Category name"
                    className="flex-1"
                    required
                  />
                </div>
                {category.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="flex gap-2 ml-8">
                    <div className="w-8 text-sm text-gray-500 pt-2">•</div>
                    <Input
                      value={tool}
                      onChange={(e) =>
                        handleToolsetChange(
                          categoryIndex,
                          toolIndex,
                          e.target.value
                        )
                      }
                      placeholder="Tool name"
                      className="flex-1"
                      required
                    />
                    {category.tools.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeToolItem(categoryIndex, toolIndex)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex justify-between mt-2">
                  <Button
                    type="button"
                    onClick={() => addToolItem(categoryIndex)}
                    variant="outline"
                    size="sm"
                  >
                    Add Tool
                  </Button>
                  {formData.toolset.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSection(categoryIndex, "toolset")}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address of stay</label>
              <Textarea
                value={formData.personalDetails.address}
                onChange={(e) => handlePersonalDetailsChange("address", e.target.value)}
                className="w-full"
                placeholder="Enter your complete address"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Distance from company</label>
              <Input
                value={formData.personalDetails.distance}
                onChange={(e) => handlePersonalDetailsChange("distance", e.target.value)}
                placeholder="e.g., 11 kms"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mode of Transport</label>
              <Input
                value={formData.personalDetails.transport}
                onChange={(e) => handlePersonalDetailsChange("transport", e.target.value)}
                placeholder="e.g., Auto"
                className="w-full"
                required
              />
            </div>
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

export default PPRForm;