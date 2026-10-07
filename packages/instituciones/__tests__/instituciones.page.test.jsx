import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockUseAuth = jest.fn();
const mockBack = jest.fn();
const mockGetInstituciones = jest.fn();

function MockTable({ instituciones, loading }) {
  return (
    <div data-testid="instituciones-table" data-loading={String(loading)}>
      {instituciones.length}
    </div>
  );
}

MockTable.propTypes = {
  instituciones: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
  })).isRequired,
  loading: PropTypes.bool,
};

MockTable.defaultProps = {
  loading: false,
};

const mockTable = jest.fn(({ instituciones, loading }) => (
  <MockTable instituciones={instituciones} loading={loading} />
));

function MockSkeleton() {
  return <div data-testid="instituciones-skeleton" />;
}

const mockSkeleton = jest.fn(() => <MockSkeleton />);

jest.mock('next/router', () => ({
  __esModule: true,
  default: { back: mockBack },
}));

/* eslint-disable react/function-component-definition, react/prop-types */
jest.mock('@siiges-ui/shared', () => {
  function Layout({ children }) {
    return <div>{children}</div>;
  }

  function Loading({ loading }) {
    return <div data-testid="loading-state">{String(loading)}</div>;
  }

  return {
    Layout,
    Loading,
    useAuth: () => mockUseAuth(),
  };
});
/* eslint-enable react/function-component-definition, react/prop-types */

jest.mock('@siiges-ui/instituciones', () => ({
  InstitucionesTable: mockTable,
  InstitucionesSkeleton: mockSkeleton,
  getInstituciones: (...args) => mockGetInstituciones(...args),
}));

const InstitucionesPage = require('../../../apps/siiges-app/pages/instituciones/index').default;

describe('InstitucionesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ session: { id: 1, rol: 'admin' } });
    mockGetInstituciones.mockReturnValue({
      instituciones: [{ id: 1, nombre: 'Universidad A' }],
      pagination: { total: 1 },
    });
  });

  it('shows the initial skeleton before the first load is ready', () => {
    mockUseAuth.mockReturnValue({ session: null });
    mockGetInstituciones.mockReturnValue({
      instituciones: [],
      pagination: { total: 0 },
    });

    render(<InstitucionesPage />);

    expect(screen.getByTestId('instituciones-skeleton')).toBeInTheDocument();
  });

  it('renders the table after the initial session and data load', async () => {
    render(<InstitucionesPage />);

    await waitFor(() => expect(mockTable).toHaveBeenCalled());
    expect(screen.getByTestId('instituciones-table')).toHaveTextContent('1');
    expect(screen.queryByTestId('instituciones-skeleton')).not.toBeInTheDocument();
  });
});
