import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = "teedeux.dev@gmail.com";

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: SUPER_ADMIN_EMAIL },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("ChangeMeImmediately123!", 10);

    const superAdmin = await prisma.user.create({
      data: {
        email: SUPER_ADMIN_EMAIL,
        name: "Teedeux Super Admin",
        passwordHash: hashedPassword,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    console.log(`✅ Super Admin created successfully: ${superAdmin.email}`);
  } else {
    await prisma.user.update({
      where: { email: SUPER_ADMIN_EMAIL },
      data: { role: Role.SUPER_ADMIN, isActive: true },
    });
    console.log(`🔒 Super Admin rights verified for: ${SUPER_ADMIN_EMAIL}`);
  }

  // Demo catalog owner (vendor) for AfroConnect-like storefront
  const vendorEmail = "vendor@mama-jones.teedeux";
  let vendor = await prisma.user.findUnique({ where: { email: vendorEmail } });
  if (!vendor) {
    vendor = await prisma.user.create({
      data: {
        email: vendorEmail,
        name: "Mama Jones",
        passwordHash: await bcrypt.hash("vendor-demo-1234", 10),
        role: Role.VENDOR,
        isActive: true,
      },
    });
  }

  const store = await prisma.store.upsert({
    where: { slug: "mama-jones" },
    update: {},
    create: {
      name: "Mama Jones African Market",
      slug: "mama-jones",
      ownerId: vendor.id,
      fulfillmentType: "HYBRID",
      address: "920 Memorial Dr SE",
      city: "Atlanta",
      state: "GA",
      zipCode: "30316",
      isVerified: true,
      description:
        "West African staples — fresh plantains, egusi, and butcher counter.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
    },
  });

  const productCount = await prisma.product.count({ where: { storeId: store.id } });
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          storeId: store.id,
          title: "Ripe Plantains",
          price: 1.49,
          category: "Fresh Produce",
          originRegion: "West African",
          weightOz: 16,
          requiresCold: true,
          stockQuantity: 40,
          imageUrl:
            "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop",
        },
        {
          storeId: store.id,
          title: "Egusi (Melon Seeds)",
          price: 7.99,
          category: "Grains & Flours",
          originRegion: "West African",
          weightOz: 16,
          requiresCold: false,
          stockQuantity: 120,
          imageUrl:
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
        },
        {
          storeId: store.id,
          title: "Red Palm Oil",
          price: 10.99,
          category: "Oils",
          originRegion: "West African",
          weightOz: 35,
          requiresCold: false,
          stockQuantity: 60,
          imageUrl:
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
        },
      ],
    });
    console.log("✅ Seeded Mama Jones demo products");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
