import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./Modules/Layout";
import Home from './Modules/Home'; 
import Login from './Modules/Login';
import UrltoVid from './Modules/UrltoVid'; 
import Pricing from './Modules/Pricing'; 
import Profile from "./Modules/Profile";



function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = localStorage.getItem("user"); // Check local storage
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/price" element={<Pricing />} />
            <Route path="/Urlvid" element={<PrivateRoute><UrltoVid /></PrivateRoute>} /> {/* Protected Route */}
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
