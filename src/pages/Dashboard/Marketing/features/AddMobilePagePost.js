import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { TailSpin } from "react-loader-spinner";
import Button from "components/General/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import ImagePicker from "components/General/Input/ImagePicker";
import CheckBox from "components/General/Input/CheckBox";
import {
  MEDIA_MODAL_TYPES,
  PRODUCT_MODAL_TYPES,
  SLIDE_LINK_TYPES,
} from "utils/appConstant";
import { isArray, isEmpty, lowerCase } from "lodash";
import BrandsStore from "pages/Dashboard/Brands/store";
import ProductsStore from "pages/Dashboard/Products/store";
import CategoriesStore from "pages/Dashboard/Categories/store";
import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import cleanPayload from "utils/cleanPayload";
import { flattenCategories } from "utils/functions";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { errorToast } from "components/General/Toast/Toast";

const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;
const { PRODUCT_CATEGORY, PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const Form = observer(() => {
  const { warehouse_id, media_id, position } = useParams();
  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  const schema = yup.object({});

  const { getBrand, brand, getBrandLoading } = BrandsStore;
  const { getProductName, product, getProductLoading } = ProductsStore;

  const {
    createMobilePagePost,
    editMobilePagePost,
    mobilePagePost,
    loadingMobilePagePost,
  } = MarketingStore;

  const defaultValues = {
    dataId: media_id ? mobilePagePost?.dataId : "",
    imageUrl: media_id ? mobilePagePost?.imageUrl : [],
    pageToLinkTo: media_id
      ? mobilePagePost?.pageToLinkTo
      : SLIDE_LINK_TYPES[0]?.value,
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

  const handleChange = async ({ prop, val }) => {
    // if (prop === "pageToLinkTo") {
    //   handleChange("dataId", "");
    // }
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    dataId: watch("dataId"),
    imageUrl: watch("imageUrl"),
    pageToLinkTo: watch("pageToLinkTo"),
  };

  useEffect(() => {
    if (!form.dataId) {
      return;
    }
    if (form.pageToLinkTo === BRAND) {
      getBrand({ data: { id: form?.dataId } });
    } else if (form.pageToLinkTo === PRODUCT) {
      getProductName({ data: { id: form?.dataId } });
    }
  }, [form.dataId, form.pageToLinkTo]);

  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.imageUrl) ? form?.imageUrl?.[0] : form?.imageUrl,
        true
      );

      if (!media_id) {
        const payload = {
          ...form,
          position,
          imageUrl: imagesUrls,
          dataId: form?.pageToLinkTo === "NONE" ? "NONE" : form.dataId,
        };

        cleanPayload(payload);

        await createMobilePagePost({
          data: payload,
          onSuccess: () => navigate(-1),
        });
      } else {
        const payload = {
          ...form,
          position,
          mobilePagePostId: media_id,
          imageUrl: imagesUrls,
        };

        cleanPayload(payload);

        await editMobilePagePost({
          data: payload,
          onSuccess: () => navigate(-1),
        });
      }
    } catch (error) {
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };

  return loadingMobilePagePost ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="h-full md:pr-4 pt-1">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
              <div className="mb-5 w-full flex justify-between gap-3">
                <button onClick={() => navigate(-1)} className="scale-90">
                  <ArrowBack />
                </button>

                {media_id ? (
                  <Button
                    onClick={() => handleChangeTwo("modalType", "delete")}
                    text="Delete Mobile Page Slider"
                    redBg
                  />
                ) : null}
              </div>
              {media_id ? (
                <h2 className="section-heading my-8 text-xl">
                  Edit Mobile Page Slider ({position})
                </h2>
              ) : (
                <h2 className="section-heading mb-3 text-xl">
                  Add Mobile Page Slider ({position})
                </h2>
              )}

              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <label
                    className={
                      "general-input-label relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1 cursor-pointer"
                    }
                  >
                    Slide type
                  </label>

                  <span className="text-grey-text text-sm mb-3 -mt-2">
                    Select the page type to be linked with this post
                  </span>
                  {SLIDE_LINK_TYPES.map((item) => (
                    <CheckBox
                      key={item.value}
                      label={item.name}
                      onChange={() =>
                        handleChange({ prop: "pageToLinkTo", val: item.value })
                      }
                      checked={form?.pageToLinkTo === item.value}
                    />
                  ))}

                  {form.pageToLinkTo && (
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <label
                        className={
                          "general-input-label relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1 cursor-pointer"
                        }
                      >
                        Select the {lowerCase(form?.pageToLinkTo)} to be linked
                        with this post
                      </label>

                      <div className="flex flex-col justify-start items-end gap-1 w-full">
                        {!isEmpty(form?.dataId) && (
                          <p>
                            {getBrandLoading || getProductLoading ? (
                              <TailSpin
                                height="25"
                                width="25"
                                color="#000000"
                                ariaLabel="tail-spin-loading"
                                radius="3"
                                visible={true}
                              />
                            ) : form.pageToLinkTo === BRAND ? (
                              brand?.brandName
                            ) : (
                              product?.name
                            )}
                          </p>
                        )}

                        <Button
                          onClick={() =>
                            handleChangeTwo("modalType", form?.pageToLinkTo)
                          }
                          text={`Select ${lowerCase(form?.pageToLinkTo)}`}
                          className=""
                          whiteBg
                          fullWidth
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <span className="text-grey-text text-lg uppercase">
                      Post Image
                    </span>
                    <span className="text-grey-text text-sm">
                      Select Post Image
                    </span>
                  </div>

                  <ImagePicker
                    label="Select Image "
                    handleDrop={(val) =>
                      handleChange({ prop: "imageUrl", val })
                    }
                    images={form.imageUrl}
                    multiple={false}
                    dimension={{ width: "375px", height: "438px" }}
                    isBanner
                  />

                  <Button
                    onClick={() =>
                      setFormTwo({ ...formTwo, showFormError: true })
                    }
                    isLoading={formTwo.createLoading}
                    type="submit"
                    text={media_id ? "Save Changes" : "Add"}
                    className="mt-8 mb-5"
                    fullWidth
                  />
                </div>
                {/* Third section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DetailsModal
        active={formTwo?.modalType === BRAND}
        details={{ prop: "dataId", modalType: BRAND }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT}
        details={{ prop: "dataId", modalType: PRODUCT }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{ modalType: PRODUCT_CATEGORY_OPTIONS }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
        type="Post"
      />
      <CategoryDetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY}
        details={{ modalType: "add", isAdd: true }}
        toggler={() => handleChangeTwo("modalType", false)}
      />

      <DetailsModal
        active={formTwo?.modalType === "delete"}
        details={{
          pageType: "Mobile Page Slider",
          modalType: "delete",
          id: media_id,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
      />
    </>
  );
});

const AddMobilePagePost = () => {
  const { media_id } = useParams();
  const { loadingMobilePagePost, getMobilePagePost } = MarketingStore;

  useEffect(() => {
    media_id && getMobilePagePost({ data: { id: media_id } });
  }, []);
  return loadingMobilePagePost ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddMobilePagePost);
