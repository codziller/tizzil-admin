import React, { useEffect, useState, useCallback } from "react";
import { isEmpty, lowerCase } from "lodash";

import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import CategoriesStore from "pages/Dashboard/Categories/store";
import CheckBox from "components/General/Input/CheckBox";
import SearchBar from "components/General/Searchbar/SearchBar";
import ProductsStore from "../store";

const ProductCategories = ({
  details,
  toggler,
  handleChange,
  form,
  type = "Product",
  isSingle,
}) => {
  const isObjectOnChange = details?.isObjectOnChange;
  const { product_id } = useParams();

  const { getCategories, categories, loading } = CategoriesStore;
  const {
    createProductCategory,
    createProductCategoryLoading,
    deleteProductCategory,
    deleteProductCategoryLoading,
  } = ProductsStore;

  useEffect(() => {
    getCategories();
  }, []);
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    categoryIds: form?.categoryIds || [],
    categoryId: form?.categoryId || "",
  });
  const [searchInput, setSearchInput] = useState("");

  const handleChangeTwo = async (val, itemIsSelected) => {
    if (product_id && type === "Product") {
      if (itemIsSelected) {
        deleteProductCategory({
          data: { categoryId: val, productId: product_id },
        });
      } else {
        createProductCategory({
          data: { categoryId: val, productId: product_id },
        });
      }
    }
    if (isSingle) {
      setFormTwo({ ...formTwo, categoryId: val });
      handleChange("categoryId", val);
      handleSubmit();
      return;
    }
    const newCategoryIds = itemIsSelected
      ? formTwo.categoryIds?.filter(
          (item) => (item?.id || item) !== (val?.id || val)
        )
      : [...formTwo.categoryIds, val];
    setFormTwo({ ...formTwo, categoryIds: newCategoryIds });
    handleChange({ prop: "categoryIds", val: newCategoryIds });
  };

  const isSelected = useCallback(
    (id) =>
      isSingle
        ? formTwo?.categoryId === id
        : isObjectOnChange
        ? !!formTwo?.categoryIds?.find((item) => item?.id === id)
        : formTwo?.categoryIds?.includes(id),
    [formTwo.categoryIds, formTwo.categoryId]
  );

  const handleSubmit = () => {
    toggler?.();
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mr-auto">
            <Close />
          </button>
        )}

        <p className="font-600 text-[20px] ">
          Select A Category For This {type}
        </p>

        <p className="mb-3 text-sm text-grey text-left">Search Categories</p>

        <SearchBar
          placeholder={"Search categories"}
          onChange={setSearchInput}
          value={searchInput}
          className="flex"
        />
        {deleteProductCategoryLoading ||
        createProductCategoryLoading ||
        loading ? (
          <div className="flex justify-center w-full p-6">
            <CircleLoader blue />
          </div>
        ) : (
          <div className="w-full flex flex-col justify-start items-start gap-4 mt-4">
            {categories?.map((item) => {
              return !isEmpty(item?.subCategories) ? (
                <div
                  key={item?.id}
                  className="flex flex-col justify-start items-start gap-3 w-full"
                >
                  <label
                    className={
                      "text-[13px] font-500 general-input-label relative text-grey-dark !flex justify-start items-center gap-1"
                    }
                  >
                    {item?.name}
                  </label>
                  <div
                    key={item?.id}
                    className="flex flex-col justify-start items-start gap-2"
                  >
                    <p className="text-[10px] text-grey">SubCategories</p>
                    {item?.subCategories
                      ?.filter((item) =>
                        lowerCase(item?.name)?.includes(lowerCase(searchInput))
                      )
                      ?.map((subItem) => {
                        const itemIsSelected = isSelected(subItem?.id);
                        return (
                          <div
                            key={subItem?.id}
                            className="flex flex-col justify-start items-start gap-2.5"
                          >
                            <CheckBox
                              key={subItem?.id}
                              label={subItem?.name}
                              onChange={() =>
                                isObjectOnChange
                                  ? handleChangeTwo(subItem, itemIsSelected)
                                  : handleChangeTwo(subItem?.id, itemIsSelected)
                              }
                              checked={itemIsSelected}
                              labelClass="text-[13px] font-500"
                              square={!isSingle}
                            />

                            {!isEmpty(subItem?.subCategories) && (
                              <>
                                <p className="text-[10px] text-grey">
                                  {item?.name} {">"} {subItem?.name} {">"}{" "}
                                  SubCategories
                                </p>

                                {subItem?.subCategories?.map((subSubItem) => {
                                  const itemIsSelected = isSelected(
                                    subSubItem?.id
                                  );
                                  return (
                                    <div
                                      key={subSubItem?.id}
                                      className="flex flex-col justify-start items-start gap-2"
                                    >
                                      <CheckBox
                                        key={subSubItem?.id}
                                        label={subSubItem?.name}
                                        onChange={() =>
                                          isObjectOnChange
                                            ? handleChangeTwo(
                                                subSubItem,
                                                itemIsSelected
                                              )
                                            : handleChangeTwo(
                                                subSubItem?.id,
                                                itemIsSelected
                                              )
                                        }
                                        checked={itemIsSelected}
                                        square={!isSingle}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  <hr className="w-full" />
                </div>
              ) : null;
            })}
            <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
              <Button
                onClick={() => toggler?.()}
                text="Cancel"
                fullWidth
                whiteBg
              />

              <Button
                onClick={handleSubmit}
                isDisabled={!formTwo?.categoryIds}
                text="Continue"
                className="mb-2"
                fullWidth
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
ProductCategories.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default observer(ProductCategories);
