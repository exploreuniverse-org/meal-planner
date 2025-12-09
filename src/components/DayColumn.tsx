import { MealSlot } from "./MealSlot";
import { Meal } from "../App";

interface DayColumnProps {
  day: string;
  meals: Meal[];
  onAddMeal: (day: string, mealType: "breakfast" | "lunch" | "dinner") => void;
  onDeleteMeal: (id: string) => void;
}

const MEAL_TYPES: ("breakfast" | "lunch" | "dinner")[] = [
  "breakfast",
  "lunch",
  "dinner",
];

export function DayColumn({
  day,
  meals,
  onAddMeal,
  onDeleteMeal,
}: DayColumnProps) {
  const getMealForType = (type: "breakfast" | "lunch" | "dinner") => {
    return meals.find((meal) => meal.mealType.toLocaleLowerCase() === type);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Day Header */}
      <div className="bg-indigo-600 px-4 py-3">
        <h2 className="text-white text-center">{day}</h2>
      </div>

      {/* Meal Slots */}
      <div className="p-3 space-y-3">
        {MEAL_TYPES.map((mealType) => (
          <MealSlot
            key={mealType}
            day={day}
            mealType={mealType}
            meal={getMealForType(mealType)}
            onAddMeal={onAddMeal}
            onDeleteMeal={onDeleteMeal}
          />
        ))}
      </div>
    </div>
  );
}
