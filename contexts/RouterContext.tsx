import React, { useState, createContext, useContext, ReactNode } from 'react';

// Create a context for the router
const RouterContext = createContext<{ route: string, navigate: (path: string) => void }>({
  route: '/',
  navigate: () => console.warn('Navigate function called outside of Router context'),
});

// Custom hook for router
export const useRouter = () => useContext(RouterContext);

// Provider component
export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState('/'); // e.g., '/', '/course/1'

  const navigate = (path: string) => {
    // Links are like '#/', '#/course/1'. We strip '#' to get the route.
    const newRoute = path.substring(1);
    setRoute(newRoute);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};
