import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "classnames";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { trimArrayOfObject } from "utils/formatter";
import { ReactComponent as Overview } from "assets/icons/overview.svg";
import { ReactComponent as Products } from "assets/icons/products.svg";
import { ReactComponent as Staff } from "assets/icons/staff.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery.svg";
import { ReactComponent as Settings } from "assets/icons/settings.svg";

import Logo from "assets/images/logo-main.png";
import LogoSmall from "assets/images/logo-small.png";
import {
  TbBrandBlogger,
  TbBrandDenodo,
  TbCategory2,
  TbPackageImport,
} from "react-icons/tb";
import {
  PiArrowsInLineVerticalDuotone,
  PiArrowsOutLineHorizontalDuotone,
  PiUsersThree,
} from "react-icons/pi";
import BackDrop from "components/Layout/BackDrop";
import ProviderCard from "./ProviderCard";
import {
  MdOutlineCardGiftcard,
  // MdOutlineForwardToInbox,
  MdOutlineInventory,
  MdOutlinePayments,
  MdOutlinePeopleAlt,
  MdOutlineRemoveShoppingCart,
  // MdOutlineStorage,
  MdOutlineReviews,
} from "react-icons/md";
import { FcBusinesswoman } from "react-icons/fc";

import WareHousesStore from "pages/Dashboard/WareHouses/store";
import ProductsStore from "pages/Dashboard/Products/store";
import { observer } from "mobx-react-lite";
import { getUserInfoFromStorage } from "utils/storage";
import { GiReceiveMoney } from "react-icons/gi";
import AuthStore from "pages/OnBoarding/SignIn/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import { IS_DEV } from "utils/appConstant";

const getLinks = (warehouse_id, user, roles) => {
  const userIsBrandStaff = roles?.userIsBrandStaff;
  const userIsCustomerSupport = roles?.userIsCustomerSupport;
  const userIsAllBrandStaff = roles?.userIsAllBrandStaff;
  const userIsGeneralAdmin = roles?.userIsGeneralAdmin;
  const userIsDeveloperStaff = roles?.userIsDeveloperStaff;
  const userIsMarketingStaff = roles?.userIsMarketingStaff;
  const userIsWarehouseAdmin = roles?.userIsWarehouseAdmin;
  const userIsWarehouseStaff = roles?.userIsWarehouseStaff;
  const userIsGeneralAdminOrDeveloper =
    userIsGeneralAdmin || userIsDeveloperStaff;

  return userIsCustomerSupport
    ? [
        {
          title: "Orders",
          slug: "/dashboard/orders",
          label: "Here’s what’s happening with Beautyhut today.",
          link: `/dashboard/orders/${warehouse_id}`,
          icon: (
            <TbPackageImport
              size={24}
              className="stroke-current transition-all duration-500 ease-in-out"
            />
          ),
        },
      ]
    : [
        userIsGeneralAdminOrDeveloper || userIsBrandStaff
          ? {
              title: "Overview",
              heading: `Welcome, ${user?.firstName}`,
              label: "Here’s what’s happening with Beautyhut today.",
              slug: "/dashboard/home",
              link: `/dashboard/home/${warehouse_id}`,
              icon: (
                <Overview className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
              ),
            }
          : {},
        ...(userIsBrandStaff
          ? []
          : [
              userIsMarketingStaff || userIsAllBrandStaff
                ? {}
                : {
                    title: "Orders",
                    slug: "/dashboard/orders",
                    label: "Here’s what’s happening with Beautyhut today.",
                    link: `/dashboard/orders/${warehouse_id}`,
                    icon: (
                      <TbPackageImport
                        size={24}
                        className="stroke-current transition-all duration-500 ease-in-out"
                      />
                    ),
                  },
              ...(userIsWarehouseStaff
                ? []
                : userIsMarketingStaff
                ? [
                    {
                      title: "Marketing",
                      slug: "/dashboard/marketing",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/marketing/${warehouse_id}/?tab=discounts`,
                      icon: (
                        <Gallery className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
                      ),
                    },
                  ]
                : userIsAllBrandStaff
                ? [
                    {
                      title: "Brands",
                      slug: "/dashboard/brands",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/brands/${warehouse_id}`,
                      icon: (
                        <TbBrandDenodo
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },
                  ]
                : [
                    {
                      title: "Products",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/products/${warehouse_id}`,
                      slug: "/dashboard/products",
                      icon: (
                        <Products className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
                      ),
                    },
                    IS_DEV
                      ? {
                          title: (
                            <p>
                              Variants with
                              <br /> wrong order
                            </p>
                          ),
                          label:
                            "Here’s what’s happening with Beautyhut today.",
                          link: `/dashboard/variants/${warehouse_id}`,
                          slug: "/dashboard/variants",
                          icon: (
                            <Products className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
                          ),
                        }
                      : {},
                    {
                      title: "Inventory",
                      slug: "/dashboard/inventory",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/inventory/${warehouse_id}`,
                      icon: (
                        <MdOutlineInventory
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },
                    {
                      title: "Categories",
                      slug: "/dashboard/categories",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/categories/${warehouse_id}`,
                      icon: (
                        <TbCategory2
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },
                    {
                      title: "Brands",
                      slug: "/dashboard/brands",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/brands/${warehouse_id}`,
                      icon: (
                        <TbBrandDenodo
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },
                  ]),
              ...(userIsGeneralAdminOrDeveloper
                ? [
                    {
                      title: "Reviews",
                      slug: "/dashboard/reviews",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/reviews/${warehouse_id}`,
                      icon: (
                        <MdOutlineReviews
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },
                    {
                      title: "Affiliate Marketers",
                      slug: "/dashboard/affiliate-marketers",
                      heading: "Manage Affiliate Marketers",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/affiliate-marketers/${warehouse_id}`,
                      icon: (
                        <FcBusinesswoman
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },
                    {
                      title: "Donations",
                      slug: "/dashboard/donations",
                      heading: "Manage Donations",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/donations/${warehouse_id}`,
                      icon: (
                        <GiReceiveMoney
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },

                    {
                      title: "Staff",
                      slug: "/dashboard/staffs",
                      heading: "Manage Staffs",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/staffs/${warehouse_id}`,
                      icon: (
                        <Staff className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
                      ),
                    },
                    {
                      title: "Users",
                      slug: "/dashboard/users",
                      heading: "Manage Users",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/users/${warehouse_id}`,
                      icon: (
                        <PiUsersThree
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },

                    {
                      title: "Marketing",
                      slug: "/dashboard/marketing",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/marketing/${warehouse_id}/?tab=discounts`,
                      icon: (
                        <Gallery className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
                      ),
                    },
                    {
                      title: "Blog",
                      slug: "/dashboard/blog",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/blog/${warehouse_id}/`,
                      icon: (
                        <TbBrandBlogger
                          size={24}
                          className="stroke-current transition-all duration-500 ease-in-out"
                        />
                      ),
                    },
                    {
                      title: "Gift Cards",
                      slug: "/dashboard/gift-cards",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/gift-cards/${warehouse_id}/`,
                      icon: (
                        <Settings className="stroke-current sidenav-item-alt  transition-all duration-500 ease-in-out" />
                      ),
                    },
                    {
                      title: "Settings",
                      slug: "/dashboard/settings",
                      label: "Here’s what’s happening with Beautyhut today.",
                      link: `/dashboard/settings/${warehouse_id}/?tab=warehouses`,
                      icon: (
                        <Settings className="stroke-current sidenav-item-alt  transition-all duration-500 ease-in-out" />
                      ),
                    },
                  ]
                : []),
            ].filter((item) => item?.title)),
      ];
};

const SideNav = ({
  sidenavOpen,
  setSidenavOpen,
  withBackDrop,
  sidenavCollapsed,
  setSidenavCollapsed,
}) => {
  const { warehouse_id } = useParams();
  const { user } = getUserInfoFromStorage();
  const navigate = useNavigate();
  const {
    userIsGeneralAdmin,
    userIsBrandStaff,
    userIsWarehouseAdmin,
    userIsWarehouseStaff,
    userIsDeveloperStaff,
    userIsMarketingStaff,
    userIsAllBrandStaff,
    userIsCustomerSupport,
  } = AuthStore;

  const { getBrand, getBrandLoading, brand } = BrandsStore;

  const links = useMemo(
    () =>
      getLinks(warehouse_id, user, {
        userIsGeneralAdmin,
        userIsBrandStaff,
        userIsWarehouseAdmin,
        userIsWarehouseStaff,
        userIsDeveloperStaff,
        userIsMarketingStaff,
        userIsAllBrandStaff,
        userIsCustomerSupport,
      }),
    [
      warehouse_id,
      user,
      userIsGeneralAdmin,
      userIsBrandStaff,
      userIsAllBrandStaff,
    ]
  );

  const { getWarehouse, warehouse, getWareHouseLoading } = WareHousesStore;
  const { resetProductStore } = ProductsStore;
  useEffect(() => {
    warehouse_id &&
      !userIsBrandStaff &&
      getWarehouse({ data: { id: warehouse_id } });
  }, [warehouse_id, location.pathname, userIsBrandStaff]);
  useEffect(() => {
    warehouse_id &&
      userIsBrandStaff &&
      getBrand({ data: { id: warehouse_id } });
  }, [warehouse_id, location.pathname, userIsBrandStaff]);

  const handleLinks = (url) => {
    return {
      to: url,
    };
  };

  const brandName = brand?.brandName;

  return (
    <>
      {withBackDrop && (
        <BackDrop
          active={sidenavOpen}
          onClick={() => setSidenavOpen(!sidenavOpen)}
          className="z-[9996]"
        />
      )}
      <aside
        className={clsx(
          `sidenav left-0 z-[9997] h-screen md:py-4 flex flex-col flex-grow  transition-transform duration-150 ease-in-out overflow-y-auto border-r border-grey-bordercolor`,
          { "w-[100px]": sidenavCollapsed, "w-[250px]": !sidenavCollapsed },
          { "translate-x-[0]": sidenavOpen },
          { "-translate-x-[250px]": !sidenavOpen },
          { "lg:hidden !mt-0 h-screen": withBackDrop },
          "lg:translate-x-0 fixed bg-black z-[9997]"
        )}
      >
        <div className="bg-grey-dark3 w-full mb-2">
          <div className="pl-9 pr-3.5 py-3.5 flex flex-col justify-start items-start gap-1 w-full overflow-hidden">
            <div className="flex text-white">
              <span className=" text-xl font-600">
                {sidenavCollapsed ? (
                  <img
                    alt="logo"
                    src={LogoSmall}
                    className="w-[50px] h-[40px]"
                  />
                ) : (
                  <img alt="logo" src={Logo} className="w-[120px] h-[60px]" />
                )}
              </span>
            </div>

            {userIsBrandStaff ? (
              <span className="text-white text-base">
                {sidenavCollapsed
                  ? brandName?.substring(0, 2)
                  : brandName + " Dashboard"}
              </span>
            ) : (
              <span className="text-grey-23 text-base">
                {sidenavCollapsed ? user?.role?.substring(0, 2) : user?.role}
              </span>
            )}
          </div>
        </div>

        <span
          onClick={() => setSidenavCollapsed(!sidenavCollapsed)}
          className="text-white ml-auto mr-6 mb-2 cursor-pointer p-3 rounded-full hover:bg-grey-dark3 transition-colors duration-300 ease-in-out"
        >
          {sidenavCollapsed ? (
            <PiArrowsOutLineHorizontalDuotone
              size={22}
              className="fill-current"
            />
          ) : (
            <PiArrowsInLineVerticalDuotone
              size={22}
              className="fill-current rotate-90 "
            />
          )}
        </span>
        <div className="w-full md:h-full space-y-[21px] md:space-y-6 pb-[15px] pr-4">
          <div className=" flex flex-col justify-start items-start pl-3 md:pl-6 w-full cursor-pointer transition-all duration-1000 ease-in-out pb-28">
            {!userIsBrandStaff && (
              <div
                onClick={() => {
                  if (!userIsGeneralAdmin && !userIsCustomerSupport) return;
                  navigate("/warehouses");
                }}
                className="w-full"
              >
                <ProviderCard
                  provider={warehouse}
                  sidenavCollapsed={sidenavCollapsed}
                  getWareHouseLoading={getWareHouseLoading}
                />
              </div>
            )}

            {trimArrayOfObject(links).map(({ title, icon, link, slug }) => (
              <>
                <Link key={title} {...handleLinks(link)}>
                  <div
                    className={`flex justify-center mt-5 items-center hover:translate-x-3 hover:text-grey-text text-grey-text6 text-sm space-x-2 font-semibold transition-all duration-300 ease-in-out ${
                      location?.pathname?.includes(slug || link) &&
                      "!text-white"
                    }`}
                  >
                    {icon}
                    {!sidenavCollapsed && (
                      <span className="text-current text-base md:text-lg capitalize transition-all duration-500 ease-in-out">
                        {title}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

SideNav.propTypes = {
  sidenavOpen: PropTypes.bool,
  withBackDrop: PropTypes.bool,
  setSidenavOpen: PropTypes.func,
  sidenavCollapsed: PropTypes.bool,
  setSidenavCollapsed: PropTypes.func,
};
export { getLinks };
export default observer(SideNav);
