import { fetchArticles } from "./actions";
import { createReducer } from "@reduxjs/toolkit";
import { Todo } from "../../entities/Todo";

const todos = createReducer<Todo[]>([], builder =>
  builder
    .addCase(fetchArticles.typeAPIRequest, (state, action) => {
      // action is inferred correctly here
      console.log(action);
    })
    .addCase(fetchArticles.typeAPISuccess, (state, action) => {
      // action is inferred correctly here
      return action.payload;
    })
    .addCase(fetchArticles.typeAPIFail, (state, action) => {
      const a = action.meta;
      // action is inferred correctly here
    })
);

export default todos;
