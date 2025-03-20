import { configureStore} from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: "root",
    storage,
};

const Reducer = persistReducer(persistConfig, AuthSlice);

export const store = configureStore({
    reducer: {
        Auth: Reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], 
            },
        }),
});

export const persistor = persistStore(store);
