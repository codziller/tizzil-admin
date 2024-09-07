import PropTypes from "prop-types";
import classNames from "classnames";
import { IS_DEV } from "utils/appConstant";

import Toast from "../General/Toast/Toast";
import { Link } from "react-router-dom";

const ProviderDashboardLayout = ({ children }) => {
  return (
    <div
      className={`w-screen flex flex-grow flex-col h-full ${
        IS_DEV ? "h-with-test-banner" : "min-h-[100vh]"
      }`}
    >
      <Toast />

      <header className="dashboard-header px-[12px] flex flex-row justify-between items-center w-full h-[49px] md:h-[62px] ">
        <div className="relative flex flex-row justify-center items-center mx-auto w-full md:px-6 ">
          <Link to="/warehouses" className="h-8 w-16 !my-0">
            <div className="beautyhut-logo-container flex flex-col items-center justify-center mb-3">
              <h2 className="text-black text-xl">beautyhut.</h2>
              <span className="text-sm bg-blue-clear3 px-5 py-0.5 rounded-[12px]">
                admin
              </span>
            </div>
          </Link>
        </div>
      </header>

      <section className="w-full h-full flex flex-row flex-grow max-w-9xl mx-auto">
        <main
          className={classNames(
            "mt-[49px] md:mt-[62px] w-full bg-grey-whitesmoke pb-14 px-6 pt-6 flex justify-center items-center flex-col flex-grow overflow-y-scroll overflow-x-hidden relative "
          )}
        >
          {children}
        </main>
      </section>
    </div>
  );
};

ProviderDashboardLayout.propTypes = {
  children: PropTypes.any,
};

export default ProviderDashboardLayout;
