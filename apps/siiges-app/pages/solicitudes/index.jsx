import React, {
  useCallback, useEffect, useMemo, useState,
  useRef,
} from 'react';
import {
  NewRequest,
  ChangeAddress,
  Refrendo,
  getSolicitudes,
  columnsSolicitudes,
  Actualizacion,
  CambioNombreInstitucion,
  SolicitudesSkeleton,
} from '@siiges-ui/solicitudes';
import {
  Layout, Select, DataTable, Loading, useAuth, useNotification,
} from '@siiges-ui/shared';
import { Divider } from '@mui/material';
import dayjs from 'dayjs';

export default function Solicitudes() {
  const { session } = useAuth();
  const notify = useNotification();
  const [newSolicitud, setNewSolicitud] = useState(false);
  const [option, setOption] = useState();
  const [NewRequestContentVisible, setNewRequestContentVisible] = useState(false);
  const [ChangeAddressContentVisible, setChangeAddressContentVisible] = useState(false);
  const [RefrendoContentVisible, setRefrendoContentVisible] = useState(false);
  const [ActualizacionContentVisible, setActualizacionContentVisible] = useState(false);
  // const [RepLegalContentVisible, setRepLegalContentVisible] = useState(false);
  const [NombreInstitucionContentVisible, setNombreInstitucionContentVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'asc' }]);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasCompletedInitialLoadRef = useRef(false);
  const activeSort = sortModel[0] || { field: 'id', sort: 'asc' };
  const {
    solicitudes,
    pagination,
    hasAcuerdoRvoe: hasAcuerdoRvoeFromApi,
    loading,
    error,
  } = getSolicitudes({
    page,
    limit: pageSize,
    search,
    sortBy: activeSort.field,
    sortOrder: activeSort.sort,
    refreshKey,
  });
  const isSessionReady = Boolean(session?.rol);

  useEffect(() => {
    if (isSessionReady && !loading) {
      hasCompletedInitialLoadRef.current = true;
    }
  }, [isSessionReady, loading]);

  const rows = useMemo(() => solicitudes.map((solicitud) => ({
    id: solicitud.id,
    estatus: solicitud.estatusSolicitudId,
    folio: solicitud.folio,
    tipoSolicitud: solicitud.tipoSolicitud?.nombre,
    programa: solicitud.programa?.nombre,
    acuerdoRvoe: solicitud.programa?.acuerdoRvoe,
    estatusSolicitudId: solicitud.estatusSolicitud?.nombre,
    institucion: solicitud?.programa?.plantel?.institucion?.nombre,
    fechaIncorporacion: solicitud.fechaIncorporacion
      ? dayjs(solicitud.fechaIncorporacion).format('DD/MM/YYYY')
      : '—',
    plantel: `${solicitud.programa?.plantel?.domicilio?.calle} #${solicitud.programa?.plantel?.domicilio?.numeroExterior}`,
    actions: 'Actions Placeholder',
  })), [solicitudes]);

  useEffect(() => {
    setNewRequestContentVisible(option === 'new');
    setChangeAddressContentVisible(option === 'address');
    setRefrendoContentVisible(option === 'refrendo');
    setActualizacionContentVisible(option === 'actualizacion');
    // setRepLegalContentVisible(option === 'repLegal');
    setNombreInstitucionContentVisible(option === 'nombreInstitucion');
  }, [option]);

  useEffect(() => {
    if (session.rol === 'representante') {
      setNewSolicitud(true);
    }
  }, [session]);

  useEffect(() => {
    setNewRequestContentVisible(option === 'new');
    setChangeAddressContentVisible(option === 'address');
    setRefrendoContentVisible(option === 'refrendo');
  }, [option]);

  const handleOnChange = (e) => {
    setOption(e.target.value);
  };

  const handlePageChange = useCallback((nextPage) => setPage(nextPage), []);
  const handlePageSizeChange = useCallback((nextPageSize) => {
    setPage(0);
    setPageSize(nextPageSize);
  }, []);
  const handleSortModelChange = useCallback((nextSortModel) => {
    setPage(0);
    setSortModel(nextSortModel);
  }, []);
  const handleSearch = useCallback((nextSearch) => {
    setPage(0);
    setSearch(nextSearch);
  }, []);
  const handleReload = useCallback(() => {
    setSearch('');
    setPage(0);
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (error) {
      notify.error(error.message || 'No fue posible cargar las solicitudes.');
    }
  }, [error, notify]);

  const hasAcuerdoRvoe = hasAcuerdoRvoeFromApi ?? solicitudes.some(
    (solicitud) => solicitud.programa?.acuerdoRvoe
      && solicitud.programa.acuerdoRvoe.trim() !== '',
  );
  const isInitialLoading = !isSessionReady
    || (loading && !hasCompletedInitialLoadRef.current);

  const options = useMemo(() => {
    const baseOptions = [
      { id: 'new', nombre: 'Nueva Solicitud' },
    ];
    if (hasAcuerdoRvoe) {
      baseOptions.push(
        { id: 'refrendo', nombre: 'Refrendo de plan de estudios' },
        { id: 'address', nombre: 'Cambio de domicilio' },
        { id: 'actualizacion', nombre: 'Actualización' },
      );
    }
    baseOptions.push(
      // { id: 'repLegal', nombre: 'Cambio de Representante Legal' },
      { id: 'nombreInstitucion', nombre: 'Cambio de nombre de Institución' },
    );
    return baseOptions;
  }, [hasAcuerdoRvoe]);

  return (
    <Layout title="Solicitudes">
      <Loading loading={isInitialLoading} />
      {isInitialLoading && <SolicitudesSkeleton />}
      {newSolicitud && (
        <Select
          title="Seleccione una opción"
          name="options"
          options={options}
          value=""
          onChange={handleOnChange}
        />
      )}
      <Divider sx={{ mt: 2 }} />
      {NewRequestContentVisible && <NewRequest />}
      {ChangeAddressContentVisible && <ChangeAddress />}
      {RefrendoContentVisible && <Refrendo />}
      {ActualizacionContentVisible && <Actualizacion />}
      {/* {RepLegalContentVisible && <CambioRepresentanteLegal />} */}
      {NombreInstitucionContentVisible && <CambioNombreInstitucion />}
      {!isInitialLoading && (
        <DataTable
          title="Tabla de solicitudes"
          rows={rows}
          columns={columnsSolicitudes(session.rol)}
          paginationMode="server"
          rowCount={pagination.total}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          onSearch={handleSearch}
          onReloadClick={handleReload}
          loading={loading}
        />
      )}
    </Layout>
  );
}
