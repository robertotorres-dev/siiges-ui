import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import {
  DataTable, DefaultModal, ButtonSimple,
} from '@siiges-ui/shared';
import institucionesColumns from '../../Tables/institucionesColumns';

const formattedRows = (instituciones) => instituciones.map((institucion) => ({
  id: institucion.id,
  nombre: institucion.nombre,
  razonSocial: institucion.razonSocial,
  claveIes: institucion.claveIes,
  actions: 'Actions Placeholder',
}));

function ModalState() {
  const [modal, setModal] = useState(false);
  const [modalId, setModalId] = useState();

  const showModal = (id) => {
    setModalId(id);
    setModal(true);
  };
  const hideModal = () => {
    setModal(false);
  };

  return {
    modal,
    showModal,
    hideModal,
    modalId,
  };
}

export default function InstitucionesTable({
  instituciones,
  session,
  pagination,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortModel,
  onSortModelChange,
  onSearch,
  onReload,
  loading,
}) {
  const { rol } = session || {};
  const [rows, setRows] = useState([]);

  const {
    modal, showModal, hideModal, modalId,
  } = ModalState();

  useEffect(() => {
    if (instituciones && instituciones.length) {
      const tableRows = formattedRows(instituciones, rol);
      setRows(tableRows);
    } else {
      setRows([]);
    }
  }, [instituciones, rol]);

  return (
    <Grid container sx={{ marginTop: 2 }}>
      <DataTable
        title="Tabla Instituciones"
        rows={rows}
        columns={institucionesColumns(showModal)}
        paginationMode="server"
        rowCount={pagination?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        onSearch={onSearch}
        onReloadClick={onReload}
        buttonAdd={false}
        loading={loading}
      />
      <DefaultModal open={modal} setOpen={hideModal} id={modalId} title="Eliminar Institución">
        <Typography>
          ¿Desea eliminar la institución
          {' '}
          ?
        </Typography>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <ButtonSimple
              text="Cancelar"
              alt="Cancelar"
              design="cancel"
              onClick={hideModal}
            />

          </Grid>
          <Grid item>
            <ButtonSimple
              text="Confirmar"
              alt="Confirmar"
              onClick={() => {
                hideModal();
              }}
            />
          </Grid>
        </Grid>
      </DefaultModal>
    </Grid>
  );
}

InstitucionesTable.propTypes = {
  instituciones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      usuario: PropTypes.string.isRequired,
      correo: PropTypes.string.isRequired,
    }),
  ),
  session: PropTypes.shape({
    rol: PropTypes.string,
  }),
  pagination: PropTypes.shape({
    total: PropTypes.number,
  }),
  page: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  sortModel: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    sort: PropTypes.oneOf(['asc', 'desc']),
  })),
  onSortModelChange: PropTypes.func,
  onSearch: PropTypes.func,
  onReload: PropTypes.func,
  loading: PropTypes.bool,
};

InstitucionesTable.defaultProps = {
  instituciones: [] || undefined,
  session: { rol: '' },
  pagination: { total: 0 },
  page: 0,
  pageSize: 10,
  onPageChange: () => {},
  onPageSizeChange: () => {},
  sortModel: [{ field: 'nombre', sort: 'asc' }],
  onSortModelChange: () => {},
  onSearch: () => {},
  onReload: () => {},
  loading: false,
};
