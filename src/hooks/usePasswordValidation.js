import React, { useEffect, useState } from "react";

import { passwordValidation } from "utils/validations";

const usePasswordValidation = ({ value }) => {
  const [passwordCheck, setPasswordCheck] = useState([]);
  useEffect(() => {
    if (value?.length > 0) {
      const passwordTest = passwordValidation(value);
      setPasswordCheck(passwordTest);
    }
  }, [value]);
  const passwordIsInvalid = passwordCheck.some((item) => !item.test);

  const PasswordCheckComp = () =>
    value ? (
      <div className="flex flex-col justify-start items-center text-sm gap-[5px]">
        {passwordCheck.map(({ text, test }) => (
          <div
            className="flex justify-start items-center w-full gap-[5px] transition-all duration-500 ease-in-out"
            key={text}
          >
            <div
              className={`min-w-[8px] min-h-[8px] max-w-[8px] max-h-[8px] gap-[5px] rounded-full
          border  ${
            test
              ? "bg-green-light border-green-light"
              : "bg-transparent border-grey-text"
          }
            `}
            />
            <p
              className={`transition-all duration-500 ease-in-out ${
                test ? "text-green-light" : "text-grey-text"
              }`}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    ) : null;
  return {
    passwordIsInvalid,
    passwordCheck,
    PasswordCheckComp,
  };
};
export default usePasswordValidation;
