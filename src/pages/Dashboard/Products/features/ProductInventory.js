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
import { Link, useParams } from "react-router-dom";
import { CENTRAL_WAREHOUSE_ID } from "utils/appConstant";
import CheckBox from "components/General/Input/CheckBox";
import cleanPayload from "utils/cleanPayload";
import { isEmpty } from "lodash";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import ProductsStore from "../store";
import { observer } from "mobx-react-lite";
import { errorToast } from "components/General/Toast/Toast";

const ProductInventory = ({ details, toggler, handleOnChange, formObj }) => {
  const { warehouseInventory } = formObj;
  const { currentProductInventory } = details;
  const { product_id, warehouse_id } = useParams();
  const isEdit = !isEmpty(currentProductInventory);
  const { editProductInventory, editProductInventoryLoading } = ProductsStore;
  const { warehouses, loading } = WareHousesStore;
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    visibility: "",
    collapsed: [],
    showProductOption: false,
  });

  const schema = yup.object({
    warehouseId: yup.string().required("Please select a warehouse"),
    quantity: yup.string().required("Please enter quantity"),
    lowInQuantityValue: yup
      .string()
      .required("Please enter Low in Stock Value"),
  });

  const defaultValues = {
    warehouseId: currentProductInventory?.warehouseId || "",
    quantity: currentProductInventory?.quantity || "",
    lowInQuantityValue: currentProductInventory?.lowInQuantityValue || "",
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
    warehouseId: watch("warehouseId"),
    quantity: watch("quantity"),
    lowInQuantityValue: watch("lowInQuantityValue"),
  };

  const currentWarehouseInPrevOptions = warehouseInventory?.find(
    (item) => item?.warehouseId === warehouse_id
  );
  const prevOption = warehouseInventory?.find(
    (item) => item?.warehouseId === form.warehouseId
  );
  const handleOnSubmit = () => {
    if (isEdit) {
      const payload = {
        ...form,
        productSubscriptionId: currentProductInventory?.id,
      };
      cleanPayload(payload);
      editProductInventory({
        product_id,
        data: payload,
        onSuccess: () => toggler?.(),
        warehouse_id,
      });
      return;
    }

    if (prevOption?.warehouseId) {
      errorToast("Error!", "You've already added inventory for this warehouse");
      return;
    }
    const payload = cleanPayload(form);
    handleOnChange({
      prop: "warehouseInventory",
      val: [...warehouseInventory, payload],
    });
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

        <p className="font-600 text-xl ">
          {isEdit ? "Edit Warehouse Inventory" : "Add Warehouse Inventory"}
        </p>

        <p className="mb-3 text-sm text-grey text-left">
          Add quantity and low in stock to value exclusively to the selected
          warehouse
        </p>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-3 w-full overflow-y-auto"
        >
          {!currentWarehouseInPrevOptions?.warehouseId ? (
            <CheckBox
              label="Use Current Warehouse"
              square
              tooltip="Add inventory to this current warehouse"
              onChange={(val) =>
                handleChange(
                  "warehouseId",
                  form.warehouseId === warehouse_id ? "" : warehouse_id
                )
              }
              checked={form.warehouseId === warehouse_id}
            />
          ) : null}
          {form.warehouseId !== warehouse_id ? (
            <Select
              label="Select Warehouse"
              placeholder="Select Warehouse"
              options={warehouses
                ?.filter(
                  (item) =>
                    item?.id !== CENTRAL_WAREHOUSE_ID &&
                    item?.id !== warehouse_id
                )
                ?.filter(
                  (item) =>
                    !warehouseInventory?.find(
                      (inv) => item?.id === inv?.warehouseId
                    )
                )}
              onChange={(val) => handleChange("warehouseId", val?.value)}
              value={warehouses?.find(
                (item) => item?.value === form?.warehouseId
              )}
              formError={errors.warehouseId}
              showFormError={formTwo?.showFormError}
              isLoading={loading}
              fullWidth
            />
          ) : null}
          <Input
            label="Product Quantity"
            value={form?.quantity}
            onChangeFunc={(val) => handleChange("quantity", val)}
            placeholder="Enter Quantity"
            formError={errors.quantity}
            showFormError={formTwo?.showFormError}
            type="number"
            isRequired
          />

          <Input
            label="Low in Stock Value"
            value={form?.lowInQuantityValue}
            onChangeFunc={(val) => handleChange("lowInQuantityValue", val)}
            placeholder="10"
            showFormError={formTwo?.showFormError}
            formError={errors.lowInQuantityValue}
            type="number"
            tooltip="When quantity is at this value, the product will be low in stock."
          />

          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Cancel"
              fullWidth
              whiteBg
            />

            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              isLoading={editProductInventoryLoading}
              type="submit"
              text={isEdit ? "Save Changes" : "Add"}
              className="mb-2"
              fullWidth
            />
          </div>
        </form>
      </div>
    </>
  );
};
ProductInventory.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleOnChange: PropTypes.func,
  formObj: PropTypes.object,
};

export default observer(ProductInventory);
