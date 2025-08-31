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
import authService from "services/auth";

const AccountSetupContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // DEMO MODE: Comment out actual API call for demo purposes
      // Prepare the registration data according to the schema
      const registrationData = {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || "",
        brandDescription: formData.brandDescription,
        brandName: formData.brandName,
        brandShortText: formData.brandShortText || "",
        businessRegistrationNumber: formData.businessRegistrationNumber || "",
        city: formData.city,
        country: formData.country,
        estimatedMonthlyOrders: formData.estimatedMonthlyOrders || 0,
        postalCode: formData.postalCode || "",
        productImportMethod: formData.productImportMethod || null,
        shopifyAccessToken: formData.shopifyAccessToken || "",
        shopifyStoreUrl: formData.shopifyStoreUrl || "",
        state: formData.state || "",
        yearsInBusiness: formData.yearsInBusiness || 0,
      };

      // DEMO MODE: Comment out API call
      // const response = await authService.authBrandRegistration({
      //   registrationData,
      // });

      // Demo mode: Simulate successful registration
      const response = {
        authBrandRegistration: {
          status: true,
          message: "Brand registration successful (Demo Mode)"
        }
      };
      
      // Simulate some delay for realistic demo experience
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (response?.authBrandRegistration?.status) {
        // Store demo brand data to localStorage for dashboard access
        const demoBrandData = {
          brand: {
            id: 1,
            name: formData.brandName,
            description: formData.brandDescription,
            ...registrationData
          },
          brandUser: {
            id: 1,
            role: 'BRAND_OWNER'
          }
        };
        localStorage.setItem('brand', JSON.stringify(demoBrandData.brand));
        localStorage.setItem('brandUser', JSON.stringify(demoBrandData.brandUser));
        
        setShowSuccessModal(true);
        toast.success("Brand setup completed successfully! (Demo Mode)");
      } else {
        toast.error("Failed to submit brand registration");
      }
    } catch (error) {
      console.error("Brand registration error:", error);
      toast.error(
        error?.response?.errors?.[0]?.message ||
          "Failed to submit brand registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExploreFeed = () => {
    // DEMO MODE: Go directly to dashboard instead of logging out
    navigate("/dashboard/home");
  };

  const handleBackToHome = () => {
    // DEMO MODE: Go directly to dashboard instead of logging out
    navigate("/dashboard/home");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountSetupOne
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <AccountSetupTwo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <AccountSetupThree
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <AccountSetupFour
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <AccountSetupFive
            formData={formData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="md:px-2 md:py-0 py-8 px-3 form-container min-w-[calc(100vw-24px)] mini:!min-w-[362px] snap-center">
      {/* Step Indicators */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full ${
                step <= currentStep ? "bg-primary" : "bg-[#EEEEEE]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {renderCurrentStep()}

      {/* Navigation Buttons (for steps 1-4) */}
      {currentStep < 5 && (
        <div className="flex flex-col gap-4 mt-8">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="w-full p-3 text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            onClick={nextStep}
            className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {currentStep === 4 ? "Review" : "Next"}
          </button>
        </div>
      )}

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
