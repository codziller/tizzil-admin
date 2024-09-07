import PropTypes from "prop-types";
import { ReactComponent as WarningIcon } from "assets/icons/warning.svg";
import Modal from "components/General/Modal/Modal/Modal";

export default function PermissionModal({ show, onHide }) {
  return (
    <Modal
      size="md"
      active={show}
      toggler={onHide}
      className="py-[80px] px-[48px]"
    >
      <WarningIcon className="mb-[33px] self-center" />
      <h3 className="text-center mb-[16px] text-[16px]">Unauthorized access</h3>
      <p className="text-grey-text text-center text-[14px]">
        Whoops! You are not authorized to access this page. Kindly contact your
        admin to update permission.
      </p>
    </Modal>
  );
}

PermissionModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};
