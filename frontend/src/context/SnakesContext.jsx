import { createContext, useReducer } from 'react';

export const SnakesContext = createContext();

export const snakesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SNAKES':
      return {
        snakes: action.payload
      };
    case 'ADD_SNAKE':
      return {
        snakes: [action.payload, ...state.snakes]
      };
    case 'DELETE_SNAKE':
      return {
        snakes: state.snakes.filter(snake => snake._id !== action.payload)
      };
    case 'UPDATE_SNAKE':
      return {
        snakes: state.snakes.map(snake => 
          snake._id === action.payload._id ? action.payload : snake
        )
      };
    default:
      return state;
  }
};

export const SnakesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(snakesReducer, {
    snakes: []
  });

  return (
    <SnakesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SnakesContext.Provider>
  );
}; 