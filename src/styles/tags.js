import styled from "styled-components";

export const OrderStatus = styled.p`
  padding: 1px 8px;
  background: #02ba81;
  border-radius: 4px;

  font-size: 12px;
  text-align: center;
  line-height: 20px;
  color: #f5f6fa;
  font-weight: 500;
  text-transform: capitalize;
  background: ${(props) => {
    switch (props.status) {
      case "paid":
        return "#02BA81";

      case "unpaid":
        return "#F3564D";

      case "part_paid":
      case "draft":
        return "#FFB413";

      default:
        return "#FFF";
    }
  }};
`;
