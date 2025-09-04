import React, { useState } from "react";
import Textarea from "components/General/Textarea/Textarea";
import Button from "components/General/Button/Button";
import Toggle from "components/General/Toggle";

const ReturnPolicySettings = () => {
  const [formData, setFormData] = useState({
    hasReturnPolicy: true,
    policyDetails:
      "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Customer is responsible for return shipping costs unless item is defective or incorrect.",
  });

  const handleToggleChange = (value, type) => {
    if (type === "yes") {
      setFormData((prev) => ({
        ...prev,
        hasReturnPolicy: true,
      }));
    } else if (type === "no") {
      setFormData((prev) => ({
        ...prev,
        hasReturnPolicy: false,
        policyDetails: "", // Clear policy details if no return policy
      }));
    }
  };

  const handleTextareaChange = (value, meta) => {
    setFormData((prev) => ({
      ...prev,
      [meta.name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving return policy settings:", formData);
    // Handle save logic here
  };

  const handleCancel = () => {
    console.log("Cancelling return policy changes");
    // Handle cancel logic here - could reset to original values
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-10">
        <h2
          style={{
            fontSize: "17px",
            fontWeight: "bold",
            color: "#050505",
            marginBottom: "6px",
          }}
        >
          Return Policy
        </h2>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          Setup your return policy on your product and give details if any.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: "40px" }}>
        {/* Return Policy Toggle Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div
            style={{
              fontSize: "14px",
              color: "#111111",
              marginBottom: "12px",
              flex: 1,
            }}
          >
            Do you have return policy on your products?
          </div>

          <div className="flex flex-row gap-4">
            <Toggle
              label="Yes"
              isOn={formData.hasReturnPolicy === true}
              onToggle={() => handleToggleChange(true, "yes")}
            />
            <Toggle
              label="No"
              isOn={formData.hasReturnPolicy === false}
              onToggle={() => handleToggleChange(false, "no")}
            />
          </div>
        </div>

        {/* Policy Details Textarea */}
        <div style={{ marginTop: "20px", marginBottom: "36px" }}>
          <Textarea
            label="Policy Details"
            name="policyDetails"
            value={formData.policyDetails}
            onChangeFunc={handleTextareaChange}
            placeholder="Enter your return policy details here..."
            rows={6}
            disabled={!formData.hasReturnPolicy}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 justify-end">
          <Button
            text="Cancel"
            isOutline
            onClick={handleCancel}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
          <Button
            text="Save"
            onClick={handleSave}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicySettings;
