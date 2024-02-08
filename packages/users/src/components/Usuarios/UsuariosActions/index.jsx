import { IconButton, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { useRouter } from 'next/router';

function ActionsAdmin({ id }) {
  const router = useRouter();
  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        aria-label="Consultar"
        onClick={() => {
          router.push(`/usuarios/consultar/${id}`);
        }}
      >
        <ListAltIcon />
      </IconButton>
      <IconButton
        aria-label="Editar"
        onClick={() => {
          router.push(`/usuarios/editar/${id}`);
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton aria-label="Eliminar">
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}

function ActionsRepresentante({ id }) {
  const router = useRouter();
  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        aria-label="Consultar"
        onClick={() => {
          router.push(`/usuarios/consultar/${id}`);
        }}
      >
        <ListAltIcon />
      </IconButton>
      <IconButton
        aria-label="Editar"
        onClick={() => {
          router.push(`/usuarios/editar/${id}`);
        }}
      >
        <EditIcon />
      </IconButton>
    </Stack>
  );
}

ActionsAdmin.propTypes = {
  id: PropTypes.number.isRequired,
};

ActionsRepresentante.propTypes = {
  id: PropTypes.number.isRequired,
};

export {
  ActionsAdmin,
  ActionsRepresentante,
};
