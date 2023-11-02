import { IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import GruposModal from './GruposModal';

export default function ButtonsGrupos({ id }) {
  const [open, setOpen] = useState(false);
  const params = {
    cicloEscolarId: id.cicloEscolarId,
    gradoId: id.gradoId,
    gradoNombre: id.gradoNombre,
  };
  return (
    <>
      <Stack direction="row" spacing={1}>
        {id && (
          <IconButton
            aria-label="Ciclos Escolares Editar"
            onClick={() => {
              setOpen(true);
            }}
          >
            <EditIcon />
          </IconButton>
        )}
      </Stack>
      <GruposModal
        open={open}
        setOpen={setOpen}
        type="edit"
        data={id}
        params={params}
      />
    </>
  );
}

ButtonsGrupos.propTypes = {
  id: PropTypes.number.isRequired,
};
