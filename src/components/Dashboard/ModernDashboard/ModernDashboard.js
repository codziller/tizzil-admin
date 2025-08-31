import React from 'react';
import SimpleBrandDashboard from '../BrandDashboard/SimpleBrandDashboard';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import { getUserInfoFromStorage } from 'utils/storage';

const ModernDashboard = () => {
  // Get user data to determine dashboard type
  const userData = getUserInfoFromStorage();
  const user = userData?.user || JSON.parse(localStorage.getItem('user') || '{}');
  
  const isAdmin = user?.userRole?.name === "ADMIN";

  return (
    <div className="w-full">
      {isAdmin ? (
        <AdminDashboard userRole="admin" />
      ) : (
        <SimpleBrandDashboard userRole="brand" />
      )}
    </div>
  );
};

export default ModernDashboard;