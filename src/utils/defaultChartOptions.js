import { numberWithCommas, numberFormatter } from "./formatter";
const setDefaultBarOptions = (currency) => {
  const defaultBarOptions = {
    chart: {
      height: 300,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
        colors: {
          ranges: [
            {
              from: 0,
              to: 1,
              color: "red",
            },
          ],
          backgroundBarColors: [],
          backgroundBarOpacity: 0,
          backgroundBarRadius: 0,
        },
      },
    },
    fill: {
      colors: ["#F5F6FA"],
      type: "solid",
    },

    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0.15,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0.35,
          colors: ["#000"],
          style: {
            fontSize: "2px",
            colors: ["#5444f2"],
            fontWeight: "100",
          },
        },
      },
    },

    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: ["#E1E1E1"],
      width: 0.5,
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#red"],
      },
    },

    xaxis: {
      categories: [],
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          fontSize: "2px",
          colors: [
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
            "#65717C",
          ],
          fontWeight: "100",
        },
        formatter: function (val) {
          return val + "";
        },
      },
      crosshairs: {
        show: false,
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#5444F2",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
    },

    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          fontSize: "2px",
          colors: ["#65717C"],
          fontWeight: "100",
        },
        formatter: function (val) {
          return numberFormatter(parseInt(val), 2) + "";
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="apex_custom_tooltip">' +
          "<span>" +
          w.globals.labels[dataPointIndex] +
          ": " +
          currency +
          " " +
          numberWithCommas(series[seriesIndex][dataPointIndex]) +
          "</span>" +
          "</div>"
        );
      },
    },
  };

  return defaultBarOptions;
};

const defaultBarSeries = [
  {
    name: "Inflow Wallet Overview",
    data: [],
  },
];
const setDefaultLineOptions = (labels, data) => {
  const defaultLineOptions = {
    labels,
    datasets: [
      {
        label: "Payout",
        data,
        borderColor: "#5444F2",
        backgroundColor: "#5444F2",
      },
    ],
  };
  return defaultLineOptions;
};
const defaultLineSeries = [
  {
    name: "Inflation",
    type: "line",
    data: [450000, 1400000, 300000, 750000, 350000, 500000, 250000],
  },

  {
    name: "Inflation 2",
    type: "line",
    data: [550000, 1100000, 200000, 250000, 300000, 570000, 1300000],
  },
];

const setDefaultDonutOptions = (label, width) => {
  const defaultDonutOptions = {
    chart: {
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    labels: ["Unpaid orders", "Paid orders"],
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: ["#F5F6FA", "#5444F2"],
      width: 1,
      dashArray: 0,
    },
    plotOptions: {
      pie: {
        customScale: width < 415 ? 0.95 : 0.75,
        expandOnClick: false,
        donut: {
          size: width < 415 ? 120 : 115,
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "8px",
              fontFamily: "AvenirRegular, Arial, sans-serif",
              fontWeight: 100,
              color: "#65717C",
              // offsetY: -10,
              formatter: function (val, e, w) {
                const totalVal = w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
                return numberFormatter(totalVal);
              },
            },
            value: {
              show: true,
              fontSize: "8px",
              fontFamily: "AvenirRegular, Arial, sans-serif",
              fontWeight: 100,
              color: "#65717C",
              // offsetY: -10,
              formatter: function (val, e, w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
              },
            },
            total: {
              show: true,
              showAlways: true,
              label,
              fontSize: "20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 500,
              color: "#000000",
              formatter: function (w, e, f) {
                return w?.config?.plotOptions?.pie?.donut?.labels?.total?.label;
              },
            },
          },
        },
      },
    },

    legend: {
      show: false,
    },
    fill: {
      colors: ["#F5F6FA", "#5444F2"],
      type: "solid",
    },
  };

  return defaultDonutOptions;
};

const setDefaultBranchPieOptions = (label, width) => {
  const defaultDonutOptions = {
    chart: {
      type: "pie",
    },
    dataLabels: {
      enabled: false,
    },
    labels: ["Other Branches", "This Branch"],
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: ["#F5F6FA", "#5444F2"],
      width: 1,
      dashArray: 0,
    },
    plotOptions: {
      pie: {
        customScale: width < 415 ? 0.7 : 1,
        expandOnClick: false,
        pie: {
          size: width < 415 ? 120 : 100,
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "8px",
              fontFamily: "AvenirRegular, Arial, sans-serif",
              fontWeight: 100,
              color: "#65717C",
              // offsetY: -10,
              formatter: function (val, e, w) {
                const totalVal = w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
                return numberFormatter(totalVal);
              },
            },
            value: {
              show: true,
              fontSize: "8px",
              fontFamily: "AvenirRegular, Arial, sans-serif",
              fontWeight: 100,
              color: "#65717C",
              // offsetY: -10,
              formatter: function (val, e, w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
              },
            },
            total: {
              show: true,
              showAlways: true,
              label,
              fontSize: "20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 500,
              color: "#000000",
              formatter: function (w, e, f) {
                return w?.config?.plotOptions?.pie?.donut?.labels?.total?.label;
              },
            },
          },
        },
      },
    },

    legend: {
      show: false,
    },
    fill: {
      colors: ["#F5F6FA", "#5444F2"],
      type: "solid",
    },
  };

  return defaultDonutOptions;
};

export {
  setDefaultBarOptions,
  defaultBarSeries,
  defaultLineSeries,
  setDefaultLineOptions,
  setDefaultDonutOptions,
  setDefaultBranchPieOptions,
};
