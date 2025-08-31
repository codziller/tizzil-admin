# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Bani Merchant Dashboard Project Outline

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 📋 Pending Features/Fixes

- Important note before starting. Note that for every api call that you have to integrate, I'd provide the graphql query or mutation, as well as the file in src\services where the query/mutation should be added. So when integrating, add the query/mutation to the service file, integrate it in a corresponding store file, usually found in the store folder inside the page folder, eg. src\pages\OnBoarding\SignIn\store\index.js, then use it in the appropriate file or component, just like other integrations are done. don't forget to add any new page to src\routes\index.js. All inputs should have similar hover, active, and focus styles (shades of the primary color implemented elegantly).

Note that the dashboard is to be use by two main types of users; brand and tizzi admin. so when logging in, if response has user.userRole.name !== ADMIN, the user is a brand, else user is admin.

1. Note that the primary color of the project should now be #690007. Use the button src\components\General\Button\Button.js for buttons, make the default bg color the primary color, same as isOutline and other non specified color such as border color.

2. Update OnboardingDefault at src\components\OnboardingDefault\index.js so that on desktop and tabs, by the left of the layout, there's the image src\assets\images\login-image.png or src\assets\images\signup-image.png (depending on the current page), filling the full page height and 50% width on desktop, 40% width on tab, at the top (200px height) on mobile. The right side is where the children will be which will be the onboarding pages like Login, Signup, SignupOTP, ForgotPassword, AccountSetup etc. Create an onboarding header component and fix it at the top of the the onboarding header should be 70px height, background: #F6F7F103;
   Backdrop-filter: blur(12px), and the onboarding header should not take its space ontop of the layout but be over it so that with its transparent bg, the part of the layout behind is is visible. The Tizzi logo width: 91px; height: 24;
   (src\assets\logos\logo.svg) should be centrally placed at the center of the header.

3. Update the Login page at src\pages\OnBoarding\SignIn\features\Login.js so that the title (18px, #444444) and subtitle (14px, #000000) is changed to 'Tap in.' (All caps), and 'Log in to shop, drop, or just lurk.'.
   Add 'CREATE ACCOUNT' button (isOuline:true) 10px below the "Log in" button.

4. Implement Signup.js, It should be a form similar to Login with the fields firstName, lastName (beside each other), email, and password. The primary button will now be 'CREATE ACCOUNT' and isOutline button 10px below will be 'LOGIN'. title: 'Let’s get you in.', subtitle: 'Whether you’re here to shop or sell, you’re in the right place.'. implement the signup api into the store from src\services\auth.js just like in Login page. Once the initial signup call is made, call authSendVerificationMail with the email from the signup form, and route to SignUpOtp page on success, the user will be sent four digit otp.
   authSendVerificationMail(
   email: String!
   ): BoolSuccessResponseType!

type BoolSuccessResponseType {
status: Boolean!
}
Implement the SignUpOtp page, title - 'Verification Code', subtitle - 'We’ve sent a verification code to your email, kindly enter your code here.''. The otp fields should be below, use react18-input-otp and each otp input should have the style (width: 70; height: 60; border-radius: 4.36px; border: 1.09px #111111;), text style 28px, bold, #1E1E1E. 20px below otp fields, add 'Enter your code (0:59) (1 min count down with the timer color red)' and 'Not received? Resend with the resend being blue when enabled, i.e when timer is reset'. Note that these two will be beside each other with space between, and gap 0f 20px between them for good measure, font size 12px. Below these primary button 'Continue', isOutline button 'BACK TO LOGIN'. integrate authSignup to be called on continue.

authSignup(
dob: String
email: String!
firstName: String!
gender: USER_GENDERS
lastName: String!
otp: String!
password: String!
phoneNumber: String
): TokenResponseType!

type TokenResponseType {
access_token: String!
brand: BrandSchema
brandUser: BrandUserSchema
refresh_token: String!
user: UserSchema!
}

type BrandUserSchema {
brandId: String!
createdAt: DateTime!
id: ID!
invitedAt: DateTime
isActive: Boolean!
joinedAt: DateTime
role: BrandUserRole!
updatedAt: DateTime!
user: UserSchema
userId: String!
}

enum BrandUserRole {
ADMIN
MANAGER
OWNER
STAFF
}

See src\services\brands.js for other brand fields. Log user in on success of the request utilizing src\hooks\useLogin.js. and Save all the fields returned from here in local storage using existing src\utils\storage.js in useLogin. save the fields separately, so access_token, brand, brandUser, refresh_token, user. This login logic should also be used for succesful login at src\pages\OnBoarding\SignIn\features\Login.js. The login mutation is:
authLoginUser(
email: String!
password: String!
): TokenResponseType!

On login, if brand or brandUser returned is empty, The means the brand account has not been created, so
route to AccountSetup page which will have box notifiers at the top to show what step they currently at which is five starting from here. The boxes will be 8px w and h and 8px apart from each other, background: #EEEEEE; by default, while active box has background: #690007;. All the setup pages should be stacked on top of each other in AccountSetup page so its one single long form. For AccountSetupOne, the title should be 'Brand Info', the fields should be 'Brand Name', 'Barnd E-mail', 'Address', 'Country' selection 'City' selection , 'Product Category' category selection. Note that all AccountSetup pages One to Five will have the notifier boxes. So below are the fields for AccountSetup pages One to Five.
AccountSetupTwo fields - title: 'Brand Bio', textare field placeholder 'Short description (who you are, what you make, why it matters)'
AccountSetupThree fields - title: 'ASSETS', subtitle:'Logo – JPG or PNG, 500×500px
Banner – JPG, 1200×600px' image selection field: 'Logo upload', image selection field: 'Banner image (optional)'. The Image selection field box with gallary icon in the center, 12px space, and input field by the right for image selection. After image selection, display the image in grid below the field. Make the image selection field a reusable component and allow for different kinds files, images, single or multiple files, through props.
AccountSetupFour fields - title: 'Social Links (optional)', Use the IconTypeInput field here similar to the ImageSelection field, but the icon in the box will be 'Instagram', 'TikTok', 'Website' icons. The input will be text field or number input with number formating, etc.. Make this IconTypeInput a reusable component too.
AccountSetupFive fields - title: 'Ready to Drop?', subtitle: 'Submit your brand to join the lineup.We review every entry. If it’s heat, we’ll be in touch.

Below the account setup pages, add 'primary button 'Submit for Review', isOutline button 'BACK', below the button, add the checkbox with label 'I confirm I own the rights to all images and designs submitted.' On successful submission, show the success modal (reusable component). The setup success modal view should have setupSuccessImage at the top, 200px height, modal title:"You’re In." (14px black), message:'We got your submission.
Our team’s reviewing it. If your drip’s legit, you’ll hear from us soon.

Until then—' (14px black)
below it 'cop drops, peep the feed, stay in the loop.' (14px #690007)

primary button (above) 'Explore the Feed'
secondary button (below) 'Back to Home'

Update the current modal component at src\components\General\Modal so that it works smoothly for this and can be easily reused.

The mutation to be called for submiting the brand details is:

authBrandRegistration(
registrationData: BrandRegistrationCreateInput!
): BoolSuccessResponseType!

registrationData: BrandRegistrationCreateInput!

type BrandRegistrationCreateInput {
addressLine1: String!
addressLine2: String
brandDescription: String!
brandName: String!
brandShortText: String
businessRegistrationNumber: String
city: String!
country: String!
estimatedMonthlyOrders: Float
postalCode: String!
productImportMethod: ProductImportMethod
shopifyAccessToken: String
shopifyStoreUrl: String
state: String!
yearsInBusiness: Float
}

on successful submit of the authBrandRegistration request, when the click on any of the buttons in the sucess modal, log them out and take them back to login page, so they can login and be routed to the dashboard home.

5. If a Tizzi Admin logs in, route them to the dashboard home directly.
6. Update src\components\Layout\Components\SideNav\index.js so that sidenav Collapse span is moved to beside the Logo, and the icons are replaced by src\assets\icons\collapse-icon.svg. Add search input 24px below this with the style bg #444444, placeholder color #FBF0DC, br 8px. Search icon from src\assets\icons\search-normal.svg on the left, search-command-icon from src\assets\icons\search-command-icon.svg on the right. The search should filter the sidenav items and sub items for now. Replace the search-command-icon with clear icon from react-icons when something is entered into it. 24px Below the search field, should be the side nav items. The items include Dashboard, Products (sub items: 'All Products', 'Categories', 'Collections'), Orders, Customers, Wallet, Settings. If the user logged in is Tizzi admin, The side nav items should be: Dashboard Overview, Orders, Brands, Reviews, Discover Users, Payout, User Management. Nav items style: text - 14px, #FBF0DC, icon beside it- 18px w,h, #FBF0DC. each nav item should have py 10px, px-12px. active nav item should have bg #FBF0DC, 8px br, box-shadow: 0px 2px 4px -2px #1018280F;, the text should be color #690007, same as the icon. Nav items with sub items should have chevron-down icon from src\assets\icons\Arrow\chevron-down.svg by the right most, on click of this nav item with sub items, expand to show the sub items below it. The sub items should also have same padding at main items and same styling when active, only different is that they have no icon
   At the bottom-most of the sidenav, Add the user details section which is The user avartar 40px w,h circle with the brand logoUrl or user profilePhoto, use fallback image from src\assets\images\avatar-sample.png. 10px by its right, put the user firstName and lastName (14px, #FFFFFF), user email (14px, #FFFFFF, 64% opacity) below, and by the right most, put more icon(#FFFFFF, with nice circle transparent bg around it on hover) that opens a small dropdown option for logout. Note that 'Dashboard' and 'Dashboard Overview' link to the same page '/dashboard/home', Remove any other existing feature, logic or code, note mentioned above

7. Update src\components\Layout\DashboardLayout.js so that the header has a transparent bg, no border. By the leff of the header, 'Good morning (appropriate greeting based on time of the day), 🌤️(appropriate emoji) 11:45 AM(right time)'-(14px, #111111). By the right of the header, notification icon from src\assets\icons\notification-icon.svg, divider icon from src\assets\icons\divider-icon.svg 20px by its right, and drop down with text 'Quick Actions'(14px, #690007) 20px by the divider right. dropdown shoold have caret down icon by its right and cleanly open a dropdwon with quick options in it on click. the whole DashboardLayout should have a bg of #F6F7F1, border radius of 16px, box-shadow: 0px 12px 16px -4px #1018280A, box-shadow: 0px 4px 6px -2px #10182808;

8. Update the home page src\pages\Dashboard\Home\features\index.js it has the a title (22px, #111111, bold) at the top, 'Dashboard' or 'Dashboard Overview' depending on the page name. For brands:

There should be three rate cards 24px below the title. Make the rate cards reusable components. A rate card will have bg #FFFFFF, bg 8px, and border: 1px solid #E5E7EB, px-18px py-10px. A rate card top section will have icon on the left, dateFilters
dateFilters selection by the right (Today, Yesterday, This week, This month, All Time, and custom date, that opens the date inteval section modal, see src\pages\Dashboard\Home\features\index.js for how this is done) (12px, #6D7280), 8px w, 4px h, #9CA3AF chevron down 10 px to the right of the selector text. The date filter drop down should be elegantly styled, No comlications, just simlar styling. The rate card bottom section 30px below the top section will have a list of items that it loops through from an array of rate items. rate item object will have {label:"", value:"", rate:"", type:""}
label(14px, #888888) will be at the top, then value(18px, #111111, bold) will be 12px below it. if it has rate, it will be shown 6px to the right of the value, and will be #22C55E with '+' if type is 'up' or empty, #FD6A6A with '-' if type is 'down'. The content of a rate item will be aligned to the start(left), and rate items in a rate card will be aligned to in a grid row with appropriate gap based on the number of rate items which will usually be 2 or 3.

Three rate cards will be aligned at the top of the page in a grid with 20px gap between them. and the grid will be 1 per row on mobile. data for the rate cards = [{icon:<SaleIcon/>, rateItems:[ {label:"Sales", value:"₦0.00", rate:"0", type:""}, {label:"Volume", value:"0", rate:"", type:""}]}, ...]. generate the objects for Customer and Order.

Below the the rate cards section, split the next section into two, left (2/3 basis) and right(1/3 basis) sections with 20px gap between them. The right section (bg #FFFFFF, br 8px, border: 1px solid #E5E7EB) should be 1/3 basis on desktop and tab, and should be below the left section and full width full basis on mobile. It should have header section(px-18px py-14px, border-bottom: 1px solid #EAEBF0) with the text 'Recent Orders'(16px #050505). below should be a table of orders. If orders is empty, show EmptyBagIcon from src/assets/icons/empty-bag-icon.svg, 'No Orders Yet'(18px, #050505, bold) 36px below it, and 'Add products to your store and start selling to see orders here.' (14px, #6D7280) 16px below it.
The left section (bg #FFFFFF, br 8px, border: 1px solid #E5E7EB) should be 2/3 basis on desktop and tab, and full width full basis on mobile. It should have header section(px-18px py-14px, border-bottom: 1px solid #EAEBF0). in the header left the graph option dropdown with the options 'Sales' (default), 'Orders' (16px #050505), and by its right should be dateFilters selection dropdown, same component as the one used in rate card. Below the header, show graph with demo data based on the graph option selected, and should load when the date filter is changed. use a nice spinner loader for this. The graph section should have height of 300px. still in the left section 20px below the graph card, split into two more sections left and right. The left section (bg #FFFFFF, br 8px, border: 1px solid #E5E7EB) should be 57% width basis on desktop and tab, and full width on mobile. It should have header section(px-18px py-14px, border-bottom: 1px solid #EAEBF0). in the header left the text 'Customer Demographics'(16px #050505), and by its right should be dateFilters selection dropdown, same component as the one used in rate card. Below the header, show piechart graph with demo data based on the users demography, 24px right of the piechart, show a list of the pie chart items representations. Each item will be like: 10px circle with bg of the pie charge section it represents, 10px by its right should be country name eg 'Canada'(14px, #111827), and by the far right (i.e space between) show the actual value the item eg. '4,765'(14px, #576477). use Nigeria (#0062FF), United States (#0CAF60), Canada (#FFD023), Others (#FE964A), as demo data with sample values, etc. Use a nice spinner loader for loading state. The graph section should have height of 200px. 20px to the right of the pie card, should be the right section 43% with with two rate cards on top of each other 20px gap. The top rate card should have bg of #050505, not date filer, and the texts inside should white, the rate items are 'All Products', 'Active', use demo values, icon is WalletRateIcon. The bottom rate card should have the rate items are 'Abandoned Cart', 'Checkout rate', use demo values, icon is CartRateIcon.

For Tizzil Admin:
There should be 8 rate cards at the top in a 4 per row 20 gap grid conatiner. It should reduce to 3 per row on tab and one per row on mobile. The rate card will have icon on the right, title(14px, #888888) by the left, no date filter. Rate card top section will also have pb-6px and border-bottom: 1px solid #1137703D. the bottom section will have value(18px, #111111, bold), and rate(10px) 4px below it. the color of the rate will be determined by the type, and there should be rateUp or rateDown icon by the left of the rate based on the type too. The rate titles are: 'Total Orders', 'Total Income', 'Tizzil Revenue', 'Average Order Value', 'Total Product Created', 'No. of Active Brands', 'Total No. of New Users', 'No. of Products Sold'.

Below the rate cards section, similar to that of brands, split the next section into two, left (2/3 basis) and right(1/3 basis) sections with 20px gap between them. The right section (bg #FFFFFF, br 8px, border: 1px solid #E5E7EB) should be 1/3 basis on desktop and tab, and should be below the left section and full width full basis on mobile. It should have header section(px-18px py-14px, with the text 'Revenue'(16px #111827 bold) on the left, and datefilter component by the right. 24px below should be revenue details section, revenue value eg. $76,345
12,00(22px, #111827) and rate pill to its right bg #0CAF60 or #E41D11 depending on the revenue rate, px-4px py-3px, br 100%, rate text insise eg 12,00%(8px white) with rateUp or rateDown icon 4px to the left of the text. 8px below this, show 'Compared to last month'(10px #718096). Below the revenue details section, put a list of progress bars each with different colors. Arrangement: title(12px, #111827 bold) on the left, by the right most i.e space between put value (12px, #718096), 6px below, put the actual progress bar. The list of the progress bar sections will be 'Tizzil Revenue', value -"21,043/48,345", 'Brands Revenue' -
'14,058/30,000', 'Affiliate Revenue', 'Delivery Cost'

<!-- Next Prompt -->

1. Update src\pages\Dashboard\Products\features\index.js so that the title "Products"(22px #111111 bold) {products?.length} TOTAL (14px #6D7280) is at the top of the page by the left. If products is not empty, add space between the title and add a section for filtering by the right. The filter section should have Search(14px #111111) and src\assets\icons\search-black.svg 8px by its left. 20px to the right of the search add Filters(14px #111111) and src\assets\icons\filter-icon.svg 8px by its left, next add src\assets\icons\divider-icon.svg 20px to the right of filter and 20px to the right of the divider, add 'Add a product'(12px uppercase, #111111),and 28px w and h bg #690007 circle with src\assets\icons\plus-icon.svg inside the center of it. on click of the search, smoothly animate the expansion of the search bar for user to searhc, make the animation fast enough not to affect UX, and add add X icon to close the search bar. on click of the filters, open filter context menu, which is bg #FFFFFFE5, p 16px, br 8px, border: 1px solid; border-image-source: linear-gradient(180deg, #F4F4F4 0%, rgba(244, 244, 244, 0) 57.38%);, box-shadow: 0px 32px 48px -8px #0000001A; box-shadow: 0px 0px 14px -4px #0000000D; backdrop-filter: blur(32px) 400px width on desktop and tab, 85% width on mobile, Top of the menu show Filter 'Filter'(16px #111827 bold). 26px below show Date created(14px #111827 bold) and Reset(14px #690007 bold). Below it show date input selects From and To on the same line, 8px gap, inputs should be same style as general input implmented previously.
   20px below show Category(14px #111827 bold) and Reset(14px #690007 bold). Below it show category select, reuse select used in auth screens. 20px below show Status(14px #111827 bold) and Reset(14px #690007 bold). Below it show status select, reuse select used in auth screens. 36 px below, show isOutline button "Reset all" and 'apply filters' primary button 20px by its right. If filter is applied, close the context and show number of filteres applied in a bracket in front of Filters text, and make the filter icon fill #690007. On mobile, hide the Filter, Search, and Add a product texts, and just show the icons.

if products is empty, show src\assets\icons\empty-list-icon.svg, 'Nothing to see here' (16px #000000) 32px below it, 'products'(16px #777777) 8px below it, and 'ADD A PRODUCT' button. This empty section should be centered in the page. If there a products, return the products in ProductCards in a 4 per row- desktop, 3 per row tab, 1 per row mobile screens, 20px gap grid container. Product card description: The first image in imageUrls of a product should be at the top of the card. the image should cover and should be 220px height. image bg color should be #EFF0EB;
8px Below the image put details section(background: #FBF0DC03, backdrop-filter: blur(4px)). Inside this section, put the product.name (#690007 15px uppercase semibold), 6px below its, put the product.salePrice (#690007 14px) all aligned to the start/left. if hasMenu is passed to ProductCard as true, show a 32px w h, 6px br box-shadow: 0px 4px 8px -2px #1018281A; box-shadow: 0px 2px 4px -2px #1018280F; container with menu icon from src\assets\icons\menu-icon.svg in the center positioned 10px to the top and 10px to the right of the product image section. Give the menu container a nice on hover styling, and on click of it open a context menu with padding 8px, background: #FFFFFF;, box-shadow: 0px 20px 24px -4px #10182814; box-shadow: 0px 8px 8px -4px #10182808;, 200px width, heigh fit content, br 6px, and if isCategory is passed to the ProductCard, the context menu options should be 'Add to category' with edit icon from src\assets\icons\edit-tiny.svg 8px by its left, 'View my items' with eye icon from src\assets\icons\eye-tiny.svg 8px by its left. Each menu option should have px 12px py 10px, and nice light grey(#F8FAFC) hover effect. Pass add the props for onAddCategoryClick and onViewItemsClick. if hasDescription is passed true, dont show the product.salePrice and instead show product.productDescription(14px #777777, max two lines, overflow ellipses). if isCollection is passed as true, show a row 14px below the productDescription, left of row 'Status:(14px #777777) Live or Pending(14px #690007)', right of the row 'Products:(14px #777777) numberOfProducts eg 10(14px #690007)', if isCategory is passed as true, the row should instead contain 'You:(14px #777777) numberOfProducts eg 10(14px #690007)'. if isCategory is passed as true add images of the products of the categories. the images will be 22px w h circle with margin left -11px so that next image covers exactly half of the previous image, the product.productDescription should be replaced with '# of Live Products:(14px #777777) numberOfProducts eg 230(14px #690007)'. Make sure to make the product card a component.
At the top of the products card, if there are products, show 'All Products' (default), 'Drafts', 'Most Purchased', and 'Jorts' in a 20px gap row container, each of the texts should have color #AAAAAA, 14px, and on click of any of them make that selected one active(#690007) and call getProducts with the partcular item selected as payload, also use a nice spinner loader, the kind used in Home page src\pages\Dashboard\Home\features\index.js, if the request fails, just filter the products by sample data which you should use for now. this mean generate sample products that can be reused in multiple files if products are empty or if there's an error. for the sample product images, use src\assets\images\sample-product-image.png,.

on click of 'Add a product' or its icon, open New product modal which is a side modal type(isSideModal is true). if isSideModal is true, on tab and desktop the modal should be 95% height of the screen, and 550px width. The title of the new product modal is 'New product'(uppercase). At the top of the modal, add three tabs 'Basics', 'Media & deets','Fulfillment'. The tabs container style is padding 3px, background: #EEEEEE;, height 44px. The tabs should have equal widths, active tab should have bg #FFFFFF, box-shadow: 0px 12px 16px -4px #1018280A; box-shadow: 0px 4px 6px -2px #10182808;, text color #690007, other tabs should just have text color #050505.Tabs texts should be uppercase 12px.

For Basics tabs, show 'Product Name' input, Product description wysiswyg with the label at its top 'Product description'(14px #555555) and placeholder 'Write your description here (max 140 chars)'(14px #555555), 'Category' select, 'Collection' select. Below Should be 'Continue' button which should be visible no matter how long the modal content is. On continue click, go to the next tab. For 'Media & deets' tab, show ImagePicker component from components/General/Input/ImagePicker with label 'Please upload at least 2, max 6'. Update the ImagePicker component so that the dotted border is #D0D5DD, the text inside should be 'Click to upload(16px #0D0D12 bold) or drag and drop(#667085 16px)', 8px below add the text 'SVG, PNG, JPG or GIF (max. 800x400px)'(14px #667085), the images added should be shown in a grid container, 2 per row and br 8px with menu container and icon for user to select the option to delete the image. below add the ImageSelection for 'Add Video (optional) (MP4 or link)'', and another ImageSelection for 'Upload Size Guide (optional)', and below add a number type input for Stock quantity.

For 'Fulfillment' tab, show Weight input with weight type selection, return policy select, Estimated Delivery time date select input, Care instructions wysywig.

On click of a product card, open product details modal which is also isSideModal true. The title should be 'preview'
below show product status(12px #22C55E for active, grey for pending ), default to Active. 8px below show the product name(22px #111111 bold), 10px show 'Item {product?.code||PD000001}'(14px #444444), 20px to the right, show the review stars(#690007), and 10px to the right, show number of review in parenthesis(14px #6D7280). 16px below show the salePrice(#111827 17px bold). 20px below, id there are orders(first show a loader for getting the orders)(show demo order number as 3 for now) for the product, show the order notify section which is src\assets\icons\warning-2.svg, 20px by the right show '3 Orders(dark grey 14px) to fulfil(less dark grey 14px)', space between, then chevron right. This order notify section should have 16px padding, and border-width: 1px, 0px, 1px, 0px; border-style: solid; border-color: #690007;. 20px below this, show the images section with is active product image full width, h 350px, br 8px. 16px to the right, show all the images as thumbnails in a 12px gap column. each image thumbnail will be 60px h and w, br 8px, and on click of any thumbnail, set is active and show its image as main and give the thumbnail border: 3px solid #690007.
20px below, in a py 20px border top and bottom: 1px solid #E5E7EB, add 'Delivery:'(14px #111827 bold) 20px by the right Confident (12px #22C55E), 20px below, add 'Between 1 to 2 days'(14px #4B5563). 20px below show 'Product details:'(14px #111827 bold), 16px below show the productDescription(14px #4B5563). 20px below show 'Features:'(14px #111827 bold), 16px below show the productfeatures(14px #4B5563). positioned at the bottom of the modal, show three buttons spaced between and gap of 12px for good measure. isOutline 'Delete product', isOutline 'Move to drafts', normal button 'Edit product'. Implement delete modal which is not a isSideNav modal

<!-- Fixes notes -->

1. remove react-toastify from src\pages\OnBoarding\AccountSetup\features\index.js and from src\pages\OnBoarding\SignUp\store\index.js and use src\components\General\Toast\Toast.js for all toasts. See src\components\General\SectionDetails\DetailsBlock.js for how its used.
