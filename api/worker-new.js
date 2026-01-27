// Cloudflare Worker - Backend API para MyBeats
import { Router } from 'itty-router';

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper: Generar UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper: Hash password con Web Crypto API
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

// Helper: Generar JWT simple
async function generateToken(userId, email, role, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 días
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
    
    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
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

// ============= RUTAS DE AUTENTICACIÓN =============

// Registro de usuarios
router.post('/api/auth/register', async (request, env) => {
  try {
    const { email, password, username, fullName } = await request.json();

    // Validar datos
    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Email y contraseña son requeridos' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Email inválido' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar si el email ya existe
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (existingUser) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Este email ya está registrado' 
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generar ID y hash de contraseña
    const userId = generateUUID();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    // Crear usuario
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

    // Generar token
    const token = await generateToken(
      userId,
      email.toLowerCase(),
      'user',
      env.JWT_SECRET || 'default-secret-change-in-production'
    );

    return new Response(JSON.stringify({
      success: true,
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        username: username || email.split('@')[0],
        fullName: fullName || '',
        role: 'user'
      }
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error en el servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Login de usuarios
router.post('/api/auth/login', async (request, env) => {
  try {
    const { email, password } = await request.json();

    // Validar datos
    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Email y contraseña son requeridos' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Buscar usuario
    const user = await env.DB.prepare(
      'SELECT id, email, password_hash, username, full_name, role, status FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Email o contraseña incorrectos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Email o contraseña incorrectos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar estado del usuario
    if (user.status !== 'active') {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Tu cuenta está suspendida. Contacta con soporte.' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generar token
    const token = await generateToken(
      user.id,
      user.email,
      user.role,
      env.JWT_SECRET || 'default-secret-change-in-production'
    );

    return new Response(JSON.stringify({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        role: user.role
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error en el servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Obtener perfil del usuario autenticado
router.get('/api/auth/me', async (request, env) => {
  try {
    const user = await authenticate(request, env);
    
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'No autenticado' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Obtener datos actualizados del usuario
    const userData = await env.DB.prepare(
      'SELECT id, email, username, full_name, role, status, created_at FROM users WHERE id = ?'
    ).bind(user.userId).first();

    if (!userData) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Usuario no encontrado' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
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
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error en el servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ============= OTRAS RUTAS =============

// Health check
router.get('/api/health', () => {
  return new Response(JSON.stringify({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// Manejo de OPTIONS para CORS
router.options('*', () => {
  return new Response(null, {
    headers: corsHeaders
  });
});

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ============= EXPORT =============

export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx).catch(err => {
      console.error('Error en worker:', err);
      return new Response(JSON.stringify({ 
        error: 'Error interno del servidor',
        message: err.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    });
  }
};
