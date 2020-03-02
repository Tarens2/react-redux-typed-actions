import { RSAA, RSAACall } from "redux-api-middleware";

declare module "redux-api-middleware" {
  function createAction<State = any, Payload = any, Meta = any>(
    clientCall: RSAACall<State, Payload, Meta>
  ): { [RSAA]: RSAACall<State, Payload, Meta> };
}
