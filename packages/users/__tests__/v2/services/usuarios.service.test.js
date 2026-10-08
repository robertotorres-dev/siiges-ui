const mockFetch = (response, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    headers: { get: () => 'application/json' },
    json: jest.fn().mockResolvedValue(response),
    statusText: ok ? 'OK' : 'Bad Request',
  });
};

const session = { id: 1, token: 'test-token', rol: 'admin' };

// eslint-disable-next-line global-require
const getService = () => require('../../../v2/services/usuarios.service');

beforeEach(() => {
  jest.resetModules();
  process.env.NEXT_PUBLIC_API_KEY = 'test-key';
  process.env.NEXT_PUBLIC_URL = 'http://localhost:3001';
});

describe('usuarios.service - getUsers', () => {
  it('calls admin endpoint for admin role', async () => {
    mockFetch({ data: [] });
    const { getUsers } = getService();
    await getUsers({ session });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/usuarios'),
      expect.any(Object),
    );
  });

  it('calls representante endpoint for representante role', async () => {
    mockFetch({ data: [] });
    const { getUsers } = getService();
    await getUsers({ session: { ...session, rol: 'representante' } });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`api/v1/usuarios/${session.id}/usuarios`),
      expect.any(Object),
    );
  });

  it('calls admin endpoint for sicyt_editar role', async () => {
    mockFetch({ data: [] });
    const { getUsers } = getService();
    await getUsers({ session: { ...session, rol: 'sicyt_editar' } });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/usuarios'),
      expect.any(Object),
    );
  });

  it('forwards the name or status search term to the users API', async () => {
    mockFetch({ data: [] });
    const { getUsers } = getService();

    await getUsers({
      session,
      page: 0,
      limit: 10,
      search: 'Activado',
      sortBy: 'nombre',
      sortOrder: 'asc',
    });

    const requestUrl = new URL(global.fetch.mock.calls[0][0]);
    expect(requestUrl.searchParams.get('search')).toBe('Activado');
    expect(requestUrl.searchParams.get('sortBy')).toBe('nombre');
  });

  it('rejects for unauthorized role', async () => {
    const { getUsers } = getService();
    await expect(getUsers({ session: { ...session, rol: 'otros' } })).rejects.toThrow();
  });
});

describe('usuarios.service - getUserById', () => {
  it('calls correct endpoint with usuarioId', async () => {
    mockFetch({ data: { id: 5 } });
    const { getUserById } = getService();
    await getUserById({ session, usuarioId: 5 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/usuarios/5'),
      expect.any(Object),
    );
  });
});

describe('usuarios.service - createUser', () => {
  const data = { usuario: 'testuser' };

  it('calls admin create endpoint', async () => {
    mockFetch({ data });
    const { createUser } = getService();
    await createUser({ session, data });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/usuarios'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('calls representante create endpoint', async () => {
    mockFetch({ data });
    const { createUser } = getService();
    await createUser({ session: { ...session, rol: 'representante' }, data });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`api/v1/usuarios/${session.id}/usuario`),
      expect.any(Object),
    );
  });

  it('rejects for unauthorized role', async () => {
    const { createUser } = getService();
    await expect(createUser({ session: { ...session, rol: 'otros' }, data })).rejects.toThrow();
  });
});

describe('usuarios.service - updateUser', () => {
  it('calls PATCH endpoint with correct id', async () => {
    mockFetch({ data: {} });
    const { updateUser } = getService();
    await updateUser({ session, usuarioId: 7, data: {} });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/usuarios/7'),
      expect.objectContaining({ method: 'PATCH' }),
    );
  });
});

describe('usuarios.service - error handling', () => {
  it('throws friendly message for RFC validation error', async () => {
    mockFetch({ message: 'body/persona/rfc must NOT have fewer than 13 characters' }, false);
    const { updateUser } = getService();
    await expect(updateUser({ session, usuarioId: 1, data: {} })).rejects.toThrow(
      /RFC inv/,
    );
  });

  it('throws friendly message for CURP validation error', async () => {
    mockFetch({ message: 'body/persona/curp must NOT have fewer than 18 characters' }, false);
    const { updateUser } = getService();
    await expect(updateUser({ session, usuarioId: 1, data: {} })).rejects.toThrow(
      /CURP inv/,
    );
  });

  it('throws friendly message for correo validation error', async () => {
    mockFetch({ message: 'body/correo must match pattern' }, false);
    const { updateUser } = getService();
    await expect(updateUser({ session, usuarioId: 1, data: {} })).rejects.toThrow(
      /Correo/,
    );
  });

  it('throws friendly message for celular validation error', async () => {
    mockFetch({ message: 'body/persona/celular must match pattern' }, false);
    const { updateUser } = getService();
    await expect(updateUser({ session, usuarioId: 1, data: {} })).rejects.toThrow(
      /Celular inv/,
    );
  });

  it('throws friendly message for telefono validation error', async () => {
    mockFetch({ message: 'body/persona/telefono must match pattern' }, false);
    const { updateUser } = getService();
    await expect(updateUser({ session, usuarioId: 1, data: {} })).rejects.toThrow(
      /Tel/,
    );
  });

  it('throws friendly message for generic minLength error', async () => {
    mockFetch({ message: 'body/campo must NOT have fewer than 5 characters' }, false);
    const { updateUser } = getService();
    await expect(updateUser({ session, usuarioId: 1, data: {} })).rejects.toThrow(
      /longitud m/,
    );
  });

  it('passes through generic error message unchanged', async () => {
    mockFetch({ message: 'Error de base de datos' }, false);
    const { updateUser } = getService();
    await expect(updateUser({ session, usuarioId: 1, data: {} })).rejects.toThrow(
      'Error de base de datos',
    );
  });
});
