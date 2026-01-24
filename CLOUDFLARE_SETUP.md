# Configuración de Cloudflare R2 + D1 + Workers

## Paso 1: Crear cuenta en Cloudflare

1. Ve a https://dash.cloudflare.com/sign-up
2. Crea una cuenta gratuita

## Paso 2: Configurar Cloudflare D1 (Base de Datos)

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Autenticarse
wrangler login

# Crear base de datos D1
wrangler d1 create mybeats-db

# Ejecutar schema SQL
wrangler d1 execute mybeats-db --file=./database/schema.sql
```

## Paso 3: Configurar Cloudflare R2 (Almacenamiento)

```bash
# Crear bucket para archivos de audio
wrangler r2 bucket create mybeats-audio

# Crear bucket para licencias PDF
wrangler r2 bucket create mybeats-licenses

# Crear bucket para covers
wrangler r2 bucket create mybeats-covers
```

## Paso 4: Subir archivos existentes a R2

```bash
# Subir MP3
wrangler r2 object put mybeats-audio/AISYBEATS1.mp3 --file=./public/beats/audio/AISYBEATS1.mp3
wrangler r2 object put mybeats-audio/AISYBEATS2.mp3 --file=./public/beats/audio/AISYBEATS2.mp3
wrangler r2 object put mybeats-audio/AISYBEATS3.mp3 --file=./public/beats/audio/AISYBEATS3.mp3

# Subir covers
wrangler r2 object put mybeats-covers/ELA_PIRLO.jpg --file=./public/beats/covers/ELA_PIRLO.jpg
wrangler r2 object put mybeats-covers/2.jpg --file=./public/beats/covers/2.jpg
wrangler r2 object put mybeats-covers/3.jpg --file=./public/beats/covers/3.jpg
```

## Paso 5: Configurar dominio público para R2

1. En Cloudflare Dashboard → R2
2. Selecciona el bucket `mybeats-audio`
3. Settings → Public Access → Enable
4. Copiar la URL pública (ejemplo: `https://pub-xxxxx.r2.dev`)

## Paso 6: Variables de entorno

Crear archivo `.env`:

```env
# Cloudflare
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
VITE_API_URL=https://api.tudominio.com

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# JWT
JWT_SECRET=tu-secret-key-super-seguro
```

## Paso 7: Crear Cloudflare Worker (API Backend)

Ver archivo `api/worker.js` para el código del Worker.

```bash
# Inicializar Worker
wrangler init mybeats-api

# Publicar Worker
wrangler publish
```

## Paso 8: Configurar Webhooks de Stripe

1. Dashboard de Stripe → Developers → Webhooks
2. Add endpoint: `https://tu-worker.workers.dev/webhook/stripe`
3. Eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## Paso 9: Configurar dominios personalizados

En Cloudflare:
- **Pages** (Frontend): mybeats.com
- **Workers** (API): api.mybeats.com
- **R2**: audio.mybeats.com

## URLs finales:

- Frontend: https://mybeats.com
- API: https://api.mybeats.com
- Audio: https://audio.mybeats.com/AISYBEATS1.mp3
- Covers: https://audio.mybeats.com/covers/ELA_PIRLO.jpg

## Costos estimados (mensual):

- **Cloudflare R2**: $0 (10GB gratis)
- **Cloudflare D1**: $0 (5GB gratis)
- **Cloudflare Workers**: $0 (100k requests/día gratis)
- **Cloudflare Pages**: $0 (deploy ilimitado)
- **Stripe**: 2.9% + $0.30 por transacción
- **Total base**: $0/mes 🎉
