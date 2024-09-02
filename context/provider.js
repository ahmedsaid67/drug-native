import React from "react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginSlice from "./features/auth/loginSlice";
import messageSlice from "./features/message/messageSlice";
import userSlice from "./features/user/userSlice";

const rootReducer = combineReducers({
    login: loginSlice,
    message: messageSlice,
    user: userSlice,
});

const store = configureStore({
    reducer: rootReducer,
});

const UserProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default UserProvider;

