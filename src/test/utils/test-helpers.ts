import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Helper to find elements by test id
export const findByTestId = (testId: string) => screen.findByTestId(testId);
export const getByTestId = (testId: string) => screen.getByTestId(testId);
export const queryByTestId = (testId: string) => screen.queryByTestId(testId);

// Helper to find elements by role
export const findByRole = (role: string, options?: any) => screen.findByRole(role, options);
export const getByRole = (role: string, options?: any) => screen.getByRole(role, options);
export const queryByRole = (role: string, options?: any) => screen.queryByRole(role, options);

// Helper to find elements by text
export const findByText = (text: string | RegExp, options?: any) => screen.findByText(text, options);
export const getByText = (text: string | RegExp, options?: any) => screen.getByText(text, options);
export const queryByText = (text: string | RegExp, options?: any) => screen.queryByText(text, options);

// Helper to find elements by label text
export const findByLabelText = (text: string | RegExp, options?: any) => screen.findByLabelText(text, options);
export const getByLabelText = (text: string | RegExp, options?: any) => screen.getByLabelText(text, options);
export const queryByLabelText = (text: string | RegExp, options?: any) => screen.queryByLabelText(text, options);

// Helper to find elements by placeholder text
export const findByPlaceholderText = (text: string | RegExp, options?: any) => screen.findByPlaceholderText(text, options);
export const getByPlaceholderText = (text: string | RegExp, options?: any) => screen.getByPlaceholderText(text, options);
export const queryByPlaceholderText = (text: string | RegExp, options?: any) => screen.queryByPlaceholderText(text, options);

// Helper to wait for element to appear
export const waitForElement = async (selector: () => HTMLElement | null, options?: { timeout?: number }) => {
  return waitFor(selector, options);
};

// Helper to wait for text to appear
export const waitForText = async (text: string | RegExp, options?: { timeout?: number }) => {
  return waitFor(() => {
    expect(screen.getByText(text)).toBeInTheDocument();
  }, options);
};

// Helper to wait for element to disappear
export const waitForElementToDisappear = async (selector: () => HTMLElement | null, options?: { timeout?: number }) => {
  return waitFor(() => {
    expect(selector()).not.toBeInTheDocument();
  }, options);
};

// Helper to simulate user interactions
export const clickElement = async (element: HTMLElement) => {
  const user = userEvent.setup();
  await user.click(element);
};

export const typeInElement = async (element: HTMLElement, text: string) => {
  const user = userEvent.setup();
  await user.type(element, text);
};

export const clearAndTypeInElement = async (element: HTMLElement, text: string) => {
  const user = userEvent.setup();
  await user.clear(element);
  await user.type(element, text);
};

// Helper to simulate form submission
export const submitForm = async (form: HTMLFormElement) => {
  const user = userEvent.setup();
  await user.click(form.querySelector('button[type="submit"]') || form);
};

// Helper to simulate keyboard navigation
export const pressKey = async (key: string, element?: HTMLElement) => {
  const user = userEvent.setup();
  if (element) {
    element.focus();
  }
  await user.keyboard(key);
};

// Helper to simulate file upload
export const uploadFile = async (input: HTMLInputElement, file: File) => {
  const user = userEvent.setup();
  await user.upload(input, file);
};

// Helper to simulate drag and drop
export const dragAndDrop = async (source: HTMLElement, target: HTMLElement) => {
  const user = userEvent.setup();
  await user.dragAndDrop(source, target);
};

// Helper to check if element is visible
export const isElementVisible = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

// Helper to check if element is in viewport
export const isElementInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
