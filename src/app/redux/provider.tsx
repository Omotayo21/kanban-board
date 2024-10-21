"use client";

import React, { ReactNode } from "react";
import store from "./store";
import { Provider } from "react-redux";

interface ReduxProviderProps {
  children: ReactNode; // Define the type of children as ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
