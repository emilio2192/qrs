import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if banners already exist
  const existingBanners = await prisma.banner.count();
  if (existingBanners === 0) {
    console.log('Creating promotional banners...');
    
    const banners = [
      {
        title: 'Summer Collection 2024',
        subtitle: 'New Arrivals',
        description: 'Discover our latest summer styles with up to 40% off on selected items',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
        buttonText: 'Shop Now',
        buttonLink: '/products?category=dresses',
        isActive: true,
        order: 1,
      },
      {
        title: 'VIP Members Exclusive',
        subtitle: 'Special Offers',
        description: 'Get 15% off on all purchases plus free shipping for VIP members',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop',
        buttonText: 'Join VIP',
        buttonLink: '/signup?type=vip',
        isActive: true,
        order: 2,
      },
      {
        title: '3 for 2 Promotion',
        subtitle: 'Limited Time',
        description: 'Buy 3 items and get the cheapest one for free! Valid on all clothing items',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=400&fit=crop',
        buttonText: 'Learn More',
        buttonLink: '/promotions',
        isActive: true,
        order: 3,
      },
      {
        title: 'Free Shipping',
        subtitle: 'On Orders Over $50',
        description: 'Enjoy free shipping on all orders over $50. No code needed!',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&h=400&fit=crop',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        isActive: true,
        order: 4,
      },
      {
        title: 'New Arrivals',
        subtitle: 'Fresh Styles',
        description: 'Check out our newest collection of trendy clothing and accessories',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=400&fit=crop',
        buttonText: 'Explore',
        buttonLink: '/products?new=true',
        isActive: true,
        order: 5,
      },
    ];

    for (const bannerData of banners) {
      const banner = await prisma.banner.create({
        data: bannerData,
      });
      console.log(`Created banner: ${banner.title}`);
    }
    console.log('✅ Promotional banners created successfully');
  } else {
    console.log('Banners already exist, skipping...');
  }

  // Check if categories already exist
  const existingCategories = await prisma.productCategory.count();
  if (existingCategories === 0) {
    console.log('Creating product categories...');
    
    const categories = [
      { name: 'T-Shirts', description: 'Comfortable t-shirts for everyday wear' },
      { name: 'Jeans', description: 'Classic and modern jeans styles' },
      { name: 'Dresses', description: 'Elegant dresses for special occasions' },
      { name: 'Hoodies', description: 'Comfortable hoodies for casual wear' },
      { name: 'Shirts', description: 'Formal and casual shirts' },
      { name: 'Shorts', description: 'Comfortable shorts for warm weather' },
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.productCategory.create({
        data: categoryData,
      });
      createdCategories.push(category);
      console.log(`Created category: ${category.name}`);
    }
    console.log('✅ Product categories created successfully');
  } else {
    console.log('Categories already exist, skipping...');
  }

  // Check if products already exist
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    console.log('Creating clothing products with categories and gender...');
    
    // Get categories for reference
    const categories = await prisma.productCategory.findMany();
    const categoryMap = categories.reduce((acc: Record<string, string>, cat: { name: string; id: string }) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {} as Record<string, string>);
    
    // Seed products with categories and gender
    const products = [
      {
        name: 'Classic White T-Shirt',
        price: 35.99,
        description: 'Premium cotton t-shirt perfect for everyday wear',
        categoryId: categoryMap['T-Shirts'],
        gender: 'UNISEX' as const,
        isActive: true,
        sizes: [
          { size: 'S', stock: 20 },
          { size: 'M', stock: 25 },
          { size: 'L', stock: 30 },
          { size: 'XL', stock: 15 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
            alt: 'White T-shirt front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop',
            alt: 'White T-shirt back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
      {
        name: 'Slim Fit Blue Jeans',
        price: 65.50,
        description: 'Comfortable slim fit jeans in classic blue',
        categoryId: categoryMap['Jeans'],
        gender: 'MALE' as const,
        isActive: true,
        sizes: [
          { size: '30x32', stock: 10 },
          { size: '32x32', stock: 15 },
          { size: '34x32', stock: 20 },
          { size: '36x32', stock: 12 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
            alt: 'Blue jeans front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
            alt: 'Blue jeans back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
      {
        name: 'Elegant Black Dress',
        price: 80.75,
        description: 'Sophisticated black dress for special occasions',
        categoryId: categoryMap['Dresses'],
        gender: 'FEMALE' as const,
        isActive: true,
        sizes: [
          { size: 'XS', stock: 8 },
          { size: 'S', stock: 12 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 6 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
            alt: 'Elegant dress front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
            alt: 'Elegant dress back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
      {
        name: 'Casual Hoodie',
        price: 45.99,
        description: 'Comfortable cotton hoodie perfect for casual wear',
        categoryId: categoryMap['Hoodies'],
        gender: 'UNISEX' as const,
        isActive: true,
        sizes: [
          { size: 'S', stock: 15 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 25 },
          { size: 'XL', stock: 18 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
            alt: 'Casual hoodie front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
            alt: 'Casual hoodie back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
      {
        name: 'Formal White Shirt',
        price: 55.25,
        description: 'Professional white shirt for office wear',
        categoryId: categoryMap['Shirts'],
        gender: 'MALE' as const,
        isActive: true,
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 18 },
          { size: 'L', stock: 22 },
          { size: 'XL', stock: 14 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&h=500&fit=crop',
            alt: 'Formal white shirt front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop',
            alt: 'Formal white shirt back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
      {
        name: 'Summer Shorts',
        price: 28.50,
        description: 'Comfortable summer shorts for warm weather',
        categoryId: categoryMap['Shorts'],
        gender: 'UNISEX' as const,
        isActive: true,
        sizes: [
          { size: 'S', stock: 20 },
          { size: 'M', stock: 25 },
          { size: 'L', stock: 30 },
          { size: 'XL', stock: 15 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop',
            alt: 'Summer shorts front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop',
            alt: 'Summer shorts back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
      {
        name: 'Floral Summer Dress',
        price: 72.99,
        description: 'Beautiful floral dress perfect for summer events',
        categoryId: categoryMap['Dresses'],
        gender: 'FEMALE' as const,
        isActive: true,
        sizes: [
          { size: 'XS', stock: 6 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 4 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
            alt: 'Floral summer dress front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
            alt: 'Floral summer dress back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
      {
        name: 'Denim Jacket',
        price: 89.99,
        description: 'Classic denim jacket for a timeless look',
        categoryId: categoryMap['Shirts'],
        gender: 'UNISEX' as const,
        isActive: true,
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 15 },
          { size: 'XL', stock: 10 },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
            alt: 'Denim jacket front view',
            isPrimary: true,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
            alt: 'Denim jacket back view',
            isPrimary: false,
            order: 1,
          },
        ],
      },
    ];

    for (const productData of products) {
      const { sizes, images, ...productInfo } = productData;
      
      const product = await prisma.product.create({
        data: {
          ...productInfo,
          sizes: {
            create: sizes,
          },
          images: {
            create: images,
          },
        },
      });
      
      console.log(`Created product: ${product.name} (${product.gender})`);
    }

    console.log('✅ Clothing products with categories and gender seeded successfully');
  } else {
    console.log('Products already exist, skipping...');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 