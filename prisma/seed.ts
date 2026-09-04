import { PrismaClient, ApplicationStatus } from "../generated/client/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Categories

  const smartphones = await prisma.category.create({
    data: {
      name: "Smartphones",
      slug: "smartphones",
      icon: "smartphone",
    },
  });

  const laptops = await prisma.category.create({
    data: {
      name: "Laptops",
      slug: "laptops",
      icon: "laptop",
    },
  });

  const audio = await prisma.category.create({
    data: {
      name: "Audio",
      slug: "audio",
      icon: "headphones",
    },
  });

  const homeAppliances = await prisma.category.create({
    data: {
      name: "Home Appliances",
      slug: "home-appliances",
      icon: "home",
    },
  });

  // Products

  await prisma.product.create({
    data: {
      name: "iPhone 17 Pro",
      slug: "iphone-17-pro",
      brand: "Apple",
      categoryId: smartphones.id,
      badge: "BESTSELLER",
      description:
        "The iPhone 17 Pro combines a powerful camera system, a bright ProMotion display and next-generation performance in a premium titanium design.",
      specs: {
        display: "6.3-inch Super Retina XDR",
        processor: "A19 Pro",
        camera: "48MP Pro camera system",
        battery: "All-day battery life",
        os: "iOS",
      },
      variants: {
        create: [
          {
            title: "256GB - Silver",
            sku: "IP17P-SLV-256",
            colorName: "Silver",
            colorHex: "#C7C7C7",
            attributes: {
              Storage: "256GB",
              RAM: "12GB",
            },
            mrp: 134900,
            price: 127400,
            imageUrl:
              "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
            images: [
              "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
            ],
            isDefault: true,
            stockQuantity: 18,
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  interestRate: 0,
                  cashbackAmount: 7500,
                  cashbackText: "Additional cashback of ₹7,500",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 5000,
                  cashbackText: "Additional cashback of ₹5,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 3000,
                  cashbackText: "Additional cashback of ₹3,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 24,
                  interestRate: 10.5,
                  cashbackAmount: 2000,
                  cashbackText: "Cashback of ₹2,000",
                  tag: "Backed by Mutual Funds",
                },
              ],
            },
          },
          {
            title: "256GB - Orange",
            sku: "IP17P-ORG-256",
            colorName: "Orange",
            colorHex: "#D96B32",
            attributes: {
              Storage: "256GB",
              RAM: "12GB",
            },
            mrp: 134900,
            price: 127400,
            imageUrl:
              "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
            images: [
              "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
            ],
            stockQuantity: 11,
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  interestRate: 0,
                  cashbackAmount: 7500,
                  cashbackText: "Additional cashback of ₹7,500",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 5000,
                  cashbackText: "Additional cashback of ₹5,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 3000,
                  cashbackText: "Additional cashback of ₹3,000",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
          {
            title: "512GB - Blue",
            sku: "IP17P-BLU-512",
            colorName: "Blue",
            colorHex: "#496B9B",
            attributes: {
              Storage: "512GB",
              RAM: "12GB",
            },
            mrp: 154900,
            price: 146900,
            imageUrl:
              "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
            images: [
              "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
            ],
            stockQuantity: 7,
            emiPlans: {
              create: [
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 5000,
                  cashbackText: "Additional cashback of ₹5,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 3000,
                  cashbackText: "Additional cashback of ₹3,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 24,
                  interestRate: 10.5,
                  cashbackAmount: 2000,
                  cashbackText: "Cashback of ₹2,000",
                  tag: "Backed by Mutual Funds",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Samsung Galaxy S24 Ultra

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      brand: "Samsung",
      categoryId: smartphones.id,
      badge: "TOP PICK",
      description:
        "A premium Android flagship with an immersive AMOLED display, versatile cameras and built-in S Pen functionality.",
      specs: {
        display: "6.8-inch Dynamic AMOLED 2X",
        processor: "Snapdragon 8 Gen 3",
        camera: "200MP quad camera",
        battery: "5000mAh",
        os: "Android",
      },
      variants: {
        create: [
          {
            title: "256GB - Titanium Black",
            sku: "S24U-BLK-256",
            colorName: "Titanium Black",
            colorHex: "#272727",
            attributes: {
              Storage: "256GB",
              RAM: "12GB",
            },
            mrp: 129999,
            price: 109999,
            imageUrl:
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
            images: [
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
            ],
            isDefault: true,
            stockQuantity: 24,
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  interestRate: 0,
                  cashbackAmount: 5000,
                  cashbackText: "Instant cashback of ₹5,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 4000,
                  cashbackText: "Instant cashback of ₹4,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 2500,
                  cashbackText: "Instant cashback of ₹2,500",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
          {
            title: "512GB - Titanium Grey",
            sku: "S24U-GRY-512",
            colorName: "Titanium Grey",
            colorHex: "#777777",
            attributes: {
              Storage: "512GB",
              RAM: "12GB",
            },
            mrp: 139999,
            price: 119999,
            imageUrl:
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
            images: [
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
            ],
            stockQuantity: 15,
            emiPlans: {
              create: [
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 4000,
                  cashbackText: "Instant cashback of ₹4,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 2500,
                  cashbackText: "Instant cashback of ₹2,500",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 24,
                  interestRate: 10.5,
                  cashbackAmount: 1500,
                  cashbackText: "Cashback of ₹1,500",
                  tag: "Backed by Mutual Funds",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Google Pixel

  await prisma.product.create({
    data: {
      name: "Google Pixel 9 Pro",
      slug: "google-pixel-9-pro",
      brand: "Google",
      categoryId: smartphones.id,
      badge: "NEW",
      description:
        "A clean Android flagship focused on computational photography, AI features and a compact premium design.",
      specs: {
        display: "6.3-inch LTPO OLED",
        processor: "Google Tensor G4",
        camera: "50MP triple camera",
        battery: "4700mAh",
        os: "Android",
      },
      variants: {
        create: [
          {
            title: "256GB - Obsidian",
            sku: "PIX9P-OBS-256",
            colorName: "Obsidian",
            colorHex: "#202124",
            attributes: {
              Storage: "256GB",
              RAM: "16GB",
            },
            mrp: 109999,
            price: 99999,
            imageUrl:
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
            images: [
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
            ],
            isDefault: true,
            stockQuantity: 13,
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  interestRate: 0,
                  cashbackAmount: 4000,
                  cashbackText: "Cashback of ₹4,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 3000,
                  cashbackText: "Cashback of ₹3,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 2000,
                  cashbackText: "Cashback of ₹2,000",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
          {
            title: "256GB - Hazel",
            sku: "PIX9P-HZL-256",
            colorName: "Hazel",
            colorHex: "#9A8F7A",
            attributes: {
              Storage: "256GB",
              RAM: "16GB",
            },
            mrp: 109999,
            price: 99999,
            imageUrl:
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
            images: [
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
            ],
            stockQuantity: 9,
            emiPlans: {
              create: [
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 3000,
                  cashbackText: "Cashback of ₹3,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 2000,
                  cashbackText: "Cashback of ₹2,000",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // MacBook Air

  await prisma.product.create({
    data: {
      name: "MacBook Air 13-inch",
      slug: "macbook-air-13",
      brand: "Apple",
      categoryId: laptops.id,
      badge: "POPULAR",
      description:
        "A lightweight everyday laptop with Apple's M-series performance, long battery life and a sharp Liquid Retina display.",
      specs: {
        display: "13.6-inch Liquid Retina",
        processor: "Apple M4",
        battery: "Up to 18 hours",
        ports: "Thunderbolt / USB 4",
        os: "macOS",
      },
      variants: {
        create: [
          {
            title: "16GB RAM - 256GB SSD - Midnight",
            sku: "MBA13-MID-16-256",
            colorName: "Midnight",
            colorHex: "#1D2733",
            attributes: {
              RAM: "16GB",
              Storage: "256GB SSD",
              Processor: "M4",
            },
            mrp: 109900,
            price: 99900,
            imageUrl:
              "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
            images: [
              "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
            ],
            isDefault: true,
            stockQuantity: 8,
            emiPlans: {
              create: [
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 5000,
                  cashbackText: "Cashback of ₹5,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 3000,
                  cashbackText: "Cashback of ₹3,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 24,
                  interestRate: 10.5,
                  cashbackAmount: 2000,
                  cashbackText: "Cashback of ₹2,000",
                  tag: "Backed by Mutual Funds",
                },
              ],
            },
          },
          {
            title: "16GB RAM - 512GB SSD - Starlight",
            sku: "MBA13-STL-16-512",
            colorName: "Starlight",
            colorHex: "#E7E0D4",
            attributes: {
              RAM: "16GB",
              Storage: "512GB SSD",
              Processor: "M4",
            },
            mrp: 129900,
            price: 119900,
            imageUrl:
              "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
            images: [
              "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
            ],
            stockQuantity: 5,
            emiPlans: {
              create: [
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 5000,
                  cashbackText: "Cashback of ₹5,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 3000,
                  cashbackText: "Cashback of ₹3,000",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Sony Headphones

  await prisma.product.create({
    data: {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      brand: "Sony",
      categoryId: audio.id,
      badge: "BESTSELLER",
      description:
        "Premium wireless headphones with active noise cancellation, comfortable earcups and long battery life.",
      specs: {
        type: "Over-ear wireless",
        connectivity: "Bluetooth 5.2",
        battery: "Up to 30 hours",
        noiseCancellation: "Yes",
        microphone: "Built-in",
      },
      variants: {
        create: [
          {
            title: "Black",
            sku: "SONY-XM5-BLK",
            colorName: "Black",
            colorHex: "#111111",
            attributes: {
              Connectivity: "Bluetooth 5.2",
              Battery: "30 hours",
            },
            mrp: 34990,
            price: 29990,
            imageUrl:
              "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
            images: [
              "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
            ],
            isDefault: true,
            stockQuantity: 31,
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  interestRate: 0,
                  cashbackAmount: 1000,
                  cashbackText: "Cashback of ₹1,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 750,
                  cashbackText: "Cashback of ₹750",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
          {
            title: "Silver",
            sku: "SONY-XM5-SLV",
            colorName: "Silver",
            colorHex: "#D4D4D4",
            attributes: {
              Connectivity: "Bluetooth 5.2",
              Battery: "30 hours",
            },
            mrp: 34990,
            price: 29990,
            imageUrl:
              "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
            images: [
              "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
            ],
            stockQuantity: 19,
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  interestRate: 0,
                  cashbackAmount: 1000,
                  cashbackText: "Cashback of ₹1,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 750,
                  cashbackText: "Cashback of ₹750",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // LG Washing Machine

  await prisma.product.create({
    data: {
      name: "LG 8 Kg Front Load Washing Machine",
      slug: "lg-8kg-front-load-washing-machine",
      brand: "LG",
      categoryId: homeAppliances.id,
      badge: "VALUE PICK",
      description:
        "An energy-efficient front-load washing machine designed for Indian households with multiple wash programs and smart inverter technology.",
      specs: {
        capacity: "8 Kg",
        type: "Front Load",
        energyRating: "5 Star",
        motor: "Inverter",
        warranty: "2 years",
      },
      variants: {
        create: [
          {
            title: "8 Kg - Black Steel",
            sku: "LGWM-8-BLK",
            colorName: "Black Steel",
            colorHex: "#333333",
            attributes: {
              Capacity: "8 Kg",
              EnergyRating: "5 Star",
              Type: "Front Load",
            },
            mrp: 44990,
            price: 37990,
            imageUrl:
              "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",
            images: [
              "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",
            ],
            isDefault: true,
            stockQuantity: 6,
            emiPlans: {
              create: [
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 1500,
                  cashbackText: "Cashback of ₹1,500",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 1000,
                  cashbackText: "Cashback of ₹1,000",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 24,
                  interestRate: 10.5,
                  cashbackAmount: 500,
                  cashbackText: "Cashback of ₹500",
                  tag: "Backed by Mutual Funds",
                },
              ],
            },
          },
          {
            title: "8 Kg - Middle Black",
            sku: "LGWM-8-MBK",
            colorName: "Middle Black",
            colorHex: "#555555",
            attributes: {
              Capacity: "8 Kg",
              EnergyRating: "5 Star",
              Type: "Front Load",
            },
            mrp: 44990,
            price: 38990,
            imageUrl:
              "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",
            images: [
              "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",
            ],
            stockQuantity: 4,
            emiPlans: {
              create: [
                {
                  tenureMonths: 6,
                  interestRate: 0,
                  cashbackAmount: 1500,
                  cashbackText: "Cashback of ₹1,500",
                  tag: "Zero Cost EMI",
                },
                {
                  tenureMonths: 12,
                  interestRate: 0,
                  cashbackAmount: 1000,
                  cashbackText: "Cashback of ₹1,000",
                  tag: "Zero Cost EMI",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
