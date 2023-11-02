export const generos = [
  { id: 1, nombre: 'Masculino' },
  { id: 2, nombre: 'Femenino' },
];

export const nacionalidad = [
  { id: 1, nombre: 'Mexicana' },
  { id: 2, nombre: 'Otro' },
];

export const situaciones = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
  { id: 3, nombre: 'Egresado' },
  { id: 4, nombre: 'Baja' },
];

export const campos = [
  { id: 'nombre', label: 'Nombre', type: 'text' },
  { id: 'apellidoPaterno', label: 'Apellido Paterno', type: 'text' },
  { id: 'apellidoMaterno', label: 'Apellido Materno', type: 'text' },
  { id: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
  {
    id: 'sexo',
    label: 'Sexo',
    type: 'select',
    options: generos,
  },
  {
    id: 'nacionalidad',
    label: 'Nacionalidad',
    type: 'select',
    options: nacionalidad,
  },
  { id: 'correoPrimario', label: 'Correo', type: 'text' },
  { id: 'telefono', label: 'Telefono', type: 'text' },
  { id: 'celular', label: 'Celular', type: 'text' },
  { id: 'curp', label: 'CURP', type: 'text' },
  { id: 'matricula', label: 'Matricula', type: 'text' },
  {
    id: 'situacionId',
    label: 'Situación',
    type: 'select',
    options: situaciones,
  },
];

export const mailValidator = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};
export const setFormData = (data) => ({
  situacionId: data?.situacionId,
  programaId: data?.alumnoId,
  matricula: data?.matricula,
  estatus: 1,
  persona: {
    nombre: data?.nombre,
    apellidoPaterno: data?.apellidoPaterno,
    apellidoMaterno: data?.apellidoMaterno,
    fechaNacimiento: data?.fechaNacimiento && new Date(data?.fechaNacimiento).toISOString(),
    sexo: generos[data.sexo - 1]?.nombre,
    nacionalidad: nacionalidad[data.nacionalidad - 1]?.nombre,
    telefono: data?.telefono,
    celular: data?.celular,
    curp: data?.curp,
    correoPrimario: data?.correoPrimario,
  },
});

const validateForm = (data) => {
  const queryEvaluate = (value) => value === undefined || value === null || value === '';
  const firstValidate = !Object.values(data).some(queryEvaluate);
  const secondValidate = !Object.values(data?.persona).some(queryEvaluate);
  return firstValidate && secondValidate;
};

export const setAndValidateFormData = (data) => {
  const formData = setFormData(data);
  const validate = validateForm(formData);
  return { formData, validate };
};
