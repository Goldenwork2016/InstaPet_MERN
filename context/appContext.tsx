import React, { createContext, useContext, useState } from 'react';

interface MyContextProps {
  state: {
    isGenerating: boolean;
    isTraining: boolean;
  };
  setState: React.Dispatch<
    React.SetStateAction<{ isGenerating: boolean; isTraining: boolean }>
  >;
}

const MyContext = createContext<MyContextProps>({
  state: {
    isGenerating: false,
    isTraining: false,
  },
  setState: () => {},
});

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState({
    isGenerating: false,
    isTraining: false,
  });

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};
export const useAppContext = (): MyContextProps => useContext(MyContext);
export default AppContextProvider;
