import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { render, RenderOptions } from '@testing-library/react';
import messages from '../../../messages/en.json';
import { Provider } from 'react-redux';
import { makeStore } from '../../lib/store';

const store = makeStore();

type WrapperProps = {
  children: ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
};

function Wrapper({ children, locale = 'en', messages: customMessages }: WrapperProps) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider locale={locale} messages={customMessages || messages}>
        {children}
      </NextIntlClientProvider>
    </Provider>
  );
}

export function renderWithIntl(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { locale?: string; messages?: Record<string, unknown> }
) {
  const { locale, messages, ...rest } = options || {};
  return render(ui, {
    wrapper: (props) => <Wrapper {...props} locale={locale} messages={messages} />,
    ...rest,
  });
} 