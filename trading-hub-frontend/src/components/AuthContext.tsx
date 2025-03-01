import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  userId: number | null;
  isAdmin: boolean;
  token: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        setUserId(tokenPayload.user_id);
        setIsAdmin(tokenPayload.admin);
      } catch {
        setToken(null);
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserId(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ userId, isAdmin, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
