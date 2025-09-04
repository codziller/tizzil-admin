import sampleProductImage from "assets/images/sample-product-image.png";

export const sampleProducts = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    salePrice: "₦25,000",
    productDescription:
      "A comfortable and stylish premium cotton t-shirt perfect for casual wear and everyday comfort.",
    imageUrls: [sampleProductImage, sampleProductImage, sampleProductImage],
    code: "PD000001",
    brand: { brandName: "Fashion Forward" },
    categories: [{ name: "Clothing" }, { name: "T-Shirts" }],
    quantity: 150,
    lowInQuantityValue: 20,
    cloudErpItemCode: "ERP001",
    archive: false,
    status: "Active",
    productOptions: [],
    numberOfProducts: 1,
    productfeatures:
      "100% Premium Cotton, Machine Washable, Available in Multiple Colors",
  },
  {
    id: 2,
    name: "Designer Jeans",
    salePrice: "₦45,000",
    productDescription:
      "High-quality designer jeans with a modern fit and premium denim material for ultimate style and comfort.",
    imageUrls: [sampleProductImage, sampleProductImage],
    code: "PD000002",
    brand: { brandName: "Denim Dreams" },
    categories: [{ name: "Clothing" }, { name: "Jeans" }],
    quantity: 85,
    lowInQuantityValue: 15,
    cloudErpItemCode: "ERP002",
    archive: false,
    status: "Active",
    productOptions: [
      {
        choices: [{ main: true, variantQuantity: 85 }],
      },
    ],
    numberOfProducts: 3,
    productfeatures:
      "Premium Denim, Stretch Fabric, Classic Fit, Multiple Sizes Available",
  },
  {
    id: 3,
    name: "Luxury Sneakers",
    salePrice: "₦75,000",
    productDescription:
      "Premium luxury sneakers crafted with the finest materials for exceptional comfort and style.",
    imageUrls: [
      sampleProductImage,
      sampleProductImage,
      sampleProductImage,
      sampleProductImage,
    ],
    code: "PD000003",
    brand: { brandName: "Urban Steps" },
    categories: [{ name: "Footwear" }, { name: "Sneakers" }],
    quantity: 50,
    lowInQuantityValue: 10,
    cloudErpItemCode: "ERP003",
    archive: false,
    status: "Active",
    productOptions: [],
    numberOfProducts: 1,
    productfeatures:
      "Genuine Leather, Cushioned Sole, Breathable Lining, Premium Craftsmanship",
  },
  {
    id: 4,
    name: "Classic Watch",
    salePrice: "₦120,000",
    productDescription:
      "Elegant classic watch with sophisticated design perfect for both formal and casual occasions.",
    imageUrls: [sampleProductImage, sampleProductImage],
    code: "PD000004",
    brand: { brandName: "TimeKeepers" },
    categories: [{ name: "Accessories" }, { name: "Watches" }],
    quantity: 25,
    lowInQuantityValue: 5,
    cloudErpItemCode: "ERP004",
    archive: false,
    status: "Pending",
    productOptions: [],
    numberOfProducts: 1,
    productfeatures:
      "Swiss Movement, Water Resistant, Stainless Steel Case, Leather Strap",
  },
  {
    id: 5,
    name: "Stylish Sunglasses",
    salePrice: "₦35,000",
    productDescription:
      "Trendy sunglasses with UV protection and durable frame construction for everyday wear.",
    imageUrls: [sampleProductImage, sampleProductImage, sampleProductImage],
    code: "PD000005",
    brand: { brandName: "Sun Shield" },
    categories: [{ name: "Accessories" }, { name: "Eyewear" }],
    quantity: 100,
    lowInQuantityValue: 20,
    cloudErpItemCode: "ERP005",
    archive: false,
    status: "Active",
    productOptions: [
      {
        choices: [{ main: true, variantQuantity: 100 }],
      },
    ],
    numberOfProducts: 2,
    productfeatures:
      "UV400 Protection, Polarized Lenses, Lightweight Frame, Scratch Resistant",
  },
  {
    id: 6,
    name: "Leather Jacket",
    salePrice: "₦85,000",
    productDescription:
      "Premium leather jacket with classic design and superior craftsmanship for the ultimate style statement.",
    imageUrls: [sampleProductImage],
    code: "PD000006",
    brand: { brandName: "Leather Luxe" },
    categories: [{ name: "Clothing" }, { name: "Jackets" }],
    quantity: 30,
    lowInQuantityValue: 8,
    cloudErpItemCode: "ERP006",
    archive: false,
    status: "Active",
    productOptions: [],
    numberOfProducts: 1,
    productfeatures:
      "Genuine Leather, Multiple Pockets, YKK Zippers, Classic Fit",
  },
];

export const sampleBrands = [
  { id: 1, brandName: "Fashion Forward" },
  { id: 2, brandName: "Denim Dreams" },
  { id: 3, brandName: "Urban Steps" },
  { id: 4, brandName: "TimeKeepers" },
  { id: 5, brandName: "Sun Shield" },
  { id: 6, brandName: "Leather Luxe" },
];

export const sampleCategories = [
  { id: 1, name: "Clothing" },
  { id: 2, name: "Footwear" },
  { id: 3, name: "Accessories" },
  { id: 4, name: "T-Shirts" },
  { id: 5, name: "Jeans" },
  { id: 6, name: "Sneakers" },
  { id: 7, name: "Watches" },
  { id: 8, name: "Eyewear" },
  { id: 9, name: "Jackets" },
];
