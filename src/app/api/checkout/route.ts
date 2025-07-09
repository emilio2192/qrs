import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, items } = await request.json();

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'userId and items are required' }, { status: 400 });
    }

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // Create the cart and items in a transaction
    const cart = await prisma.cart.create({
      data: {
        userId,
        totalPrice,
        status: 'ACTIVE',
        isActive: true,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ cart }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 