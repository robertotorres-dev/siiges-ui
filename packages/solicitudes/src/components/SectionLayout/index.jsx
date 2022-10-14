import React from 'react';
import { LoadCircle, Title } from '@siiges-ui/shared';
import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ButtonSection from './ButtonSection';

export default function SectionLayout({
  children,
  sections,
  position,
  total,
  porcentage,
  next,
  prev,
}) {
  return (
    <>
      <Title title="Datos Generales" />
      <Grid container sx={{ mt: 3 }}>
        <Grid
          item
          xs={8}
          justifyContent="end"
          alignItems="center"
          sx={{ textAlign: 'left' }}
        >
          <Box
            alignItems="center"
            display="flex"
            sx={{
              backgroundColor: 'darkGray',
              width: 230,
              ml: 55,
              py: 1,
              px: 1,
              borderRadius: 20,
            }}
          >
            <LoadCircle state={porcentage} />
            <Typography
              alignItems="center"
              variant="p"
              sx={{
                color: 'white',
                ml: 3,
              }}
            >
              {sections}
              {' '}
              de
              {' '}
              {total}
              {' '}
              completado
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <ButtonSection position={position} next={next} prev={prev} />
        </Grid>
        {children}
        <Grid item xs={8} />
        <Grid item xs={4} direction="row-reverse">
          <ButtonSection position={position} next={next} prev={prev} />
        </Grid>
      </Grid>
    </>
  );
}

SectionLayout.propTypes = {
  sections: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  porcentage: PropTypes.number.isRequired,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};