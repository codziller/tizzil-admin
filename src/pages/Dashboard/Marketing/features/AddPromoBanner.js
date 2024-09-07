import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { MEDIA_MODAL_TYPES } from "utils/appConstant";
import Input from "components/General/Input/Input";
import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";

const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;

const Form = observer(() => {
  const { warehouse_id, media_id, position } = useParams();

  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  const schema = yup.object({
    titleText: yup.string().required("Please enter post title"),
  });

  const {
    createPromoBanner,
    editPromoBanner,
    promoBanner,
    loadingPromoBanner,
    createPromoBannerLoading,
    editPromoBannerLoading,
  } = MarketingStore;

  const defaultValues = {
    titleText: media_id ? promoBanner?.titleText : "",
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

  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    titleText: watch("titleText"),
  };

  const handleOnSubmit = async () => {
    const payload = {
      ...form,
      showOnWeb: !!(position === "web"),
      showOnMobile: !!(position === "mobile"),
    };
    if (!media_id) {
      await createPromoBanner({
        data: payload,
        onSuccess: () => navigate(-1),
      });
      return;
    } else {
      await editPromoBanner({
        data: { ...payload, id: media_id },
        onSuccess: () => navigate(-1),
      });
      return;
    }
  };

  return loadingPromoBanner ? (
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
                  Edit Banner ({position})
                </h2>
              ) : (
                <h2 className="section-heading mb-3 text-xl">
                  Add Banner ({position})
                </h2>
              )}

              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <Input
                    label="Banner Text"
                    value={form?.titleText}
                    onChangeFunc={(val) => handleChange("titleText", val)}
                    placeholder="Enter Text"
                    formError={errors.titleText}
                    showFormError={formTwo?.showFormError}
                  />
                  <Button
                    onClick={() =>
                      setFormTwo({ ...formTwo, showFormError: true })
                    }
                    isLoading={
                      createPromoBannerLoading || editPromoBannerLoading
                    }
                    type="submit"
                    text={media_id ? "Save Changes" : "Add"}
                    className="mt-8 mb-5"
                    fullWidth
                  />
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
        details={{ modalType: BRAND }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT}
        details={{ modalType: PRODUCT }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
    </>
  );
});

const AddHomePagePost = () => {
  const { media_id } = useParams();
  const { loadingPromoBanner, getPromoBanner } = MarketingStore;

  useEffect(() => {
    media_id && getPromoBanner({ data: { id: media_id } });
  }, []);
  return loadingPromoBanner ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePagePost);
