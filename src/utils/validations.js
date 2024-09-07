import { isEmpty } from "lodash";

export function isEmail(string) {
  const emailCheck =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return string.match(emailCheck);
}

export function includesNumber(string) {
  const numberRegex = /\d/;
  return numberRegex.test(string);
}

export function includesUppercase(string) {
  const uppercase = /[A-Z]/;
  return uppercase.test(string);
}

/* eslint-disable no-useless-escape */
export function includesSpecialCharacter(string) {
  const includesSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return includesSpecialCharacter.test(string);
}

export function passwordValidation(password) {
  const test = [
    {
      text: "Your password must be at least 8 Characters",
      test: password.length > 7,
      type: "characters",
    },
    {
      text: "At least one uppercase and number",
      test: !!includesNumber(password) && includesUppercase(password),
      type: "uppercase",
    },
    {
      text: "contain a special character (*#.!$(%-_)",
      test: includesSpecialCharacter(password),
      type: "special_characters",
    },
  ];
  return test;
}

export const hasValue = (value) => !!(value && value !== "");

export const containsAnyLetters = (str) => {
  return /[a-zA-Z]/.test(str);
};

export const isNullTxName = (value) => {
  const nullTxValues = [" ", "N/A", "None", "None.", "null"];
  return !!(
    isEmpty(value) ||
    nullTxValues.find(
      (nullVal) => nullVal.toLowerCase() === value.toLowerCase()
    )
  );
};
