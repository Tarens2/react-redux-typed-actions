import {
  RSAA,
  RSAAAction,
  RSAACall,
  InternalError,
  RequestError,
  ApiError
} from "redux-api-middleware";
import { isNil, set, get } from "lodash";
import {
  createAction,
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithPreparedPayload
} from "@reduxjs/toolkit";

const baseUrl = "";

/**
 * returns array of action names to use them as default types for RSAA
 */
export const getActionTypes = (
  actionName: string
): [string, string, string] => [
  `${actionName}/REQUEST`,
  `${actionName}/SUCCESS`,
  `${actionName}/FAIL`
];

const getAccessHeader = (token?: string, isFormData = false) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers.Accept = "application/json";
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export interface APIAction<Arguments extends any[], S, P, M> {
  (...args: Arguments): RSAAAction<S, P, M>;
  type: string;
  typeAPIRequest: ActionCreatorWithOptionalPayload<undefined>;
  typeAPISuccess: ActionCreatorWithOptionalPayload<P>;
  typeAPIFail: ActionCreatorWithPreparedPayload<
    [InternalError | RequestError | ApiError<P>],
    InternalError | RequestError | ApiError<P>,
    string,
    boolean,
    M
  >;
}

interface RSAACallCustom extends RSAACall {
  data: Record<string, any> | FormData;
}

export interface SetupAction<T extends any[]> {
  (...args: T): Partial<RSAACallCustom>;
}

const createAPIAction = <Arguments extends any[], S, P, M>(
  type: string,
  setupAction: SetupAction<Arguments>
): APIAction<Arguments, S, P, M> => {
  const actionCreator: APIAction<Arguments, S, P, M> = (...args: Arguments) => {
    const { endpoint, method, data, fetch } = setupAction(...args);

    const signal = get(data, "signal", null);

    // const accessToken = selectAccessToken(state);
    // const defaultFetch = getDefaultFetch(state, signal);

    const action: RSAAAction<S, P, M> = {
      [RSAA]: {
        endpoint: `${baseUrl}${endpoint}`,
        method: method || "GET",
        types: getActionTypes(type),
        headers: getAccessHeader("accessToken", data instanceof window.FormData)
        // fetch: defaultFetch,
      }
    };

    if (fetch) {
      action[RSAA].fetch = fetch;
    }

    if (data) {
      if (data instanceof FormData) {
        action[RSAA].body = data;
      } else {
        const { signal, ...requestData } = data;
        action[RSAA].body = JSON.stringify(requestData);
      }
    }

    return action;
  };

  actionCreator.type = type;
  actionCreator.typeAPIRequest = createAction<undefined>(`${type}/REQUEST`);
  actionCreator.typeAPISuccess = createAction<P>(
    `${type}/SUCCESS`
  ) as ActionCreatorWithOptionalPayload<P>;

  actionCreator.typeAPIFail = createAction<
    InternalError | RequestError | ApiError<P>
  >(`${type}/FAIL`) as ActionCreatorWithPreparedPayload<
    [InternalError | RequestError | ApiError<P>],
    InternalError | RequestError | ApiError<P>,
    string,
    boolean,
    M
  >;
  return actionCreator;
};

export default createAPIAction;
