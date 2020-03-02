import createApiAction from "../../utils/createAPIAction";
import { Todo } from "../../entities/Todo";
import { ThunkAction } from "redux-thunk";
import { RootStoreState } from "../reducers";
import { Dispatch } from "redux";

export const fetchArticles = createApiAction<[], any, Todo[], "test meta">(
  "FETCH_ARTICLES",
  () => ({
    endpoint: "http://localhost:9292/api/articles",
    method: "GET"
  })
);

export function testThunkAction(
  data: boolean
): ThunkAction<Promise<boolean>, RootStoreState, never, any> {
  return async dispatch => {
    if (data) {
      const a = await (dispatch as Dispatch)(fetchArticles());
      if (a.error) {
        return false;
      }
      return true;
    }
    return false;
  };
}
