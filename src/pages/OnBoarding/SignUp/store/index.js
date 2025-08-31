import { makeObservable, observable, action, runInAction } from "mobx";
import { toast } from "react-toastify";
import authService from "services/auth";

class AuthSignUpStore {
  constructor() {
    makeObservable(this, {
      loading: observable,
      setLoading: action,
      signup: action,
      sendVerificationMail: action,
    });
  }

  loading = false;

  setLoading = (loading) => {
    this.loading = loading;
  };

  sendVerificationMail = async (data, callback) => {
    try {
      this.setLoading(true);
      
      // DEMO MODE: Comment out actual API call for demo purposes
      // const response = await authService.authSendVerificationMail(data);
      
      // Demo mode: Simulate successful verification email send
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      const response = {
        authSendVerificationMail: {
          status: true,
          message: "Verification email sent successfully (Demo Mode)"
        }
      };
      
      if (response?.authSendVerificationMail?.status) {
        toast.success("Verification email sent successfully! (Demo Mode)");
        callback && callback(true);
      } else {
        toast.error("Failed to send verification email");
        callback && callback(false);
      }
    } catch (error) {
      console.error("Send verification mail error:", error);
      toast.error(error?.response?.errors?.[0]?.message || "Failed to send verification email");
      callback && callback(false);
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  signup = async (data, callback) => {
    try {
      this.setLoading(true);
      
      // DEMO MODE: Comment out actual API call for demo purposes
      // const response = await authService.authSignup(data);
      
      // Demo mode: Simulate successful signup
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      const response = {
        authSignup: {
          access_token: 'demo_signup_token_123',
          user: {
            id: 1,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            userRole: { name: 'BRAND_USER' }
          },
          status: true
        }
      };
      
      if (response?.authSignup) {
        // Store demo user data
        localStorage.setItem('access_token', response.authSignup.access_token);
        localStorage.setItem('user', JSON.stringify(response.authSignup.user));
        
        toast.success("Account created successfully! (Demo Mode)");
        callback && callback(response.authSignup);
      } else {
        toast.error("Failed to create account");
        callback && callback(null);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.errors?.[0]?.message || "Failed to create account");
      callback && callback(null);
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };
}

export default new AuthSignUpStore();