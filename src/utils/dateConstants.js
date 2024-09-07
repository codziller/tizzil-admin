import moment from "moment";
const dateConstants = {
  today: moment().format("YYYY-MM-DD"),
  yesterday: moment().add(-1, "days").format("YYYY-MM-DD"),
  startOfWeek: moment().clone().startOf("week").format("YYYY-MM-DD"),
  endOfWeek: moment().clone().endOf("week").format("YYYY-MM-DD"),
  startOfMonth: moment().clone().startOf("month").format("YYYY-MM-DD"),
  endOfMonth: moment().clone().endOf("month").format("YYYY-MM-DD"),
  startOfLastMonth: moment()
    .add(-1, "month")
    .clone()
    .startOf("month")
    .format("YYYY-MM-DD"),
  endOfLastMonth: moment()
    .add(-1, "month")
    .clone()
    .endOf("month")
    .format("YYYY-MM-DD"),
  thisMonth: moment().format("MMMM"),
  lastMonth: moment().format("MMMM"),
  monthsOfYear: moment.months(),
  firstDay: "2023-01-01",
};
export default dateConstants;
