import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; username: string; avatar?: string } | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (savedUser.email) {
      setUser(savedUser);
      setNewUsername(savedUser.username);
      setAvatar(savedUser.avatar || undefined);
    } else {
      navigate("/login");
    }
  }, []);

  const handleSave = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        username: newUsername, 
        avatar: avatar || undefined 
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile updated successfully!");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-6 w-96 border border-gray-700 rounded-lg shadow-xl backdrop-blur-lg">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-4">
          <label className="relative cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-24 h-24 rounded-full border border-gray-700 object-cover" />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-cyan-600 text-white text-3xl font-bold border border-gray-700">
                {user?.email[0].toUpperCase()}
              </div>
            )}
            <p className="text-xs text-gray-400 text-center mt-2">Click to change</p>
          </label>
        </div>

        {/* Display Username & Email in White Bold Centered */}
        {user && (
          <div className="text-center mb-4">
            <p className="text-xl font-bold text-white">{user.username}</p>
            <p className="text-lg font-bold text-white">{user.email}</p>
          </div>
        )}

        {/* Edit Username */}
        {user && (
          <>
            <label className="text-sm text-gray-300">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 mt-1 text-white bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="mt-4 w-full border border-cyan-500 text-white py-2 rounded-md hover:bg-cyan-500 hover:text-black transition"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
