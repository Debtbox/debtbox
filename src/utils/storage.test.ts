import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import Cookies from 'js-cookie';
import { getCookie, setCookie, clearCookie } from './storage';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('storage', () => {
  const mockGet = Cookies.get as unknown as Mock<(name: string) => string | undefined>;

  beforeEach(() => {
    mockGet.mockReturnValue(undefined);
    vi.mocked(Cookies.set).mockClear();
    vi.mocked(Cookies.remove).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCookie', () => {
    it('returns cookie value with prefix', () => {
      mockGet.mockReturnValue('token-123');
      const result = getCookie('access_token');
      expect(Cookies.get).toHaveBeenCalledWith('debtbox_access_token');
      expect(result).toBe('token-123');
    });

    it('returns undefined when cookie does not exist', () => {
      mockGet.mockReturnValue(undefined);
      const result = getCookie('access_token');
      expect(result).toBeUndefined();
    });
  });

  describe('setCookie', () => {
    it('sets cookie with prefix and options', () => {
      setCookie('access_token', 'token-123');
      expect(Cookies.set).toHaveBeenCalledWith(
        'debtbox_access_token',
        'token-123',
        expect.objectContaining({
          path: '/',
          sameSite: 'lax',
        }),
      );
    });
  });

  describe('clearCookie', () => {
    it('removes cookie with prefix and path', () => {
      clearCookie('access_token');
      expect(Cookies.remove).toHaveBeenCalledWith('debtbox_access_token', {
        path: '/',
      });
    });
  });
});
