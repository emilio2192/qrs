import '@testing-library/jest-dom'

// Mock next-intl to avoid ESM issues
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useFormatter: () => ({
    number: (value) => value.toString(),
    dateTime: (value) => value.toISOString(),
  }),
  NextIntlClientProvider: ({ children }) => children,
}))

// Suppress fetchPriority warning from Next.js <Image />
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      message.includes('React does not recognize the `fetchPriority` prop')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 