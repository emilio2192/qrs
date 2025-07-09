import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Extract user ID from JWT token
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { items, appliedPromotion, totalPrice } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    // Use provided totalPrice if available, otherwise calculate
    const finalTotal = typeof totalPrice === 'number'
      ? totalPrice
      : items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // Create the cart and items in a transaction, and update stock
    const cart = await prisma.$transaction(async (tx: any) => {
      // Create cart
      const newCart = await tx.cart.create({
        data: {
          userId,
          totalPrice: finalTotal,
          appliedPromotion: appliedPromotion || null,
          status: 'ACTIVE',
          isActive: true,
          items: {
            create: items.map((item: { id: string; size: string; quantity: number; unitPrice: number }) => ({
              productId: item.id,
              size: item.size,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.unitPrice * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Update stock for each product/size
      for (const item of items) {
        await tx.productSize.updateMany({
          where: {
            productId: item.id,
            size: item.size,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newCart;
    });

    return NextResponse.json({ cart }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 