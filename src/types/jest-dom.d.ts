/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeEmpty(): R
      toHaveFocus(): R
      toHaveFormValues(expectedValues: Record<string, any>): R
      toHaveDisplayValue(value: string | string[]): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveValue(value: string | string[] | number): R
      toHaveStyle(css: string | Record<string, any>): R
    }
  }
}

export {} 