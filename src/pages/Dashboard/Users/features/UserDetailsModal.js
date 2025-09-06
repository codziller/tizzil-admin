import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal";
import Toggle from "components/General/Toggle";

const UserDetailsModal = ({ active, user, onClose, adminNavItems }) => {
  const [userPermissions, setUserPermissions] = useState({});

  useEffect(() => {
    if (user && user.permissions) {
      // Initialize permissions state based on user's current permissions
      const permissionsState = {};
      adminNavItems.forEach(item => {
        permissionsState[item.id] = user.permissions.includes(item.id);
      });
      setUserPermissions(permissionsState);
    }
  }, [user, adminNavItems]);

  const handlePermissionToggle = (permissionId) => {
    setUserPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  const handleSavePermissions = () => {
    console.log("Save permissions:", userPermissions);
    // Here you would typically make an API call to update user permissions
    onClose();
  };

  if (!user) return null;

  // Get icon for the permission (we'll use a simple icon placeholder for now)
  const getPermissionIcon = (permissionId) => {
    // You can add specific icons for each permission type here
    return (
      <div className="w-9 h-9 rounded bg-[#6900071A] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="#690007"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <Modal active={active} toggler={onClose} modalTitle="USER PERMISSIONS" isSideModal>
      <div className="flex flex-col gap-6">
        {/* User Info Section */}
        <div className="flex items-center gap-4">
          <div className="w-[46px] h-[46px] rounded-lg bg-gray-200 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[14px] text-[#111827] font-medium">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-[12px] text-[#6D7280]">
              {user.email}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h3 className="text-[16px] text-[#4B5563] mb-5">Details</h3>
          <div className="border border-[#DDDDDD] bg-white rounded p-4">
            <div className="flex flex-col gap-2">
              {adminNavItems.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between w-full pb-2">
                    <div className="flex items-center gap-3">
                      {getPermissionIcon(item.id)}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[16px] text-[#111827]">
                          {item.label}
                        </span>
                        <span className="text-[12px] text-[#111827]">
                          {item.label} permission
                        </span>
                      </div>
                    </div>
                    <Toggle
                      checked={userPermissions[item.id] || false}
                      onChange={() => handlePermissionToggle(item.id)}
                    />
                  </div>
                  {index < adminNavItems.length - 1 && (
                    <div className="w-full h-px bg-[#D2D2D2] mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePermissions}
            className="flex-1 px-4 py-2 bg-[#690007] text-white rounded-md hover:bg-[#580006] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

UserDetailsModal.propTypes = {
  active: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    permissions: PropTypes.array,
  }),
  onClose: PropTypes.func.isRequired,
  adminNavItems: PropTypes.array.isRequired,
};

export default UserDetailsModal;