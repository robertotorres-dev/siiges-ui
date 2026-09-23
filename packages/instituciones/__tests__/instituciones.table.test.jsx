import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockDataTable = jest.fn();

/* eslint-disable react/destructuring-assignment,
react/prop-types,
react/function-component-definition */
jest.mock('@siiges-ui/shared', () => ({
  DataTable: ({ loading, ...props }) => {
    mockDataTable({ ...props, loading });
    return <div data-testid="data-table" data-loading={String(loading)} />;
  },
  DefaultModal: ({ children }) => <div>{children}</div>,
  ButtonSimple: ({ text }) => <button type="button">{text}</button>,
}));
/* eslint-enable react/destructuring-assignment,
react/prop-types,
react/function-component-definition */

jest.mock('../src/components/Tables/institucionesColumns', () => jest.fn(() => [{ field: 'nombre', headerName: 'Nombre' }]));

const InstitucionesTable = require('../src/components/Instituciones/InstitucionesTable').default;

describe('InstitucionesTable', () => {
  it('passes pagination and loading props to the shared data table', () => {
    render(
      <InstitucionesTable
        instituciones={[{
          id: 1,
          nombre: 'Universidad A',
          usuario: 'admin',
          correo: 'admin@siiges.mx',
        }]}
        session={{ rol: 'admin' }}
        pagination={{ total: 1 }}
        page={0}
        pageSize={10}
        onPageChange={jest.fn()}
        onPageSizeChange={jest.fn()}
        sortModel={[{ field: 'nombre', sort: 'asc' }]}
        onSortModelChange={jest.fn()}
        onSearch={jest.fn()}
        onReload={jest.fn()}
        loading
      />,
    );

    const props = mockDataTable.mock.calls.at(-1)[0];

    expect(props.loading).toBe(true);
    expect(props.rowCount).toBe(1);
    expect(props.paginationMode).toBe('server');
    expect(props.onReloadClick).toBeDefined();
  });
});
