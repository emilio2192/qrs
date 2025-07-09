import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BannerResponse } from '../../../types/api';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        imageUrl: true,
        buttonText: true,
        buttonLink: true,
        order: true,
      },
    });

    // Convert null values to undefined for TypeScript compatibility
    const formattedBanners = banners.map((banner: any) => ({
      ...banner,
      subtitle: banner.subtitle || undefined,
      description: banner.description || undefined,
      buttonText: banner.buttonText || undefined,
      buttonLink: banner.buttonLink || undefined,
    }));

    const response: BannerResponse = {
      success: true,
      data: formattedBanners,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching banners:', error);
    const errorResponse: BannerResponse = {
      success: false,
      error: 'Failed to fetch banners',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 