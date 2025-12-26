import { CalendarDays, LogOut } from "lucide-react";

interface HeaderProps {
  onAddMeal: () => void;
  userName: string;
  onLogout: () => void;
}

export function Header({ onAddMeal, userName, onLogout }: HeaderProps) {
  // Logic to get up to 2 initials (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase(); // "Cherry" -> "CH"
    }
    // "John Doe" -> "JD"
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(userName);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-900">
                Weekly Meal Planner
              </h1>
              <p className="text-gray-500 text-sm hidden sm:block">
                Plan your meals for the week
              </p>
            </div>
          </div>

          {/* User Profile & Actions Section */}
          <div className="flex items-center gap-4">
            {/* Sign Out Button (Now on the Left) */}
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Sign Out"
            >
              <LogOut className="w-6 h-6" />
            </button>

            {/* Separator */}
            <div className="h-8 w-px bg-gray-300 mx-1"></div>

            {/* User Avatar & Name (Now on the Right) */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {userName}
              </span>
              {/* Updated Size to 50px */}
              <div
                style={{ height: "50px", width: "50px" }}
                className="rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm flex-shrink-0"
              >
                <span className="text-indigo-700 font-bold text-xl tracking-wide">
                  {initials}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
