import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PropTypes from "prop-types";

import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { FormErrorMessage } from "../FormErrorMessage";
import ToolTip from "../ToolTip";

const Wysiwyg = ({
  onEditorStateChange,
  editorState,
  isLoading,
  label,
  labelClass,
  formError,
  showFormError,
  tooltip,
  ...rest
}) => {
  return (
    <div className={`relative h-full w-full`}>
      {label && (
        <label
          className={`general-input-label text-[13px] mb-1 text-grey-dark !flex justify-start items-center gap-1.5 ${labelClass}`}
        >
          {label}
          {tooltip && (
            <ToolTip content={tooltip}>
              <InfoIcon />
            </ToolTip>
          )}
        </label>
      )}
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        //   toolbarClassName="toolbarClassName"
        //   wrapperClassName="wrapperClassName"
        editorClassName={`
      relative p-3 w-full font-normal outline-none focus:outline-none transition-all duration-300 ease-in-out whitespace-nowrap text-base leading-relaxed border border-solid text-left text-black text-[16px] sm:text-base placeholder:text-grey placeholder:font-extralight min-h-[150px]
      bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white focus:bg-white focus:border-[#111111] focus:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]

        ${isLoading && "pointer-events-none"}
        `}
        {...rest}
      />

      <div className="h-[13px]">
        {showFormError && formError && <FormErrorMessage type={formError} />}
      </div>
    </div>
  );
};

Wysiwyg.propTypes = {
  onEditorStateChange: PropTypes.func,
  editorState: PropTypes.any,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  formError: PropTypes.object,
  showFormError: PropTypes.bool,
  tooltip: PropTypes.string,
};

export default Wysiwyg;
