import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import CountryListDropdown from "components/General/Input/CountryListDropdown";
import { getStates } from "country-state-picker";
import { observer } from "mobx-react-lite";
import WareHousesStore from "../store";
import { isEmpty, lowerCase } from "lodash";
import Select from "components/General/Input/Select";
import cleanPayload from "utils/cleanPayload";
import Input from "components/General/Input/Input";
import { DeleteButton } from "components/General/Button";
import DetailsModal from "./DetailsModal";

const CreateProvider = () => {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
  });
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const schema = yup.object({
    erp_name: yup.string().required("Please enter ERP name"),
    name: yup.string().required("Please enter name"),
    state: yup.string().required("Please select state"),
    country: yup.string().required("Please select country"),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const {
    createWarehouse,
    createWareHouseLoading,
    editWarehouse,
    editWareHouseLoading,
  } = WareHousesStore;

  const defaultValues = {
    name: state?.name,
    state: state?.state,
    country: state?.country,
    lat: state ? "" : "6.5244",
    lng: state ? "" : "3.3792",
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

  const form = {
    erpName: watch("erp_name"),
    name: watch("name"),
    state: watch("state"),
    country: watch("country"),
    lat: watch("lat"),
    lng: watch("lng"),
  };
  const handleOnSubmit = (e) => {
    const payload = cleanPayload(form);
    if (state) {
      editWarehouse({
        data: { ...payload, id: state.id },
        onSuccess: () => navigate("/warehouses"),
      });
      return;
    }

    createWarehouse({
      data: { ...payload },
      onSuccess: () => navigate("/warehouses"),
    });
  };

  const states = useMemo(() => {
    const selectedCountry = lowerCase(form?.country);
    let statesList = getStates(selectedCountry);
    if (!isEmpty(statesList)) {
      statesList = statesList.map((item) => {
        const itemName =
          selectedCountry === "ng" ? item?.replace(" State", "") : item;
        return { label: itemName, value: itemName };
      });
    } else {
      statesList = [];
    }
    return statesList;
  }, [form.country]);

  const stateValue = useMemo(
    () => states?.find((item) => item.value === form.state),
    [form.state]
  );

  return (
    <>
      <div className="md:px-2 md:py-0 py-8 px-3 form-container min-w-[calc(100vw-24px)] mini:!min-w-[362px] snap-center rounded-lg bg-white shadow-[0_7px_56px_0_rgba(84,68,242,0.04)] border border-grey-border">
        <button onClick={() => navigate(-1)} className="scale-90 mb-5">
          <ArrowBack />
        </button>

        <h2 className="section-heading mb-3 text-xl">
          {state ? "Edit Warehouse" : "Add a New Warehouse"}
        </h2>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start space-y-3 w-full"
        >
          <Input
            label="ERP Name"
            value={form?.erp_name}
            onChangeFunc={(val) => handleChange("erp_name", val)}
            placeholder="Enter ERP Name"
            formError={errors.erp_name}
            showFormError={formTwo?.showFormError}
            required
          />

          <Input
            label="Warehouse Name"
            value={form?.name}
            onChangeFunc={(val) => handleChange("name", val)}
            placeholder="Enter Warehouse Name"
            formError={errors.name}
            showFormError={formTwo?.showFormError}
            required
          />

          <CountryListDropdown
            label="Select Country"
            placeholder="Select country"
            onClick={(val) => {
              handleChange("country", val);
            }}
            value={form.country}
            formError={errors.country}
            showFormError={formTwo?.showFormError}
            fullWidth
          />

          <Select
            label="Select State"
            placeholder="Select state"
            options={states}
            onChange={(val) => handleChange("state", val?.value)}
            value={stateValue}
            formError={errors.state}
            showFormError={formTwo?.showFormError}
            fullWidth
          />
          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              type="submit"
              text={state ? "Save Changes" : "Add New Warehouse"}
              isLoading={editWareHouseLoading || createWareHouseLoading}
              fullWidth
            />
            {state && (
              <DeleteButton
                onClick={() =>
                  setCurrentTxnDetails({
                    ...state,
                    modalType: "delete",
                  })
                }
                text={`${state?.archive ? "Unarchive" : "Archive"} Warehouse`}
              />
            )}
          </div>
        </form>
      </div>

      <DetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
    </>
  );
};
export default observer(CreateProvider);
