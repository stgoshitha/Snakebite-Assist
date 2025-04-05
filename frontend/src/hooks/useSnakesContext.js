import { useContext } from 'react';
import { SnakesContext } from '../context/SnakesContext';

export const useSnakesContext = () => {
  const context = useContext(SnakesContext);

  if (!context) {
    throw Error('useSnakesContext must be used inside a SnakesContextProvider');
  }

  return context;
}; 