import { CalendarDays, Plus } from "lucide-react";

interface HeaderProps {
  onAddMeal: () => void;
}

export function Header({ onAddMeal }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-indigo-900">Weekly Meal Planner</h1>
              <p className="text-gray-500 text-sm">
                Plan your meals for the week
              </p>
            </div>
          </div>
          <button
            onClick={onAddMeal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Meal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
