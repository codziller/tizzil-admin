import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { TailSpin } from "react-loader-spinner";
import "froala-editor/css/froala_style.min.css";

import "froala-editor/css/froala_editor.pkgd.min.css";

// Load all plugins
import "froala-editor/js/plugins.pkgd.min.js";

// Require Editor CSS files.
import FroalaEditorComponent from "react-froala-wysiwyg";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { Link, useParams } from "react-router-dom";
import {
  GENDERS,
  MEDIA_MODAL_TYPES,
  NAIRA,
  PRODUCT_MODAL_TYPES,
  ROLES,
  WALLET_ACTIONS,
} from "utils/appConstant";
import DetailsModal from "pages/Dashboard/Marketing/features/DetailsModal";
import { observer } from "mobx-react-lite";
import cleanPayload from "utils/cleanPayload";
import { isArray, isEmpty } from "lodash";
import DatePickerComponent from "components/General/DatePicker";
import moment from "moment";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import BlogStore from "../store";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import { numberWithCommas } from "utils/formatter";
import Select from "components/General/Input/Select";
import PhoneNumber from "components/General/PhoneNumber/PhoneNumber";
import usePasswordValidation from "hooks/usePasswordValidation";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import ImagePicker from "components/General/Input/ImagePicker";
import { errorToast } from "components/General/Toast/Toast";

const { PRODUCT_CATEGORY, PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const { BRAND } = MEDIA_MODAL_TYPES;
const { Credit, Debit } = WALLET_ACTIONS;
const REACT_APP_IMAGE_UPLOAD_URL = process.env.REACT_APP_IMAGE_UPLOAD_URL;

const Form = ({ details, toggler }) => {
  const { blog_id, warehouse_id } = useParams();

  const {
    editBlogWallet,
    blog,
    editBlogWalletLoading,
    editBlog,
    editBlogLoading,
    createBlog,
    createBlogLoading,
  } = BlogStore;
  const { warehouses, loading, getWarehouses } = WareHousesStore;
  const { getBrand, brand, getBrandLoading } = BrandsStore;

  const navigate = useNavigate();

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    formModified: false,
    modalType: "",
    createLoading: false,
  });
  const [body, setBody] = useState(blog_id ? blog?.post : "");

  const schema = yup.object({
    title: yup.string().required("Please enter title"),
    post: yup.string().required("Please enter blog post"),
    subHeader: yup.string().required("Please enter last name"),
    publishDate: yup.string().required("Please select date of birth"),
    authorsName: yup.string().required("Please enter authorsName"),
    bannerImageUrl: yup
      .mixed()
      .required("Please select a banner image for this blog post"),
    postImageUrl: yup
      .mixed()
      .required("Please select a banner image for this blog post"),
    categoryIds: yup
      .array()
      .min(1, "Please select at least one category for this blog post")
      .required("Please select at least one category for this blog post"),
  });

  const defaultValues = {
    post: blog_id ? blog?.post : "",
    publishDate: blog_id ? blog?.publishDate : "",
    authorsName: blog_id ? blog?.authorsName : "",
    title: blog_id ? blog?.title : "",
    subHeader: blog_id ? blog?.subHeader : "",
    bannerImageUrl: blog_id ? blog?.bannerImageUrl : [],
    postImageUrl: blog_id ? blog?.postImageUrl : [],
    categoryIds: blog_id ? blog?.categories : [],
    brandIds: blog_id ? blog?.brands : [],
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const form = {
    post: watch("post"),
    publishDate: watch("publishDate"),
    authorsName: watch("authorsName"),
    title: watch("title"),
    subHeader: watch("subHeader"),
    bannerImageUrl: watch("bannerImageUrl"),
    postImageUrl: watch("postImageUrl"),
    categoryIds: watch("categoryIds"),
    brandIds: watch("brandIds"),
  };

  const handleChange = async ({ prop, val, rest, isFormTwo }) => {
    isFormTwo
      ? setFormTwo({ ...formTwo, [prop]: val, formModified: true })
      : setFormTwo({ ...formTwo, formModified: true });
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };
  const handleRemoveItem = (prop, id) => {
    let prevData = form?.[prop];
    prevData = prevData?.filter((item) => item?.id !== id);
    handleChange({ prop, val: prevData });
  };

  const handleOnSubmit = async () => {
    try {
      setFormTwo({ ...formTwo, createLoading: true });
      const imagesUrls = await Promise.all([
        uploadImageToCloud(
          isArray(form?.bannerImageUrl)
            ? form?.bannerImageUrl?.[0]
            : form?.bannerImageUrl,
          true
        ),
        uploadImageToCloud(
          isArray(form?.postImageUrl)
            ? form?.postImageUrl?.[0]
            : form?.postImageUrl
        ),
      ]);

      let payload = {
        ...form,
        bannerImageUrl: imagesUrls?.[0],
        postImageUrl: imagesUrls?.[1],
        categoryIds: form?.categoryIds?.map((item) => item?.id || item),
        brandIds: form?.brandIds?.map((item) => item?.id || item),
        blogArticleId: blog_id,
      };

      cleanPayload(payload);

      if (blog_id) {
        editBlog({
          data: payload,
          onSuccess: () => navigate(`/dashboard/blog/${warehouse_id}`),
        });
      } else {
        createBlog({
          data: payload,
          onSuccess: () => navigate(`/dashboard/blog/${warehouse_id}`),
        });
      }
    } catch (error) {
      const errorMesage = new Error(error);

      errorToast(
        errorMesage.message,
        "Please check that the image size is not too large."
      );
    } finally {
      setFormTwo({ ...formTwo, createLoading: false });
    }
  };

  let config = {
    heightMin: 300,
    imageUploadURL: REACT_APP_IMAGE_UPLOAD_URL,
    events: {
      "image.upload": (file, editor, response) => {
        const url = file?.url;
        editor.image.insert(url, false, null, editor.image.get(), response);
      },
    },
  };
  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 ">
        {details?.link ? (
          <div className="mb-5">
            <Link to={`/dashboard/blog/${warehouse_id}`} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {!blog_id ? (
          <h2 className="section-heading my-8 text-xl">Upload New Blog Post</h2>
        ) : (
          <h2 className="section-heading my-8 text-xl  ">Edit Blog Post</h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-10 w-full "
        >
          <div className="flex flex-col md:flex-row justify-start items-start gap-10 w-full ">
            {/* First section */}

            <div className="flex flex-col md:basis-1/2 justify-start items-start gap-y-3 h-full">
              <Input
                label="Blog Title"
                value={form?.title}
                onChangeFunc={(val) => handleChange({ prop: "title", val })}
                placeholder="Enter blog title"
                formError={errors.title}
                showFormError={formTwo?.showFormError}
              />

              <Input
                label="Blog Sub-Header"
                value={form?.subHeader}
                onChangeFunc={(val) => handleChange({ prop: "subHeader", val })}
                placeholder="Enter blog sub-header"
                formError={errors.subHeader}
                showFormError={formTwo?.showFormError}
              />
            </div>

            {/* Second section */}
            <div className="flex flex-col md:basis-1/2 justify-start items-start gap-y-3 ">
              <Input
                label="Author"
                value={form?.authorsName}
                onChangeFunc={(val) =>
                  handleChange({ prop: "authorsName", val })
                }
                placeholder="Enter author's name"
                formError={errors.authorsName}
                showFormError={formTwo?.showFormError}
              />
              <DatePickerComponent
                label="Pulishing Date"
                placeholder="Select publishing date"
                name="publishDate"
                isRequired
                value={
                  moment(form?.publishDate).isValid()
                    ? moment(form?.publishDate)._d
                    : ""
                }
                minDate={
                  moment(form?.end_date).isValid()
                    ? moment(form?.end_date).subtract(0, "days")._d
                    : moment().subtract(1, "days")._d
                }
                dateFormat="dd MMMM yyyy"
                onChange={(value) =>
                  handleChange({
                    prop: "publishDate",
                    val: moment(value).format("YYYY-MM-DD"),
                  })
                }
                formError={errors.publishDate}
                showFormError={formTwo?.showFormError}
              />
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-1 w-full">
            <FroalaEditorComponent
              tag="textarea"
              config={config}
              onModelChange={(e) => {
                setBody(e);
                handleChange({ prop: "post", val: e });
              }}
              model={body}
            />
            <div className="h-[13px]">
              {errors?.post && <FormErrorMessage type={errors?.post} />}
            </div>
          </div>

          <ImagePicker
            label="Select post banner image "
            handleDrop={(val) => handleChange({ prop: "bannerImageUrl", val })}
            images={form.bannerImageUrl}
            multiple={false}
            dimension={{ width: "1100px", height: "600px" }}
            isBanner
            formError={errors.bannerImageUrl}
            showFormError={formTwo?.showFormError}
          />

          <div className="flex flex-col md:flex-row justify-start items-start gap-10 w-full ">
            <div className="flex flex-col md:basis-1/2 justify-start items-start gap-y-3 w-full h-full">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 justify-between items-start gap-6">
                {/* Brands */}
                <div className="flex flex-col justify-start items-end gap-1 w-full">
                  <div
                    className="shadow-card min-h-[140px] max-h-[140px] p-5 flex flex-col justify-center items-center gap-3 cursor-pointer w-full"
                    onClick={() => handleChangeTwo("modalType", BRAND)}
                  >
                    <AddIcon />
                    <span className="text-base">Select Brands</span>

                    {!isEmpty(form.brandIds) ? (
                      <div className="flex flex-wrap justify-start items-start gap-2 text-xs text-grey-text">
                        {form.brandIds?.length}{" "}
                        {form.brandIds?.length === 1 ? "brand" : "brands"}{" "}
                        selected
                      </div>
                    ) : null}
                  </div>
                  <div className="h-[13px]">
                    {errors?.brandIds && (
                      <FormErrorMessage type={errors?.brandIds} />
                    )}
                  </div>

                  {!isEmpty(form?.brandIds) ? (
                    <div className="w-full flex flex-wrap gap-3 mb-3">
                      {form?.brandIds?.map((item) => {
                        return (
                          <div
                            className="flex justify-center items-center bg-red-light2 px-2 py-1 gap-2 text-sm"
                            key={item?.id}
                          >
                            <span>{item?.brandName}</span>
                            <span
                              onClick={() =>
                                handleRemoveItem("brandIds", item?.id)
                              }
                              className="flex justify-center items-center cursor-pointer rounded-full hover:bg-red-light4 transition-colors ease-in-out duration-300"
                            >
                              <Close className="scale-[0.5]" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col md:basis-1/2 justify-start items-start gap-y-3 h-full">
                  {/* Categories */}
                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    <div
                      className="shadow-card min-h-[140px] max-h-[140px] p-5 flex flex-col justify-center items-center gap-3 cursor-pointer w-full"
                      onClick={() =>
                        handleChangeTwo("modalType", PRODUCT_CATEGORY_OPTIONS)
                      }
                    >
                      <AddIcon />
                      <span className="text-base">Select Categories</span>

                      {!isEmpty(form.categoryIds) ? (
                        <div className="flex flex-wrap justify-start items-start gap-2 text-xs text-grey-text">
                          {form.categoryIds?.length}{" "}
                          {form.categoryIds?.length === 1
                            ? "category"
                            : "categories"}{" "}
                          selected
                        </div>
                      ) : null}
                    </div>
                    <div className="h-[13px]">
                      {errors?.categoryIds && (
                        <FormErrorMessage type={errors?.categoryIds} />
                      )}
                    </div>

                    {!isEmpty(form?.categoryIds) ? (
                      <div className="w-full flex flex-wrap gap-3 mb-3">
                        {form?.categoryIds?.map((item) => {
                          return (
                            <div
                              className="flex justify-center items-center bg-red-light2 px-2 py-1 gap-2 text-sm"
                              key={item?.id}
                            >
                              <span>{item?.name}</span>
                              <span
                                onClick={() =>
                                  handleRemoveItem("categoryIds", item?.id)
                                }
                                className="flex justify-center items-center cursor-pointer rounded-full hover:bg-red-light4 transition-colors ease-in-out duration-300"
                              >
                                <Close className="scale-[0.5]" />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:basis-1/2 justify-start items-start gap-y-3 w-full h-full">
              <ImagePicker
                label="Select post image "
                handleDrop={(val) =>
                  handleChange({ prop: "postImageUrl", val })
                }
                images={form.postImageUrl}
                formError={errors.postImageUrl}
                showFormError={formTwo?.showFormError}
                multiple={false}
                dimension={{ width: "400px", height: "500px" }}
                isPost
              />
            </div>
          </div>

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            type="submit"
            text={!blog_id ? "Publish Blog" : "Save Changes"}
            isLoading={
              createBlogLoading || editBlogLoading || formTwo.createLoading
            }
            className="mt-10 mb-5 w-[300px]"
          />
        </form>
      </div>
      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{
          modalTitle: "Blog",
          modalType: PRODUCT_CATEGORY_OPTIONS,
          isObjectOnChange: true,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
        type="Post"
      />
      <DetailsModal
        active={formTwo?.modalType === BRAND}
        details={{
          isMultipleBrands: true,
          isObjectOnChange: true,
          prop: "brandIds",
          modalType: BRAND,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
    </>
  );
};

Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(Form);
