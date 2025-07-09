import { calculatePromotion, CartItem } from '@/lib/services/promo';

describe('Checkout Promotion Logic', () => {
  // Helper to round to 2 decimals
  const round = (n: number) => Math.round(n * 100) / 100;

  it('Scenario 1: Common customer, 3 t-shirts (3 for 2)', () => {
    const cart: CartItem[] = [
      { id: 'tshirt', price: 35.99, quantity: 3 },
    ];
    const result = calculatePromotion(cart, false, false);
    expect(round(result.bestTotal)).toBe(71.98); // 2 x 35.99
    expect(result.appliedPromotion).toBe('3_FOR_2');
  });

  it('Scenario 2: Common customer, 2 t-shirts + 2 jeans (3 for 2)', () => {
    const cart: CartItem[] = [
      { id: 'tshirt', price: 35.99, quantity: 2 },
      { id: 'jeans', price: 65.50, quantity: 2 },
    ];
    const result = calculatePromotion(cart, false, false);
    expect(round(result.bestTotal)).toBe(166.99); // 2 jeans + 1 tshirt (free tshirt)
    expect(result.appliedPromotion).toBe('3_FOR_2');
  });

  it('Scenario 3: VIP, 3 dresses (VIP vs 3 for 2)', () => {
    const cart: CartItem[] = [
      { id: 'dress', price: 80.75, quantity: 3 },
    ];
    // VIP discount
    const vip = calculatePromotion(cart, true, true);
    expect(round(vip.bestTotal)).toBe(205.91); // 242.25 - 36.34
    expect(vip.appliedPromotion).toBe('VIP_15');
    // 3 for 2
    const promo = calculatePromotion(cart, true, false);
    expect(round(promo.bestTotal)).toBe(161.5); // 2 x 80.75
    expect(promo.appliedPromotion).toBe('3_FOR_2');
    // Recommendation
    const best = calculatePromotion(cart, true, false);
    expect(round(best.bestTotal)).toBe(161.5);
    expect(best.appliedPromotion).toBe('3_FOR_2');
  });

  it('Scenario 4: VIP, 2 jeans + 2 dresses (VIP vs 3 for 2)', () => {
    const cart: CartItem[] = [
      { id: 'jeans', price: 65.50, quantity: 2 },
      { id: 'dress', price: 80.75, quantity: 2 },
    ];
    // VIP discount
    const vip = calculatePromotion(cart, true, true);
    expect(round(vip.bestTotal)).toBe(248.63); // 293 - 44.38
    expect(vip.appliedPromotion).toBe('VIP_15');
    // 3 for 2
    const promo = calculatePromotion(cart, true, false);
    expect(round(promo.bestTotal)).toBe(227.00); // 2 dresses + 1 jeans (free jeans)
    expect(promo.appliedPromotion).toBe('3_FOR_2');
    // Recommendation
    const best = calculatePromotion(cart, true, false);
    expect(round(best.bestTotal)).toBe(227.00);
    expect(best.appliedPromotion).toBe('3_FOR_2');
  });

  it('Scenario 5: VIP, 4 t-shirts + 1 jeans (VIP vs 3 for 2)', () => {
    const cart: CartItem[] = [
      { id: 'tshirt', price: 35.99, quantity: 4 },
      { id: 'jeans', price: 65.50, quantity: 1 },
    ];
    // VIP discount
    const vip = calculatePromotion(cart, true, true);
    expect(round(vip.bestTotal)).toBe(178.04); // 209.46 - 31.42
    expect(vip.appliedPromotion).toBe('VIP_15');
    // 3 for 2
    const promo = calculatePromotion(cart, true, false);
    expect(round(promo.bestTotal)).toBe(173.47); // 3 tshirts + 1 jeans
    expect(promo.appliedPromotion).toBe('3_FOR_2');
    // Recommendation
    const best = calculatePromotion(cart, true, false);
    expect(round(best.bestTotal)).toBe(173.47);
    expect(best.appliedPromotion).toBe('3_FOR_2');
  });
}); 