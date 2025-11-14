import { makeObservable, observable, action, runInAction } from "mobx";
import { toast } from "react-toastify";
import authService from "services/auth";

class AuthSignUpStore {
  constructor() {
    makeObservable(this, {
      loading: observable,
      signupData: observable,
      setLoading: action,
      setSignupData: action,
      signup: action,
      sendVerificationMail: action,
      authBrandRegistration: action,
    });
  }

  loading = false;
  signupData = null;

  setLoading = (loading) => {
    this.loading = loading;
  };

  setSignupData = (data) => {
    this.signupData = data;
  };

  sendVerificationMail = async (data, callback) => {
    try {
      this.setLoading(true);

      const response = await authService.authSendVerificationMail(data);

      // Demo mode - simulate successful verification email send
      // setTimeout(() => {
      //   const demoResponse = {
      //     authSendVerificationMail: {
      //       status: true,
      //     },
      //   };

      //   if (demoResponse?.authSendVerificationMail?.status) {
      //     toast.success("Verification email sent successfully! (Demo Mode)");
      //     callback && callback(true);
      //   } else {
      //     toast.error("Failed to send verification email");
      //     callback && callback(false);
      //   }

      //   runInAction(() => {
      //     this.setLoading(false);
      //   });
      // }, 1000); // Simulate network delay

      if (response?.authSendVerificationMail?.status) {
        toast.success("Verification email sent successfully!");
        callback && callback(true);
      } else {
        toast.error("Failed to send verification email");
        callback && callback(false);
      }

      runInAction(() => {
        this.setLoading(false);
      });
    } catch (error) {
      console.error("Send verification mail error:", error);
      toast.error("Failed to send verification email");
      callback && callback(false);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  signup = async (data, callback) => {
    try {
      this.setLoading(true);

      const response = await authService.authSignup(data);

      // Demo mode - simulate successful account creation
      // setTimeout(() => {
      //   // Check if email is the special fullbrand email
      //   const isFullBrandUser = data.email === "fullbrand@gmail.com";

      //   const demoResponse = {
      //     authSignup: {
      //       access_token: "demo_signup_access_token_12345",
      //       refresh_token: "demo_signup_refresh_token_67890",
      //       user: {
      //         id: "demo-signup-user-id-123",
      //         firstName: data.firstName || "Demo",
      //         lastName: data.lastName || "User",
      //         email: data.email || "demo@tizzil.com",
      //         userRole: {
      //           name: "BRAND_ADMIN",
      //           id: "role-123",
      //         },
      //       },
      //       // For fullbrand@gmail.com, include complete brand setup
      //       // For other emails, exclude brand/brandUser to trigger account setup flow
      //       brand: isFullBrandUser
      //         ? {
      //             id: "demo-signup-brand-id-456",
      //             brandName: `${data.firstName || "Demo"}'s Brand Store`,
      //             brandEmail: data.email || "demo@tizzil.com",
      //             logoUrl:
      //               "https://via.placeholder.com/100/690007/FFFFFF?text=DB",
      //           }
      //         : null,
      //       brandUser: isFullBrandUser
      //         ? {
      //             brandId: "demo-signup-brand-id-456",
      //             createdAt: new Date().toISOString(),
      //             id: "demo-signup-brand-user-789",
      //             invitedAt: new Date().toISOString(),
      //             isActive: true,
      //             joinedAt: new Date().toISOString(),
      //             role: "OWNER",
      //             updatedAt: new Date().toISOString(),
      //             userId: "demo-signup-user-id-123",
      //           }
      //         : null,
      //     },
      //   };

      //   if (demoResponse?.authSignup) {
      //     toast.success("Account created successfully! (Demo Mode)");
      //     callback && callback(demoResponse.authSignup);
      //   } else {
      //     toast.error("Failed to create account");
      //     callback && callback(null);
      //   }

      //   runInAction(() => {
      //     this.setLoading(false);
      //   });
      // }, 1500); // Simulate network delay

      if (response?.authSignup) {
        toast.success("Account created successfully!");
        callback && callback(response.authSignup);
      } else {
        toast.error("Failed to create account");
        callback && callback(null);
      }

      runInAction(() => {
        this.setLoading(false);
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account");
      callback && callback(null);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  authBrandRegistration = async (registrationData, callback) => {
    try {
      this.setLoading(true);

      const response = await authService.authBrandRegistration({
        registrationData,
      });

      if (response?.authBrandRegistration?.status) {
        toast.success("Brand registration completed successfully!");
        // Return the full response with user and brand data
        callback && callback(response.authBrandRegistration);
      } else {
        toast.error("Failed to complete brand registration");
        callback && callback(null);
      }

      runInAction(() => {
        this.setLoading(false);
      });
    } catch (error) {
      console.error("Brand registration error:", error);
      toast.error("Failed to complete brand registration");
      callback && callback(null);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };
}

export default new AuthSignUpStore();
