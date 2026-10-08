import InstitucionData from './components/Sections/InstitucionData';
import DatosGenerales from './components/NuevaSolicitud/DatosGenerales';
import Plantel from './components/NuevaSolicitud/Plantel';
import PlanEstudios from './components/NuevaSolicitud/PlanEstudios';
import PlataformaEducativa from './components/NuevaSolicitud/PlataformaEducativa';
import Anexos from './components/NuevaSolicitud/Anexos';
import EvaluacionCurricular from './components/NuevaSolicitud/EvaluacionCurricular';
import ChangeAddress from './components/ModuleSelector/CambioDomicilio';
import NewRequest from './components/ModuleSelector/NuevaSolicitud';
import Refrendo from './components/ModuleSelector/Refrendo';
import ModuleHeader from './components/ModuleHeader';
import NuevaSolicitud from './components/NuevaSolicitud';
import getSolicitudes from './components/utils/getSolicitudes';
import errorDatosPlanEstudios from './components/utils/sections/errors/errorDatosPlanEstudios';
import errorDatosNuevaSolicitud from './components/utils/sections/errors/errorDatosNuevaSolicitud';
import SolicitudContext from './components/utils/Context/solicitudContext';
import modalidades from './components/utils/Mocks/mockModalidades';
import formData from './components/utils/sections/forms/formData';
import getSolicitudDetalles from './components/utils/getSolicitudDetalles';
import columnsSolicitudes from './components/utils/Tables/solicitudesColumns';
import DocentesCreateModal from './components/utils/Components/DocentesModales/DocentesModal';
import HerramientaEducativa from './components/Sections/HerramientaEducativa';
import useProgramaById from './components/utils/useProgramaById';
import Actualizacion from './components/ModuleSelector/Actualizacion';
import CambioNombreInstitucion from './components/ModuleSelector/CambioNombreInstitucion';
import CambioRepresentanteLegal from './components/ModuleSelector/CambioRepresentanteLegal';
import SolicitudesSkeleton from './components/SolicitudesSkeleton';

export {
  CambioRepresentanteLegal,
  SolicitudesSkeleton,
  CambioNombreInstitucion,
  Actualizacion,
  useProgramaById,
  HerramientaEducativa,
  getSolicitudDetalles,
  NewRequest,
  ChangeAddress,
  EvaluacionCurricular,
  columnsSolicitudes,
  Refrendo,
  InstitucionData,
  ModuleHeader,
  NuevaSolicitud,
  DatosGenerales,
  Plantel,
  PlanEstudios,
  PlataformaEducativa,
  Anexos,
  getSolicitudes,
  errorDatosPlanEstudios,
  errorDatosNuevaSolicitud,
  SolicitudContext,
  modalidades,
  formData,
  DocentesCreateModal,
};
