import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import {
  MEDIA_MODAL_TYPES,
  PRODUCT_MODAL_TYPES,
  SLIDE_LINK_TYPES,
} from "utils/appConstant";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";
import ImagePicker from "components/General/Input/ImagePicker";
import CategoriesStore from "pages/Dashboard/Categories/store";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import BrandsStore from "pages/Dashboard/Brands/store";
import ProductsStore from "pages/Dashboard/Products/store";
import { isArray, isEmpty, lowerCase } from "lodash";
import { errorToast } from "components/General/Toast/Toast";
import CheckBox from "components/General/Input/CheckBox";
import { TailSpin } from "react-loader-spinner";
import cleanPayload from "utils/cleanPayload";
import Input from "components/General/Input/Input";
import Textarea from "components/General/Textarea/Textarea";

const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;

const Form = observer(() => {
  const { warehouse_id, media_id, position } = useParams();
  const { headerNavs, getHeaderNavs } = CategoriesStore;

  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  useEffect(() => {
    getHeaderNavs();
  }, []);

  const schema = yup.object({});

  const { getBrand, brand, getBrandLoading } = BrandsStore;
  const { getProductName, product, getProductLoading } = ProductsStore;
  const {
    createWebMarketingImage,
    editWebMarketingImage,
    webMarketingImage,
    loadingWebMarketingImage,
  } = MarketingStore;

  const defaultValues = {
    headerNavId: position !== "forYou" ? position : "",
    imageUrl: media_id ? webMarketingImage?.imageUrl : [],
    dataId: media_id ? webMarketingImage?.dataId : "",
    pageToLinkTo: media_id
      ? webMarketingImage?.pageToLinkTo
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
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    headerNavId: watch("headerNavId"),
    imageUrl: watch("imageUrl"),
    pageToLinkTo: watch("pageToLinkTo"),
    dataId: watch("dataId"),
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

  const selectedHeaderNav = useMemo(
    () =>
      !isEmpty(headerNavs)
        ? headerNavs?.find((item) => item?.id === form?.headerNavId)?.name
        : "",
    [headerNavs, form?.headerNavId]
  );

  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.imageUrl) ? form?.imageUrl?.[0] : form?.imageUrl
      );
      const payload = {
        ...form,
        isForYou: !!(position === "forYou"),
        imageUrl: imagesUrls,
        landscapeImageUrl: imagesUrls,
      };
      cleanPayload(payload);
      if (!media_id) {
        await createWebMarketingImage({
          data: payload,
          onSuccess: () => navigate(-1),
        });
      } else {
        await editWebMarketingImage({
          data: { ...payload, id: media_id },
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

  return loadingWebMarketingImage ? (
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
                    text="Delete Marketing Image"
                    redBg
                  />
                ) : null}
              </div>
              {media_id ? (
                <h2 className="section-heading my-8 text-xl">
                  Edit Web Marketing Image (
                  {position === "forYou" ? "For You" : selectedHeaderNav})
                </h2>
              ) : (
                <h2 className="section-heading mb-3 text-xl">
                  Add Web Marketing Image (
                  {position === "forYou" ? "For You" : selectedHeaderNav})
                </h2>
              )}

              <ImagePicker
                label="Select Image "
                handleDrop={(val) => handleChange({ prop: "imageUrl", val })}
                images={form.imageUrl}
                multiple={false}
                dimension={{ width: "1000px", height: "244px" }}
                isBanner
              />
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
                    Page type
                  </label>
                  <span className="text-grey-text text-sm mb-3 -mt-2">
                    Select the page type to be linked with this marketing image
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
                        with this marketing image.
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
                  ``
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
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
        active={formTwo?.modalType === "delete"}
        details={{
          pageType: "Marketing Image",
          modalType: "delete",
          id: media_id,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
      />
    </>
  );
});

const AddHomePagePost = () => {
  const { media_id } = useParams();
  const { loadingWebMarketingImage, getWebMarketingImage } = MarketingStore;

  useEffect(() => {
    media_id && getWebMarketingImage({ data: { id: media_id } });
  }, []);
  return loadingWebMarketingImage ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePagePost);
