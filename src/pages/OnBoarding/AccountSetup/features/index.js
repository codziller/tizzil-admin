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
import { uploadImagesToCloud } from "utils/uploadImagesToCloud";
import { saveUserInfoToStorage } from "utils/storage";
import useAuth from "hooks/useAuth";

const AccountSetupContainer = () => {
  const navigate = useNavigate();
  const { logUserIn } = useLogin();
  const { setAuthenticatedUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
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

  // Validate that all required fields are filled
  const validateForm = () => {
    const requiredFields = {
      // Step 1: Brand Info
      brandName: "Brand name",
      addressLine1: "Address",
      latitude: "Valid address location",
      longitude: "Valid address location",
      country: "Country",
      state: "State",
      city: "City",
      postalCode: "Postal code",
      productCategory: "Product category",
      // Step 2: Business Details
      brandDescription: "Brand description",
      // Step 3: Product Setup
      logo: "Logo",
    };

    const missingFields = [];

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage("Preparing brand registration...");

      // Upload images to cloud if they exist
      let logoUrl = "";
      let bannerImageUrl = "";

      const imagesToUpload = [];
      const imageTypes = [];

      if (formData.logo) {
        imagesToUpload.push(formData.logo);
        imageTypes.push("logo");
      }

      if (formData.banner) {
        imagesToUpload.push(formData.banner);
        imageTypes.push("banner");
      }

      if (imagesToUpload.length > 0) {
        setLoadingMessage("Uploading images...");
        try {
          const uploadedUrls = await uploadImagesToCloud(imagesToUpload);

          // Map uploaded URLs to the correct fields
          imageTypes.forEach((type, index) => {
            if (type === "logo") {
              logoUrl = uploadedUrls[index] || "";
            } else if (type === "banner") {
              bannerImageUrl = uploadedUrls[index] || "";
            }
          });
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast.error("Failed to upload images. Please try again.");
          setIsLoading(false);
          setLoadingMessage("");
          return;
        }
      }

      setLoadingMessage("Submitting brand registration...");

      // Prepare brand registration data according to BrandRegistrationCreateInput
      const brandRegistrationData = cleanPayload({
        addressLine1: formData.addressLine1 || formData.address || "",
        addressLine2: formData.addressLine2 || "",
        bannerImageUrl: bannerImageUrl || "",
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
        instagramUrl: formData.instagramUrl || "",
        logoUrl: logoUrl || "",
        postalCode: formData.postalCode || formData.zipCode || "",
        productCategory: formData.productCategory || "",
        productImportMethod: formData.productImportMethod || null,
        shopifyAccessToken: formData.shopifyAccessToken || "",
        shopifyStoreUrl: formData.shopifyStoreUrl || "",
        state: formData.state || "",
        tiktokUrl: formData.tiktokUrl || "",
        websiteUrl: formData.websiteUrl || "",
        yearsInBusiness: formData.yearsInBusiness
          ? parseFloat(formData.yearsInBusiness)
          : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      });

      // Call the brand registration API
      await AuthStore.authBrandRegistration(brandRegistrationData, (result) => {
        if (result) {
          // Get current access and refresh tokens from localStorage
          const accessToken = localStorage.getItem("access_token") || "";
          const refreshToken = localStorage.getItem("refresh_token") || "";

          // Prepare the response in the expected format
          const updatedUserData = {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: result.user,
            brand: result.brand,
            // Create a brandUser object from the brand owner data
            brandUser: {
              brandId: result.brand?.id,
              createdAt: result.brand?.createdAt,
              id: result.brand?.id, // Using brand ID as temporary brandUser ID
              invitedAt: result.brand?.createdAt,
              isActive: result.brand?.isActive,
              joinedAt: result.brand?.createdAt,
              role: "OWNER",
              updatedAt: result.brand?.updatedAt,
              userId: result.user?.id,
            },
          };

          // Save user data to storage
          saveUserInfoToStorage(updatedUserData);
          setAuthenticatedUser(updatedUserData);

          setShowSuccessModal(true);
          toast.success("Brand setup completed successfully!");
        } else {
          toast.error("Failed to submit brand registration");
        }
        setIsLoading(false);
        setLoadingMessage("");
      });
    } catch (error) {
      console.error("Brand registration error:", error);
      toast.error("Failed to submit brand registration");
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  const handleExploreFeed = () => {
    navigate("/");
    // handleLogout();
  };

  const handleBackToHome = () => {
    navigate("/");
    // handleLogout();
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
                  loadingMessage={loadingMessage}
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
