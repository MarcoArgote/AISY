// Cloudflare Worker - Backend API
// Este archivo se despliega en Cloudflare Workers

import { Router } from 'itty-router';
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import jwt from '@tsndr/cloudflare-worker-jwt';

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Middleware de autenticación
async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const isValid = await jwt.verify(token, env.JWT_SECRET);
    if (!isValid) return null;
    
    const decoded = jwt.decode(token);
    return decoded.payload;
  } catch (error) {
    return null;
  }
}

// ============= RUTAS DE AUTENTICACIÓN =============

router.post('/api/auth/register', async (request, env) => {
  const { email, password, username, full_name } = await request.json();

  // Validar datos
  if (!email || !password || !username) {
    return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Hash de contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Insertar usuario en D1
    const result = await env.DB.prepare(
      'INSERT INTO users (email, password_hash, username, full_name) VALUES (?, ?, ?, ?)'
    ).bind(email, passwordHash, username, full_name || null).run();

    const userId = result.meta.last_row_id;

    // Crear JWT
    const token = await jwt.sign({
      id: userId,
      email,
      username
    }, env.JWT_SECRET, { expiresIn: '7d' });

    return new Response(JSON.stringify({
      token,
      user: { id: userId, email, username, full_name }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Usuario ya existe' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

router.post('/api/auth/login', async (request, env) => {
  const { email, password } = await request.json();

  // Buscar usuario
  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Verificar contraseña
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Crear JWT
  const token = await jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, env.JWT_SECRET, { expiresIn: '7d' });

  return new Response(JSON.stringify({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

router.get('/api/auth/me', async (request, env) => {
  const user = await authenticate(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const userData = await env.DB.prepare(
    'SELECT id, email, username, full_name, created_at FROM users WHERE id = ?'
  ).bind(user.id).first();

  return new Response(JSON.stringify(userData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ============= RUTAS DE BEATS =============

router.get('/api/beats', async (request, env) => {
  const beats = await env.DB.prepare(
    'SELECT * FROM beats WHERE is_available = 1'
  ).all();

  return new Response(JSON.stringify(beats.results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ============= RUTAS DE CHECKOUT =============

router.post('/api/checkout/create-session', async (request, env) => {
  const user = await authenticate(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { beatId, licenseType } = await request.json();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  // Obtener información del beat y licencia
  const beat = await env.DB.prepare('SELECT * FROM beats WHERE id = ?').bind(beatId).first();
  const license = await env.DB.prepare('SELECT * FROM license_types WHERE slug = ?').bind(licenseType).first();

  // Crear sesión de Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${beat.title} - ${license.name}`,
          description: `Licencia ${license.name} para el beat "${beat.title}"`,
          images: [beat.cover_image_url]
        },
        unit_amount: Math.round(license.price * 100)
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/cancel`,
    metadata: {
      userId: user.id,
      beatId: beatId,
      licenseTypeId: license.id
    }
  });

  return new Response(JSON.stringify({ sessionId: session.id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ============= WEBHOOK DE STRIPE =============

router.post('/api/webhook/stripe', async (request, env) => {
  const sig = request.headers.get('stripe-signature');
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  
  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Generar número de licencia único
      const licenseNumber = `LIC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Crear registro de compra
      await env.DB.prepare(`
        INSERT INTO purchases (user_id, beat_id, license_type_id, transaction_id, amount, payment_status, license_number)
        VALUES (?, ?, ?, ?, ?, 'completed', ?)
      `).bind(
        session.metadata.userId,
        session.metadata.beatId,
        session.metadata.licenseTypeId,
        session.payment_intent,
        session.amount_total / 100,
        licenseNumber
      ).run();

      // TODO: Generar PDF de licencia y subirlo a R2
      // TODO: Si es licencia exclusiva, marcar beat como no disponible
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ============= RUTAS DE COMPRAS =============

router.get('/api/purchases/my-purchases', async (request, env) => {
  const user = await authenticate(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const purchases = await env.DB.prepare(`
    SELECT p.*, b.title as beat_title, b.cover_image_url, l.name as license_name, l.includes_wav
    FROM purchases p
    JOIN beats b ON p.beat_id = b.id
    JOIN license_types l ON p.license_type_id = l.id
    WHERE p.user_id = ? AND p.payment_status = 'completed'
    ORDER BY p.created_at DESC
  `).bind(user.id).all();

  return new Response(JSON.stringify(purchases.results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ============= RUTAS DE DESCARGAS =============

router.post('/api/downloads/url', async (request, env) => {
  const user = await authenticate(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { purchaseId, fileType } = await request.json();

  // Verificar que la compra pertenece al usuario
  const purchase = await env.DB.prepare(
    'SELECT * FROM purchases WHERE id = ? AND user_id = ?'
  ).bind(purchaseId, user.id).first();

  if (!purchase) {
    return new Response(JSON.stringify({ error: 'Compra no encontrada' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Generar URL firmada temporal (válida por 1 hora)
  // TODO: Implementar con R2 presigned URLs
  const signedUrl = `${env.R2_PUBLIC_URL}/downloads/${purchaseId}/${fileType}`;

  return new Response(JSON.stringify({ url: signedUrl }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// Handle CORS preflight
router.options('*', () => {
  return new Response(null, { headers: corsHeaders });
});

// 404 handler
router.all('*', () => {
  return new Response('Not Found', { status: 404 });
});

// Export Worker
export default {
  fetch: router.handle
};
