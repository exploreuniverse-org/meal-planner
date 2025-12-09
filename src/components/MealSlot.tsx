import { Coffee, Sun, Moon, Plus, Trash2 } from "lucide-react";
import { Meal } from "../App";

interface MealSlotProps {
  day: string;
  mealType: "breakfast" | "lunch" | "dinner";
  meal?: Meal;
  onAddMeal: (day: string, mealType: "breakfast" | "lunch" | "dinner") => void;
  onDeleteMeal: (id: string) => void;
}

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
};

const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export function MealSlot({
  day,
  mealType,
  meal,
  onAddMeal,
  onDeleteMeal,
}: MealSlotProps) {
  const Icon = MEAL_ICONS[mealType];

  return (
    <div className="border border-gray-200 rounded-lg p-3 min-h-[100px] flex flex-col">
      {/* Meal Type Header */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-indigo-600" />
        <span className="text-sm text-gray-600">{MEAL_LABELS[mealType]}</span>
      </div>

      {/* Meal Content or Add Button */}
      {meal ? (
        <div className="flex-1 flex flex-col justify-between group">
          <div>
            <p className="text-gray-900 mb-1">{meal.dishName}</p>
            {meal.notes && (
              <p className="text-sm text-gray-500">{meal.notes}</p>
            )}
          </div>
          <button
            onClick={() => onDeleteMeal(meal.id.toString())}
            className="self-end mt-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete meal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => onAddMeal(day, mealType)}
          className="flex-1 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          aria-label={`Add ${mealType} for ${day}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
