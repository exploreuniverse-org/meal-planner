import { DayColumn } from "./DayColumn";
import { Meal } from "../App";

interface MealPlannerProps {
  days: string[];
  meals: Meal[];
  onAddMeal: (day: string, mealType: "breakfast" | "lunch" | "dinner") => void;
  onDeleteMeal: (id: string) => void;
}

export function MealPlanner({
  days,
  meals,
  onAddMeal,
  onDeleteMeal,
}: MealPlannerProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile View: Stacked days */}
      <div className="hidden space-y-4">
        {days.map((day) => (
          <DayColumn
            key={day}
            // API uses uppercase dayOfWeek (e.g. "TUESDAY") — compare to day.toUpperCase()
            meals={meals.filter((meal) => meal.dayOfWeek === day.toUpperCase())}
            day={day}
            onAddMeal={onAddMeal}
            onDeleteMeal={onDeleteMeal}
          />
        ))}
      </div>

      {/* Desktop View: Grid layout */}
      <div className="lg:grid lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <DayColumn
            key={day}
            day={day}
            meals={meals.filter((meal) => meal.dayOfWeek === day.toUpperCase())}
            onAddMeal={onAddMeal}
            onDeleteMeal={onDeleteMeal}
          />
        ))}
      </div>
    </main>
  );
}
