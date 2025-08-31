/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import apis from "services/blog";
import userApis from "services/users";

class BlogsStore {
  // ====================================================
  // State
  // ====================================================
  blogs = [];
  blogsArchived = [];
  searchResult = [];
  blog = null;
  blogsCount = 0;
  blogsArchivedCount = 0;
  searchResultCount = 0;
  error = null;
  loading = false;
  loadingArchived = false;
  searchBlogLoading = false;
  createBlogLoading = false;
  editBlogLoading = false;
  editBlogWalletLoading = false;
  getBlogLoading = false;
  deleteBlogLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getBlogs = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getBlogs(data);
      res = res?.blogArticles_by_page_number;
      this.blogs = res?.results || [];
      this.blogsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getArchivedBlogs = async ({ data }) => {
    this.loadingArchived = true;
    try {
      let res = await apis.getArchivedBlogs(data);
      res = res?.blogArticles_archived_by_page_number;
      this.blogsArchived = res?.results || [];
      this.blogsArchivedCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingArchived = false;
    }
  };

  searchBlogs = async ({ data }) => {
    this.searchBlogLoading = true;
    try {
      let res = await apis.searchBlogs(data);
      res = res?.blogArticles_search_by_page_number;
      this.searchResult = res?.results || [];
      this.searchResultCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.searchBlogLoading = false;
    }
  };

  getBlog = async ({ data }) => {
    this.getBlogLoading = true;
    try {
      let res = await apis.getBlog(data);
      res = res?.blogArticle;
      this.blog = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getBlogLoading = false;
    }
  };

  createBlog = async ({ data, onSuccess, page, currentData }) => {
    this.createBlogLoading = true;
    try {
      await apis.createBlog(data);
      successToast("Operation Successful!", "Blog created Successfully.");
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.createBlogLoading = false;
    }
  };

  editBlog = async ({ data, onSuccess, page, currentData }) => {
    this.editBlogLoading = true;
    try {
      await apis.editBlog(data);
      successToast("Operation Successful!", "Blog updated Successfully.");
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editBlogLoading = false;
    }
  };

  editBlogWallet = async ({ data, onSuccess, page }) => {
    this.editBlogWalletLoading = true;
    try {
      await apis.editBlogWallet(data);
      successToast(
        "Operation Successful!",
        "Blog wallet updated Successfully."
      );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editBlogWalletLoading = false;
    }
  };

  deleteBlog = async ({ data, onSuccess, page, currentData }) => {
    this.deleteBlogLoading = true;
    try {
      await apis.deleteBlog(data);
      successToast("Operation Successful!", "Blog archived Successfully.");
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteBlogLoading = false;
    }
  };
}

export default new BlogsStore();
