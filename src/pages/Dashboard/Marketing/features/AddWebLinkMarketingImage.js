import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Textarea from "components/General/Textarea/Textarea";
import Input from "components/General/Input/Input";
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
    createWebLinkMarketingImage,
    editWebLinkMarketingImage,
    webLinkMarketingImage,
    loadingWebLinkMarketingImage,
  } = MarketingStore;

  const defaultValues = {
    headerNavId: position !== "forYou" ? position : "",
    imageUrl: media_id ? webLinkMarketingImage?.imageUrl : [],
    dataId: media_id ? webLinkMarketingImage?.dataId : "",
    pageToLinkTo: media_id
      ? webLinkMarketingImage?.pageToLinkTo
      : SLIDE_LINK_TYPES[0]?.value,
    titleText: media_id ? webLinkMarketingImage?.titleText : "",
    descriptionText: media_id ? webLinkMarketingImage?.descriptionText : "",
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
    titleText: watch("titleText"),
    descriptionText: watch("descriptionText"),
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
        isArray(form?.imageUrl) ? form?.imageUrl?.[0] : form?.imageUrl,
        true
      );
      const payload = {
        ...form,
        isForYou: !!(position === "forYou"),
        imageUrl: imagesUrls,
      };
      cleanPayload(payload);
      if (!media_id) {
        await createWebLinkMarketingImage({
          data: payload,
          onSuccess: () => navigate(-1),
        });
        return;
      } else {
        await editWebLinkMarketingImage({
          data: { ...payload, id: media_id },
          onSuccess: () => navigate(-1),
        });
        return;
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

  return loadingWebLinkMarketingImage ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="h-full md:pr-4 pt-1">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
              <div className="mb-5">
                <button onClick={() => navigate(-1)} className="scale-90">
                  <ArrowBack />
                </button>
              </div>
              {media_id ? (
                <h2 className="section-heading my-8 text-xl">
                  Edit Marketing Image (
                  {position === "forYou" ? "For You" : selectedHeaderNav})
                </h2>
              ) : (
                <h2 className="section-heading mb-3 text-xl">
                  Add Marketing Image (
                  {position === "forYou" ? "For You" : selectedHeaderNav})
                </h2>
              )}

              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <Input
                    label="Post Title"
                    value={form?.titleText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "titleText", val })
                    }
                    placeholder="Enter Title"
                    formError={errors.titleText}
                    showFormError={formTwo?.showFormError}
                  />

                  <Textarea
                    label="Post Description"
                    value={form?.descriptionText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "descriptionText", val })
                    }
                    placeholder="Enter Description"
                    formError={errors.descriptionText}
                    showFormError={formTwo?.showFormError}
                    required
                  />

                  <ImagePicker
                    label="Select Image "
                    handleDrop={(val) =>
                      handleChange({ prop: "imageUrl", val })
                    }
                    images={form.imageUrl}
                    multiple={false}
                    dimension={{ width: "500px", height: "538px" }}
                    isMarketingImg
                  />
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
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
                        with this marketing image
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
    </>
  );
});

const AddHomePagePost = () => {
  const { media_id } = useParams();
  const { loadingWebLinkMarketingImage, getWebLinkMarketingImage } =
    MarketingStore;

  useEffect(() => {
    media_id && getWebLinkMarketingImage({ data: { id: media_id } });
  }, []);
  return loadingWebLinkMarketingImage ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePagePost);
