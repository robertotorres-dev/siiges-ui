import { useState, useEffect } from 'react';
import { getToken } from '@siiges-ui/shared';

const ENDPOINT_MAPPING = {
  representante: (usuarioId) => `/api/v1/notificaciones/usuarios/${usuarioId}`,
  admin: () => '/api/v1/notificaciones',
};

export default function fetchNotificaciones({ session }) {
  const token = getToken();
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const basePath = process.env.NEXT_PUBLIC_URL;
  const [notificaciones, setNotificaciones] = useState();

  useEffect(() => {
    if (session && session.id) {
      const { id, rol } = session;
      const endpoint = ENDPOINT_MAPPING[rol](id);
      const url = `${basePath}${endpoint}`;

      fetch(url, {
        method: 'GET',
        headers: {
          api_key: apikey,
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(({ data }) => {
          setNotificaciones(data);
        });
    }
  }, [session]);

  return {
    notificaciones,
  };
}
