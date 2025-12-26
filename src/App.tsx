import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MealPlanner } from "./components/MealPlanner";
import { AddMealModal } from "./components/AddMealModal";
import { LoginComponent } from "./components/LoginComponent";

// Firebase Imports
import { auth } from "./firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

export interface Meal {
  id: number;
  createdAt: string;
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

// CHANGED: Base URL now points to the root API to access both /plans and /user/sync
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

export default function App() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | null
  >(null);

  // --- 1. AUTHENTICATION LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get the JWT token for the backend
          const token = await currentUser.getIdToken();
          setIdToken(token);
          setUser(currentUser);

          // Sync with Backend
          await syncUserToBackend(token);

          // Fetch Data
          fetchMeals(token);
        } catch (err) {
          console.error("Error setting up auth session:", err);
          setError("Failed to initialize session");
        }
      } else {
        // Logged out
        setUser(null);
        setIdToken(null);
        setMeals([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. BACKEND SYNC ---
  const syncUserToBackend = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Secure Header
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Backend sync failed");
      console.log("User synced with backend!");
    } catch (err) {
      console.error("Backend sync error:", err);
      // Optional: force logout if backend is unreachable
    }
  };

  // --- 3. CRUD OPERATIONS (Protected) ---

  const fetchMeals = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const handleSaveMeal = async (name: string, description: string) => {
    if (!selectedDay || !selectedMealType || !name.trim() || !idToken) return;

    setLoading(true);
    setError(null);
    try {
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

      const response = await fetch(`${API_BASE_URL}/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Add Token
        },
        body: JSON.stringify({
          dayOfWeek: dayOfWeekMap[selectedDay],
          mealType: mealTypeMap[selectedMealType],
          dishName: name.trim(),
          notes: description.trim() || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save meal");
      const newMeal: Meal = await response.json();

      setMeals([...meals, newMeal]);
      setIsModalOpen(false);
      setSelectedDay(null);
      setSelectedMealType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meal");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!idToken) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`, // Add Token
        },
      });
      if (!response.ok) throw new Error("Failed to delete meal");
      setMeals(meals.filter((meal) => meal.id.toString() !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete meal");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const handleAddMeal = (
    day: string,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsModalOpen(true);
  };

  // --- RENDER ---

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Updated Header to accept logout prop if your component supports it */}
      <Header onAddMeal={() => setIsModalOpen(true)} />

      {/* Simple logout button added here if not in Header */}
      <div className="max-w-7xl mx-auto px-4 pt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Logged in as {user.displayName}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Sign Out
        </button>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4 mt-4 bg-red-50 text-red-700 rounded">
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
