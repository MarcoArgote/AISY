// Cloudflare Worker - Backend API para MyBeats
// Sin itty-router para mayor compatibilidad

// ============= HELPERS =============

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper: Respuesta JSON
const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

// Helper: Generar UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper: Hash password
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Verificar password
async function verifyPassword(password, hashedPassword) {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Helper: Generar JWT
async function generateToken(userId, email, role, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '');
  
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

// Helper: Verificar JWT
async function verifyToken(token, secret) {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );
    
    const valid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!valid) return null;
    
    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Middleware: Autenticación
async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return await verifyToken(token, env.JWT_SECRET || 'default-secret-change-in-production');
}

// ============= HANDLERS =============

// Health check
async function handleHealth(request, env) {
  return jsonResponse({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}

// Registro
async function handleRegister(request, env) {
  try {
    const { email, password, username, fullName } = await request.json();

    if (!email || !password) {
      return jsonResponse({ 
        success: false,
        error: 'Email y contraseña son requeridos' 
      }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ 
        success: false,
        error: 'Email inválido' 
      }, 400);
    }

    if (password.length < 6) {
      return jsonResponse({ 
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres' 
      }, 400);
    }

    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (existingUser) {
      return jsonResponse({ 
        success: false,
        error: 'Este email ya está registrado' 
      }, 409);
    }

    const userId = generateUUID();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO users (id, email, password_hash, username, full_name, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      email.toLowerCase(),
      passwordHash,
      username || email.split('@')[0],
      fullName || '',
      'user',
      'active',
      now,
      now
    ).run();

    const token = await generateToken(
      userId,
      email.toLowerCase(),
      'user',
      env.JWT_SECRET || 'default-secret-change-in-production'
    );

    return jsonResponse({
      success: true,
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        username: username || email.split('@')[0],
        fullName: fullName || '',
        role: 'user'
      }
    }, 201);

  } catch (error) {
    console.error('Error en registro:', error);
    return jsonResponse({ 
      success: false,
      error: 'Error en el servidor' 
    }, 500);
  }
}

// Login
async function handleLogin(request, env) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return jsonResponse({ 
        success: false,
        error: 'Email y contraseña son requeridos' 
      }, 400);
    }

    const user = await env.DB.prepare(
      'SELECT id, email, password_hash, username, full_name, role, status FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (!user) {
      return jsonResponse({ 
        success: false,
        error: 'Email o contraseña incorrectos' 
      }, 401);
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return jsonResponse({ 
        success: false,
        error: 'Email o contraseña incorrectos' 
      }, 401);
    }

    if (user.status !== 'active') {
      return jsonResponse({ 
        success: false,
        error: 'Tu cuenta está suspendida' 
      }, 403);
    }

    const token = await generateToken(
      user.id,
      user.email,
      user.role,
      env.JWT_SECRET || 'default-secret-change-in-production'
    );

    return jsonResponse({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return jsonResponse({ 
      success: false,
      error: 'Error en el servidor' 
    }, 500);
  }
}

// Obtener perfil
async function handleGetProfile(request, env) {
  try {
    const user = await authenticate(request, env);
    
    if (!user) {
      return jsonResponse({ 
        success: false,
        error: 'No autenticado' 
      }, 401);
    }

    const userData = await env.DB.prepare(
      'SELECT id, email, username, full_name, role, status, created_at FROM users WHERE id = ?'
    ).bind(user.userId).first();

    if (!userData) {
      return jsonResponse({ 
        success: false,
        error: 'Usuario no encontrado' 
      }, 404);
    }

    return jsonResponse({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        fullName: userData.full_name,
        role: userData.role,
        status: userData.status,
        createdAt: userData.created_at
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return jsonResponse({ 
      success: false,
      error: 'Error en el servidor' 
    }, 500);
  }
}

// ============= ROUTER =============

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (path === '/api/health' && method === 'GET') {
    return handleHealth(request, env);
  }

  // Registro
  if (path === '/api/auth/register' && method === 'POST') {
    return handleRegister(request, env);
  }

  // Login
  if (path === '/api/auth/login' && method === 'POST') {
    return handleLogin(request, env);
  }

  // Obtener perfil
  if (path === '/api/auth/me' && method === 'GET') {
    return handleGetProfile(request, env);
  }

  // 404
  return jsonResponse({ error: 'Ruta no encontrada' }, 404);
}

// ============= EXPORT =============

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error('Error en worker:', error);
      return jsonResponse({ 
        error: 'Error interno del servidor',
        message: error.message 
      }, 500);
    }
  }
};
