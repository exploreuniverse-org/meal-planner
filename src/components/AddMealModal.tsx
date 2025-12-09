import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AddMealModalProps {
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  days: string[];
  preselectedDay: string | null;
  preselectedMealType: "breakfast" | "lunch" | "dinner" | null;
}

export function AddMealModal({
  onClose,
  onSave,
  days,
  preselectedDay,
  preselectedMealType,
}: AddMealModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDay, setSelectedDay] = useState(preselectedDay || days[0]);
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner"
  >(preselectedMealType || "breakfast");

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), description.trim());
      setName("");
      setDescription("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-indigo-900">Add Meal</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="meal-name"
              className="block text-sm text-gray-700 mb-1"
            >
              Meal Name *
            </label>
            <input
              id="meal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grilled Chicken Salad"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="meal-description"
              className="block text-sm text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="meal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this meal"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="meal-day"
              className="block text-sm text-gray-700 mb-1"
            >
              Day
            </label>
            <select
              id="meal-day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={preselectedDay !== null}
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="meal-type"
              className="block text-sm text-gray-700 mb-1"
            >
              Meal Type
            </label>
            <select
              id="meal-type"
              value={selectedMealType}
              onChange={(e) =>
                setSelectedMealType(
                  e.target.value as "breakfast" | "lunch" | "dinner"
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={preselectedMealType !== null}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Save Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
