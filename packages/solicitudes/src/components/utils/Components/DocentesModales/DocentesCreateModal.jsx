import React, { useEffect, useContext, useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { DefaultModal, ButtonStyled } from '@siiges-ui/shared';
import Input from '@siiges-ui/shared/src/components/Input';
import PropTypes from 'prop-types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import errorDatosDocentes from '../../sections/errors/errordatosDocentes';
import handleCreate from '../../submitNewAsignaturas';
import { TablesPlanEstudiosContext } from '../../Context/tablesPlanEstudiosProviderContext';

export default function DocentesCreateModal({ open, hideModal, title }) {
  const {
    setDocentesList,
    formDocentes,
    setFormDocentes,
    setError,
    error,
    errors,
    setErrors,
    initialValues,
    setInitialValues,
    id,
    setNoti,
  } = useContext(TablesPlanEstudiosContext);

  const errorsAsignatura = errorDatosDocentes(formDocentes, setError, error);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormDocentes((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnBlur = (e) => {
    const { name, value } = e.target;
    const initialValue = initialValues[name];

    if (value !== initialValue || value === '') {
      errorsAsignatura[name]();
    }
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setInitialValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  useEffect(() => {
    if (errorsAsignatura !== undefined) {
      setErrors(errorsAsignatura);
    }
  }, [error]);

  const handleOnSubmit = () => {
    handleCreate(
      formDocentes,
      setFormDocentes,
      setInitialValues,
      setDocentesList,
      hideModal,
      errors,
      setNoti,
      id,
      1,
    );
  };

  const [currentSection, setCurrentSection] = useState(1);

  const handleNextSection = () => {
    setCurrentSection((prevSection) => prevSection + 1);
  };

  const handlePreviousSection = () => {
    setCurrentSection((prevSection) => prevSection - 1);
  };

  const tiposDocentes = [
    { id: 1, nombre: 'Docente de asignatura' },
    { id: 2, nombre: 'Docente de tiempo completo' },
  ];

  const documentosPresentados = [
    { id: 1, nombre: 'Titulo' },
    { id: 2, nombre: 'Cédula' },
  ];

  const tipoContratacion = [
    { id: 1, nombre: 'Contratación' },
    { id: 2, nombre: 'Tiempo indefinido' },
    { id: 3, nombre: 'Otro' },
  ];

  const nivel = [
    { id: 1, nombre: 'Licenciatura' },
    { id: 2, nombre: 'Técnico Superior Universitario' },
    { id: 3, nombre: 'Especialidad' },
    { id: 4, nombre: 'Maestria' },
    { id: 5, nombre: 'Doctorado' },
    { id: 6, nombre: 'Profesional Asociado' },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid item xs={3}>
              <BasicSelect
                title="Tipo de docente"
                name="tipoDocente"
                options={tiposDocentes}
                onchange={handleOnChange}
                onblur={handleOnBlur}
                errorMessage={error.tipoDocente}
                textValue
                required
              />
            </Grid>
            <Grid item xs={9}>
              <Input
                id="nombre"
                label="Nombre(s)"
                name="nombre"
                auto="nombre"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.nombre}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                id="apellidoPaterno"
                label="Apellido paterno"
                name="apellidoPaterno"
                auto="apellidoPaterno"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.apellidoPaterno}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                id="apellidoMaterno"
                label="Apellido materno"
                name="apellidoMaterno"
                auto="apellidoMaterno"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.apellidoMaterno}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Ultimo grado</Typography>
            </Grid>
            <Grid item xs={3}>
              <BasicSelect
                title="Nivel"
                name="nivelUltimoGrado"
                options={nivel}
                onchange={handleOnChange}
                onblur={handleOnBlur}
                errorMessage={error.nivelUltimoGrado}
                textValue
                required
              />
            </Grid>
            <Grid item xs={9}>
              <Input
                id="nombreUltimoGrado"
                label="Nombre"
                name="nombreUltimoGrado"
                auto="nombreUltimoGrado"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.nombreUltimoGrado}
              />
            </Grid>
            <Grid item xs={12}>
              <BasicSelect
                title="Documento presentado"
                name="documentoPresentadoUltimoGrado"
                options={documentosPresentados}
                onchange={handleOnChange}
                onblur={handleOnBlur}
                errorMessage={error.documentoPresentadoUltimoGrado}
                textValue
                required
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Penultimo grado</Typography>
            </Grid>
            <Grid item xs={3}>
              <BasicSelect
                title="Nivel"
                name="nivelPenultimoGrado"
                options={nivel}
                onchange={handleOnChange}
                onblur={handleOnBlur}
                errorMessage={error.nivelPenultimoGrado}
                textValue
                required
              />
            </Grid>
            <Grid item xs={9}>
              <Input
                id="naombrePenultimoGrado"
                label="Nombre"
                name="naombrePenultimoGrado"
                auto="naombrePenultimoGrado"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.naombrePenultimoGrado}
              />
            </Grid>
            <Grid item xs={12}>
              <BasicSelect
                title="Documento presentado"
                name="documentoPresentadoPenultimoGrado"
                options={documentosPresentados}
                onchange={handleOnChange}
                onblur={handleOnBlur}
                errorMessage={error.documentoPresentadoPenultimoGrado}
                textValue
                required
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <Input
                id="asignaturasPropuesta"
                label="Asignaturas para las que se propone"
                name="asignaturasPropuesta"
                auto="asignaturasPropuesta"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.asignaturasPropuesta}
              />
            </Grid>
            <Grid item xs={6}>
              <BasicSelect
                title="Documento presentado"
                name="Tipo de contratación"
                options={tipoContratacion}
                onchange={handleOnChange}
                onblur={handleOnBlur}
                errorMessage={error.tipoContratacion}
                textValue
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                id="antiguedad"
                label="Antiguedad"
                name="antiguedad"
                auto="antiguedad"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.antiguedad}
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                id="totalHorasIndependiente"
                label="Total horas independiente"
                name="totalHorasIndependiente"
                auto="totalHorasIndependiente"
                onchange={handleOnChange}
                onblur={handleOnBlur}
                onfocus={handleInputFocus}
                required
                errorMessage={error.totalHorasIndependiente}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="experienciaLaboral"
                name="experienciaLaboral"
                label="Experiencia laboral"
                rows={4}
                multiline
                sx={{ width: '100%' }}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onFocus={handleInputFocus}
                required
                errorMessage={error.experienciaLaboral}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <DefaultModal open={open} setOpen={hideModal} title={title}>
      {renderSection()}
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={8}>
          <ButtonStyled
            text="Cancelar"
            alt="Cancelar"
            design="error"
            onclick={hideModal}
          >
            Cancelar
          </ButtonStyled>
        </Grid>
        {currentSection === 1 && (
          <>
            <Grid item xs={2} />
            <Grid item xs={2}>
              <ButtonStyled
                text={<ArrowForwardIosIcon sx={{ height: 14 }} />}
                alt={<ArrowForwardIosIcon sx={{ height: 14 }} />}
                onclick={handleNextSection}
              />
            </Grid>
          </>
        )}
        {currentSection === 2 && (
          <>
            <Grid item xs={2}>
              <ButtonStyled
                text={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
                alt={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
                onclick={handlePreviousSection}
              />
            </Grid>
            <Grid item xs={2}>
              <ButtonStyled
                text={<ArrowForwardIosIcon sx={{ height: 14 }} />}
                alt={<ArrowForwardIosIcon sx={{ height: 14 }} />}
                onclick={handleNextSection}
              />
            </Grid>
          </>
        )}
        {currentSection === 3 && (
          <>
            <Grid item xs={2}>
              <ButtonStyled
                text={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
                alt={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
                onclick={handlePreviousSection}
              />
            </Grid>
            <Grid item xs={2}>
              <ButtonStyled
                text="Confirmar"
                alt="Confirmar"
                onclick={handleOnSubmit}
              />
            </Grid>
          </>
        )}
      </Grid>
    </DefaultModal>
  );
}

DocentesCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};
