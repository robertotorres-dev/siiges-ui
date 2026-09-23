import { getToken } from '@siiges-ui/shared';
import { useEffect, useState } from 'react';

export default function getInstituciones({
  esNombreAutorizado,
  tipoInstitucionId,
  setLoading,
  page = 0,
  limit = 10,
  search = '',
  sortBy = 'id',
  sortOrder = 'asc',
  refreshKey = 0,
}) {
  const [instituciones, setInstituciones] = useState([]);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
    sortBy,
    sortOrder,
    search,
  });
  const token = getToken();
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    if (setLoading) {
      setLoading(true);
    }

    const params = new URLSearchParams();

    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search) params.set('search', search);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (esNombreAutorizado !== undefined) params.set('esNombreAutorizado', String(esNombreAutorizado));
    if (tipoInstitucionId) params.set('tipoInstitucionId', String(tipoInstitucionId));

    const finalURL = `${url}/api/v1/instituciones?${params.toString()}`;

    fetch(finalURL, {
      headers: { api_key: apikey, Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const nextData = Array.isArray(data?.data) ? data.data : [];
        const nextPagination = data?.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0,
          sortBy,
          sortOrder,
          search,
        };

        setInstituciones(nextData);
        setPagination(nextPagination);
      })
      .catch((error) => {
        console.error('Error:', error);
        setInstituciones([]);
        setPagination({
          page, limit, total: 0, totalPages: 0, sortBy, sortOrder, search,
        });
      })
      .finally(() => {
        if (setLoading) {
          setLoading(false);
        }
      });
  }, [
    apikey,
    esNombreAutorizado,
    limit,
    page,
    refreshKey,
    search,
    setLoading,
    sortBy,
    sortOrder,
    tipoInstitucionId,
    token,
    url,
  ]);

  return {
    instituciones,
    pagination,
  };
}
