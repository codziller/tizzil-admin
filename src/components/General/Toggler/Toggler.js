import React from "react";
import PropTypes from "prop-types";

import Loading from "components/General/CircleLoader/CircleLoader";
import styles from "./style.module.css";
const Toggler = ({
  active,
  togglerFunc,
  disabled,
  size,
  loading,
  containerClass,
}) => {
  return (
    <div className={containerClass}>
      {loading ? (
        <Loading size="tiny" />
      ) : (
        <label
          className={`${size === "sm" ? styles.switchAlt : styles.switch} `}
        >
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => togglerFunc(e.target.checked)}
            disabled={disabled || loading}
          />
          <span
            className={`${styles.slider} ${styles.round} ${
              size === "sm" ? styles.sliderAlt : styles.round
            }`}
          ></span>
        </label>
      )}
    </div>
  );
};

Toggler.propTypes = {
  active: PropTypes.bool,
  togglerFunc: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  loading: PropTypes.bool,
  containerClass: PropTypes.string,
};

export default Toggler;
