import styled from "styled-components";

export const TimePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #e1e1e1;
  align-items: center;
  width: 100%;
  padding: 0 16px;
  height: 44px;
  border-radius: 8px;

  &.time-is-active {
    border: 0.5px solid #5444f2;
  }

  input {
    font-size: 16px;
    height: 100%;
    outline: none;
  }

  input[type="time"]::-webkit-calendar-picker-indicator {
    position: absolute;
    width: 100%;
    left: 30px;
    opacity: 0;
  }

  .clock-icon {
  }
`;

export const RadioInputWrapper = styled.div`
  display: flex;
  align-items: ${(props) => (props.align ? props.align : "center")};

  input[type="radio"] {
    -webkit-appearance: none;
    appearance: none;
    flex-shrink: 0;
    background-color: #fff;
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 16px;
    height: 16px;
    border: 1.5px solid #cecbf7;
    border-radius: 50%;
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;
    margin-right: ${(props) => (props.spacing ? props.spacing + "px" : 0)};
  }

  input[type="radio"]:checked {
    border: 1.5px solid #000000;
  }

  input[type="radio"]::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #000000;
    background-color: CanvasText;
  }

  input[type="radio"]:checked::before {
    transform: scale(1);
  }
`;
