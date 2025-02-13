"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorksheetForm } from "./WorksheetForm";
import { EngagementForm } from "./EngagementForm";

export const ReportSelector: React.FC = () => {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Nirma University Report Generator
        </h1>
        <p className="text-gray-600 text-center">
          Generate various reports and documentation for your academic needs
        </p>
      </div>

      <Tabs defaultValue="DWS" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="DWS">Daily Worksheet</TabsTrigger>
          <TabsTrigger value="ENGAGEMENT">Student Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="DWS" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Worksheet (DWS)</CardTitle>
              <CardDescription>
                Generate your daily work report for internship documentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorksheetForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ENGAGEMENT" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement Schedule</CardTitle>
              <CardDescription>
                Create and manage your student engagement schedules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EngagementForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};