import axios from "axios";
import { errorToast } from "components/General/Toast/Toast";
import CryptoJS from "crypto-js";

const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY?.trim();
const CLOUDINARY_SECRET = process.env.REACT_APP_CLOUDINARY_SECRET?.trim();
const CLOUDINARY_CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUDNAME?.trim();

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUDNAME}/upload`;

/**
 * Generate signature for Cloudinary upload
 * @param {Object} params - Upload parameters
 * @returns {String} - Generated signature
 */
const generateSignature = (params) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return CryptoJS.SHA1(sortedParams + CLOUDINARY_SECRET).toString();
};

/**
 * Upload multiple images or files to Cloudinary.
 * @param {Array} files - The array of files to upload.
 * @returns {Promise<Array>} - Returns an array of uploaded image/file URLs.
 */
export const uploadImagesToCloud = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  // Validate required environment variables
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_SECRET || !CLOUDINARY_CLOUDNAME) {
    console.error("Cloudinary configuration missing");
    errorToast("Configuration Error", "Cloudinary configuration is incomplete");
    return [];
  }

  const imageUrls = [];
  const uploaders = files.map((file) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const uploadParams = {
      timestamp: timestamp,
    };

    // Generate signature for signed upload
    const signature = generateSignature(uploadParams);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    return axios
      .post(CLOUDINARY_URL, formData, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
      .then((response) => {
        imageUrls.push(response.data.secure_url);
      })
      .catch((error) => {
        console.error("Cloudinary upload error:", error);
        errorToast(
          "Error uploading file.",
          error?.response?.data?.error?.message || error?.message
        );
      });
  });

  await Promise.all(uploaders);

  return imageUrls;
};

/**
 * Upload a single image or file to Cloudinary.
 * @param {File} file - The file to upload.
 * @param {Boolean} compress - If true, enables compression (optional).
 * @returns {Promise<String>} - Returns the uploaded image/file URL.
 */
export const uploadImageToCloud = async (file, compress = false) => {
  if (!file) return null;

  // Validate required environment variables
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_SECRET || !CLOUDINARY_CLOUDNAME) {
    console.error("Cloudinary configuration missing:", {
      api_key: !!CLOUDINARY_API_KEY,
      secret: !!CLOUDINARY_SECRET,
      cloudname: !!CLOUDINARY_CLOUDNAME
    });
    errorToast("Configuration Error", "Cloudinary configuration is incomplete");
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // For signed uploads, we'll use minimal parameters to avoid signature issues
  const uploadParams = {
    timestamp: timestamp,
  };

  // Generate signature for signed upload
  const signature = generateSignature(uploadParams);

  // Build form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    errorToast(
      "Error uploading file.",
      error?.response?.data?.error?.message || error?.message
    );
    return null;
  }
};
