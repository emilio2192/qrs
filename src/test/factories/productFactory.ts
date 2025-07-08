import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Product } from '../../types/api';

export const productFactory = Factory.define<Product>(() => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: Number(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  categoryId: faker.string.uuid(),
  gender: 'UNISEX',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  images: [
    {
      id: faker.string.uuid(),
      productId: faker.string.uuid(),
      url: faker.image.url(),
      alt: faker.commerce.productAdjective(),
      isPrimary: true,
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  sizes: [],
})); 