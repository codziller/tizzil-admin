import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { Link } from "react-router-dom";
import ProductsStore from "pages/Dashboard/Products/store";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import { observer } from "mobx-react-lite";
import cleanPayload from "utils/cleanPayload";

const RequestProductForm = ({ details, toggler }) => {
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    modalType: "",
  });

  const schema = yup.object({
    sourceWarehouseId: yup.string().required("Please enter source warehouse"),
  });

  const { requestProductsLoading, requestProducts } = ProductsStore;

  const { warehouses, loading, getWarehouses, warehouse } = WareHousesStore;

  useEffect(() => {
    getWarehouses({ data: { page: 1 } });
  }, []);

  const defaultValues = {
    sourceWarehouseId: "",
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
    const updatedVal = rest ? [...val, ...rest] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const form = {
    sourceWarehouseId: watch("sourceWarehouseId"),
    quantity: watch("quantity"),
  };

  const handleOnSubmit = async () => {
    const payload = {
      sourceWarehouseId: form?.sourceWarehouseId,
      destinationWarehouseId: warehouse?.id,
      productTransferRequestProductQuantities: [
        {
          productId: details?.id,
          quantity: Number(form.quantity),
        },
      ],
    };
    cleanPayload(payload);

    await requestProducts({ data: payload, onSuccess: () => toggler?.() });
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

        <h2 className="section-heading mb-3 text-xl">
          Request {details?.name}
        </h2>
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-5 w-full overflow-y-auto"
        >
          <Select
            label="Source Warehouse"
            placeholder="Select Source Warehouse"
            options={warehouses?.filter((item) => item?.id !== warehouse?.id)}
            onChange={(val) => handleChange("sourceWarehouseId", val?.value)}
            value={warehouses?.find(
              (item) => item?.value === form?.sourceWarehouseId
            )}
            formError={errors.sourceWarehouseId}
            showFormError={formTwo?.showFormError}
            isLoading={loading}
            fullWidth
          />

          <Input
            label="Quantity"
            value={form?.quantity}
            onChangeFunc={(val) => handleChange("quantity", val)}
            placeholder="Enter Quantity"
            type="number"
            formError={errors.quantity}
            showFormError={formTwo?.showFormError}
            required
          />

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            isLoading={requestProductsLoading}
            type="submit"
            text={"Request Product"}
            className="mb-5 "
            fullWidth
          />
        </form>
      </div>
    </>
  );
};
RequestProductForm.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(RequestProductForm);
