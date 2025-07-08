import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import { ProductResponse } from '../../../types/api';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const size = searchParams.get('size');
    const maxPrice = searchParams.get('maxPrice');

    if (id) {
      // Fetch a single product by id
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          images: true,
          sizes: true,
        },
      });
      if (!product) {
        return NextResponse.json({ success: false, data: [], error: 'Product not found' }, { status: 404 });
      }
      // Format product for API response
      const formattedProduct = {
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
        sizes: product.sizes.map((sz) => ({
          ...sz,
          createdAt: sz.createdAt.toISOString(),
          updatedAt: sz.updatedAt.toISOString(),
        })),
      };
      return NextResponse.json({ success: true, data: [formattedProduct] });
    }

    const where: any = { isActive: true };
    if (gender) where.gender = gender;
    if (category) where.category = { name: category };
    if (maxPrice) where.price = { lte: Number(maxPrice) };

    let products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        sizes: true,
      },
      take: 20,
    });

    // Filter by size if provided
    if (size) {
      products = products.filter(product =>
        product.sizes.some(s => s.size === size && s.stock > 0)
      );
    }

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
      sizes: product.sizes.map((sz) => ({
        ...sz,
        createdAt: sz.createdAt.toISOString(),
        updatedAt: sz.updatedAt.toISOString(),
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