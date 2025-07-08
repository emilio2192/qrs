import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import { ProductResponse } from '../../../types/api';

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
      },
      take: 20, // Limit to 20 newest products
    });

    // Convert decimal and date fields for API response, and map null to undefined
    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      description: product.description || undefined,
      images: product.images.map((img) => ({
        ...img,
        alt: img.alt || undefined,
        createdAt: img.createdAt.toISOString(),
        updatedAt: img.updatedAt.toISOString(),
      })),
    }));

    const response: ProductResponse = {
      success: true,
      data: formattedProducts,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    const errorResponse: ProductResponse = {
      success: false,
      data: [],
      error: 'Failed to fetch products',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 