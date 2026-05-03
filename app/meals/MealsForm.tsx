"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Select, TextArea } from "@/components/ui";

export function MealsForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [meal, setMeal] = useState("Breakfast");
  const [appetite, setAppetite] = useState("Good");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await appendToSheet(SHEETS.meals, [formatTimestamp(), meal, appetite, notes]);
    setMeal("Breakfast"); setAppetite("Good"); setNotes("");
    setShowForm(false);
    router.refresh();
    setSubmitting(false);
  };

  return (
    <>
      <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "cta"} className="w-auto px-5">
        {showForm ? "Cancel" : "+ Log Meal"}
      </Button>

      {showForm && (
        <Card className="p-5 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Meal"
              value={meal}
              onChange={setMeal}
              options={[
                { value: "Breakfast", label: "Breakfast" },
                { value: "Lunch", label: "Lunch" },
                { value: "Dinner", label: "Dinner" },
                { value: "Snack", label: "Snack" },
              ]}
            />
            <Select
              label="Appetite"
              value={appetite}
              onChange={setAppetite}
              options={[
                { value: "Good", label: "Good - Ate most of it" },
                { value: "Fair", label: "Fair - Ate some" },
                { value: "Poor", label: "Poor - Barely ate" },
              ]}
            />
            <TextArea label="Notes (optional)" value={notes} onChange={setNotes} placeholder="What was served, any issues..." />
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Save Meal"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
