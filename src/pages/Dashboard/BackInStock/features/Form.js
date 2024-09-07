import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Edit } from "assets/icons/Edit/edit.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery-black.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import Textarea from "components/General/Textarea/Textarea";
import { Link } from "react-router-dom";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import ImagePicker from "components/General/Input/ImagePicker";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import { PRODUCT_MODAL_TYPES, RIBBONS } from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";

const { PRODUCT_OPTION, PRODUCT_SUBSCRIPTION, PRODUCT_VARIANT } =
  PRODUCT_MODAL_TYPES;
export default function Form({ details, toggler }) {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
    description: "",
    collapsed: [],
    modalType: "",
  });

  const schema = yup.object({});

  //

  //   const { actions } = signInSlice;

  const defaultValues = {
    name: "",
    country: "",
    cost_price: "",
    sale_price: "",
    low_at: details?.quantity || "",
    quantity: details?.quantity || "",
    images: [],
    videos: [],
    description: EditorState.createEmpty(),
    enable_preorder: false,
    no_limit: true,
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
  const handleChange = async (prop, val, rest, isFormTwo) => {
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    name: watch("name"),
    country: watch("country"),
    cost_price: watch("cost_price"),
    sale_price: watch("sale_price"),
    low_at: watch("low_at"),
    quantity: watch("quantity"),
    images: watch("images"),
    videos: watch("videos"),
    description: watch("description"),
    enable_preorder: watch("enable_preorder"),
    no_limit: watch("no_limit"),
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      toggler?.();
    }
    // onSubmit(e);
    // dispatch(actions.signInUser({ username: name, country }));
  };

  const profitMargin =
    form?.cost_price && form?.sale_price
      ? form?.sale_price - form?.cost_price
      : "";

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {details?.isAdd ? (
          <h2 className="section-heading my-8 text-xl">Add New Product</h2>
        ) : (
          <h2 className="section-heading mb-3 text-xl  ">
            Edit Product Inventory
          </h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-5 w-full overflow-y-auto"
        >
          <Input
            label="Quantity"
            value={form?.quantity}
            onChangeFunc={(val) => handleChange("quantity", val)}
            placeholder="Enter Quantity"
            formError={errors.quantity}
            showFormError={formTwo?.showFormError}
            type="number"
            required
          />

          <Input
            label="Low in stock value"
            value={form?.low_at}
            onChangeFunc={(val) => handleChange("low_at", val)}
            placeholder="Enter low_at"
            formError={errors.low_at}
            showFormError={formTwo?.showFormError}
            type="number"
            required
          />

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            type="submit"
            text={details?.isAdd ? "Add New Product" : "Save Changes"}
            className="mb-5 "
            fullWidth
          />
        </form>
      </div>
      <DetailsModal
        active={formTwo?.modalType === PRODUCT_OPTION}
        details={{ modalType: PRODUCT_OPTION }}
        toggler={() => handleChangeTwo("modalType", false)}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT_VARIANT}
        details={{ modalType: PRODUCT_VARIANT }}
        toggler={() => handleChangeTwo("modalType", false)}
      />

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_SUBSCRIPTION}
        details={{ modalType: PRODUCT_SUBSCRIPTION }}
        toggler={() => handleChangeTwo("modalType", false)}
      />
    </>
  );
}
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
