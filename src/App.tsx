import React from "react";
import Todos from './components/Todos';
import {Provider} from "react-redux";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <Todos />
        </div>
    </Provider>
  );
}

export default App;
