import { useEffect, useState } from 'react';
import { useAuth, getToken } from '@siiges-ui/shared';

const initialPagination = (page, limit) => ({
  page,
  limit,
  total: 0,
  totalPages: 0,
});

export default function getSolicitudes({
  page = 0,
  limit = 10,
  search = '',
  sortBy = 'id',
  sortOrder = 'asc',
  refreshKey = 0,
} = {}) {
  const { session } = useAuth();
  const token = session?.token || getToken();
  const [solicitudes, setSolicitudes] = useState([]);
  const [pagination, setPagination] = useState(() => initialPagination(page, limit));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAcuerdoRvoe, setHasAcuerdoRvoe] = useState(null);
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    if (!session?.rol) return undefined;

    const controller = new AbortController();
    let active = true;
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
    });

    if (search) params.set('search', search);
    if (session.rol === 'control_documental') {
      params.append('estatusSolicitudId', '2');
      params.append('estatusSolicitudId', '3');
    }

    const endpoint = session.rol === 'admin'
      || session.rol === 'sicyt_editar'
      || session.rol === 'control_documental'
      ? '/api/v1/solicitudes/'
      : `/api/v1/solicitudes/usuarios/${session.id}`;

    const loadSolicitudes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${url}${endpoint}?${params.toString()}`, {
          headers: {
            api_key: apikey,
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          let responseError;
          try {
            responseError = await response.json();
          } catch {
            responseError = null;
          }
          throw new Error(
            responseError?.message || response.statusText || 'No fue posible cargar las solicitudes.',
          );
        }

        const responseData = await response.json();
        if (!Array.isArray(responseData?.data)) {
          throw new Error('La respuesta del servicio de solicitudes no tiene un formato válido.');
        }

        if (!active) return;

        const responsePagination = responseData.pagination || {};
        setSolicitudes(responseData.data);
        setPagination({
          page: responsePagination.page ?? page,
          limit: responsePagination.limit ?? limit,
          total: responsePagination.total ?? responseData.data.length,
          totalPages: responsePagination.totalPages
            ?? Math.ceil(responseData.data.length / limit),
        });
        setHasAcuerdoRvoe(
          typeof responsePagination.hasAcuerdoRvoe === 'boolean'
            ? responsePagination.hasAcuerdoRvoe
            : null,
        );
      } catch (requestError) {
        if (!active || requestError.name === 'AbortError') return;

        setSolicitudes([]);
        setPagination(initialPagination(page, limit));
        setError(requestError);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSolicitudes();

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    apikey,
    limit,
    page,
    refreshKey,
    search,
    session?.id,
    session?.rol,
    session?.token,
    sortBy,
    sortOrder,
    token,
    url,
  ]);

  return {
    solicitudes,
    pagination,
    hasAcuerdoRvoe,
    loading,
    error,
  };
}
