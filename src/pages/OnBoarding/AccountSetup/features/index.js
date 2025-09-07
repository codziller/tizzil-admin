import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import AccountSetupOne from "./AccountSetupOne";
import AccountSetupTwo from "./AccountSetupTwo";
import AccountSetupThree from "./AccountSetupThree";
import AccountSetupFour from "./AccountSetupFour";
import AccountSetupFive from "./AccountSetupFive";
import SetupSuccessModal from "components/General/Modal/SetupSuccessModal";
import AuthStore from "../../SignUp/store";
import useLogin from "hooks/useLogin";
import cleanPayload from "utils/cleanPayload";

const AccountSetupContainer = () => {
  const navigate = useNavigate();
  const { logUserIn } = useLogin();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const stepItems = [
    { step: 1, title: "Brand Info", component: AccountSetupOne },
    { step: 2, title: "Business Details", component: AccountSetupTwo },
    { step: 3, title: "Product Setup", component: AccountSetupThree },
    { step: 4, title: "Business Operations", component: AccountSetupFour },
    { step: 5, title: "Review & Submit", component: AccountSetupFive },
  ];

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Prepare brand registration data according to BrandRegistrationCreateInput
      const brandRegistrationData = cleanPayload({
        addressLine1: formData.addressLine1 || formData.address || "",
        addressLine2: formData.addressLine2 || "",
        brandDescription:
          formData.brandDescription || formData.description || "",
        brandName: formData.brandName || "",
        brandShortText:
          formData.brandShortText || formData.shortDescription || "",
        businessRegistrationNumber:
          formData.businessRegistrationNumber ||
          formData.registrationNumber ||
          "",
        city: formData.city || "",
        country: formData.country || "",
        estimatedMonthlyOrders: formData.estimatedMonthlyOrders
          ? parseFloat(formData.estimatedMonthlyOrders)
          : null,
        postalCode: formData.postalCode || formData.zipCode || "",
        productImportMethod: formData.productImportMethod || null,
        shopifyAccessToken: formData.shopifyAccessToken || "",
        shopifyStoreUrl: formData.shopifyStoreUrl || "",
        state: formData.state || "",
        yearsInBusiness: formData.yearsInBusiness
          ? parseFloat(formData.yearsInBusiness)
          : null,
      });

      // Call the brand registration API
      const success = await AuthStore.authBrandRegistration(
        brandRegistrationData,
        (result) => {
          if (result) {
            setShowSuccessModal(true);
            toast.success("Brand setup completed successfully!");
          } else {
            toast.error("Failed to submit brand registration");
          }
          setIsLoading(false);
        }
      );

      // Demo mode - simulate successful brand registration and update user data
      // setTimeout(() => {
      //   // Create updated demo response with brand setup complete
      //   const updatedDemoResponse = {
      //     access_token: "demo_access_token_after_setup_12345",
      //     refresh_token: "demo_refresh_token_after_setup_67890",
      //     user: JSON.parse(localStorage.getItem("user") || "{}"),
      //     brand: {
      //       id: "demo-brand-id-456",
      //       brandName: formData.brandName || "Demo Brand Store",
      //       brandEmail: formData.brandEmail || "demo@tizzil.com",
      //       logoUrl: "https://via.placeholder.com/100/690007/FFFFFF?text=DB",
      //     },
      //     brandUser: {
      //       brandId: "demo-brand-id-456",
      //       createdAt: new Date().toISOString(),
      //       id: "demo-brand-user-789",
      //       invitedAt: new Date().toISOString(),
      //       isActive: true,
      //       joinedAt: new Date().toISOString(),
      //       role: "OWNER",
      //       updatedAt: new Date().toISOString(),
      //       userId:
      //         JSON.parse(localStorage.getItem("user") || "{}")?.id ||
      //         "demo-user-id-123",
      //     },
      //   };

      //   // Update localStorage with complete brand setup
      //   saveUserInfoToStorage(updatedDemoResponse);

      //   setShowSuccessModal(true);
      //   toast.success("Brand setup completed successfully! (Demo Mode)");
      //   setIsLoading(false);
      // }, 1500); // Simulate processing time
    } catch (error) {
      console.error("Brand registration error:", error);
      toast.error("Failed to submit brand registration");
      setIsLoading(false);
    }
  };

  const handleExploreFeed = () => {
    // AuthStore.logout();
    navigate("/");
  };

  const handleBackToHome = () => {
    // AuthStore.logout();
    navigate("/");
  };

  const renderStepIndicator = (stepNumber, isCompleted = false) => (
    <div className="flex justify-start mb-6">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full ${
              step === stepNumber
                ? "bg-primary"
                : step < stepNumber || isCompleted
                ? "bg-primary"
                : "bg-[#EEEEEE]"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="md:px-2 md:py-0 py-8 px-3 form-container min-w-[calc(100vw-48px)] mini:!min-w-[362px] snap-center mt-20">
      <div className="space-y-12">
        {stepItems.map(({ step, title, component: StepComponent }) => (
          <div key={step} className="w-full">
            {/* Step Indicator */}
            {renderStepIndicator(step)}

            {/* Step Title */}
            <h3 className="text-xl font-bold text-[#111111] mb-6 text-left">
              {title}
            </h3>

            {/* Step Content */}
            <div className="w-full">
              {step === 5 ? (
                <StepComponent
                  formData={formData}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  hideTitle={true} // Hide the original title since we show it above
                />
              ) : (
                <StepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  hideTitle={true} // Hide the original title since we show it above
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Success Modal */}
      <SetupSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onExploreFeed={handleExploreFeed}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
};

export default observer(AccountSetupContainer);
