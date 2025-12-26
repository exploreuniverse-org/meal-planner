import { useState } from "react";
import { Eye, EyeOff, UtensilsCrossed } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import { FacebookIcon } from "./FacebookIcon";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // Import from your new config file

export function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email login not implemented yet (focusing on Google first)", {
      email,
      password,
    });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Trigger the Firebase Pop-up
      await signInWithPopup(auth, googleProvider);
      // Success! App.tsx's onAuthStateChanged listener will handle the redirection.
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login not configured yet");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 lg:bg-gradient-to-br lg:from-indigo-50 lg:via-white lg:to-orange-50">
      <div className="w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Desktop decorative side panel */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-48 h-48 bg-indigo-100 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="w-24 h-24 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-gray-700 mb-2">Weekly Meal Planner</h2>
            <p className="text-gray-500">Plan your meals, simplify your life</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <h1 className="text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-500">
                Log in to your Weekly Meal Plan account
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Social Login Buttons (Moved to top as primary action) */}
            <div className="space-y-3 mb-6">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition shadow-sm hover:shadow disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <GoogleIcon />
                )}
                <span className="text-gray-700">Continue with Google</span>
              </button>

              {/* Facebook Button */}
              {/* <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] transition shadow-sm hover:shadow text-white opacity-70 cursor-not-allowed"
              >
                <FacebookIcon />
                <span>Continue with Facebook</span>
              </button> */}
            </div>

            {/* Divider */}
            {/* <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">
                OR LOGIN WITH EMAIL
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div> */}

            {/* Login Form (Visual Only for now) */}

            {/* <form onSubmit={handleLogin} className="space-y-5 opacity-60">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12"
                    placeholder="••••••••"
                    disabled
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg cursor-not-allowed"
                disabled
              >
                LOGIN
              </button>
            </form> */}

            {/* Sign Up Link */}
            {/* <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 transition"
                >
                  Sign Up
                </a>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
