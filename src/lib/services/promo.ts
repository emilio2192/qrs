// Promotion logic for cart pricing (frontend only)

export type CartItem = {
  id: string;
  price: number;
  quantity: number;
  size?: string;
};

export type PromotionType = 'NONE' | '3_FOR_2' | 'VIP_15';

export interface PromotionResult {
  bestTotal: number;
  appliedPromotion: PromotionType;
  breakdown: string;
  options: Array<{
    type: PromotionType;
    total: number;
    breakdown: string;
  }>;
}

/**
 * Calculate the best promotion for a cart, given VIP status.
 * Returns both options for VIPs so the frontend can let the user choose.
 */
export function calculatePromotion(cart: CartItem[], isVIP: boolean, shouldApplyVipDiscount: boolean = false): PromotionResult {
  console.log('calculatePromotion called with:', { cart, isVIP });
  
  // Flatten cart to a list of individual items (for 3-for-2 logic)
  const items: number[] = [];
  cart.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      items.push(item.price);
    }
  });

  const cartTotal = items.reduce((acc, v) => acc + v, 0);
  console.log('Cart total:', cartTotal, 'Items:', items);

  // 3 for 2: For every 3 items, the cheapest is free
  let threeForTwoTotal = cartTotal;
  if (items.length >= 3) {
    const sorted = [...items].sort((a, b) => a - b);
    let sum = 0;
    for (let i = 0; i < sorted.length; i += 3) {
      // Add two most expensive in each group of 3
      if (i + 2 < sorted.length) {
        sum += sorted[i + 1] + sorted[i + 2];
      } else {
        // Add remaining items
        sum += sorted.slice(i).reduce((acc, v) => acc + v, 0);
      }
    }
    threeForTwoTotal = sum;
  }

  // VIP: 15% off total
  const vipTotal = isVIP ? +(cartTotal * 0.85).toFixed(2) : cartTotal;

  // Build options
  const options = [
    { type: 'NONE' as PromotionType, total: cartTotal, breakdown: 'No promotion applied.' },
  ];
  
  // Add 3 for 2 option if applicable
  if (items.length >= 3) {
    options.push({ type: '3_FOR_2' as PromotionType, total: threeForTwoTotal, breakdown: `3 for 2: Cheapest item free for every 3. You pay $${threeForTwoTotal.toFixed(2)}.` });
  }
  
  // Add VIP option if user is VIP
  if (isVIP) {
    options.push({ type: 'VIP_15', total: vipTotal, breakdown: `VIP: 15% off. You pay $${vipTotal.toFixed(2)}.` });
  }

  // Determine which promotion to apply
  let appliedPromotion: PromotionType = 'NONE';
  let bestTotal = cartTotal;
  let breakdown = 'No promotion applied.';

  if (shouldApplyVipDiscount && isVIP) {
    // VIP discount is explicitly requested by user
    appliedPromotion = 'VIP_15';
    bestTotal = vipTotal;
    breakdown = `VIP: 15% off. You pay $${vipTotal.toFixed(2)}.`;
  } else if (isVIP && items.length >= 3) {
    // For VIP users, automatically choose the better option
    if (vipTotal < threeForTwoTotal) {
      appliedPromotion = 'VIP_15';
      bestTotal = vipTotal;
      breakdown = `VIP: 15% off (recommended). You pay $${vipTotal.toFixed(2)}.`;
    } else {
      appliedPromotion = '3_FOR_2';
      bestTotal = threeForTwoTotal;
      breakdown = `3 for 2 (recommended). You pay $${threeForTwoTotal.toFixed(2)}.`;
    }
  } else if (items.length >= 3) {
    // Non-VIP users get 3 for 2 if available
    appliedPromotion = '3_FOR_2';
    bestTotal = threeForTwoTotal;
    breakdown = `3 for 2: Cheapest item free for every 3. You pay $${threeForTwoTotal.toFixed(2)}.`;
  }

  console.log('Options:', options);
  console.log('Applied promotion:', { appliedPromotion, bestTotal, breakdown });

  return {
    bestTotal,
    appliedPromotion,
    breakdown,
    options: isVIP ? options.slice(1) : options.slice(1, 2), // For VIP, show both; for non-VIP, only 3-for-2
  };
} 