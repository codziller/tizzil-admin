import { observer } from "mobx-react-lite";
import AuthStore from "pages/OnBoarding/SignIn/store";
import Orders from "./orders";
import BrandOrders from "./BrandOrders";

const OrdersPage = () => {
  const { userIsBrandStaff } = AuthStore;
  return userIsBrandStaff ? <BrandOrders /> : <Orders />;
};
export default observer(OrdersPage);
