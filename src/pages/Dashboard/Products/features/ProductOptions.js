import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { HexColorPicker } from "react-colorful";
import { BsCardList } from "react-icons/bs";
import { MdOutlineInvertColors } from "react-icons/md";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";

import { Link } from "react-router-dom";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import classNames from "classnames";
import { errorToast } from "components/General/Toast/Toast";
import { isEmpty, lowerCase, uniq } from "lodash";
import cleanPayload from "utils/cleanPayload";
import { CHOICE_DISPLAY } from "utils/appConstant";
import ProductsStore from "../store";
import { observer } from "mobx-react-lite";

const ProductOptions = ({ details, toggler, handleOnChange, formObj }) => {
  const { productOptions } = formObj;
  const { currentProductOption } = details;

  const isEdit = !isEmpty(currentProductOption);

  const { editProductOptionLoading } = ProductsStore;

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    activeChoice: "",
    choice: "",
    choices: [],
    colors: [],
  });

  const schema = yup.object({
    name: yup.string().required("Please enter option name"),
    choices: yup
      .array()
      .min(1, "Enter at least one choice for this option")
      .required("Enter at least one choice for this option"),
  });

  const { COLOR, LIST } = CHOICE_DISPLAY;

  const defaultValues = {
    name: currentProductOption?.name || "",
    choiceDisplay: currentProductOption?.choiceDisplay || LIST,
    choices: currentProductOption?.choices || [],
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

  const handleChange = async (prop, val, isFormTwo) => {
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    setValue(prop, val);
    await trigger(prop);
  };
  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    name: watch("name"),
    choiceDisplay: watch("choiceDisplay"),
    choices: watch("choices"),
  };
  const handleSave = (e) => {
    let choice = formTwo.choice?.split(",").map((item) => item?.trim());
    choice = uniq(choice);
    const choiceObj = choice
      ?.map?.((itm) => {
        if (itm)
          return {
            variantName: itm,
            choice: "#000000",
            visibility: true,
            main: false,
          };
      })
      .filter((item) => item?.variantName);

    if (isEmpty(choice)) return;
    if (form.choices?.find((itm) => choice?.includes(itm?.variantName))) {
      errorToast("Cannot add the same choice twice");
    } else {
      handleChangeTwo("choice", "");
      handleChange("choices", [...form.choices, ...choiceObj]);
    }
  };
  const handleRemoveChoice = (val) => {
    const newChoices = form.choices.filter(
      (item) => item?.variantName !== val?.variantName
    );
    handleChange("choices", newChoices);
  };
  const handleSetColor = ({ index, choice, rest }) => {
    const choices = [...form.choices];
    choices[index] = { ...rest, choice };
    handleChange("choices", choices);
  };

  const handleOnSubmit = () => {
    const choices = form.choices?.map((item) => {
      return cleanPayload({ ...item, choice: "" });
    });
    const payload = {
      ...form,
      choices,
      productOptionId: currentProductOption?.id,
    };
    cleanPayload(payload);
    if (isEdit) {
      const newProductOptions = productOptions?.map((item) => {
        if (item?.name === currentProductOption?.name) {
          return { ...currentProductOption, ...payload };
        } else {
          return item;
        }
      });

      handleOnChange({
        prop: "productOptions",
        val: newProductOptions,
      });
      toggler?.();
      return;
    }
    const prevOption = productOptions?.find(
      (item) => lowerCase(item?.name) === lowerCase(form.name)
    );
    if (prevOption?.name) {
      errorToast(
        "Error!",
        "You've already added a product option with this name"
      );
      return;
    }

    handleOnChange({
      prop: "productOptions",
      val: [...productOptions, payload],
    });
    toggler?.();
  };

  return (
    <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <Link to={details?.link} className="scale-90 mb-2 mr-auto">
          <ArrowBack />
        </Link>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mr-auto">
          <Close />
        </button>
      )}

      <p className="font-600 text-xl ">
        {isEdit ? "Edit" : "Add"} Product Option
      </p>

      <p className="mb-3 text-sm text-grey text-left">
        You'll be able to manage pricing and inventory for this product option
        later on
      </p>

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start w-full overflow-y-auto"
      >
        <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mb-2">
          <Input
            label="Option Name"
            value={form?.name}
            onChangeFunc={(val) => handleChange("name", val)}
            placeholder="Enter Product Name"
            formError={errors.name}
            showFormError={formTwo?.showFormError}
            tooltip="Type in an option name"
            required
          />
          <div className="flex flex-col w-full mb-[13px]">
            <label
              className={
                "general-input-label mb-1 relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1.5"
              }
            >
              Show in product page as:
            </label>
            <div className="flex justify-start items-center gap-3">
              <button
                type="button"
                className={classNames(
                  "flex justify-start items-center gap-2 transition-colors duration-300 ease-in-out",
                  {
                    "text-blue": form.choiceDisplay === LIST,
                    "text-grey-text5": form.choiceDisplay !== LIST,
                  }
                )}
                onClick={() => handleChange("choiceDisplay", LIST)}
              >
                <BsCardList size={20} />
                <span>List</span>
              </button>

              <button
                type="button"
                className={classNames(
                  "flex justify-start items-center gap-2 transition-colors duration-300 ease-in-out",
                  {
                    "text-blue": form.choiceDisplay === COLOR,
                    "text-grey-text5": form.choiceDisplay !== COLOR,
                  }
                )}
                onClick={() => handleChange("choiceDisplay", COLOR)}
              >
                <MdOutlineInvertColors size={20} />
                <span>Color</span>
              </button>
            </div>
          </div>
        </div>
        <Input
          label="Type in choices for this option"
          value={formTwo?.choice}
          onChangeFunc={(val) => handleChangeTwo("choice", val)}
          placeholder="Enter Choice"
          tooltip="Use comma to separate multiple choices"
          extraElement={
            <Button
              onClick={() => handleSave()}
              icon={
                <ArrowBack className="rotate-180 scale-75 current-svg text-white" />
              }
              innerClassName="!h-[90%] cursor-pointer !px-1"
              textClass="text-sm"
              isDisabled={!formTwo.choice}
            />
          }
          required
        />
        <p className="text-sm text-grey text-left flex justify-start items-center gap-1">
          <InfoIcon /> Use comma to separate multiple choices
        </p>
        {!isEmpty(form?.choices) && (
          <div className="flex flex-wrap gap-3 w-full my-3 justify-start items-center border-1/2 border-grey-border p-2">
            {form?.choices?.map((item, index) => {
              const backgroundColor = item?.choice;
              const isActive =
                formTwo?.activeChoice?.variantName === item?.variantName;
              return (
                <div
                  key={item?.variantName}
                  className="flex justify-center items-center w-fit transition-colors duration-300 ease-in-out gap-1 bg-grey-fadeLight text-sm px-1 relative"
                  onMouseEnter={() => handleChange("activeChoice", item, true)}
                  onMouseLeave={() => handleChange("activeChoice", "", true)}
                >
                  {form.choiceDisplay === COLOR && (
                    <span
                      style={{ backgroundColor }}
                      className="w-3 h-3 rounded-full  hover:bg-grey-alt transition-colors duration-300 ease-in-out cursor-pointer mr-1"
                    ></span>
                  )}
                  <span>{item?.variantName}</span>

                  <span
                    onClick={() => handleRemoveChoice(item)}
                    className="hover:bg-red-300 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                  >
                    <Close className="current-svg scale-[0.7]" />
                  </span>

                  {form.choiceDisplay === COLOR && (
                    <div
                      className={classNames(
                        "flex absolute left-0 bottom-6 transition-opacity duration-300 ease-in-out pb-1",
                        {
                          "opacity-0 -z-10": !isActive,
                          "opacity-100 z-[99]": isActive,
                        }
                      )}
                    >
                      <HexColorPicker
                        color={backgroundColor}
                        onChange={(choice) =>
                          handleSetColor({ rest: item, choice, index })
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="h-[13px]">
          {errors?.choices && <FormErrorMessage type={errors?.choices} />}
        </div>
        <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
          <Button onClick={() => toggler?.()} text="Cancel" fullWidth whiteBg />

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            isLoading={editProductOptionLoading}
            type="submit"
            text={isEdit ? "Save Changes" : "Add"}
            className="mb-2"
            fullWidth
          />
        </div>
      </form>
    </div>
  );
};
ProductOptions.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(ProductOptions);
