import PropTypes from "prop-types";
import { ReactComponent as WarningIcon } from "assets/icons/warning.svg";
import Modal from "components/General/Modal/Modal/Modal";

export default function ComplianceModal({ show, onHide }) {
  return (
    <Modal
      size="md"
      active={show}
      toggler={onHide}
      className="py-[80px] px-[48px]"
    >
      <WarningIcon className="mb-[33px] self-center" />
      <h3 className="text-center mb-[16px] text-[16px]">
        Please complete compliance
      </h3>
      <p className="text-grey-text text-center text-[14px]">
        Whoops! Your account needs to be verified before accessing this page.
        Please complete the compliance forms and wait for your account to be
        verified.
      </p>
    </Modal>
  );
}

ComplianceModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};
