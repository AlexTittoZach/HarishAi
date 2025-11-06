import { createContext, useState, useEffect, useContext } from 'react';

interface UserProfile {
  id: string;
  name: string;
  preferences: {
    notifications: boolean;
    dataSharing: boolean;
    language: string;
  };
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
}

const defaultUser: UserProfile = {
  id: '1',
  name: 'Guest User',
  preferences: {
    notifications: true,
    dataSharing: false,
    language: 'en',
  },
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  isAuthenticated: true, // For demo purposes, user is automatically logged in
  updateUser: () => {},
  updatePreferences: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (userData: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const updatePreferences = (preferences: Partial<UserProfile['preferences']>) => {
    if (user) {
      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences },
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        updateUser,
        updatePreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};