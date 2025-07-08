import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample banners
  const banners = [
    {
      title: 'Summer Collection 2024',
      subtitle: 'Discover the latest trends',
      description: 'Explore our new summer collection with fresh styles and vibrant colors.',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      order: 1,
    },
    {
      title: 'Exclusive VIP Offers',
      subtitle: 'Limited time deals',
      description: 'Join our VIP program and get access to exclusive discounts and early access to new collections.',
      imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop',
      buttonText: 'Learn More',
      buttonLink: '/vip',
      order: 2,
    },
    {
      title: 'Free Shipping on Orders Over $50',
      subtitle: 'No minimum purchase required',
      description: 'Enjoy free shipping on all orders over $50. Valid on all items in our collection.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      buttonText: 'Start Shopping',
      buttonLink: '/shop',
      order: 3,
    },
  ];

  console.log('📦 Creating banners...');
  for (const banner of banners) {
    await prisma.banner.create({
      data: banner,
    });
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 