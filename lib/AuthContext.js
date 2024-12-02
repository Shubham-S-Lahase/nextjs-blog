"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when the app initializes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user:", await res.text());
          logout();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (token) => {
    // Store token in localStorage
    localStorage.setItem("token", token);
  
    try {
      // Fetch user data using the token in the Authorization header
      const res = await fetch("/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },  // Pass the token correctly in the Authorization header
      });
  
      if (res.ok) {
        const data = await res.json();
        // console.log(data.user);
        setUser(data.user);
      } else {
        console.error("Failed to fetch user after login:", await res.text());
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
