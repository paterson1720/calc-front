import * as React from 'react';

const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = React.useState({ authToken: null });
  const value = { user, setUser };

  React.useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) setUser({ authToken: token });
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be inside a UserProvider');
  }
  return context;
}
export { UserProvider, useUser };
