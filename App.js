import React, { useState } from "react";

import { Provider } from "react-redux";
import allReducers from "./redux/reducers/index";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import Navigation from "./navigation/Navigation";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { PersistGate } from "redux-persist/integration/react";
// Imports: Redux Persist Persister
import { store, persistor } from "./redux/store/store";

const App = () => {
  let [fontsLoaded] = useFonts({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    roboto: require("./assets/fonts/Roboto-Regular.ttf"),
    "roboto-light": require("./assets/fonts/Roboto-Light.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
};
export default App;
