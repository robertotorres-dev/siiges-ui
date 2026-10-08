import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

let mockSession;

jest.mock('@siiges-ui/shared', () => ({
  getToken: jest.fn(() => null),
  useAuth: () => ({ session: mockSession }),
}));

const getSolicitudes = require('../../src/components/utils/getSolicitudes').default;

describe('getSolicitudes', () => {
  beforeEach(() => {
    mockSession = {
      id: 12,
      rol: 'admin',
      token: 'token-123',
    };
    process.env.NEXT_PUBLIC_API_KEY = 'api-key';
    process.env.NEXT_PUBLIC_URL = 'http://localhost:3000';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ id: 1, folio: 'SOL-1' }],
        pagination: {
          page: 1,
          limit: 25,
          total: 31,
          totalPages: 2,
          hasAcuerdoRvoe: true,
        },
      }),
    });
  });

  it('requests and exposes the selected server page and global metadata', async () => {
    function HookHarness() {
      const result = getSolicitudes({
        page: 1,
        limit: 25,
        search: 'solicitud',
        sortBy: 'folio',
        sortOrder: 'desc',
      });

      return <output data-testid="result">{JSON.stringify(result)}</output>;
    }

    render(<HookHarness />);

    await waitFor(() => {
      const result = JSON.parse(screen.getByTestId('result').textContent);
      expect(result.pagination.total).toBe(31);
      expect(result.hasAcuerdoRvoe).toBe(true);
      expect(result.solicitudes).toHaveLength(1);
    });

    const requestUrl = new URL(global.fetch.mock.calls[0][0]);
    expect(requestUrl.pathname).toBe('/api/v1/solicitudes/');
    expect(requestUrl.searchParams.get('page')).toBe('1');
    expect(requestUrl.searchParams.get('limit')).toBe('25');
    expect(requestUrl.searchParams.get('sortBy')).toBe('folio');
    expect(requestUrl.searchParams.get('sortOrder')).toBe('desc');
    expect(requestUrl.searchParams.get('search')).toBe('solicitud');
  });

  it('preserves the control-documental statuses in the server query', async () => {
    mockSession.rol = 'control_documental';

    function HookHarness() {
      const { loading } = getSolicitudes();
      return <output data-testid="loading">{String(loading)}</output>;
    }

    render(<HookHarness />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const requestUrl = new URL(global.fetch.mock.calls[0][0]);
    expect(requestUrl.searchParams.getAll('estatusSolicitudId')).toEqual(['2', '3']);
  });

  it('exposes request failures instead of treating them as empty success', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      statusText: 'Service unavailable',
      json: async () => ({ message: 'No fue posible consultar solicitudes.' }),
    });

    function HookHarness() {
      const { error, solicitudes, loading } = getSolicitudes();
      return (
        <output data-testid="result">
          {JSON.stringify({ error: error?.message, solicitudes, loading })}
        </output>
      );
    }

    render(<HookHarness />);

    await waitFor(() => {
      const result = JSON.parse(screen.getByTestId('result').textContent);
      expect(result.error).toBe('No fue posible consultar solicitudes.');
      expect(result.solicitudes).toEqual([]);
      expect(result.loading).toBe(false);
    });
  });
});
