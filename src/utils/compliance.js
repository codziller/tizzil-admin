export const handleSetComplianceStatuses = (complianceData, profileData) => {
  // const videoStatus = complianceData?.account_video_status?.toLowerCase();
  const idStatus =
    complianceData?.profile_compliance?.identity_status?.toLowerCase() ||
    complianceData?.account_status?.toLowerCase();
  const utilityStatus = complianceData?.account_utility_status?.toLowerCase();
  const rcStatus = complianceData?.account_rc_status?.toLowerCase();
  const tinNoStatus = complianceData?.account_tin_number_status?.toLowerCase();
  const regCertificateStatus =
    complianceData?.account_legal_cert_status?.toLowerCase();
  const bvnStatus =
    profileData?.account_holder_details?.identity_legal_num_status?.toLowerCase();

  // const videoError =
  //   videoStatus === "rejected"
  //     ? complianceData?.account_video_status_msg
  //     : "";
  const idError =
    idStatus === "rejected"
      ? complianceData?.profile_compliance?.identity_status_msg
      : "";
  const utilityError =
    utilityStatus === "rejected"
      ? complianceData?.account_utility_status_msg
      : "";
  const rcError =
    rcStatus === "rejected" ? complianceData?.account_rc_status_msg : "";
  const tinNoError =
    tinNoStatus === "rejected"
      ? complianceData?.account_tin_number_status_msg
      : "";
  const regCertificateError =
    regCertificateStatus === "rejected"
      ? complianceData?.account_legal_cert_status_msg
      : "";
  const stats = {
    // videoStatus,
    idStatus,
    utilityStatus,
    rcStatus,
    tinNoStatus,
    regCertificateStatus,
  };
  // const userErrs = [videoError, idError];
  const userErrs = [idError];
  const businessErrs = [rcError, tinNoError, utilityError, regCertificateError];
  const dataCopy = {
    ...stats,
    bvnStatus,
    userErrs,
    businessErrs,
  };
  return dataCopy;
};
