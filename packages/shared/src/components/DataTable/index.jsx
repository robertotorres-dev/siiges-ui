import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, IconButton, TextField, Typography, Stack, Button as MuiButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, esES } from '@mui/x-data-grid';
import Button from '../Buttons/Button';

function DataTable({
  title,
  rows,
  columns,
  buttonAdd,
  buttonText,
  buttonDisabled = false,
  buttonClick,
  buttonType,
  onReloadClick,
  buttonReloadDisabled = false,
  secondaryButtonText,
  secondaryButtonClick,
  secondaryButtonDisabled = false,
  initialState,
  loading: externalLoading = false,
  paginationMode = 'client',
  rowCount,
  page = 0,
  pageSize: controlledPageSize,
  onPageChange,
  onPageSizeChange,
  sortModel,
  onSortModelChange,
  onSearch,
}) {
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10); // Default page size

  useEffect(() => {
    setLoading(false);
    setFilteredRows(rows);
  }, [rows]);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((value, dataRows = []) => {
      const normalizedValue = value.toLowerCase();
      const filteredData = dataRows.filter((row) => {
        const primitiveValues = Object.values(row || {}).filter(
          (data) => data != null && typeof data !== 'object',
        );

        const getterValues = (columns || [])
          .filter((col) => typeof col.valueGetter === 'function')
          .map((col) => {
            try {
              return col.valueGetter({ row });
            } catch {
              return null;
            }
          })
          .filter((val) => val != null);

        const allValues = [...primitiveValues, ...getterValues];

        return allValues.some(
          (data) => data.toString().toLowerCase().includes(normalizedValue),
        );
      });

      setFilteredRows(normalizedValue ? filteredData : dataRows);
    }, 300),
    [columns],
  );

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
    if (paginationMode === 'client') {
      debouncedSearch(value, rows);
    }
  };

  const handleSearchSubmit = () => {
    if (paginationMode === 'server') {
      onSearch(searchText);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleReload = () => {
    setSearchText('');
    if (paginationMode === 'server') {
      onSearch('');
    } else {
      setFilteredRows(rows);
    }
    onReloadClick();
  };

  const localeText = {
    ...esES.components.MuiDataGrid.defaultProps.localeText,
    noRowsLabel: 'No hay registros',
    rowsPerPage: 'Filas por página:',
    footerRowSelected: (count) => (count !== 1 ? `${count.toLocaleString()} filas seleccionadas` : `${count.toLocaleString()} fila seleccionada`),
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={9} sx={{ mt: 2 }}>
          {buttonAdd || onReloadClick || secondaryButtonText ? (
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                '& > .MuiGrid-container': {
                  width: 'auto',
                },
              }}
            >
              {buttonAdd && (
                <Button
                  onClick={buttonClick}
                  disabled={buttonDisabled}
                  text={buttonText}
                  type={buttonType}
                />
              )}
              {secondaryButtonText && (
                <Button
                  type="enviar"
                  text={secondaryButtonText}
                  onClick={secondaryButtonClick}
                  disabled={secondaryButtonDisabled}
                >
                  {secondaryButtonText}
                </Button>
              )}
              {onReloadClick && (
                <MuiButton
                  variant="text"
                  onClick={handleReload}
                  disabled={buttonReloadDisabled}
                  startIcon={<RefreshIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Actualizar
                </MuiButton>
              )}
            </Stack>
          ) : (
            <Typography variant="h6">
              {title}
            </Typography>
          )}
        </Grid>
        <Grid item xs={3}>
          <TextField
            margin="normal"
            fullWidth
            id="filter"
            label="Filtrar"
            type="text"
            name="filter"
            autoComplete="filter"
            size="small"
            sx={{ mt: 2 }}
            value={searchText}
            onChange={handleSearch}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearchSubmit}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>
      <div style={{ height: 400, width: '100%', marginTop: 15 }}>
        <DataGrid
          localeText={localeText}
          loading={externalLoading || loading}
          rows={paginationMode === 'server' ? rows : filteredRows}
          columns={columns || []}
          paginationMode={paginationMode}
          rowCount={paginationMode === 'server' ? rowCount : undefined}
          page={paginationMode === 'server' ? page : undefined}
          pageSize={paginationMode === 'server' ? controlledPageSize : pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageChange={paginationMode === 'server' ? onPageChange : undefined}
          onPageSizeChange={(newPageSize) => {
            if (paginationMode === 'server') {
              onPageSizeChange(newPageSize);
            } else {
              setPageSize(newPageSize);
            }
          }}
          sortingMode={paginationMode === 'server' ? 'server' : 'client'}
          sortModel={paginationMode === 'server' ? sortModel : undefined}
          onSortModelChange={paginationMode === 'server' ? onSortModelChange : undefined}
          initialState={initialState || { sorting: { sortModel: [{ field: 'id', sort: 'asc' }] } }}
        />
      </div>
    </>
  );
}

DataTable.defaultProps = {
  title: '',
  buttonAdd: false,
  buttonDisabled: false,
  buttonText: '',
  buttonType: '',
  onReloadClick: null,
  buttonReloadDisabled: false,
  secondaryButtonText: '',
  secondaryButtonClick: () => {},
  secondaryButtonDisabled: false,
  initialState: { sorting: { sortModel: [{ field: 'id', sort: 'asc' }] } },
  buttonClick: () => {},
  rowCount: 0,
  loading: false,
  paginationMode: 'client',
  page: 0,
  pageSize: 10,
  onPageChange: () => {},
  onPageSizeChange: () => {},
  sortModel: [],
  onSortModelChange: () => {},
  onSearch: () => {},
};

DataTable.propTypes = {
  initialState: PropTypes.shape({
    sorting: PropTypes.shape({
      sortModel: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string.isRequired,
          sort: PropTypes.oneOf(['desc', 'asc']),
        }),
      ),
    }),
  }),
  title: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.number,
    }),
  ).isRequired,
  buttonAdd: PropTypes.bool,
  buttonDisabled: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonType: PropTypes.string,
  buttonClick: PropTypes.func,
  onReloadClick: PropTypes.func,
  buttonReloadDisabled: PropTypes.bool,
  secondaryButtonText: PropTypes.string,
  secondaryButtonClick: PropTypes.func,
  secondaryButtonDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  paginationMode: PropTypes.oneOf(['client', 'server']),
  rowCount: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  sortModel: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      sort: PropTypes.oneOf(['desc', 'asc']),
    }),
  ),
  onSortModelChange: PropTypes.func,
  onSearch: PropTypes.func,
};

export default React.memo(DataTable);
