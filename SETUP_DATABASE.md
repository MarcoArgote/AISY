# Guía de Configuración de Base de Datos D1

## Paso 1: Instalar Wrangler (si no lo tienes)
```bash
npm install -g wrangler
# o
npx wrangler --version
```

## Paso 2: Autenticarte con Cloudflare
```bash
npx wrangler login
```
Esto abrirá tu navegador para autorizar.

## Paso 3: Crear la base de datos D1
```bash
npx wrangler d1 create mybeats-db
```

**IMPORTANTE:** Este comando te devolverá algo como:
```
✅ Successfully created DB 'mybeats-db'!

[[d1_databases]]
binding = "DB"
database_name = "mybeats-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**COPIA el `database_id` y pégalo en `wrangler.toml`**

## Paso 4: Ejecutar el schema (crear tablas)
```bash
npx wrangler d1 execute mybeats-db --file=./database/schema.sql
```

## Paso 5: Verificar que las tablas se crearon
```bash
npx wrangler d1 execute mybeats-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

Deberías ver:
- users
- producer_profiles
- producer_requests
- beats
- license_types
- orders
- purchases
- downloads
- waitlist
- sessions

## Paso 6: Crear bucket R2 (para archivos)
```bash
npx wrangler r2 bucket create mybeats-storage
```

## Paso 7: Configurar secret JWT (para tokens)
```bash
npx wrangler secret put JWT_SECRET
```
Cuando te pregunte, escribe un secreto largo y aleatorio (mínimo 32 caracteres).
Ejemplo: `mi-secreto-super-seguro-12345-abcdef-CHANGE-ME`

## Paso 8: Reemplazar worker.js
```bash
# Respaldar el antiguo
cp api/worker.js api/worker.backup.js

# Reemplazar con el nuevo
cp api/worker-new.js api/worker.js
```

## Paso 9: Probar localmente
```bash
# Terminal 1: Iniciar el worker
npx wrangler dev api/worker.js --local --persist

# Terminal 2: Iniciar el frontend
npm run dev
```

El worker estará en: http://localhost:8787
El frontend en: http://localhost:5173

## Paso 10: Probar el registro
Abre el navegador en http://localhost:5173/login y:
1. Click en "Crear cuenta"
2. Ingresa email y contraseña
3. Click en "Registrarse"

Si todo funciona, verás tu usuario en la base de datos:
```bash
npx wrangler d1 execute mybeats-db --command="SELECT * FROM users;"
```

## Troubleshooting

### Error: "DB is not defined"
- Verifica que el `database_id` en wrangler.toml esté correcto
- Reinicia `wrangler dev`

### Error: "table users does not exist"
- Ejecuta el schema nuevamente:
  ```bash
  npx wrangler d1 execute mybeats-db --file=./database/schema.sql
  ```

### Error: CORS
- Verifica que el frontend esté haciendo requests a http://localhost:8787
- Revisa que los headers CORS estén en el worker

## Desplegar a producción (cuando estés listo)
```bash
# 1. Desplegar worker
npx wrangler publish

# 2. Obtener URL del worker
# Será algo como: https://mybeats-api.tu-usuario.workers.dev

# 3. Actualizar el frontend para usar esa URL en producción
# src/services/api.js - cambiar la baseURL
```
