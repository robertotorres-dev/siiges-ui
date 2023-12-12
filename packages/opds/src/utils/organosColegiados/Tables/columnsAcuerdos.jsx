import React from 'react';
import ButtonsAcuerdos from '../../../components/organosColegiados/Tables/ButtonsAcuerdos';

const columnsAcuerdos = [
  { field: 'numeroAcuerdo', headerName: 'Numero de Acuerdo', width: 400 },
  { field: 'estatus', headerName: 'Estatus', width: 300 },
  { field: 'ano', headerName: 'Año', width: 250 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => <ButtonsAcuerdos id={params.row.id} />,
    sortable: false,
    filterable: false,
  },
];

export default columnsAcuerdos;
