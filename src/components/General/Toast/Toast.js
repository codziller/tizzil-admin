import { Toaster, ToastBar, toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { ReactComponent as Success } from "assets/icons/Toast/success.svg";
import { ReactComponent as Error } from "assets/icons/Toast/error.svg";
import { ReactComponent as Warning } from "assets/icons/Toast/warning.svg";
import styled from "styled-components";

const DEFAULT_TOAST_DURATION = 5000;

const defaultConfig = { duration: DEFAULT_TOAST_DURATION };

const ToastLoader = styled.div`
  height: 5px;
  background-color: var(--zusco-blue);
  position: absolute;
  left: -200%;
  bottom: 0;
  width: 200%;
  animation: slide-right ${(props) => props.duration / 1000}s ease forwards;

  @keyframes slide-right {
    0% {
    }
    50% {
    }
    100% {
      left: -100%;
    }
  }
`;

const Toast = () => {
  return (
    <Toaster
      position="top-left"
      toastOptions={{
        style: {
          zIndex: 999999,
        },
      }}
      containerStyle={{
        zIndex: 999999,
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          position="top-left"
          style={{
            maxWidth: "396px",
            minHeight: "fit-content",
            background: "#FFFFFF",
            boxShadow: "0px 0px 10px rgba(225, 231, 242, 0.8)",
            borderRadius: "8px",
            padding: "15px",
            boxSizing: "border-box",
            overflow: "hidden",
            zIndex: 999999,
            ...t.style,
          }}
        >
          {({ icon, message }) => {
            const toastIcon =
              t.type === "error" ? (
                <Error />
              ) : t.type === "success" ? (
                <Success />
              ) : message.props.role === "warning" ? (
                <Warning />
              ) : (
                icon
              );
            return (
              <div className="bani-toast w-full">
                <div className="flex justify-between align-start w-full">
                  <div className="flex justify-between align-start">
                    <div className="bani-toast-icon mr-[20px]">{toastIcon}</div>
                    <div className="bani-toast-message flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-center gap-[8px]">
                      <div className="flex flex-col justify-center items-start gap-[8px]">
                        <span className="bani-toast-header font-semibold text-base">
                          {message.props.title}
                        </span>
                        {message.props.children ? (
                          <p className="helv-regular text-grey-text bani-toast-content text-sm">
                            {message.props.children}
                          </p>
                        ) : null}
                      </div>
                      {/* Action Buttons */}
                      {message.props.actions && t.type === "success" && (
                        <div className="flex gap-2 mt-2">
                          {message.props.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                action.onClick();
                                if (action.dismissOnClick !== false) {
                                  toast.dismiss(t.id);
                                }
                              }}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                action.variant === "outline"
                                  ? "border border-[#690007] text-[#690007] hover:bg-[#690007] hover:text-white"
                                  : "bg-[#690007] text-white hover:bg-[#590006]"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-auto pl-2">
                    <p
                      onClick={() => toast.dismiss(t.id)}
                      className="text-red helv-medium text-[12px] cursor-pointer p-1.5 hover:bg-red-light3 transition-colors rounded-full"
                    >
                      <IoClose
                        size={18}
                        className="hover:opacity-75 transition-opacity"
                      />
                    </p>
                  </div>
                </div>
                <ToastLoader duration={t.duration} />
              </div>
            );
          }}
        </ToastBar>
      )}
    </Toaster>
  );
};

export const warningToast = (title, message) => {
  toast(message, {
    ...defaultConfig,
    ariaProps: {
      role: "warning",
      title,
    },
  });
};

export const successToast = (title, message, duration, actions, extraStyle) => {
  toast.success(message, {
    ...defaultConfig,
    duration: duration || DEFAULT_TOAST_DURATION,
    style: extraStyle,
    ariaProps: {
      role: "success",
      title,
      actions,
    },
  });
};

export const errorToast = (title, message) => {
  toast.error(message, {
    ...defaultConfig,
    ariaProps: {
      role: "error",
      title,
    },
  });
};

export default Toast;
