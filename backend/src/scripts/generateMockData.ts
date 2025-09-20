import mongoose from "mongoose";
import ProductModel from "@/infrastructure/model/product.model";
import CategoryModel, { Icategory } from "@/infrastructure/model/category.model";
import { env } from "@/infrastructure/config/environment";

// Sample categories data
const categoriesData = [
  {
    name: "Electronics",
    image: {
      url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
      id: "electronics_img_1",
    },
    isListed: true,
  },
  {
    name: "Home", // Changed from "Home & Garden"
    image: {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      id: "home_img_1",
    },
    isListed: true,
  },
  {
    name: "Fashion", // Changed from "Clothing"
    image: {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
      id: "fashion_img_1",
    },
    isListed: true,
  },
  {
    name: "Sports", // Changed from "Sports & Outdoors"
    image: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
      id: "sports_img_1",
    },
    isListed: true,
  },
  {
    name: "Health", // Changed from "Beauty & Personal Care"
    image: {
      url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
      id: "health_img_1",
    },
    isListed: true,
  },
  {
    name: "Media", // Changed from "Books"
    image: {
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
      id: "media_img_1",
    },
    isListed: true,
  },
];

// Sample products data templates
const electronicsProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    price: "999.00",
    brandName: "Apple",
    modelName: "iPhone 15 Pro",
    stock: 50,
    images: [
      { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", id: "iphone_1" },
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", id: "iphone_2" },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and AI features",
    price: "1199.00",
    brandName: "Samsung",
    modelName: "Galaxy S24 Ultra",
    stock: 35,
    images: [
      { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500", id: "samsung_1" },
      { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500", id: "samsung_2" },
    ],
  },
  {
    name: "MacBook Pro 16-inch",
    description: "Powerful laptop with M3 Pro chip, 16-inch Liquid Retina XDR display",
    price: "2499.00",
    brandName: "Apple",
    modelName: "MacBook Pro 16",
    stock: 25,
    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", id: "macbook_1" },
      { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", id: "macbook_2" },
    ],
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones",
    price: "399.00",
    brandName: "Sony",
    modelName: "WH-1000XM5",
    stock: 75,
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", id: "sony_headphones_1" },
      { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500", id: "sony_headphones_2" },
    ],
  },
  {
    name: "iPad Air 5th Generation",
    description: "Powerful, colorful, and versatile iPad with M1 chip",
    price: "599.00",
    brandName: "Apple",
    modelName: "iPad Air 5",
    stock: 40,
    images: [
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500", id: "ipad_1" },
      { url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500", id: "ipad_2" },
    ],
  },
];

const fashionProducts = [
  {
    name: "Classic Denim Jacket",
    description: "Timeless denim jacket perfect for layering in any season",
    price: "89.99",
    brandName: "Levi's",
    modelName: "Classic Trucker",
    stock: 60,
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", id: "denim_jacket_1" },
      { url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500", id: "denim_jacket_2" },
    ],
  },
  {
    name: "Cotton T-Shirt Pack",
    description: "Set of 3 premium cotton t-shirts in assorted colors",
    price: "45.00",
    brandName: "Hanes",
    modelName: "ComfortSoft",
    stock: 120,
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", id: "tshirt_1" },
      { url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500", id: "tshirt_2" },
    ],
  },
  {
    name: "Running Sneakers",
    description: "Lightweight running shoes with advanced cushioning technology",
    price: "129.99",
    brandName: "Nike",
    modelName: "Air Zoom Pegasus",
    stock: 85,
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", id: "sneakers_1" },
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500", id: "sneakers_2" },
    ],
  },
  {
    name: "Wool Blend Sweater",
    description: "Cozy wool blend sweater perfect for cold weather",
    price: "79.99",
    brandName: "J.Crew",
    modelName: "Classic Crew",
    stock: 45,
    images: [
      { url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500", id: "sweater_1" },
      { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500", id: "sweater_2" },
    ],
  },
];

const homeGardenProducts = [
  {
    name: "Ceramic Plant Pot Set",
    description: "Set of 3 modern ceramic plant pots with drainage holes",
    price: "34.99",
    brandName: "HomeDecor",
    modelName: "Modern Ceramic",
    stock: 90,
    images: [
      { url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500", id: "plant_pot_1" },
      { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500", id: "plant_pot_2" },
    ],
  },
  {
    name: "LED String Lights",
    description: "Warm white LED string lights for indoor and outdoor decoration",
    price: "24.99",
    brandName: "Brightech",
    modelName: "Ambience Pro",
    stock: 150,
    images: [
      { url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500", id: "lights_1" },
      { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500", id: "lights_2" },
    ],
  },
  {
    name: "Bamboo Cutting Board",
    description: "Eco-friendly bamboo cutting board with juice groove",
    price: "29.99",
    brandName: "Bambüsi",
    modelName: "Premium Bamboo",
    stock: 70,
    images: [
      { url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500", id: "cutting_board_1" },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500", id: "cutting_board_2" },
    ],
  },
];

const sportsProducts = [
  {
    name: "Yoga Mat Premium",
    description: "Non-slip premium yoga mat with alignment lines",
    price: "49.99",
    brandName: "Manduka",
    modelName: "PRO Mat",
    stock: 65,
    images: [
      { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500", id: "yoga_mat_1" },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", id: "yoga_mat_2" },
    ],
  },
  {
    name: "Adjustable Dumbbells",
    description: "Space-saving adjustable dumbbells, 5-50 lbs per dumbbell",
    price: "299.99",
    brandName: "Bowflex",
    modelName: "SelectTech 552",
    stock: 30,
    images: [
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", id: "dumbbells_1" },
      { url: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500", id: "dumbbells_2" },
    ],
  },
];

const booksProducts = [
  {
    name: "The Psychology of Programming",
    description: "Classic book on software development and programmer psychology",
    price: "29.99",
    brandName: "O'Reilly",
    modelName: "2nd Edition",
    stock: 40,
    images: [
      { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", id: "book_1" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500", id: "book_2" },
    ],
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship",
    price: "39.99",
    brandName: "Prentice Hall",
    modelName: "1st Edition",
    stock: 55,
    images: [
      { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500", id: "clean_code_1" },
      { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", id: "clean_code_2" },
    ],
  },
];

const beautyProducts = [
  {
    name: "Vitamin C Serum",
    description: "Anti-aging vitamin C serum with hyaluronic acid",
    price: "24.99",
    brandName: "CeraVe",
    modelName: "Vitamin C Serum",
    stock: 80,
    images: [
      { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500", id: "serum_1" },
      { url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500", id: "serum_2" },
    ],
  },
  {
    name: "Moisturizing Face Cream",
    description: "Daily moisturizing cream for all skin types",
    price: "19.99",
    brandName: "Neutrogena",
    modelName: "Hydro Boost",
    stock: 95,
    images: [
      { url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500", id: "cream_1" },
      { url: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500", id: "cream_2" },
    ],
  },
];

// Function to generate additional random products
function generateRandomProduct(categoryId: string, categoryName: string): any {
  const brands = ["Generic", "Premium", "Quality", "Elite", "Standard", "Pro"];
  const adjectives = ["Premium", "Deluxe", "Professional", "Advanced", "Classic", "Modern", "Eco-Friendly"];
  const productTypes = {
    Electronics: ["Gadget", "Device", "Accessory", "Component", "Tool"],
    Fashion: ["Apparel", "Wear", "Garment", "Outfit", "Accessory"],
    Home: ["Decor", "Tool", "Accessory", "Furniture", "Appliance"],
    Sports: ["Equipment", "Gear", "Accessory", "Tool", "Apparel"],
    Media: ["Guide", "Manual", "Reference", "Novel", "Textbook"],
    Health: ["Product", "Treatment", "Care", "Essential", "Solution"],
  };

  const randomBrand = brands[Math.floor(Math.random() * brands.length)];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomType =
    productTypes[categoryName as keyof typeof productTypes][
      Math.floor(Math.random() * productTypes[categoryName as keyof typeof productTypes].length)
    ];

  const name = `${randomAdjective} ${randomType}`;
  const price = (Math.random() * 500 + 10).toFixed(2);
  const stock = Math.floor(Math.random() * 100) + 10;

  return {
    name,
    description: `High-quality ${name.toLowerCase()} perfect for your needs. Features premium materials and excellent craftsmanship.`,
    price,
    brandName: randomBrand,
    modelName: `${randomBrand} ${randomType}`,
    stock,
    category: categoryId,
    images: [
      {
        url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=500`,
        id: `${name.replace(/\s+/g, "_").toLowerCase()}_1`,
      },
      {
        url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=500`,
        id: `${name.replace(/\s+/g, "_").toLowerCase()}_2`,
      },
    ],
    isListed: Math.random() > 0.1, // 90% chance of being listed
  };
}

async function generateMockData() {
  try {
    // Connect to database
    await mongoose.connect(env.DB_URL!);
    console.log("Connected to database...");

    // Clear existing data
    console.log("Clearing existing data...");
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});

    // Create categories
    console.log("Creating categories...");
    const createdCategories = await CategoryModel.insertMany(categoriesData);
    console.log(`Created ${createdCategories.length} categories`);

    // Prepare products with category references
    const allProducts = [];

    // Map categories to their respective product arrays
    const categoryProductMap: Record<string, any[]> = {
      Electronics: electronicsProducts,
      Home: homeGardenProducts,
      Fashion: fashionProducts,
      Sports: sportsProducts,
      Health: beautyProducts,
      Media: booksProducts,
    };

    for (const category of createdCategories) {
      const categoryProducts = categoryProductMap[category.name] || [];

      // Add predefined products for this category
      for (const product of categoryProducts) {
        allProducts.push({
          name: product.name,
          description: product.description,
          price: product.price,
          brandName: product.brandName,
          modelName: product.modelName,
          stock: product.stock,
          images: product.images,
          category: category._id,
          isListed: product.isListed !== undefined ? product.isListed : true,
        });
      }

      // Generate additional random products for each category (10-20 per category)
      const additionalCount = Math.floor(Math.random() * 11) + 10; // 10-20 products
      for (let i = 0; i < additionalCount; i++) {
        allProducts.push(
          generateRandomProduct((category._id as mongoose.Types.ObjectId).toString(), category.name),
        );
      }
    }

    // Create products
    console.log("Creating products...");
    const createdProducts = await ProductModel.insertMany(allProducts);
    console.log(`Created ${createdProducts.length} products`);

    console.log("\n=== Mock Data Generation Complete ===");
    console.log(`Total Categories: ${createdCategories.length}`);
    console.log(`Total Products: ${createdProducts.length}`);

    // Display category breakdown
    console.log("\nCategory Breakdown:");
    for (const category of createdCategories) {
      const productCount = createdProducts.filter(
        (p) => p.category.toString() === (category._id as mongoose.Types.ObjectId).toString(),
      ).length;
      console.log(`- ${category.name}: ${productCount} products`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error generating mock data:", error);
    process.exit(1);
  }
}

const productTypes: Record<string, string[]> = {
  electronics: ["Gadget", "Device", "Accessory", "Component", "Tool"],
  home: ["Furniture", "Decor", "Appliance", "Tool", "Storage"],
  fashion: ["Clothing", "Accessory", "Footwear", "Jewelry", "Bag"],
  sports: ["Equipment", "Apparel", "Accessory", "Gear", "Supplement"],
  health: ["Supplement", "Device", "Care", "Fitness", "Wellness"],
  media: ["Book", "Movie", "Game", "Music", "Magazine"],
};
