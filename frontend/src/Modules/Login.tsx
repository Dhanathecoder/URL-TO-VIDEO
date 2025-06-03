import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate(); // Initialize navigation
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) navigate("/Urlvid"); // Redirect if already logged in
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    setLoading(true);

    const endpoint = isRegister ? "register" : "login";
    const body = isRegister ? { username, email, password } : { email, password };

    try {
      const response = await fetch("http://localhost:8080/" + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Store user details in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ username: data.username, email }));

      navigate("/Urlvid"); // Redirect to URL to Video page after login
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="font-sans max-w-7xl mx-auto h-screen flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 items-center gap-8 w-full max-w-4xl">
        {user ? (
          <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-lg text-center">
            <h3 className="text-gray-800 text-4xl font-bold">Welcome, {user}!</h3>
            <button
              className="mt-6 py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-500"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login"); // Redirect to login on logout
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="max-w-lg w-full p-6 bg-white shadow-lg rounded-lg">
              <div className="mb-6">
                <h3 className="text-gray-800 text-4xl font-bold">{isRegister ? "Register" : "Sign in"}</h3>
              </div>

              {isRegister && (
                <div className="mb-4">
                  <label className="text-gray-800 text-sm mb-2 block">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-sm text-gray-800 bg-gray-100 pl-4 pr-10 py-3 rounded-md border border-gray-300 focus:outline-none"
                    placeholder="Enter username"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm text-gray-800 bg-gray-100 pl-4 pr-10 py-3 rounded-md border border-gray-300 focus:outline-none"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4 relative">
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm text-gray-800 bg-gray-100 pl-4 pr-10 py-3 rounded-md border border-gray-300 focus:outline-none"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute top-9 right-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>

              {isRegister && (
                <div className="mb-4 relative">
                  <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-sm text-gray-800 bg-gray-100 pl-4 pr-10 py-3 rounded-md border border-gray-300 focus:outline-none"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute top-9 right-4"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              )}

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-teal-800 hover:bg-teal-700"
                disabled={loading}
              >
                {loading ? "Loading..." : isRegister ? "Register" : "Log in"}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-teal-700 hover:underline"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}
                </button>
              </div>
            </form>
            <img
              src="https://readymadeui.com/photo.webp"
              className="rounded-md w-4/5"
              alt="Dining Experience"
            />
          </>
        )}
      </div>
    </div>
  );
}
