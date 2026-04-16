import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  businessName: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: User, token: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  setAuth: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("biztrack_token");
      if (storedToken) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${storedToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem("biztrack_token");
          }
        } catch (error) {
          console.error("Failed to fetch user session", error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const setAuth = (newUser: User, newToken: string) => {
    localStorage.setItem("biztrack_token", newToken);
    setUser(newUser);
    setToken(newToken);
  };

  const signOut = async () => {
    localStorage.removeItem("biztrack_token");
    setUser(null);
    setToken(null);
    toast({
      title: "Signed out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
