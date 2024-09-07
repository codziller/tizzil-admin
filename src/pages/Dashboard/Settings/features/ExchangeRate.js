import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "components/General/Button/Button";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { NAIRA } from "utils/appConstant";
import Input from "components/General/Input/Input";
import { upperCase } from "lodash";

import SettingsStore from "../store";
import { observer } from "mobx-react-lite";

import cleanPayload from "utils/cleanPayload";
import { errorToast } from "components/General/Toast/Toast";
import Select from "components/General/Input/Select";
import { supportedIntlCountries, supportedLocalCountries } from "utils/data";
import Flag from "components/General/Flag";
import { numberWithCommas } from "utils/formatter";
import { convertToJs } from "utils/functions";

const Form = observer(() => {
  const intlCurrencyOptions = supportedIntlCountries();
  const localCurrencyOptions = supportedLocalCountries();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  const schema = yup.object({});
  const { editExchangeRate, exchangeRate, editExchangeRateLoading, loading } =
    SettingsStore;

  const defaultValues = {
    localCurrency: localCurrencyOptions?.[0] || "",
    localCurrencyValue: exchangeRate?.localCurrencyValue || "",
    intlCurrency: intlCurrencyOptions?.[0] || "",
    intlCurrencyValue: exchangeRate?.intlCurrencyValue || "1",
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

  const handleChange = async ({ prop, val }) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const form = {
    localCurrency: watch("localCurrency"),
    localCurrencyValue: watch("localCurrencyValue"),
    intlCurrency: watch("intlCurrency"),
    intlCurrencyValue: watch("intlCurrencyValue"),
  };

  const handleOnSubmit = async () => {
    try {
      const payload = {
        currency: form.intlCurrency?.value,
        exchangeAmount: parseFloat(form.localCurrencyValue),
      };

      cleanPayload(payload);

      await editExchangeRate({
        data: payload,
      });
    } catch (error) {
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
    }
  };

  return loading ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="w-full h-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 pb-4 w-full h-full">
              <h2 className="section-heading mb-8 text-xl">
                Exchange Rate Settings
              </h2>
              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col justify-start items-start gap-10 w-full h-full"
              >
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-center items-center gap-6">
                  {intlCurrencyOptions?.map((item) => {
                    const currItem = exchangeRate?.find(
                      (itm) => itm.currency === item.value
                    );
                    return (
                      <div
                        key={item.country}
                        className="w-full flex justify-center items-center box-shadow bg-white rounded-lg p-[4px]"
                      >
                        <div className="w-full flex flex-col justify-center items-start bg-red-light2 rounded-lg px-2 py-4 gap-3">
                          <div className="flex justify-center items-center gap-2 pb-3 border-b-1/2 border-grey-light3 w-full">
                            <span className="">
                              <Flag countryCode={item.country} />
                            </span>
                            <span className="text-xl font-700">
                              {numberWithCommas(item?.value)}
                            </span>
                          </div>

                          <div className="flex justify-center items-center gap-2 text-[20px] font-600 w-full">
                            {NAIRA}
                            {numberWithCommas(currItem?.value)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col md:flex-row justify-start items-start gap-10 md:w-[70%] w-full ">
                  <div className="flex flex-col justify-start items-start gap-4 w-full">
                    <Select
                      fullWidth
                      value={form.intlCurrency}
                      onChange={(val) =>
                        handleChange({ prop: "intlCurrency", val })
                      }
                      label="Select Intl Currency"
                      options={intlCurrencyOptions}
                      formatOptionLabel={(option) => (
                        <div className="flex flex-row items-center">
                          {option.country && (
                            <Flag countryCode={option.country} />
                          )}
                          <span className="text-black ml-3">
                            {option.value?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    />

                    <Input
                      value={form?.intlCurrencyValue}
                      onChangeFunc={(val) => {}}
                      isDisabled
                      placeholder={`Enter ${form?.intlCurrency?.value} value`}
                      formError={errors.intlCurrencyValue}
                      showFormError={formTwo?.showFormError}
                      prefix={upperCase(form?.intlCurrency?.value)}
                      type="number"
                      inputClassName="!bg-red-light2"
                    />

                    <div className="flex flex-wrap gap-4 items-center justify-start -mt-3">
                      {intlCurrencyOptions?.map((item) => {
                        return (
                          <span className="uppercase text-xs">
                            {item?.value}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-start gap-4 w-full">
                    <Select
                      fullWidth
                      value={form.localCurrency}
                      onChange={(val) =>
                        handleChange({ prop: "localCurrency", val })
                      }
                      label="Select Local Currency"
                      options={localCurrencyOptions}
                      formatOptionLabel={(option) => (
                        <div className="flex flex-row items-center">
                          {option.country && (
                            <Flag countryCode={option.country} />
                          )}
                          <span className="text-black ml-3">
                            {option.value?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    />

                    <Input
                      value={form?.localCurrencyValue}
                      onChangeFunc={(val) => {
                        handleChange({ prop: "localCurrencyValue", val });
                      }}
                      placeholder={`Enter ${form?.localCurrency?.value} value`}
                      formError={errors.localCurrencyValue}
                      showFormError={formTwo?.showFormError}
                      prefix={upperCase(form?.localCurrency?.value)}
                      type="number"
                      inputClassName="!bg-red-light2"
                    />

                    <div className="flex flex-wrap gap-4 items-center justify-start -mt-3">
                      {localCurrencyOptions?.map((item) => {
                        return (
                          <span className="uppercase text-xs">
                            {item?.value}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    setFormTwo({ ...formTwo, showFormError: true })
                  }
                  isLoading={editExchangeRateLoading}
                  type="submit"
                  text="Save Changes"
                  className="mb-5 max-w-[300px]"
                  fullWidth
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

const ExchangeRate = () => {
  const { loading, getExchangeRate, exchangeRate } = SettingsStore;

  useEffect(() => {
    getExchangeRate();
  }, []);

  return loading ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(ExchangeRate);
