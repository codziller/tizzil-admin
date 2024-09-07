import React from "react";
import PropTypes from "prop-types";
import Rating from "react-rating";

import { ReactComponent as EmptyGrade } from "assets/icons/empty-grade.svg";
import { ReactComponent as FillGrade } from "assets/icons/fill-grade.svg";
const AppRating = ({ ...rest }) => {
  return (
    <div className="flex justify-start items-center w-fit gap-x-2 ">
      {
        <Rating
          emptySymbol={<EmptyGrade />}
          fullSymbol={<FillGrade />}
          {...rest}
        />
      }
    </div>
  );
};
AppRating.propTypes = {
  rest: PropTypes.object,
};
export default AppRating;
