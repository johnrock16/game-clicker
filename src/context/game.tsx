'use client'

import { createContext, useState } from 'react';

const defaultValue = {
    moneyTotal: 0,
    setState: null as any,
};

export const GameContext = createContext(defaultValue);

export const GameContextProvider = ({children} : any) => {
  const [state, setState] = useState(defaultValue);

  // const updateMoney = (money: number) => {
  //   setState((pv) => ({...pv, moneyTotal: money}))
  // }

  return (
    <GameContext.Provider value={{...state, setState: setState}}>
      {children}
    </GameContext.Provider>
  );
}
