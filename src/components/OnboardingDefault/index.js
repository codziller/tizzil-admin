import PropTypes from "prop-types";
import { IS_DEV } from "utils/appConstant";
import { OnboardingDefaultWrapper } from "./style";

export default function Index({ children }) {
  return (
    <OnboardingDefaultWrapper
      className={`${
        IS_DEV ? "h-with-test-banner" : "h-screen w-screen"
      } bg-white`}
    >
      <div className="default-content">
        <div className="beautyhut-logo-container flex flex-col items-center justify-center mb-3">
          <h2 className="text-black text-xl">beautyhut.</h2>
          <span className="text-sm bg-blue-clear3 px-5 py-0.5 rounded-[12px]">
            admin
          </span>
        </div>
        {children}
      </div>
    </OnboardingDefaultWrapper>
  );
}

Index.propTypes = {
  children: PropTypes.elementType,
};
