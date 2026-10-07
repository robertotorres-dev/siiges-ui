import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockGetToken = jest.fn(() => 'token-123');

jest.mock('@siiges-ui/shared', () => ({
  getToken: (...args) => mockGetToken(...args),
}));

const getInstituciones = require('../src/utils/getInstituciones').default;

describe('getInstituciones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        data: [{ id: 1, nombre: 'Universidad A' }],
        pagination: {
          page: 0,
          limit: 10,
          total: 1,
          totalPages: 1,
          sortBy: 'nombre',
          sortOrder: 'asc',
          search: '',
        },
      }),
    });
  });

  it('fetches paginated institutions and resolves loading state', async () => {
    const setLoading = jest.fn();

    function HookHarness() {
      const result = getInstituciones({
        tipoInstitucionId: 1,
        page: 0,
        limit: 10,
        search: 'universidad',
        sortBy: 'nombre',
        sortOrder: 'asc',
        setLoading,
      });

      return (
        <div>
          {result.instituciones.length}
          {result.pagination.total}
        </div>
      );
    }

    render(<HookHarness />);

    await waitFor(() => expect(setLoading).toHaveBeenCalledWith(false));
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toContain('/api/v1/instituciones?');
    expect(global.fetch.mock.calls[0][0]).toContain('search=universidad');
    expect(screen.getByText('11')).toBeInTheDocument();
  });
});
