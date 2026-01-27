# Credenciales de Administrador (TEMPORAL - BORRAR DESPUÉS)

## Usuario Admin de Prueba

**Email:** admin@mybeats.com  
**Contraseña:** admin123

**⚠️ IMPORTANTE:**
- Estas credenciales son TEMPORALES y solo para desarrollo/prueba
- La contraseña usa un hash simple (NO seguro para producción)
- BORRAR este archivo antes del deploy final
- Cambiar la contraseña del admin en producción

## Acceso al Panel

1. Ve a: https://tu-sitio.netlify.app/login
2. Ingresa las credenciales de arriba
3. Accede al panel admin desde el menú de perfil → "Panel Admin"
4. O directamente: https://tu-sitio.netlify.app/admin

## Crear Admin con Contraseña Real

Para crear un admin con contraseña segura en producción:

```bash
# Generar hash de contraseña (con tu contraseña real)
echo -n "TU_CONTRASEÑA_SEGURA" | sha256sum

# Luego ejecutar en D1:
npx wrangler d1 execute mybeats-db --remote --command="
INSERT INTO users (id, email, password_hash, username, full_name, role, status, created_at, updated_at) 
VALUES ('admin-real', 'tu-email@tudominio.com', 'HASH_GENERADO', 'admin', 'Tu Nombre', 'admin', 'active', datetime('now'), datetime('now'));
"
```

## Eliminar Admin de Prueba

```bash
npx wrangler d1 execute mybeats-db --remote --command="DELETE FROM users WHERE id = 'admin-001';"
```
