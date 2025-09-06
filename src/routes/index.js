import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "components/ProtectedRoute";
import Home from "pages/Dashboard/Home";
import HomePage from "pages/Dashboard/Home/features";
import ProviderDashboard from "pages/Dashboard/WareHouses";
import ProvidersList from "pages/Dashboard/WareHouses/features/ProvidersList";
import CreateProvider from "pages/Dashboard/WareHouses/features/CreateProvider";
import Successful from "pages/Dashboard/WareHouses/features/Successful";
import SignIn from "pages/OnBoarding/SignIn/features";
import SignInAdmin from "pages/OnBoarding/SignIn/features/AdminLogin";
import SignInPage from "pages/OnBoarding/SignIn";
import SignUp from "pages/OnBoarding/SignUp/features";
import SignUpPage from "pages/OnBoarding/SignUp";
import AccountSetup from "pages/OnBoarding/AccountSetup";
import Logs from "pages/Dashboard/Log";
import ListOfLogs from "pages/Dashboard/Log/features";
import ProductsPage from "pages/Dashboard/Products/features";
import ProductCategoriesPage from "pages/Dashboard/Products/features/categories";
import ProductCollectionsPage from "pages/Dashboard/Products/features/collections";
import Products from "pages/Dashboard/Products";
import AddProduct from "pages/Dashboard/Products/features/AddProduct";
import StaffPage from "pages/Dashboard/Staff/features";
import Staff from "pages/Dashboard/Staff";
import PromoPage from "pages/Dashboard/Promo/features";
import Promo from "pages/Dashboard/Promo";
import AddPromo from "pages/Dashboard/Promo/features/AddPromo";
import Marketing from "pages/Dashboard/Marketing";
import AddHomePageSlider from "pages/Dashboard/Marketing/features/AddHomePageSlider";
import MarketingPage from "pages/Dashboard/Marketing/features";
import FeaturedSectionPage from "pages/Dashboard/FeaturedSection/features";
import FeaturedSection from "pages/Dashboard/FeaturedSection";
import Orders from "pages/Dashboard/Orders";
import OrdersPage from "pages/Dashboard/Orders/features";
import OrderDetailsPage from "pages/Dashboard/Orders/features/OrderDetailsPage";
import Inventory from "pages/Dashboard/Inventory";
import InventoryPage from "pages/Dashboard/Inventory/features";
import Categories from "pages/Dashboard/Categories";
import CategoriesPage from "pages/Dashboard/Categories/features";
import BackInStock from "pages/Dashboard/BackInStock";
import BackInStockPage from "pages/Dashboard/BackInStock/features";
import Brands from "pages/Dashboard/Brands";
import BrandsPage from "pages/Dashboard/Brands/features";
import BrandDetails from "pages/Dashboard/Brands/features/Brand";
import AbandonedCarts from "pages/Dashboard/AbandonedCarts";
import AbandonedCartsPage from "pages/Dashboard/AbandonedCarts/features";
import GiftCards from "pages/Dashboard/GiftCards";
import GiftCardsPage from "pages/Dashboard/GiftCards/features";
import AddGiftCards from "pages/Dashboard/GiftCards/features/AddForm";
import Subscriptions from "pages/Dashboard/Subscriptions";
import SubscriptionsPage from "pages/Dashboard/Subscriptions/features";
import Discounts from "pages/Dashboard/Discounts";
import DiscountsPage from "pages/Dashboard/Discounts/features";
import AddDiscounts from "pages/Dashboard/Discounts/features/AddForm";
import Referrals from "pages/Dashboard/Referrals";
import ReferralsPage from "pages/Dashboard/Referrals/features";
import Payments from "pages/Dashboard/Payments";
import PaymentsPage from "pages/Dashboard/Payments/features";
import AddMarketer from "pages/Dashboard/AffiliateMarketers/features/AddMarketer";
import AffiliateMarketers from "pages/Dashboard/AffiliateMarketers";
import AffiliateMarketersPage from "pages/Dashboard/AffiliateMarketers/features";
import Users from "pages/Dashboard/Users";
import UsersPage from "pages/Dashboard/Users/features";
import AddUser from "pages/Dashboard/Users/features/AddUser";
import Donations from "pages/Dashboard/Donations";
import DonationsPage from "pages/Dashboard/Donations/features";
import AddHomePagePost from "pages/Dashboard/Marketing/features/AddHomePagePost";
import AddMobilePagePost from "pages/Dashboard/Marketing/features/AddMobilePagePost";
import AddPromoBanner from "pages/Dashboard/Marketing/features/AddPromoBanner";
import AddMobileMarketingImage from "pages/Dashboard/Marketing/features/AddMobileMarketingImage";
import AddMobileHeaderNavDiscountBanner from "pages/Dashboard/Marketing/features/AddMobileHeaderNavDiscountBanner";
import AddDiscount from "pages/Dashboard/Marketing/features/AddDiscount";
import AddStaff from "pages/Dashboard/Staff/features/AddStaff";
import AddMobileBrandsOfTheMoment from "pages/Dashboard/Marketing/features/AddMobileBrandsOfTheMoment";
import EditInventory from "pages/Dashboard/Inventory/features/EditInventory";
import AddWebMarketingImage from "pages/Dashboard/Marketing/features/AddWebMarketingImage";
import AddWebLinkMarketingImage from "pages/Dashboard/Marketing/features/AddWebLinkMarketingImage";
import Reviews from "pages/Dashboard/Reviews";
import ReviewsPage from "pages/Dashboard/Reviews/features";
import ExchangeRate from "pages/Dashboard/Settings";
import ExchangeRatePage from "pages/Dashboard/Settings/features";
import VariantsPage from "pages/Dashboard/Products/features/VariantsPage";

import BlogPage from "pages/Dashboard/Blog/features";
import Blog from "pages/Dashboard/Blog";
import AddBlog from "pages/Dashboard/Blog/features/AddBlog";
import Activity from "pages/Dashboard/GiftCards/features/activity";
import GiftCardDesigns from "pages/Dashboard/GiftCards/features/giftCardDesigns";
import Wallet from "pages/Dashboard/Wallet";
import WalletPage from "pages/Dashboard/Wallet/features";
import DiscoverUsers from "pages/Dashboard/Users/features/DiscoverUsers";
import AdminUsers from "pages/Dashboard/Users/features/AdminUsers";

const Router = () => {
  return (
    <>
      <Routes>
        {/* providers */}
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute path="">
              <ProviderDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ProvidersList />} />
          <Route
            path="/warehouses/create_warehouse"
            element={<CreateProvider />}
          />
          <Route path="/warehouses/successful" element={<Successful />} />
        </Route>
        {/* end providers */}

        {/* home */}
        <Route
          path="/dashboard/home"
          element={
            <ProtectedRoute path="">
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<HomePage />} />
        </Route>
        {/* end home */}

        {/* products */}
        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute path="">
              <Products />
            </ProtectedRoute>
          }
        >
          <Route path="all" element={<ProductsPage />} />
          <Route path="categories" element={<ProductCategoriesPage />} />
          <Route path="collections" element={<ProductCollectionsPage />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="edit/:product_id" element={<AddProduct />} />
          <Route path="view/:product_id" element={<AddProduct />} />
        </Route>
        {/* end products */}

        {/* variants */}
        <Route
          path="/dashboard/variants"
          element={
            <ProtectedRoute path="">
              <Products />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<VariantsPage />} />
        </Route>
        {/* end variants */}

        {/* affiliate-marketers */}
        <Route
          path="/dashboard/affiliate-marketers"
          element={
            <ProtectedRoute path="">
              <AffiliateMarketers />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<AffiliateMarketersPage />} />
          <Route path="add/:warehouse_id" element={<AddMarketer />} />
          <Route
            path="edit/:warehouse_id/:affiliateMarketer_id"
            element={<AddMarketer />}
          />
        </Route>
        {/* end affiliate-marketers */}

        {/* donations */}
        <Route
          path="/dashboard/donations"
          element={
            <ProtectedRoute path="">
              <Donations />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<DonationsPage />} />
        </Route>
        {/* end affiliate-marketers */}

        {/* orders */}
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute path="">
              <Orders />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<OrdersPage />} />

          <Route path=":order_id" element={<OrderDetailsPage />} />
        </Route>
        {/* end orders */}

        {/* inventory */}
        <Route
          path="/dashboard/inventory"
          element={
            <ProtectedRoute path="">
              <Inventory />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<InventoryPage />} />
          <Route
            path="edit/:warehouse_id/:product_id"
            element={<EditInventory />}
          />
        </Route>
        {/* end inventory */}

        {/* brands */}
        <Route
          path="/dashboard/brands"
          element={
            <ProtectedRoute path="">
              <Brands />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<BrandsPage />} />
          <Route
            path="view/:warehouse_id/:brand_id"
            element={<BrandDetails />}
          />
        </Route>
        {/* end brands */}

        {/* reviews */}
        <Route
          path="/dashboard/reviews"
          element={
            <ProtectedRoute path="">
              <Reviews />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ReviewsPage />} />
        </Route>
        {/* end reviews */}

        {/* categories */}
        <Route
          path="/dashboard/categories"
          element={
            <ProtectedRoute path="">
              <Categories />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<CategoriesPage />} />
        </Route>
        {/* end categories */}

        {/* back-in-stock */}
        <Route
          path="/dashboard/back-in-stock"
          element={
            <ProtectedRoute path="">
              <BackInStock />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<BackInStockPage />} />
        </Route>
        {/* end back-in-stock */}

        {/* abandoned-carts */}
        <Route
          path="/dashboard/abandoned-carts"
          element={
            <ProtectedRoute path="">
              <AbandonedCarts />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<AbandonedCartsPage />} />
        </Route>
        {/* end abandoned-carts */}

        {/* staff */}
        <Route
          path="/dashboard/staffs"
          element={
            <ProtectedRoute path="">
              <Staff />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<StaffPage />} />
          <Route path="add/:warehouse_id" element={<AddStaff />} />
          <Route path="edit/:warehouse_id/:staff_id" element={<AddStaff />} />
        </Route>
        {/* end staff */}

        {/* customers */}
        <Route
          path="/dashboard/customers"
          element={
            <ProtectedRoute path="">
              <Users />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<UsersPage />} />
          <Route path="add/" element={<AddUser />} />
          <Route path="edit/:user_id" element={<AddUser />} />
        </Route>
        {/* end customers */}

        {/* customers */}
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute path="">
              <Users />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<AdminUsers />} />
        </Route>
        {/* end customers */}

        {/* users */}
        <Route
          path="/dashboard/discover-users"
          element={
            <ProtectedRoute path="">
              <Users />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<DiscoverUsers />} />
        </Route>
        {/* end users */}

        {/* blog */}
        <Route
          path="/dashboard/blog"
          element={
            <ProtectedRoute path="">
              <Blog />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<BlogPage />} />
          <Route path="add/:warehouse_id" element={<AddBlog />} />
          <Route path="edit/:warehouse_id/:blog_id" element={<AddBlog />} />
        </Route>
        {/* end blog */}

        {/* promo */}
        <Route
          path="/dashboard/promo"
          element={
            <ProtectedRoute path="">
              <Promo />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<PromoPage />} />
          <Route path="add-promo/:warehouse_id" element={<AddPromo />} />
        </Route>
        {/* end promo */}

        {/* gift-cards */}
        <Route
          path="/dashboard/gift-cards"
          element={
            <ProtectedRoute path="">
              <GiftCards />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<GiftCardsPage />} />
          <Route
            path="activity/:warehouse_id/:gift_card_id"
            element={<Activity />}
          />
          <Route path="designs/:warehouse_id" element={<GiftCardDesigns />} />
          <Route
            path="add-gift-cards/:warehouse_id"
            element={<AddGiftCards />}
          />
        </Route>
        {/* end promo */}

        {/* discounts */}
        <Route
          path="/dashboard/discounts"
          element={
            <ProtectedRoute path="">
              <Discounts />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<DiscountsPage />} />
          <Route
            path="add-discounts/:warehouse_id"
            element={<AddDiscounts />}
          />
        </Route>
        {/* end discounts */}

        {/* referrals */}
        <Route
          path="/dashboard/referrals"
          element={
            <ProtectedRoute path="">
              <Referrals />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ReferralsPage />} />
        </Route>
        {/* end referrals */}

        {/* subscriptions */}
        <Route
          path="/dashboard/subscriptions"
          element={
            <ProtectedRoute path="">
              <Subscriptions />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<SubscriptionsPage />} />
        </Route>
        {/* end subscriptions */}

        {/* payments */}
        <Route
          path="/dashboard/payments"
          element={
            <ProtectedRoute path="">
              <Payments />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<PaymentsPage />} />
        </Route>
        {/* end payments */}

        {/* marketing */}
        <Route
          path="/dashboard/marketing"
          element={
            <ProtectedRoute path="">
              <Marketing />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<MarketingPage />} />
          <Route
            path="add-homepage-slider/:warehouse_id/:position"
            element={<AddHomePageSlider />}
          />
          <Route
            path="edit/:warehouse_id/:position/:media_id"
            element={<AddHomePageSlider />}
          />
          <Route
            path="add-homepage-post/:warehouse_id/:position"
            element={<AddHomePagePost />}
          />
          <Route
            path="edit-homepage-post/:warehouse_id/:position/:media_id"
            element={<AddHomePagePost />}
          />
          <Route
            path="add-mobile-post/:warehouse_id/:position"
            element={<AddMobilePagePost />}
          />
          <Route
            path="edit-mobile-post/:warehouse_id/:position/:media_id"
            element={<AddMobilePagePost />}
          />
          <Route
            path="add-promo-banner/:warehouse_id/:position"
            element={<AddPromoBanner />}
          />
          <Route
            path="edit-promo-banner/:warehouse_id/:position/:media_id"
            element={<AddPromoBanner />}
          />
          <Route
            path="add-mobile-marketing-image/:warehouse_id/:position"
            element={<AddMobileMarketingImage />}
          />

          <Route
            path="edit-mobile-marketing-image/:warehouse_id/:position/:media_id"
            element={<AddMobileMarketingImage />}
          />
          <Route
            path="add-mobile-discount-banner/:warehouse_id/:position"
            element={<AddMobileHeaderNavDiscountBanner />}
          />
          <Route
            path="edit-mobile-discount-banner/:warehouse_id/:position/:media_id"
            element={<AddMobileHeaderNavDiscountBanner />}
          />
          <Route
            path="add-web-link-marketing-image/:warehouse_id/:position"
            element={<AddWebLinkMarketingImage />}
          />
          <Route
            path="edit-web-link-marketing-image/:warehouse_id/:position/:media_id"
            element={<AddWebLinkMarketingImage />}
          />
          <Route
            path="add-mobile-brand-of-the-moment/:warehouse_id/:position"
            element={<AddMobileBrandsOfTheMoment />}
          />
          <Route
            path="edit-mobile-brand-of-the-moment/:warehouse_id/:position/:media_id"
            element={<AddMobileBrandsOfTheMoment />}
          />
          <Route
            path="add-web-marketing-image/:warehouse_id/:position"
            element={<AddWebMarketingImage />}
          />
          <Route
            path="edit-web-marketing-image/:warehouse_id/:position/:media_id"
            element={<AddWebMarketingImage />}
          />
          <Route
            path="add-discount/:warehouse_id/:position"
            element={<AddDiscount />}
          />
          <Route
            path="edit-discount/:warehouse_id/:position/:media_id"
            element={<AddDiscount />}
          />
        </Route>
        {/* end media */}

        {/* settings */}
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute path="">
              <ExchangeRate />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ExchangeRatePage />} />
        </Route>

        {/* wallet */}
        <Route
          path="/dashboard/wallet"
          element={
            <ProtectedRoute path="">
              <Wallet />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<WalletPage />} />
        </Route>

        {/* featured-sections */}
        <Route
          path="/dashboard/featured-sections"
          element={
            <ProtectedRoute path="">
              <FeaturedSection />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<FeaturedSectionPage />} />
        </Route>
        {/* end featured-sections */}

        {/* team */}
        <Route
          path="/dashboard/logs"
          element={
            <ProtectedRoute path="">
              <Logs />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ListOfLogs />} />
        </Route>
        {/* end team */}

        <Route
          path="/auth/account-setup"
          element={
            <ProtectedRoute path="/auth/account-setup">
              <AccountSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/login"
          element={
            <ProtectedRoute path="/auth/login" notProtected>
              <SignInPage />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<SignIn />} />
          <Route path="admin" element={<SignInAdmin />} />
        </Route>

        <Route
          path="/auth/signup"
          element={
            <ProtectedRoute path="/auth/signup" notProtected>
              <SignUpPage />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<SignUp />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute path="/" notProtected>
              <SignInPage />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<SignIn />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
