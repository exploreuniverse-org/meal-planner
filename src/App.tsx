import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MealPlanner } from "./components/MealPlanner";
import { AddMealModal } from "./components/AddMealModal";
import { LoginScreen } from "./components/LoginScreen";

export interface Meal {
  id: number;
  createdAt: string; // ISO timestamp e.g. "2025-12-07T21:28:18.059214"
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  dishName: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  notes?: string | null;
  userId?: number | null;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1/plans";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | null
  >(null);

  // Fetch meals from API
  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error("Failed to fetch meals");
      const data = await response.json();
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch meals when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMeals();
    }
  }, [isAuthenticated]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMeals([]);
  };

  const handleAddMeal = (
    day: string,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsModalOpen(true);
  };

  const handleSaveMeal = async (name: string, description: string) => {
    if (!selectedDay || !selectedMealType || !name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // Convert day name to uppercase dayOfWeek (e.g. "Monday" -> "MONDAY")
      const dayOfWeekMap: { [key: string]: string } = {
        Monday: "MONDAY",
        Tuesday: "TUESDAY",
        Wednesday: "WEDNESDAY",
        Thursday: "THURSDAY",
        Friday: "FRIDAY",
        Saturday: "SATURDAY",
        Sunday: "SUNDAY",
      };

      const mealTypeMap: { [key: string]: string } = {
        breakfast: "BREAKFAST",
        lunch: "LUNCH",
        dinner: "DINNER",
      };

      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayOfWeek: dayOfWeekMap[selectedDay],
          mealType: mealTypeMap[selectedMealType],
          dishName: name.trim(),
          notes: description.trim() || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save meal");
      const newMeal: Meal = await response.json();

      // Add new meal to state and automatically refresh
      setMeals([...meals, newMeal]);

      // Reset modal state
      setIsModalOpen(false);
      setSelectedDay(null);
      setSelectedMealType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meal");
      console.error("Error saving meal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete meal");
      setMeals(meals.filter((meal) => meal.id.toString() !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete meal");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddMeal={() => setIsModalOpen(true)} />
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      <MealPlanner
        days={DAYS}
        meals={meals}
        onAddMeal={handleAddMeal}
        onDeleteMeal={handleDeleteMeal}
      />
      {isModalOpen && (
        <AddMealModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMeal}
          days={DAYS}
          preselectedDay={selectedDay}
          preselectedMealType={selectedMealType}
        />
      )}
    </div>
  );
}
