// Generador de licencias PDF (se ejecutará en Cloudflare Worker)

export function generateLicenseData(purchase, beat, user, licenseType) {
  const licenseNumber = `LIC-${purchase.id.toString().padStart(8, '0')}`;
  const date = new Date(purchase.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    licenseNumber,
    date,
    beatTitle: beat.title,
    producer: beat.producer,
    bpm: beat.bpm,
    key: beat.key,
    licenseType: licenseType.name,
    price: purchase.amount,
    buyer: {
      name: user.full_name || user.username,
      email: user.email
    },
    terms: getLicenseTerms(licenseType.slug),
    features: JSON.parse(licenseType.features)
  };
}

function getLicenseTerms(licenseSlug) {
  const terms = {
    mp3: [
      'Uso no exclusivo del beat',
      'Máximo 2,000 reproducciones en plataformas de streaming',
      'Permitido 1 video musical en YouTube/plataformas similares',
      'Créditos obligatorios: "Prod. AISY"',
      'No se permite reventa o sublicenciamiento',
      'El beat permanece disponible para otros artistas'
    ],
    trackout: [
      'Uso no exclusivo del beat con stems',
      'Reproducciones ilimitadas en todas las plataformas',
      'Videos musicales ilimitados',
      'Incluye archivos WAV y MP3 de alta calidad',
      'Incluye pistas separadas (stems) para mezcla profesional',
      'Créditos obligatorios: "Prod. AISY"',
      'No se permite reventa o sublicenciamiento',
      'El beat permanece disponible para otros artistas',
      'Soporte prioritario del productor'
    ],
    exclusive: [
      'Derechos exclusivos y completos del beat',
      'El beat se retira del catálogo inmediatamente',
      'Uso ilimitado en todas las plataformas',
      'Videos y distribución ilimitada',
      'Incluye archivos WAV, MP3 y stems',
      'Incluye archivos del proyecto (si aplica)',
      'Créditos opcionales (recomendados)',
      'Permitida la reventa y sublicenciamiento',
      'Propiedad total de la grabación master',
      'Soporte VIP dedicado del productor'
    ]
  };

  return terms[licenseSlug] || terms.mp3;
}

export function createLicenseHTML(licenseData) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: 'Helvetica', Arial, sans-serif; 
      margin: 40px; 
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #000;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .license-number {
      font-size: 18px;
      color: #666;
      margin-top: 10px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      border-left: 4px solid #000;
      padding-left: 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 10px;
      margin: 20px 0;
    }
    .label {
      font-weight: bold;
    }
    .terms {
      list-style: none;
      padding: 0;
    }
    .terms li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #000;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AISY BEATS</div>
    <div class="license-number">Licencia ${licenseData.licenseNumber}</div>
    <div>${licenseData.date}</div>
  </div>

  <div class="section">
    <div class="section-title">Información del Beat</div>
    <div class="info-grid">
      <div class="label">Título:</div>
      <div>${licenseData.beatTitle}</div>
      <div class="label">Productor:</div>
      <div>${licenseData.producer}</div>
      <div class="label">BPM:</div>
      <div>${licenseData.bpm}</div>
      <div class="label">Tonalidad:</div>
      <div>${licenseData.key}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Información de la Licencia</div>
    <div class="info-grid">
      <div class="label">Tipo:</div>
      <div>${licenseData.licenseType}</div>
      <div class="label">Precio:</div>
      <div>$${licenseData.price} USD</div>
      <div class="label">Comprador:</div>
      <div>${licenseData.buyer.name}</div>
      <div class="label">Email:</div>
      <div>${licenseData.buyer.email}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Características Incluidas</div>
    <ul class="terms">
      ${licenseData.features.map(f => `<li>✓ ${f}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Términos y Condiciones</div>
    <ul class="terms">
      ${licenseData.terms.map(t => `<li>${t}</li>`).join('')}
    </ul>
  </div>

  <div class="footer">
    <p>Este documento es legalmente vinculante y certifica los derechos de uso del beat.</p>
    <p>© ${new Date().getFullYear()} AISY Beats. Todos los derechos reservados.</p>
    <p>Licencia verificable en: aisybeats.com/verify/${licenseData.licenseNumber}</p>
  </div>
</body>
</html>
  `;
}
