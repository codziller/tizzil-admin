import React, { useState } from "react";
import PropTypes from "prop-types";

const UserCard = ({
  user,
  onApprove,
  onReject,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleApprove = (e) => {
    e.stopPropagation();
    setActionType("approve");
    setShowConfirmModal(true);
  };

  const handleReject = (e) => {
    e.stopPropagation();
    setActionType("reject");
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (actionType === "approve") {
      onApprove?.(user);
    } else {
      onReject?.(user);
    }
    setShowConfirmModal(false);
    setActionType("");
  };

  return (
    <div className="relative bg-white shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <div
          className="w-full h-[220px] bg-[#EFF0EB] bg-cover bg-center"
          style={{
            backgroundImage: user.profileImage
              ? `url(${user.profileImage})`
              : "none",
          }}
        >
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-3">
          <div
            className="w-4 h-4 rounded-full mr-1.5"
            style={{ backgroundColor: "#690007" }}
          />
          <h3 className="text-base text-[#111827] font-normal">
            {user.firstName} {user.lastName}
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {user.description || `User from ${user.location || "Unknown location"}`}
        </p>

        <div className="px-4 py-1.5">
          <div className="bg-[#F6F7F1] px-3 py-2 flex">
            <div className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-100 transition-colors px-3 py-2 rounded">
              <img 
                src="/src/assets/icons/approve-icon.svg" 
                alt="Approve"
                className="w-4 h-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-4 h-4"
                onClick={handleApprove}
              >
                <path 
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
                  fill="#111111"
                />
              </svg>
              <span className="text-[13px] text-[#111111]" onClick={handleApprove}>Approve</span>
            </div>
            
            <div className="w-px bg-[#D9D9D9]" />
            
            <div className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-100 transition-colors px-3 py-2 rounded">
              <img 
                src="/src/assets/icons/reject-icon.svg" 
                alt="Reject"
                className="w-4 h-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-4 h-4"
                onClick={handleReject}
              >
                <path 
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" 
                  fill="#690007"
                />
              </svg>
              <span className="text-[13px] text-[#690007]" onClick={handleReject}>Reject</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === "approve" ? "Approve User" : "Reject User"}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} {user.firstName} {user.lastName}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-md text-white transition-colors ${
                  actionType === "approve"
                    ? "bg-[#690007] hover:bg-[#580006]"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
};

export default UserCard;