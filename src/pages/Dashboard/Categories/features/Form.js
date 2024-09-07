import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { TailSpin } from "react-loader-spinner";
import { isEmpty, uniq } from "lodash";
import CategoriesStore from "../store";
import { errorToast, successToast } from "components/General/Toast/Toast";
import Select from "components/General/Input/Select";
import cleanPayload from "utils/cleanPayload";

const Form = ({ details, toggler }) => {
  const {
    createCategory,
    createCategoryLoading,
    editCategory,
    deleteCategory,
    headerNavs,
    getHeaderNavs,
    loadingHeaderNavs,
  } = CategoriesStore;

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    subcategories: details?.subCategories,
    subcategory: "",
    deletingSubcategories: [],
    editLoading: false,
  });

  useEffect(() => {
    getHeaderNavs();
  }, []);
  const schema = yup.object({
    name: yup.string().required("Please enter category name"),
  });

  const defaultValues = {
    name: details?.name,
    parentCategoryId: "",
    headerNavId: details?.headerNavId,
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
    name: watch("name"),
    parentCategoryId: watch("parentCategoryId"),
    headerNavId: watch("headerNavId"),
  };

  const handleAdd = () => {
    let choice = formTwo.subcategory?.split(",").map((item) => item?.trim());
    choice = uniq(choice);
    const newArr = choice?.map?.((itm) => {
      return { name: itm };
    });

    if (isEmpty(choice)) return;
    if (formTwo.subcategories?.find((itm) => choice?.includes(itm?.name))) {
      errorToast("Cannot add the same category twice");
    } else {
      setFormTwo({
        ...formTwo,
        subcategories: [...formTwo.subcategories, ...newArr],
        subcategory: "",
      });
    }
  };
  const handleRemove = async (val) => {
    if (val?.id) {
      const newDelArr = [...formTwo.deletingSubcategories, val?.id];
      setFormTwo({
        ...formTwo,
        deletingSubcategories: newDelArr,
      });
      const payload = { id: val?.id };
      try {
        await deleteCategory({ data: payload });
        setFormTwo({
          ...formTwo,
          subcategories: formTwo.subcategories.filter(
            (item) => item?.name !== val?.name
          ),
          deletingSubcategories: newDelArr.filter((item) => item !== val?.id),
        });
      } catch (error) {
      } finally {
      }
      return;
    }
    setFormTwo({
      ...formTwo,
      subcategories: formTwo.subcategories.filter(
        (item) => item?.name !== val?.name
      ),
    });
  };

  const handleOnSubmit = async (e) => {
    if (details.isAdd) {
      const payload = { name: form.name };
      createCategory({ data: payload, onSuccess: () => toggler() });
      return;
    }
    handleChangeTwo("editLoading", true);
    const payload = {
      name: form.name,
      id: details?.id,
      headerNavId: form?.headerNavId,
    };
    cleanPayload(payload);
    const newSubcategories = formTwo.subcategories?.filter((item) => !item?.id);

    await Promise.all([
      editCategory({ data: payload, noAlert: true }),
      ...newSubcategories?.map((item) =>
        createCategory({
          data: { name: item?.name, parentCategoryId: details?.id },
          noAlert: true,
        })
      ),
    ]);

    handleChangeTwo("editLoading", false);
    successToast("Operation Successful!", "Category updated Successfully.");
    toggler?.();
  };
  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 ">
            <Close />
          </button>
        )}

        {details?.isAdd ? (
          <p className="font-600 mb-3 text-xl">Add New Category</p>
        ) : (
          <p className="font-600 mb-3 text-xl  ">Edit Category</p>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-5 w-full overflow-y-auto"
        >
          <Input
            label="Category Name"
            value={form?.name}
            onChangeFunc={(val) => handleChange("name", val)}
            placeholder="Enter Category Name"
            formError={errors.name}
            showFormError={formTwo?.showFormError}
            required
          />
          {!details?.isAdd && (
            <>
              <Input
                label="Add subcategories to this category"
                value={formTwo?.subcategory}
                onChangeFunc={(val) => handleChangeTwo("subcategory", val)}
                placeholder="Enter subcategory"
                tooltip="Use comma to separate multiple subcategories"
                extraElement={
                  <Button
                    onClick={() => {
                      handleAdd();
                    }}
                    icon={
                      <ArrowBack className="rotate-180 scale-75 current-svg text-white" />
                    }
                    innerClassName="!h-[90%] cursor-pointer !px-1"
                    textClass="text-sm"
                    isDisabled={!formTwo.subcategory}
                  />
                }
                required
              />

              <p className="text-sm text-grey text-left flex justify-start items-center gap-1">
                <InfoIcon /> Use comma to separate multiple subcategories
              </p>

              {!isEmpty(formTwo?.subcategories) && (
                <div>
                  <label className="general-input-label mb-1 relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1.5">
                    Subcategories
                  </label>
                  <div className="flex flex-wrap gap-3 w-full my-3 justify-start items-center border-1/2 border-grey-border p-2">
                    {formTwo?.subcategories?.map((item, index) => (
                      <div
                        className="flex justify-center items-center w-fit transition-colors duration-300 ease-in-out gap-1 bg-grey-fadeLight text-sm px-1 relative"
                        key={item + index}
                      >
                        <span>{item?.name}</span>
                        <span
                          onClick={() => handleRemove(item)}
                          className="hover:bg-red-300 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                        >
                          {formTwo.deletingSubcategories?.includes(item?.id) ? (
                            <TailSpin
                              height="18"
                              width="18"
                              color="#000000"
                              ariaLabel="tail-spin-loading"
                              radius="3"
                              visible={true}
                            />
                          ) : (
                            <Close className="current-svg scale-[0.7]" />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Select
                label="Add this category to a header nav"
                placeholder="Select Header Nav"
                options={headerNavs}
                onChange={(val) => handleChange("headerNavId", val?.value)}
                value={headerNavs?.find(
                  (item) => item?.value === form?.headerNavId
                )}
                isLoading={loadingHeaderNavs}
                fullWidth
              />
            </>
          )}

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            isLoading={createCategoryLoading || formTwo.editLoading}
            type="submit"
            text={details?.isAdd ? "Add Category" : "Save Changes"}
            className="mb-5 "
            fullWidth
          />
        </form>
      </div>
    </>
  );
};
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(Form);
