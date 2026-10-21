import '@testing-library/jest-dom';
import { server } from './mocks/server';

// jsdom does not implement matchMedia — required by next-themes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.spyOn(Storage.prototype, 'getItem');
vi.spyOn(Storage.prototype, 'setItem');
vi.spyOn(Storage.prototype, 'removeItem');
vi.spyOn(Storage.prototype, 'clear');

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
  vi.clearAllMocks();
});

afterAll(() => server.close());
