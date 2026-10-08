import React from 'react';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: () => <div data-testid="data-grid" />,
  esES: {
    components: {
      MuiDataGrid: {
        defaultProps: {
          localeText: {},
        },
      },
    },
  },
}));

const DataTable = require('../../../src/components/DataTable').default;

describe('DataTable server search and reload', () => {
  it('keeps the entered search casing and clears it when reloading', () => {
    const onSearch = jest.fn();
    const onReloadClick = jest.fn();

    render(
      <DataTable
        rows={[]}
        columns={[]}
        paginationMode="server"
        onSearch={onSearch}
        onReloadClick={onReloadClick}
      />,
    );

    const searchInput = screen.getByRole('textbox', { name: 'Filtrar' });
    fireEvent.change(searchInput, { target: { value: 'AbC-123' } });

    expect(searchInput).toHaveValue('AbC-123');

    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(onSearch).toHaveBeenLastCalledWith('AbC-123');

    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));

    expect(searchInput).toHaveValue('');
    expect(onSearch).toHaveBeenLastCalledWith('');
    expect(onReloadClick).toHaveBeenCalledTimes(1);
  });
});
