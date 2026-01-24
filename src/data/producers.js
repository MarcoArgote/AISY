// Cloudflare R2 Public URL
const R2_BASE_URL = "https://pub-089c50aada404ece8b78efd1892e21d1.r2.dev";

export const producersData = [
  {
    id: "aisy",
    name: "AISY",
    avatar: `${R2_BASE_URL}/logoProds/logo.png`,
    coverImage: `${R2_BASE_URL}/logoProds/aisy.jpg`,
    bio: "Productor especializado en Trap, Drill y Hip-Hop",
    genre: "Trap / Hip-Hop",
    location: "Bolivia",
    totalBeats: 4,
    social: {
      instagram: "@aisybeats",
      spotify: "aisy",
      youtube: "@aisybeats"
    }
  },
  // Agregar más productores aquí
  {
    id: "demo-producer",
    name: "Demo Producer",
    avatar: `${R2_BASE_URL}/producers/demo-avatar.jpg`,
    coverImage: `${R2_BASE_URL}/producers/demo-cover.jpg`,
    bio: "Productor de ejemplo - próximamente",
    genre: "Diversos",
    location: "Global",
    totalBeats: 0,
    social: {
      instagram: "",
      spotify: "",
      youtube: ""
    }
  },
  {
    id: "demo-producer2",
    name: "Demo Producer2",
    avatar: `${R2_BASE_URL}/producers/demo-avatar.jpg`,
    coverImage: `${R2_BASE_URL}/producers/demo-cover.jpg`,
    bio: "Productor de ejemplo - próximamente",
    genre: "Diversos",
    location: "Global",
    totalBeats: 0,
    social: {
      instagram: "",
      spotify: "",
      youtube: ""
    }
  },
];

// Beats organizados por productor
export const beatsByProducer = {
  "aisy": [
    {
      id: 1,
      title: "Eladio Carrion x Pirlo Type Beat",
      producer: "AISY",
      bpm: 120,
      key: "A Minor",
      genre: "Trap",
      tags: ["Dark", "Hard", "808"],
      coverImage: `${R2_BASE_URL}/covers/ELA_PIRLO.jpg`,
      audioFile: `${R2_BASE_URL}/AISY/AISYBEATS1.mp3`,
      licenses: [
        {
          name: "Licencia MP3",
          price: 99,
          features: [
            "Formato MP3",
            "Derechos No Exclusivos",
            "2,000 Reproducciones",
            "1 Video Musical"
          ]
        },
        {
          name: "Trackout",
          price: 120,
          features: [
            "Todas las Pistas/Stems",
            "Formatos WAV + MP3",
            "Derechos No Exclusivos",
            "Reproducciones Ilimitadas",
            "Videos Musicales Ilimitados",
            "Soporte Prioritario"
          ]
        },
        {
          name: "Derechos Exclusivos",
          price: 220,
          features: [
            "Propiedad Exclusiva Completa",
            "Formatos WAV + MP3",
            "Reproducciones Ilimitadas",
            "Videos Ilimitados",
            "Soporte VIP Dedicado",
            "Beat retirado del catálogo"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Rochy RD x El Americano 4KT x Pirlo TypeBeat",
      producer: "AISY",
      bpm: 99,
      key: "C Major",
      genre: "Trap",
      tags: ["Hard", "Dark", "808"],
      coverImage: `${R2_BASE_URL}/covers/2.jpg`,
      audioFile: `${R2_BASE_URL}/AISY/AISYBEATS2.mp3`,
      licenses: [
        {
          name: "Licencia MP3",
          price: 99,
          features: [
            "Formato MP3",
            "Derechos No Exclusivos",
            "2,000 Reproducciones",
            "1 Video Musical"
          ]
        },
        {
          name: "Trackout",
          price: 120,
          features: [
            "Formatos WAV + MP3",
            "Derechos No Exclusivos",
            "Reproducciones Ilimitadas",
            "Videos Musicales Ilimitados",
            "Soporte Prioritario"
          ]
        },
        {
          name: "Derechos Exclusivos",
          price: 220,
          features: [
            "Propiedad Exclusiva Completa",
            "Formatos WAV + MP3",
            "Reproducciones Ilimitadas",
            "Videos Ilimitados",
            "Soporte VIP Dedicado",
            "Beat retirado del catálogo"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "ELADIO CARRION X ALÉMAN",
      producer: "AISY",
      bpm: 95,
      key: "---",
      genre: "Rap",
      tags: ["Rap", "Westcoast", "808"],
      coverImage: `${R2_BASE_URL}/covers/3.jpg`,
      audioFile: `${R2_BASE_URL}/AISY/AISYBEATS3.mp3`,
      licenses: [
        {
          name: "Licencia MP3",
          price: 99,
          features: [
            "Formato MP3",
            "Derechos No Exclusivos",
            "2,000 Reproducciones",
            "1 Video Musical"
          ]
        },
        {
          name: "Trackout",
          price: 120,
          features: [
            "Formatos WAV + MP3",
            "Derechos No Exclusivos",
            "Reproducciones Ilimitadas",
            "Videos Musicales Ilimitados",
            "Soporte Prioritario"
          ]
        },
        {
          name: "Derechos Exclusivos",
          price: 220,
          features: [
            "Propiedad Exclusiva Completa",
            "Formatos WAV + MP3",
            "Reproducciones Ilimitadas",
            "Videos Ilimitados",
            "Soporte VIP Dedicado",
            "Beat retirado del catálogo"
          ]
        }
      ]
    },
    {
      id: 4,
      title: "PIRLO420 x El Americano 4KT x Rochy RD",
      producer: "AISY",
      bpm: 93,
      key: "---",
      genre: "Trap",
      tags: ["Trap", "Dark", "Hard"],
      coverImage: `${R2_BASE_URL}/covers/4.jpg`,
      audioFile: `${R2_BASE_URL}/AISY/AISYBEATS4.mp3`,
      licenses: [
        {
          name: "Licencia MP3",
          price: 99,
          features: [
            "Formato MP3",
            "Derechos No Exclusivos",
            "2,000 Reproducciones",
            "1 Video Musical"
          ]
        },
        {
          name: "Trackout",
          price: 120,
          features: [
            "Formatos WAV + MP3",
            "Derechos No Exclusivos",
            "Reproducciones Ilimitadas",
            "Videos Musicales Ilimitados",
            "Soporte Prioritario"
          ]
        },
        {
          name: "Derechos Exclusivos",
          price: 220,
          features: [
            "Propiedad Exclusiva Completa",
            "Formatos WAV + MP3",
            "Reproducciones Ilimitadas",
            "Videos Ilimitados",
            "Soporte VIP Dedicado",
            "Beat retirado del catálogo"
          ]
        }
      ]
    }
  ],
  "demo-producer": []
};
