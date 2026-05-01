import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API } from "../service/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("Token from sessionStorage:", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        if (!decoded.id) {
          console.error("No id found in token!");
          setUser(null);
          sessionStorage.removeItem("token");
          return;
        }

        // Always fetch profile to get latest role and info
        API.getUserProfile(token)
          .then((profile) => {
            setUser({
              id: profile.id || decoded.id,
              token,
              username: profile.name || profile.username || decoded.username,
              email: profile.email || decoded.email,
              role: profile.role || 'user',
            });
            console.log("Set user from profile API:", profile);
          })
          .catch((err) => {
            console.error("Failed to fetch profile:", err);
            // still set minimal user from token
            if (decoded.username && decoded.email) {
              setUser({ id: decoded.id, token, username: decoded.username, email: decoded.email, role: 'user' });
            } else {
              setUser({ id: decoded.id, token, role: 'user' });
            }
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
        sessionStorage.removeItem("token");
      }
    }
  }, []);

  const login = (userData) => {
    // Decode token to get user ID
    try {
      const decoded = jwtDecode(userData.token);
      // Prefer user object returned from server if present
      const serverUser = userData.user;
      const user = {
        id: serverUser?.id || decoded.id,
        username: serverUser?.username || decoded.username,
        email: serverUser?.email || decoded.email,
        role: serverUser?.role || 'user',
        token: userData.token,
      };
      setUser(user);
      sessionStorage.setItem("token", userData.token);
      console.log("Logged in user:", user);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
