// Cloudflare Worker - Backend API para MyBeats (versión simplificada)
import { Router } from 'itty-router';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper para respuestas JSON con CORS
const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

// Crear router
const router = Router();

// Health check
router.get('/api/health', () => {
  return jsonResponse({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// OPTIONS handler para CORS
router.options('*', () => {
  return new Response(null, {
    headers: corsHeaders
  });
});

// 404 handler
router.all('*', () => {
  return jsonResponse({ error: 'Ruta no encontrada' }, 404);
});

// Export
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  }
};
