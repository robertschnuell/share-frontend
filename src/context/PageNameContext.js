import React, { createContext, useState } from 'react';

export const PageNameContext = createContext();

export const PageNameProvider = ({ children }) => {
  const [pageName, setPageName] = useState("robert schnüll");

  return (
    <PageNameContext.Provider value={{ pageName, setPageName }}>
      {children}
    </PageNameContext.Provider>
  );
};