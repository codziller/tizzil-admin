/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import apis from "services/marketing";

class MarketingStore {
  // ====================================================
  // State
  // ====================================================
  images = [];
  image = null;
  imagesCount = null;
  loadingImages = false;
  loadingImage = false;
  createImageLoading = false;
  editImageLoading = false;

  marketingText = null;
  loadingMarketingText = false;
  editMarketingTextLoading = false;

  webMarketingImages = [];
  webMarketingImage = null;
  webMarketingImagesCount = null;
  loadingWebMarketingImages = false;
  loadingWebMarketingImage = false;
  createWebMarketingImageLoading = false;
  editWebMarketingImageLoading = false;
  deleteWebMarketingImageLoading = false;

  mobileBrandsOfTheMoments = [];
  mobileBrandsOfTheMoment = null;
  mobileBrandsOfTheMomentsCount = null;
  loadingMobileBrandsOfTheMoments = false;
  loadingMobileBrandsOfTheMoment = false;
  createMobileBrandsOfTheMomentLoading = false;
  editMobileBrandsOfTheMomentLoading = false;

  mobileMarketingImages = [];
  mobileMarketingImage = null;
  mobileMarketingImagesCount = null;
  loadingMobileMarketingImages = false;
  loadingMobileMarketingImage = false;
  createMobileMarketingImageLoading = false;
  editMobileMarketingImageLoading = false;
  deleteMobileMarketingImageLoading = false;

  mobileHeaderNavDiscountBanners = [];
  mobileHeaderNavDiscountBanner = null;
  mobileHeaderNavDiscountBannersCount = null;
  loadingMobileHeaderNavDiscountBanners = false;
  loadingMobileHeaderNavDiscountBanner = false;
  createMobileHeaderNavDiscountBannerLoading = false;
  editMobileHeaderNavDiscountBannerLoading = false;
  deleteMobileHeaderNavDiscountBannerLoading = false;

  webLinkMarketingImages = [];
  webLinkMarketingImage = null;
  webLinkMarketingImagesCount = null;
  loadingWebLinkMarketingImages = false;
  loadingWebLinkMarketingImage = false;
  createWebLinkMarketingImageLoading = false;
  editWebLinkMarketingImageLoading = false;

  promoBanners = [];
  promoBanner = null;
  promoBannersCount = null;
  loadingPromoBanners = false;
  loadingPromoBanner = false;
  createPromoBannerLoading = false;
  editPromoBannerLoading = false;

  discounts = [];
  discountsArchived = [];
  discount = null;
  discountsCount = null;
  loadingDiscounts = false;
  discountsArchivedCount = 0;
  loadingDiscount = false;
  loadingArchivedDiscounts = false;
  createDiscountLoading = false;
  editDiscountLoading = false;
  deleteDiscountLoading = false;
  unarchiveDiscountLoading = false;

  homeSliderImages = [];
  homeSliderImage = null;
  homeSliderImagesCount = null;
  loadingHomeSliderImages = false;
  loadingHomeSliderImage = false;
  createHomeSliderImageLoading = false;
  editHomeSliderImageLoading = false;
  deleteHomeSliderImageLoading = false;

  mobilePagePosts = [];
  mobilePagePost = null;
  mobilePagePostsCount = null;
  loadingMobilePagePosts = false;
  loadingMobilePagePost = false;
  createMobilePagePostLoading = false;
  editMobilePagePostLoading = false;
  deleteMobilePagePostLoading = false;

  discountProducts = [];
  discountProductsCount = null;
  loadingDiscountProducts = false;

  discountBrands = [];
  discountBrandsCount = null;
  loadingDiscountBrands = false;

  discountCategories = [];
  discountCategoriesCount = null;
  loadingDiscountCategories = false;

  topshipCountries = [];
  loadingTopshipCountries = false;

  topshipStates = [];
  loadingTopshipStates = false;

  discountStat = [];
  loadingDiscountStat = false;

  error = null;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getDiscountStat = async ({ data }) => {
    this.loadingDiscountStat = true;
    try {
      let res = await apis.getDiscountStat(data);
      res = res?.get_number_of_orders_and_total_amount_saved_by_discount_code;
      this.discountStat = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingDiscountStat = false;
    }
  };
  getTopshipCountries = async () => {
    this.loadingTopshipCountries = true;
    try {
      let res = await apis.getTopshipCountries();
      res = res?.topshipCountries;
      this.topshipCountries =
        res?.map((item) => {
          return { ...item, label: item?.name, value: item?.code };
        }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingTopshipCountries = false;
    }
  };

  getTopshipStates = async ({ data }) => {
    this.loadingTopshipStates = true;
    try {
      let res = await apis.getTopshipStates(data);
      res = res?.topshipStates_by_country_code;
      this.topshipStates =
        res?.map((item) => {
          return { ...item, label: item?.name, value: item?.id };
        }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingTopshipStates = false;
    }
  };
  getImages = async ({ data }) => {
    this.loadingImages = true;
    try {
      let res = await apis.getImages(data);
      res = res?.images;
      this.images =
        res?.results?.sort((a, b) => a?.name.localeCompare(b?.name)) || [];
      this.imagesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingImages = false;
    }
  };

  getImage = async ({ data }) => {
    this.loadingImage = true;
    try {
      let res = await apis.getImage(data);
      res = res?.image;
      this.image = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingImage = false;
    }
  };

  getMarketingText = async () => {
    this.loadingMarketingText = true;
    try {
      let res = await apis.getMarketingText();
      res = res?.marketingText;
      this.marketingText = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMarketingText = false;
    }
  };

  getWebMarketingImages = async ({ data }) => {
    this.loadingWebMarketingImages = true;
    try {
      let res = await apis.getWebMarketingImages(data);
      res = res?.webMarketingImages;
      this.webMarketingImages = res?.results || [];
      this.webMarketingImagesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingWebMarketingImages = false;
    }
  };

  getWebMarketingImage = async ({ data }) => {
    this.loadingWebMarketingImage = true;
    try {
      let res = await apis.getWebMarketingImage(data);
      res = res?.webMarketingImage;
      this.webMarketingImage = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingWebMarketingImage = false;
    }
  };

  getMobileBrandsOfTheMoments = async ({ data }) => {
    this.loadingMobileBrandsOfTheMoments = true;
    try {
      let res = await apis.getMobileBrandsOfTheMoments(data);
      res = res?.mobileBrandsOfTheMoments;
      this.mobileBrandsOfTheMoments = res?.results || [];
      this.mobileBrandsOfTheMomentsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobileBrandsOfTheMoments = false;
    }
  };

  getMobileBrandsOfTheMoment = async ({ data }) => {
    this.loadingMobileBrandsOfTheMoment = true;
    try {
      let res = await apis.getMobileBrandsOfTheMoment(data);
      res = res?.mobileBrandsOfTheMoment;
      this.mobileBrandsOfTheMoment = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobileBrandsOfTheMoment = false;
    }
  };

  getMobileMarketingImages = async ({ data }) => {
    this.loadingMobileMarketingImages = true;
    try {
      let res = await apis.getMobileMarketingImages(data);
      res = res?.mobileMarketingImages;
      this.mobileMarketingImages = res?.results || [];
      this.mobileMarketingImagesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobileMarketingImages = false;
    }
  };

  getMobileMarketingImage = async ({ data }) => {
    this.loadingMobileMarketingImage = true;
    try {
      let res = await apis.getMobileMarketingImage(data);
      res = res?.mobileMarketingImage;
      this.mobileMarketingImage = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobileMarketingImage = false;
    }
  };

  getMobileHeaderNavDiscountBanners = async ({ data }) => {
    this.loadingMobileHeaderNavDiscountBanners = true;
    try {
      let res = await apis.getMobileHeaderNavDiscountBanners(data);
      res = res?.mobileHeaderNavDiscountBanners;
      this.mobileHeaderNavDiscountBanners = res?.results || [];
      this.mobileHeaderNavDiscountBannersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobileHeaderNavDiscountBanners = false;
    }
  };

  getMobileHeaderNavDiscountBanner = async ({ data }) => {
    this.loadingMobileHeaderNavDiscountBanner = true;
    try {
      let res = await apis.getMobileHeaderNavDiscountBanner(data);
      res = res?.mobileHeaderNavDiscountBanner;
      this.mobileHeaderNavDiscountBanner = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobileHeaderNavDiscountBanner = false;
    }
  };

  getWebLinkMarketingImages = async ({ data }) => {
    this.loadingWebLinkMarketingImages = true;
    try {
      let res = await apis.getWebLinkMarketingImages(data);
      res = res?.webLinkMarketingImages;
      this.webLinkMarketingImages = res?.results || [];
      this.webLinkMarketingImagesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingWebLinkMarketingImages = false;
    }
  };

  getWebLinkMarketingImage = async ({ data }) => {
    this.loadingWebLinkMarketingImage = true;
    try {
      let res = await apis.getWebLinkMarketingImage(data);
      res = res?.webLinkMarketingImage;
      this.webLinkMarketingImage = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingWebLinkMarketingImage = false;
    }
  };

  getPromoBanners = async ({ data }) => {
    this.loadingPromoBanners = true;
    try {
      let res = await apis.getPromoBanners(data);
      res = res?.promoBanners;
      this.promoBanners = res || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingPromoBanners = false;
    }
  };

  getPromoBanner = async ({ data }) => {
    this.loadingPromoBanner = true;
    try {
      let res = await apis.getPromoBanner(data);
      res = res?.promoBanner;
      this.promoBanner = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingPromoBanner = false;
    }
  };

  getDiscounts = async ({ data }) => {
    this.loadingDiscounts = true;
    try {
      let res = await apis.getDiscounts(data);
      res = res?.discounts;
      this.discounts = res?.results || [];
      this.discountsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingDiscounts = false;
    }
  };

  getArchivedDiscounts = async ({ data }) => {
    this.loadingArchivedDiscounts = true;
    try {
      let res = await apis.getArchivedDiscounts(data);
      res = res?.archived_discounts;
      this.discountsArchived = res?.results || [];
      this.discountsArchivedCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingArchivedDiscounts = false;
    }
  };

  getDiscount = async ({ data }) => {
    this.loadingDiscount = true;
    try {
      let res = await apis.getDiscount(data);
      res = res?.discount;
      this.discount = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingDiscount = false;
    }
  };

  getHomeSliderImages = async ({ data }) => {
    this.loadingHomeSliderImages = true;
    try {
      let res = await apis.getHomeSliderImages(data);
      res = res?.homeSliderHomeSliderImages;
      this.homeSliderImages =
        res?.results?.sort(
          (a, b) => Number(a?.position) - Number(b?.position)
        ) || [];
      this.homeSliderImagesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingHomeSliderImages = false;
    }
  };

  getHomeSliderImage = async ({ data }) => {
    this.loadingHomeSliderImage = true;
    try {
      let res = await apis.getHomeSliderImage(data);
      res = res?.homeSliderHomeSliderImage;
      this.homeSliderImage = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingHomeSliderImage = false;
    }
  };

  getMobilePagePosts = async ({ data }) => {
    this.loadingMobilePagePosts = true;
    try {
      let res = await apis.getMobilePagePosts(data);
      res = res?.homeSliderMobilePagePosts;
      this.mobilePagePosts =
        res?.results?.sort(
          (a, b) => Number(a?.position) - Number(b?.position)
        ) || [];
      this.mobilePagePostsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobilePagePosts = false;
    }
  };

  getMobilePagePost = async ({ data }) => {
    this.loadingMobilePagePost = true;
    try {
      let res = await apis.getMobilePagePost(data);
      res = res?.homeSliderMobilePagePost;
      this.mobilePagePost = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobilePagePost = false;
    }
  };

  getDiscountProducts = async ({ data }) => {
    this.loadingDiscountProducts = true;
    try {
      let res = await apis.getDiscountProducts(data);
      res = res?.products_by_discount_id;
      this.discountProducts = res?.products || [];
      this.discountProductsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingDiscountProducts = false;
    }
  };

  getDiscountBrands = async ({ data }) => {
    this.loadingDiscountBrands = true;
    try {
      let res = await apis.getDiscountBrands(data);
      res = res?.brands_by_discount_id;
      this.discountBrands = res?.brands || [];
      this.discountBrandsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingDiscountBrands = false;
    }
  };

  getDiscountCategories = async ({ data }) => {
    this.loadingDiscountCategories = true;
    try {
      let res = await apis.getDiscountCategories(data);
      res = res?.categories_by_discount_id;
      this.discountCategories = res?.categories || [];
      this.discountCategoriesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingDiscountCategories = false;
    }
  };

  createImage = async ({ data, onSuccess, page }) => {
    this.createImageLoading = true;
    try {
      await apis.createImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Post created Successfully."
      );
      onSuccess?.();
      await this.getImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createImageLoading = false;
    }
  };

  editImage = async ({ data, onSuccess, page }) => {
    this.editImageLoading = true;
    try {
      await apis.editImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Post updated Successfully."
      );
      onSuccess?.();
      await this.getImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editImageLoading = false;
    }
  };

  editMarketingText = async ({ data, onSuccess }) => {
    this.editMarketingTextLoading = true;
    try {
      await apis.editMarketingText(data);
      successToast(
        "Operation Successful!",
        "Marketing text content updated successfully."
      );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editMarketingTextLoading = false;
    }
  };

  createPromoBanner = async ({ data, onSuccess, page }) => {
    this.createPromoBannerLoading = true;
    try {
      await apis.createPromoBanner(data);
      successToast("Operation Successful!", "Banner created Successfully.");
      onSuccess?.();
      await this.getPromoBanners({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createPromoBannerLoading = false;
    }
  };

  editPromoBanner = async ({ data, onSuccess, page }) => {
    this.editPromoBannerLoading = true;
    try {
      await apis.editPromoBanner(data);
      successToast("Operation Successful!", "Banner updated Successfully.");
      onSuccess?.();
      await this.getPromoBanners({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editPromoBannerLoading = false;
    }
  };

  createWebMarketingImage = async ({ data, onSuccess, page }) => {
    this.createWebMarketingImageLoading = true;
    try {
      await apis.createWebMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Web Marketing Image Created Successfully."
      );
      onSuccess?.();
      await this.getWebMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createWebMarketingImageLoading = false;
    }
  };

  editWebMarketingImage = async ({ data, onSuccess, page }) => {
    this.editWebMarketingImageLoading = true;
    try {
      await apis.editWebMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Web Marketing Image Updated Successfully."
      );
      onSuccess?.();
      await this.getWebMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editWebMarketingImageLoading = false;
    }
  };

  createMobileBrandsOfTheMoment = async ({ data, onSuccess, page }) => {
    this.createMobileBrandsOfTheMomentLoading = true;
    try {
      await apis.createMobileBrandsOfTheMoment(data);
      successToast(
        "Operation Successful!",
        "Mobile Brand Of the Moment Created Successfully."
      );
      onSuccess?.();
      await this.getMobileBrandsOfTheMoments({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createMobileBrandsOfTheMomentLoading = false;
    }
  };

  editMobileBrandsOfTheMoment = async ({ data, onSuccess, page }) => {
    this.editMobileBrandsOfTheMomentLoading = true;
    try {
      await apis.editMobileBrandsOfTheMoment(data);
      successToast(
        "Operation Successful!",
        "Mobile Brand Of the Moment Updated Successfully."
      );
      onSuccess?.();
      await this.getMobileBrandsOfTheMoments({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editMobileBrandsOfTheMomentLoading = false;
    }
  };

  createMobileMarketingImage = async ({ data, onSuccess, page }) => {
    this.createMobileMarketingImageLoading = true;
    try {
      await apis.createMobileMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Mobile Marketing Image Created Successfully."
      );
      onSuccess?.();
      await this.getMobileMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createMobileMarketingImageLoading = false;
    }
  };

  editMobileMarketingImage = async ({ data, onSuccess, page }) => {
    this.editMobileMarketingImageLoading = true;
    try {
      await apis.editMobileMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Mobile Marketing Image Updated Successfully."
      );
      onSuccess?.();
      await this.getMobileMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editMobileMarketingImageLoading = false;
    }
  };

  createMobileHeaderNavDiscountBanner = async ({ data, onSuccess, page }) => {
    this.createMobileHeaderNavDiscountBannerLoading = true;
    try {
      await apis.createMobileHeaderNavDiscountBanner(data);
      successToast(
        "Operation Successful!",
        "Mobile Discount Banner Created Successfully."
      );
      onSuccess?.();
      await this.getMobileHeaderNavDiscountBanners({
        data: { page: page || 1 },
      });
    } catch (error) {
      this.error = error;
    } finally {
      this.createMobileHeaderNavDiscountBannerLoading = false;
    }
  };

  editMobileHeaderNavDiscountBanner = async ({ data, onSuccess, page }) => {
    this.editMobileHeaderNavDiscountBannerLoading = true;
    try {
      await apis.editMobileHeaderNavDiscountBanner(data);
      successToast(
        "Operation Successful!",
        "Mobile Discount Banner Updated Successfully."
      );
      onSuccess?.();
      await this.getMobileHeaderNavDiscountBanners({
        data: { page: page || 1 },
      });
    } catch (error) {
      this.error = error;
    } finally {
      this.editMobileHeaderNavDiscountBannerLoading = false;
    }
  };

  createWebLinkMarketingImage = async ({ data, onSuccess, page }) => {
    this.createWebLinkMarketingImageLoading = true;
    try {
      await apis.createWebLinkMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Web Marketing Image Created Successfully."
      );
      onSuccess?.();
      await this.getWebLinkMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createWebLinkMarketingImageLoading = false;
    }
  };

  editWebLinkMarketingImage = async ({ data, onSuccess, page }) => {
    this.editWebLinkMarketingImageLoading = true;
    try {
      await apis.editWebLinkMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Web Marketing Image Updated Successfully."
      );
      onSuccess?.();
      await this.getWebLinkMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editWebLinkMarketingImageLoading = false;
    }
  };

  createDiscount = async ({ data, onSuccess, page }) => {
    this.createDiscountLoading = true;
    try {
      await apis.createDiscount(data);
      successToast("Operation Successful!", "Discount created Successfully.");
      onSuccess?.();
      await this.getDiscounts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createDiscountLoading = false;
    }
  };

  editDiscount = async ({ data, onSuccess, page }) => {
    this.editDiscountLoading = true;
    try {
      await apis.editDiscount(data);
      successToast("Operation Successful!", "Discount updated Successfully.");
      onSuccess?.();
      await this.getDiscounts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editDiscountLoading = false;
    }
  };

  unarchiveDiscount = async ({ data, onSuccess, page }) => {
    this.unarchiveDiscountLoading = true;
    try {
      await apis.unarchiveDiscount(data);
      successToast(
        "Operation Successful!",
        "Discount unarchived Successfully."
      );
      onSuccess?.();
      await this.getArchivedDiscounts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.unarchiveDiscountLoading = false;
    }
  };

  createHomeSliderImage = async ({ data, onSuccess, page }) => {
    this.createHomeSliderImageLoading = true;
    try {
      await apis.createHomeSliderImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Slider Image created Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createHomeSliderImageLoading = false;
    }
  };
  editHomeSliderImage = async ({ data, onSuccess, page }) => {
    this.editHomeSliderImageLoading = true;
    try {
      await apis.editHomeSliderImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Slider Image updated Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editHomeSliderImageLoading = false;
    }
  };

  createMobilePagePost = async ({ data, onSuccess, page }) => {
    this.createMobilePagePostLoading = true;
    try {
      await apis.createMobilePagePost(data);
      successToast(
        "Operation Successful!",
        "Mobile Page Slider created Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderMobilePagePosts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createMobilePagePostLoading = false;
    }
  };
  editMobilePagePost = async ({ data, onSuccess, page }) => {
    this.editMobilePagePostLoading = true;
    try {
      await apis.editMobilePagePost(data);
      successToast(
        "Operation Successful!",
        "Mobile Page Slider updated Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderMobilePagePosts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editMobilePagePostLoading = false;
    }
  };

  deleteDiscount = async ({ data, onSuccess, page }) => {
    this.deleteDiscountLoading = true;
    try {
      await apis.deleteDiscount(data);
      successToast("Operation Successful!", "Discount archived successfully.");
      onSuccess?.();
      await this.getDiscounts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteDiscountLoading = false;
    }
  };

  deleteHomeSliderImage = async ({ data, onSuccess, page }) => {
    this.deleteHomeSliderImageLoading = true;
    try {
      await apis.deleteHomeSliderImage(data);
      successToast(
        "Operation Successful!",
        "Slider image deleted successfully."
      );
      onSuccess?.();
      await this.getHomeSliderImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteHomeSliderImageLoading = false;
    }
  };

  deleteWebMarketingImage = async ({ data, onSuccess, page }) => {
    this.deleteWebMarketingImageLoading = true;
    try {
      await apis.deleteWebMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Web marketing image deleted successfully."
      );
      onSuccess?.();
      await this.getWebMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteWebMarketingImageLoading = false;
    }
  };

  deleteMobilePagePost = async ({ data, onSuccess, page }) => {
    this.deleteMobilePagePostLoading = true;
    try {
      await apis.deleteMobilePagePost(data);
      successToast(
        "Operation Successful!",
        "Mobile page slider deleted successfully."
      );
      onSuccess?.();
      await this.getMobilePagePosts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteMobilePagePostLoading = false;
    }
  };

  deleteMobileMarketingImage = async ({ data, onSuccess, page }) => {
    this.deleteMobileMarketingImageLoading = true;
    try {
      await apis.deleteMobileMarketingImage(data);
      successToast(
        "Operation Successful!",
        "Mobile marketing image deleted successfully."
      );
      onSuccess?.();
      await this.getMobileMarketingImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteMobileMarketingImageLoading = false;
    }
  };

  deleteMobileHeaderNavDiscountBanner = async ({ data, onSuccess, page }) => {
    this.deleteMobileHeaderNavDiscountBannerLoading = true;
    try {
      await apis.deleteMobileHeaderNavDiscountBanner(data);
      successToast(
        "Operation Successful!",
        "Mobile discount banner deleted successfully."
      );
      onSuccess?.();
      await this.getMobileHeaderNavDiscountBanners({
        data: { page: page || 1 },
      });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteMobileHeaderNavDiscountBannerLoading = false;
    }
  };
}

export default new MarketingStore();
