import React, { useState } from "react";

import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { Link } from "react-router-dom";

import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import ProductsPage from "pages/Dashboard/Products/features";

const Products = ({ details, toggler, handleChange, form }) => {
  const prop = details?.prop || "productId";
  const isObjectOnChange = details?.isObjectOnChange;
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    [prop]: form?.[prop],
  });

  const isSelected = useCallback(
    (id) => {
      return isObjectOnChange
        ? !!formTwo?.[prop]?.find((item) => item?.id === id?.id)
        : !details?.isMultipleProducts
        ? formTwo?.[prop] === id
        : formTwo?.[prop]?.includes(id);
    },
    [formTwo?.[prop]]
  );

  const handleSubmit = (val) => {
    if (!details?.isMultipleProducts) {
      setFormTwo({ ...formTwo, [prop]: val });
      handleChange({ prop, val });
      toggler?.();
      return;
    }
    const newItems = isSelected(val)
      ? formTwo?.[prop]?.filter(
          (item) => (item?.id || item) !== (val?.id || val)
        )
      : [...formTwo?.[prop], val];
    setFormTwo({ ...formTwo, [prop]: newItems });
    handleChange({ prop, val: newItems });
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

        <p className="font-600 text-[20px]">Select A Product</p>

        <p className="mb-3 text-sm text-grey text-left">
          Search for a product to be linked to this slide
        </p>

        <ProductsPage
          isModal
          handleProductSelect={(e) => {
            handleSubmit(isObjectOnChange ? e : e?.id);
          }}
          isSelected={isSelected}
          modalDetails={details}
        />
      </div>
    </>
  );
};
Products.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default observer(Products);
