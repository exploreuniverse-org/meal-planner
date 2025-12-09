import { useState } from "react";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
}

export function LoginScreen({ onLogin, onGoogleLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    onLogin(email, password);
  };

  const handleGoogleClick = () => {
    // In a real app this would start OAuth. Here we call the optional callback.
    if (onGoogleLogin) {
      onGoogleLogin();
      return;
    }
    // fallback: sign in as demo google user
    onLogin("google-demo@example.com", "google-oauth-demo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Meal Planner
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Plan your weekly meals
        </p>

        <button
          type="button"
          onClick={handleGoogleClick}
          className="w-full flex items-center justify-center gap-3 py-2 mb-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
          aria-label="Continue with Google"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
          >
            <path
              d="M17.64 9.2045c0-.638-.057-.99-.182-1.424H9v2.695h4.844c-.083.676-.536 1.737-1.424 2.293l.013.087 2.063 1.593.143.014C16.63 13.18 17.64 11.341 17.64 9.2045z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.47-.803 5.96-2.18l-2.845-2.197C11.58 13.12 10.346 13.7 9 13.7 6.61 13.7 4.58 12.03 3.7 9.84l-.077.005L1.71 11.99C3.19 15.36 5.92 18 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.7 9.84A5.997 5.997 0 0 1 3.7 6.16L1.71 4.01A8.999 8.999 0 0 0 .2 9c0 1.44.33 2.8.9 4.01l2.6-3.17z"
              fill="#FBBC05"
            />
            <path
              d="M9 4.3c1.32 0 2.5.45 3.43 1.33l2.57-2.51C13.46 1.38 11.43.2 9 .2 5.92.2 3.19 2.84 1.71 6.21l2 1.83C4.58 6.03 6.61 4.3 9 4.3z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <hr className="flex-1 border-t border-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Minimum 6 characters"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-4">
          Demo: use any email and password (6+ chars). Google login is a mock
          action.
        </p>
      </div>
    </div>
  );
}
