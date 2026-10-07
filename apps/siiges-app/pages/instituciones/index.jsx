import React, { useEffect, useRef, useState } from 'react';
import router from 'next/router';
import { Divider } from '@mui/material';
import { Layout, Loading, useAuth } from '@siiges-ui/shared';
import { InstitucionesTable, InstitucionesSkeleton, getInstituciones } from '@siiges-ui/instituciones';

const USERS_AUTH = ['admin', 'sicyt_editar'];

export default function Instituciones() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortModel, setSortModel] = useState([{ field: 'nombre', sort: 'asc' }]);
  const hasRenderedInitialLoadRef = useRef(false);

  const activeSort = sortModel[0] || { field: 'nombre', sort: 'asc' };
  const { instituciones, pagination } = getInstituciones({
    setLoading,
    tipoInstitucionId: 1,
    page,
    limit: pageSize,
    search,
    sortBy: activeSort.field,
    sortOrder: activeSort.sort,
    refreshKey,
  });

  useEffect(() => {
    if (session?.rol) {
      hasRenderedInitialLoadRef.current = true;
    }
  }, [session?.rol]);

  useEffect(() => {
    if (!session) return;

    const { id, rol } = session;
    if (id && USERS_AUTH.includes(rol)) {
      setData(Array.isArray(instituciones) ? instituciones : []);
    } else {
      router.back();
    }
  }, [session, instituciones]);

  const handlePageChange = (nextPage) => setPage(nextPage);
  const handlePageSizeChange = (nextPageSize) => {
    setPage(0);
    setPageSize(nextPageSize);
  };
  const handleSortModelChange = (nextSortModel) => {
    setPage(0);
    setSortModel(nextSortModel);
  };
  const handleSearch = (nextSearch) => {
    setPage(0);
    setSearch(nextSearch);
  };
  const handleReload = () => {
    setSearch('');
    setPage(0);
    setRefreshKey((prev) => prev + 1);
  };

  const isSessionReady = Boolean(session?.rol);
  const shouldShowInitialSkeleton = !isSessionReady
    || (loading && !hasRenderedInitialLoadRef.current);
  const shouldShowTable = data.length > 0 || Boolean(search);
  const tableLoading = loading && hasRenderedInitialLoadRef.current;

  return (
    <Layout title="Instituciones">
      <Loading loading={!isSessionReady || loading} />
      <Divider sx={{ marginTop: 2 }} />
      {shouldShowInitialSkeleton && <InstitucionesSkeleton />}
      {!shouldShowInitialSkeleton && shouldShowTable && (
        <InstitucionesTable
          instituciones={data}
          session={session}
          pagination={pagination}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          onSearch={handleSearch}
          onReload={handleReload}
          loading={tableLoading}
        />
      )}
    </Layout>
  );
}
