import { useState, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); // Redirect to Home
  };

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/Urlvid", name: "Url to Video" },
    { path: "/price", name: "Pricing" },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 p-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img src={logo} alt="ArticVidz Logo" className="h-12 w-12 object-contain" />
          <span className="text-white text-2xl font-bold">ArticVidz</span>
        </a>

        {/* Navigation Links & Profile Together */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(({ path, name }) => (
              <a
                key={path}
                href={path}
                className={`py-2 px-3 transition-colors ${
                  location.pathname === path
                    ? "text-emerald-700 font-semibold" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {name}
              </a>
            ))}
          </div>

          {/* Profile / Login Section */}
          <div className="relative">
            {user ? (
              <>
                {/* Profile Icon (First Letter of Email) */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-600 text-white text-xl font-bold cursor-pointer"
                >
                  {user.email[0].toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-900 bg-opacity-80 backdrop-blur-lg 
                              border border-gray-700 shadow-xl rounded-lg overflow-hidden z-50"
                  >
                    {/* Show Username */}
                    <div className="px-4 py-2 text-sm font-bold text-white border-b border-gray-700">
                      {user.username}
                    </div>

                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
                    >
                      Edit Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Show Login Button if User is Not Logged In */
              <a
                href="/login"
                className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="min-h-screen px-4 lg:px-4">{children}</main>
    </div>
  );
}
