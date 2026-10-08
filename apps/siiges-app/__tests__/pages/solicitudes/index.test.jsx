import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

let mockListState;
const mockDataTable = jest.fn();
const mockNotifyError = jest.fn();
const mockGetSolicitudes = jest.fn(() => mockListState);

/* eslint-disable react/destructuring-assignment,
react/prop-types,
react/function-component-definition */
jest.mock('@siiges-ui/shared', () => ({
  Layout: ({ children }) => <div>{children}</div>,
  Select: () => null,
  DataTable: (props) => {
    mockDataTable(props);
    return <div data-testid="solicitudes-table" data-loading={String(props.loading)} />;
  },
  Loading: ({ loading }) => (
    <div data-testid="global-loading">{String(loading)}</div>
  ),
  useAuth: () => ({ session: { id: 1, rol: 'admin' } }),
  useNotification: () => ({ error: mockNotifyError }),
}));
/* eslint-enable react/destructuring-assignment,
react/prop-types,
react/function-component-definition */

jest.mock('@siiges-ui/solicitudes', () => ({
  NewRequest: () => null,
  ChangeAddress: () => null,
  Refrendo: () => null,
  Actualizacion: () => null,
  CambioNombreInstitucion: () => null,
  SolicitudesSkeleton: () => <div data-testid="solicitudes-skeleton" />,
  getSolicitudes: (...args) => mockGetSolicitudes(...args),
  columnsSolicitudes: () => [],
}));

const SolicitudesPage = require('../../../pages/solicitudes').default;

describe('SolicitudesPage loading states', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSolicitudes.mockImplementation(() => mockListState);
    mockListState = {
      solicitudes: [],
      pagination: { total: 0 },
      hasAcuerdoRvoe: false,
      loading: true,
      error: null,
    };
  });

  it('shows the global loader and skeleton only until the initial load completes', async () => {
    const { rerender } = render(<SolicitudesPage />);

    expect(screen.getByTestId('global-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('solicitudes-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('solicitudes-table')).not.toBeInTheDocument();

    mockListState = { ...mockListState, loading: false };
    rerender(<SolicitudesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('global-loading')).toHaveTextContent('false');
      expect(screen.queryByTestId('solicitudes-skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('solicitudes-table')).toBeInTheDocument();
    });

    mockListState = { ...mockListState, loading: true };
    rerender(<SolicitudesPage />);

    expect(screen.getByTestId('global-loading')).toHaveTextContent('false');
    expect(screen.queryByTestId('solicitudes-skeleton')).not.toBeInTheDocument();
    expect(screen.getByTestId('solicitudes-table')).toHaveAttribute('data-loading', 'true');
    expect(mockDataTable.mock.calls.at(-1)[0].loading).toBe(true);
  });

  it('resets server search and page when the table is refreshed', () => {
    mockListState = { ...mockListState, loading: false };
    const { rerender } = render(<SolicitudesPage />);

    act(() => {
      mockDataTable.mock.calls.at(-1)[0].onSearch('ABC');
    });
    rerender(<SolicitudesPage />);
    expect(mockGetSolicitudes.mock.calls.at(-1)[0]).toMatchObject({
      page: 0,
      search: 'ABC',
    });

    act(() => {
      mockDataTable.mock.calls.at(-1)[0].onReloadClick();
    });
    rerender(<SolicitudesPage />);
    expect(mockGetSolicitudes.mock.calls.at(-1)[0]).toMatchObject({
      page: 0,
      search: '',
      refreshKey: 1,
    });
  });
});
