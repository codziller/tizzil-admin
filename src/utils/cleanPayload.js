import { isBoolean, isEmpty, isNumber } from "lodash";

const cleanPayload = (payload) => {
  Object.keys(payload).forEach((key) => {
    if (
      !isNumber(payload[key]) &&
      !isBoolean(payload[key]) &&
      isEmpty(payload[key])
    ) {
      delete payload[key];
    }
  });
  return payload;
};
export default cleanPayload;
