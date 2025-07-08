import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Banner } from '../../types/api';

export const bannerFactory = Factory.define<Banner>(() => ({
  id: faker.string.uuid(),
  title: faker.commerce.productName(),
  subtitle: faker.commerce.productDescription(),
  description: faker.lorem.paragraph(),
  imageUrl: faker.image.url(),
  buttonText: faker.commerce.productAdjective(),
  buttonLink: faker.internet.url(),
  order: faker.number.int({ min: 1, max: 10 }),
})); 