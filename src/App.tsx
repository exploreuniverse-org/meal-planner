/// <reference types="vite/client" />

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MealPlanner } from "./components/MealPlanner";
import { AddMealModal } from "./components/AddMealModal";
import { LoginComponent } from "./components/LoginComponent";

// Firebase Imports
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export default function App() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  // NEW: State to store user data from your Backend (DB)
  const [backendData, setBackendData] = useState<any>(null);
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
          const token = await currentUser.getIdToken();
          setIdToken(token);
          setUser(currentUser);

          // Sync with Backend and capture the result
          const dbUser = await syncUserToBackend(token);
          if (dbUser) {
            setBackendData(dbUser);
          }

          fetchMeals(token);
        } catch (err) {
          console.error("Error setting up auth session:", err);
          setError("Failed to initialize session");
        }
      } else {
        setUser(null);
        setBackendData(null);
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Backend sync failed");

      // RETURN the user data so we can use it in the UI
      return await response.json();
    } catch (err) {
      console.error("Backend sync error:", err);
      return null;
    }
  };

  // --- 3. CRUD OPERATIONS ---

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
          Authorization: `Bearer ${idToken}`,
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
          Authorization: `Bearer ${idToken}`,
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

  // Helper to determine display name
  // Prioritize Backend Name > Firebase Name > Default
  // Note: Check if your backend uses 'name', 'fullName', or 'username'
  const displayName =
    backendData?.name || backendData?.fullName || user?.displayName || "User";

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
      <Header
        onAddMeal={() => setIsModalOpen(true)}
        userName={displayName}
        onLogout={handleLogout}
      />

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
