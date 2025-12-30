# MyBeats - Catálogo de Beats Premium 🎵

Un catálogo moderno y responsive de beats con animaciones fluidas, construido con React, Vite, TailwindCSS y Framer Motion.

## ✨ Características

- **Galería de Beats Animada**: Tarjetas interactivas con efectos hover y animaciones llamativas
- **Reproductor de Audio Integrado**: Control completo de reproducción con progreso visual
- **Sistema de Licencias**: Múltiples opciones de licencia para cada beat (MP3 Lease, WAV Lease, Trackout, Exclusive Rights)
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **Filtros por Género**: Navegación fácil por diferentes estilos de beats
- **Modal de Detalles**: Vista completa de información y licencias
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI moderna
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Framework CSS utility-first
- **Framer Motion** - Animaciones fluidas y naturales
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
MyBeats/
├── public/
│   └── beats/
│       ├── covers/      # Imágenes de portada (800x800px recomendado)
│       └── audio/       # Archivos MP3 de los beats
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── BeatGallery.jsx
│   │   ├── BeatCard.jsx
│   │   ├── BeatModal.jsx
│   │   └── AudioPlayer.jsx
│   ├── data/
│   │   └── beats.js     # Metadata de los beats
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Agregar tus beats:**
   - Coloca las portadas en `public/beats/covers/`
   - Coloca los archivos de audio en `public/beats/audio/`
   - Los nombres deben coincidir con los definidos en `src/data/beats.js`

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Build para producción:**
```bash
npm run build
```

## 📝 Configuración de Beats

Edita `src/data/beats.js` para agregar o modificar beats:

```javascript
{
  id: 1,
  title: "Nombre del Beat",
  producer: "Tu Nombre",
  bpm: 140,
  key: "A Minor",
  genre: "Trap",
  tags: ["Dark", "Hard", "808"],
  coverImage: "/beats/covers/tu-imagen.jpg",
  audioFile: "/beats/audio/tu-audio.mp3",
  licenses: [
    {
      name: "MP3 Lease",
      price: 29.99,
      features: [...]
    },
    // ... más licencias
  ]
}
```

## 🎨 Personalización

### Colores
Modifica los colores en `tailwind.config.js`:

```javascript
colors: {
  primary: '#8b5cf6',    // Color principal
  secondary: '#ec4899',  // Color secundario
  dark: '#0f172a',       // Fondo oscuro
  'dark-light': '#1e293b' // Fondo claro
}
```

### Animaciones
Ajusta las animaciones en cada componente usando las props de Framer Motion.

## 📱 Responsive Design

- **Móvil**: < 768px - Vista de una columna
- **Tablet**: 768px - 1024px - Vista de dos columnas
- **Desktop**: > 1024px - Vista de tres columnas

## 🎯 Características de los Beats

Cada beat incluye:
- ✅ Portada personalizada
- ✅ Información de BPM y Key
- ✅ Tags/género
- ✅ Preview de audio
- ✅ Múltiples opciones de licencia
- ✅ Botones de compra

## 🔊 Reproductor de Audio

- Play/Pause
- Siguiente/Anterior
- Barra de progreso interactiva
- Control de volumen
- Reproducción continua
- Rotación animada de portada

## 💰 Licencias Incluidas

1. **MP3 Lease** - $29.99
2. **WAV Lease** - $49.99
3. **Trackout** - $99.99
4. **Exclusive Rights** - $299.99

Cada licencia incluye diferentes derechos y características.

## 🚀 Próximos Pasos

- [ ] Integrar pasarela de pago (Stripe/PayPal)
- [ ] Sistema de carrito de compras
- [ ] Autenticación de usuarios
- [ ] Dashboard de descargas
- [ ] Sistema de favoritos
- [ ] Compartir en redes sociales

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

---

**Desarrollado con ❤️ para productores musicales**
