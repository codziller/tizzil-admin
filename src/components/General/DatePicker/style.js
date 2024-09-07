import styled from "styled-components";

export const DatePickerWrapper = styled.div`
  width: 100%;
  label {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 12px;
    color: #65717C;
    display: block;
  }  

  .datepicker-full-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-radius: 8px;
    border: 0.5px solid #e1e1e1;
    height: 44px;
    padding: 0 16px;
    border-radius: 8px;

    position: relative;

    .react-datepicker__tab-loop{
      ${(props) => {
        if (props.containerStyle) {
          return props.containerStyle;
        } else {
          return {
            top: "calc(100% + 16px)",
          };
        }
      }}
    
      width: 100%;
      left: 0;
      height: 100%;
      position: absolute;
    }

    .react-datepicker-popper {
      z-index: 100;
      width: 100%;
      padding: 0;
      position: relative !important;
      transform: none !important;;
    }

    .react-datepicker-wrapper,
    .react-datepicker__input-container,
    input {
      border-radius: 8px;
      height: 100%;
      width: 100%;
    }

    input {
      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
      color: #000000;
      outline: none;

      ::placeholder{
        color: #C1C1C1;
      }
    }

    .react-datepicker {
      width: 100%;
      
      .react-datepicker__triangle:before,
      .react-datepicker__triangle:after {
        display: none;
      }

      .react-datepicker__header {
        background: #ffffff;
        border:none;
        padding-top:0;
      }

      .react-datepicker__month-container {
        background: #ffffff;
        width: 100%;
        padding:16px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px #e1e7f2;
      }

      .react-datepicker__current-month{
          margin-bottom:16px;
          font-weight: 500;
          font-size: 14px;
          line-height: 18px;
          color: #000000;
      }

      .react-datepicker__week, .react-datepicker__day-names{
        display:flex;
        justify-content: space-between;
      }

      .react-datepicker__week:last-child .react-datepicker__day{
          margin-bottom:0;
       }

      .react-datepicker__day, .react-datepicker__day-name {
        cursor: pointer;
        margin:0;
        width: 14px;
        font-size: 14px;
        line-height: 18px;
        margin-bottom:16px;
      }

      .react-datepicker__day{
          color: #000000;
      }

      .react-datepicker__day-name {
         color: #65717C;
      }

    .react-datepicker__day.react-datepicker__day--selected{
        width:20px;
        height:20px;
        font-weight: 400;
        background: #F5F6FA;
        border: 1px solid #CECBF7;
        border-radius: 8px;
        color: #5444F2;
    }

    .react-datepicker__day--keyboard-selected, .react-datepicker__day--today{
        background: transparent;
    }

    .react-datepicker__day--disabled, 
    .react-datepicker__month-text--disabled, 
    .react-datepicker__quarter-text--disabled, 
    .react-datepicker__year-text--disabled {
      cursor: default;
      color: #ccc !important;
  }

  }


  .calendar-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:16px;

      .central-control{
        display: flex;
        align-items: center;
        justify-content: center;

          .month-controls{
            .month-arrow{
                width:14px;
                height:14px;
            }
          }

          .current-date{
            margin: 0 24px;

            select {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                font-weight: 500;
                font-size: 14px;
                line-height: 18px;
                color: #000000;
                outline:none;
             }

             .date-month{
                margin-right:4px;
             }
          }
      }
  }

  .datepicker-full-container.time-is-active {
    border: 0.5px solid #5444f2;
  }
`;
