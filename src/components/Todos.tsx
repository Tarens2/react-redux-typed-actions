import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RootStoreState } from "../store/reducers";
import { fetchArticles, testThunkAction } from "../store/todos/actions";
import { Dispatch, AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: RootStoreState) => ({ todos: state.todos });
const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchArticles: () => dispatch(fetchArticles()),
  thunkAction: () =>
    (dispatch as ThunkDispatch<RootStoreState, never, AnyAction>)(
      testThunkAction(true)
    )
});
type TodosProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Todos = ({ todos, fetchArticles, thunkAction }: TodosProps) => {
  useEffect(() => {
    fetchArticles().then(res =>
      console.log("RSAA action with server response", res)
    );
    thunkAction().then(res =>
      console.log("thunk action with boolean payload", res)
    );
  }, [fetchArticles, thunkAction]);

  return (
    <ul>
      {todos.map(todo => (
        <li>{todo.label}</li>
      ))}
    </ul>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
