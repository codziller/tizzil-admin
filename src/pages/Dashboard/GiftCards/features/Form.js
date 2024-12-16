import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { Link, useNavigate, useParams } from "react-router-dom";
import GiftCardsStore from "../store";
import { successToast } from "components/General/Toast/Toast";
import ImagePicker from "components/General/Input/ImagePicker";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import { isArray } from "lodash";

export default function Form({ details, toggler }) {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
  });

  const schema = yup.object({
    category: yup.string().required("Please select a category"),
    design: yup.mixed().required("Please select a design for this gift card"),
  });

  const defaultValues = {
    category: "",
    design: [],
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { createGiftCard, createGiftCardLoading } = GiftCardsStore;

  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
  };
  const router = useNavigate();

  const form = {
    category: watch("category"),
    design: watch("design"),
  };
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleOnSubmit = async (e) => {
    if (isValid) {
      setUploadingImage(true);
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.design) ? form?.design?.[0] : form?.design
      );
      setUploadingImage(false);
      const payload = { cardCategory: e.category, cardDesign: imagesUrls };
      createGiftCard({
        data: payload,
        onSuccess: () => {
          router(-1);
        },
      });
    }
  };
  const { warehouse_id } = useParams();

  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <div className="mb-5">
          <button onClick={() => router(-1)}>
            <ArrowBack />
          </button>
        </div>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mb-5">
          <Close />
        </button>
      )}

      {details?.isAdd ? (
        <h2 className="section-heading my-8 text-xl">Add Gift Card Design</h2>
      ) : (
        <h2 className="section-heading mb-3 text-xl">Edit Gift Card Design</h2>
      )}

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start gap-y-3 w-full overflow-y-auto"
      >
        <Select
          label="Gift Card Category"
          placeholder="Select Gift Card Category"
          options={[
            { label: "Birthday", value: "BIRTHDAY" },
            { label: "Christmas", value: "CHRISTMAS" },
            { label: "Congratulations", value: "CONGRATULATIONS" },
            { label: "Love/Valentine", value: "LOVE_VALENTINE" },
            { label: "Standard", value: "STANDARD" },
            { label: "Thank You", value: "THANK_YOU" },
          ]}
          onChange={(val) => handleChange("category", val.value)}
          value={form.category}
          formError={errors.category}
          showFormError={formTwo?.showFormError}
          fullWidth
        />

        <ImagePicker
          label="Gift Card Design"
          handleDrop={(val) => handleChange("design", val)}
          images={form.design}
          formError={errors.design}
          showFormError={formTwo?.showFormError}
          multiple={false}
        />
        <Button
          onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
          type="submit"
          text={details?.isAdd ? "Add Gift Card Design" : "Save Changes"}
          className="mt-8 mb-5"
          fullWidth
          isLoading={uploadingImage || createGiftCardLoading}
        />
      </form>
    </div>
  );
}
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
