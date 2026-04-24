import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  subscribers: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, displayName: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'displayName' | 'avatar' | 'bio'>>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'yuvist_users';
const SESSION_KEY = 'yuvist_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (_e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const getUsers = (): Record<string, { user: User; password: string }> => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch (_e) {
      return {};
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const entry = users[username.toLowerCase()];
    if (!entry || entry.password !== password) return false;
    setUser(entry.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(entry.user));
    return true;
  };

  const register = async (username: string, displayName: string, password: string): Promise<boolean> => {
    const users = getUsers();
    if (users[username.toLowerCase()]) return false;
    const newUser: User = {
      id: Date.now().toString(),
      username: username.toLowerCase(),
      displayName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=dc2626&textColor=ffffff`,
      bio: '',
      subscribers: 0,
      createdAt: new Date().toISOString(),
    };
    users[username.toLowerCase()] = { user: newUser, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (data: Partial<Pick<User, 'displayName' | 'avatar' | 'bio'>>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    const users = getUsers();
    if (users[user.username]) {
      users[user.username].user = updated;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
