/**
 * Sistema de internacionalización para Grupo Scout Myotragus
 * Gestiona las traducciones para español, catalán e inglés
 */

// Diccionarios de traducción
const translations = {
  // Español
  es: {
    // Navegación
    nav: {
      home: "Inicio",
      about: "Quiénes Somos",
      sections: "Secciones",
      activities: "Actividades",
    methodology: "Metodología",
    forum: "Foro",
    signup: "Inscripciones",
      contact: "Contacto",
      menu: "Menú"
    },
    homeActivities: {
      title: "Nuestras Actividades",
      card1Title: "Acampadas",
      card1Desc: "Cada trimestre realizamos acampadas donde ponemos en práctica técnicas scout y convivimos en la naturaleza.",
      card2Title: "Campamentos de Verano",
      card2Desc: "15 días de aventura, aprendizaje y diversión en entornos naturales privilegiados.",
      card3Title: "Servicio Comunitario",
      card3Desc: "Proyectos solidarios y actividades de voluntariado para mejorar nuestra comunidad.",
      cta: "Ver Todas las Actividades"
    },
    homeCta: {
      title: "¿Quieres Formar Parte?",
      desc: "Únete a nuestra gran familia scout y vive una experiencia educativa única",
      primary: "Ir a inscripciones",
      secondary: "Síguenos en Instagram"
    },
    forumUi: {
      heroKicker: "Comunidad Myotragus",
      heroTitle: "Foro del grupo",
      heroSubtitle: "Un espacio seguro para compartir avisos, resolver dudas y proponer nuevas aventuras.",
      heroPrimary: "Abrir tablón",
      heroSecondary: "Contactar con el equipo",
      boardBadge: "Comunidad",
      boardTitle: "Tablón de mensajes",
      boardDesc: "Los mensajes se guardan para que toda la comunidad pueda leerte. Respeta la Ley Scout y evita datos personales.",
      newPost: "Crear nuevo mensaje",
      searchPlaceholder: "Buscar en mensajes...",
      sortLabel: "Ordenar por:",
      sortNewest: "Más recientes",
      sortOldest: "Más antiguos",
      name: "Nombre",
      category: "Categoría",
      categories: { general: "General", actividades: "Actividades", ayuda: "Ayuda", anuncios: "Anuncios" },
      message: "Mensaje",
      publish: "Publicar",
      cancel: "Cancelar",
      empty: "Todavía no hay mensajes. ¡Sé la primera persona en escribir!",
      clearAll: "Borrar todo (solo en este dispositivo)",
      confirmTitle: "Confirmar acción",
      confirmText: "¿Estás seguro que deseas continuar?",
      yes: "Sí",
      no: "No",
      deleteOne: "¿Quieres borrar este mensaje?",
      clearAllConfirm: "Esto eliminará todos los mensajes guardados en este dispositivo. ¿Continuar?"
    },
    forum: {
      notePublic: "Recomendación: identifica siempre la sección o actividad sobre la que escribes. Los mensajes se publican de forma visible para toda la comunidad."
    },
    volunteer: {
      title: "Voluntariado",
      subtitle: "¿Te gustaría ser scouter o colaborar con el grupo? Súmate como persona voluntaria y ayuda a educar en valores.",
      cta: "Quiero ser voluntario/a"
    },
    recentRegs: {
      title: "Inscripciones recientes",
      loading: "Cargando...",
      empty: "Todavía no hay inscripciones públicas.",
      child: "Nombre",
      section: "Sección",
      date: "Fecha"
    },
    // Sección Hero
    hero: {
      kicker: "Grupo Scout Myotragus 684",
      title: "Aventuras que educan y transforman",
      subtitle: "Escultismo en Palma con espíritu ASDE",
    description: "Desde 1984 acompañamos a niños y jóvenes con actividades al aire libre, servicio y liderazgo para construir una sociedad más justa.",
    join: "Comenzar inscripción",
    learn: "Ver secciones",
      stats: {
        years: "Años educando",
        scouts: "Jóvenes activos",
        sections: "Secciones progresivas"
      }
    },
    // Sección Quiénes Somos
    about: {
      title: "Quiénes Somos",
      lead: "El Grupo Scout Myotragus 684 nació en 1984 en Palma de Mallorca con la misión de educar a niños y jóvenes en valores fundamentales a través del escultismo.",
      description: "Somos un grupo aconfesional y laico, perteneciente a ASDE-Scouts de España y ASDE Baleares, comprometidos con la educación no formal basada en la metodología scout creada por Baden-Powell.",
      since: "Desde 1984",
      values: {
        education: {
          title: "Educación en Valores",
          desc: "Promovemos la responsabilidad, solidaridad, respeto y compromiso social"
        },
        inclusion: {
          title: "Inclusión",
          desc: "Aceptamos a todas las personas sin discriminación por origen, religión o condición"
        },
        commitment: {
          title: "Compromiso Social",
          desc: "Trabajamos por un mundo más justo, participativo y sostenible"
        },
        learning: {
          title: "Aprender Haciendo",
          desc: "Metodología activa basada en la experiencia y el contacto con la naturaleza"
        }
      }
    },
    // Sección Secciones
    sections: {
      title: "Nuestras Secciones Educativas",
      intro: "Organizamos nuestras actividades por franjas de edad, adaptando la metodología scout a cada etapa del desarrollo",
      register: "Inscribe a tu hijo/a",
      beavers: {
        title: "Castores",
        age: "6-8 años",
        desc: "Primeros pasos en el escultismo. Aprenden jugando, desarrollando habilidades sociales y descubriendo el mundo que les rodea.",
        feature1: "Juegos cooperativos",
        feature2: "Primeras salidas a la naturaleza",
        feature3: "Desarrollo de la creatividad"
      },
      cubs: {
        title: "Lobatos",
        age: "8-11 años",
        desc: "Basado en \"El Libro de la Selva\". Desarrollo de la personalidad a través del juego y el aprendizaje en grupo.",
        feature1: "Manada como \"familia feliz\"",
        feature2: "Juegos de pistas y aventuras",
        feature3: "Primeras acampadas"
      },
      scouts: {
        title: "Scouts",
        age: "11-14 años",
        desc: "Vida en patrullas, aventura y técnicas scout. Desarrollo de la autonomía y trabajo en equipo.",
        feature1: "Sistema de patrullas",
        feature2: "Campamentos y raids",
        feature3: "Técnicas de orientación y pionerismo"
      },
      explorers: {
        title: "Escultas",
        age: "14-17 años",
        desc: "Proyectos de servicio comunitario. Desarrollo del espíritu crítico y compromiso social.",
        feature1: "Empresas y proyectos",
        feature2: "Servicio a la comunidad",
        feature3: "Grandes rutas y expediciones"
      },
      rovers: {
        title: "Rovers",
        age: "17-21 años",
        desc: "Compromiso personal y social. Preparación para la vida adulta con responsabilidad y servicio.",
        feature1: "Proyectos de servicio",
        feature2: "Rutas internacionales",
        feature3: "Formación de monitores"
      }
    },
    // Formulario de inscripción
    registration: {
      title: "Inscripción en",
      child: {
        title: "Datos del niño/a o joven",
        name: "Nombre",
        surname: "Apellidos",
        birthdate: "Fecha de nacimiento",
        gender: "Género",
        genderOptions: {
          notSay: "Prefiero no decirlo",
          male: "Masculino",
          female: "Femenino",
          other: "Otro"
        },
        health: "Información médica relevante (alergias, medicación, etc.)"
      },
      contact: {
        title: "Datos de contacto",
        name: "Nombre del tutor/a",
        relation: "Relación",
        relationOptions: {
          mother: "Madre",
          father: "Padre",
          legal: "Tutor/a legal",
          other: "Otro"
        },
        email: "Email",
        phone: "Teléfono",
        address: "Dirección"
      },
      additional: {
        title: "Información adicional",
        comments: "Comentarios o información adicional",
        privacy: "He leído y acepto la política de privacidad",
        image: "Autorizo la toma y publicación de imágenes de mi hijo/a en las actividades del grupo"
      },
      submit: "Enviar inscripción",
      cancel: "Cancelar",
      success: {
        title: "¡Inscripción enviada con éxito!",
        message: "Gracias por tu interés en el Grupo Scout Myotragus. Nos pondremos en contacto contigo en breve para completar el proceso de inscripción.",
        button: "Aceptar"
      },
      required: "Campo obligatorio"
    },
    // Footer
    footer: {
      contact: "Contacto",
      email: "Email:",
      phone: "Teléfono:",
      location: "Local:",
      meetings: "Reuniones:",
      links: "Enlaces",
      privacy: "Política de privacidad",
      terms: "Términos de uso",
      copyright: "Grupo Scout Myotragus 684",
      credits: "Sitio web desarrollado por Tero"
    },
    activitiesPage: {
      hero: {
        kicker: "Agenda 2024 · 2025",
        title: "Actividades Scout",
        subtitle: "Una aventura educativa continua: naturaleza, servicio y vida en grupo en cada trimestre.",
        btnCalendar: "Ver calendario",
        btnSignup: "Quiero inscribirme"
      },
      overview: {
        badge: "Lo que vivimos",
        title: "Momentos clave del curso scout",
        desc: "Combinamos salidas, talleres y proyectos de servicio para que cada sección crezca a su ritmo con experiencias memorables.",
        cards: {
          camp: {
            title: "Salidas y campamentos",
            desc: "Exploramos la Serra de Tramuntana, playas y espacios naturales de la isla en distintos niveles de dificultad.",
            li1: "Acampadas trimestrales por secciones",
            li2: "Campamento de verano de 15 días",
            li3: "Raids y travesías para escultas y rovers"
          },
          service: {
            title: "Servicio a la comunidad",
            desc: "Desarrollamos proyectos solidarios y medioambientales para dejar huella positiva en nuestro entorno.",
            li1: "Recogidas de alimentos y campañas solidarias",
            li2: "Acciones de limpieza de litoral y bosques",
            li3: "Proyectos de empresa scout diseñados por el propio grupo"
          },
          skills: {
            title: "Habilidades y progresión",
            desc: "La metodología scout nos permite avanzar por etapas con objetivos adaptados a cada edad.",
            li1: "Competencias al aire libre y vida en patrulla",
            li2: "Talleres creativos, STEM y primeros auxilios",
            li3: "Rutas urbanas y actividades de ciudad"
          }
        }
      },
      calendar: {
        title: "Calendario 2024 · 2025",
        intro: "Nuestras reuniones regulares son los sábados de 17:00 a 19:30 h en Palma. Además, programamos salidas trimestrales y proyectos especiales para cada sección. Este calendario se actualiza con las novedades mensuales.",
        add: "Añadir a mi calendario",
        follow: "Seguimiento en redes",
        first: "Primer trimestre",
        second: "Segundo trimestre",
        third: "Tercer trimestre",
        sep: { m: "Septiembre", d: "Inicio de curso, presentación de scouters y juegos de bienvenida." },
        oct: { m: "Octubre", d: "Salida de convivencia por secciones y talleres de habilidades básicas." },
        nov: { m: "Noviembre", d: "Acción solidaria con entidades locales y hike de patrullas." },
        dec: { m: "Diciembre", d: "Acampada de invierno y convivencia con familias." },
        jan: { m: "Enero", d: "Proyecto de servicio comunitario y formación para scouters jóvenes." },
        feb: { m: "Febrero", d: "Semana del Pensamiento Scout con actividades intersección." },
        mar: { m: "Marzo", d: "Raid de escultas y travesía costera para rovers." },
        apr: { m: "Abril", d: "Salida de naturaleza y participación en encuentros ASDE." },
        jun: { m: "Junio", d: "Fiesta de fin de curso y preparación del campamento de verano." },
        note: "* Las excursiones y proyectos pueden variar según disponibilidad de espacios y condiciones meteorológicas. Comunicamos cualquier cambio mediante email y grupos oficiales."
      },
      sampler: {
        badge: "Metodología",
        title: "Progresión adaptada a cada sección",
        desc: "Castores, lobatos, scouts, escultas y rovers siguen itinerarios específicos donde el protagonismo y la responsabilidad aumentan progresivamente.",
        explore: { title: "Exploración y juego", desc: "Para castores y lobatos el objetivo es descubrir el entorno mediante dinámicas cooperativas, cuentos y pequeñas aventuras." },
        patrol: { title: "Vida en patrulla", desc: "En la tropa y la unidad escultas fomentamos la autonomía y liderazgo a través de patrullas y equipos de proyecto." },
        commit: { title: "Compromiso y servicio", desc: "Los rovers diseñan proyectos sociales de impacto y realizan rutas de larga duración como preparación para la vida adulta." }
      },
      cta: {
        title: "¿Te gustaría vivir estas experiencias?",
        desc: "Estamos abiertos a nuevas incorporaciones a lo largo del año. Escríbenos y te orientamos según la sección y disponibilidad de plazas.",
        primary: "Ir a inscripciones"
      }
    },
    teachingsPage: {
      title: "Enseñanzas",
      lead: "Objetivos educativos y metodología: el método scout, valores y habilidades para la vida.",
      valuesTitle: "Valores y Ley Scout",
      valuesDesc: "Honestidad, respeto y compromiso con la comunidad y el medio ambiente.",
      skillsTitle: "Habilidades prácticas",
      skillsDesc: "Primeros auxilios, nudos, orientación, cocina de campo y liderazgo.",
      ctaTitle: "¿Quieres saber más o participar?",
      ctaDesc: "Contacta con nosotros para asistir a una sesión o para recibir más información.",
      contact: "Contactar",
      seeActivities: "Ver actividades"
    }
  },
  
  // Catalán
  ca: {
    nav: {
      home: "Inici",
      about: "Qui Som",
      sections: "Seccions",
      activities: "Activitats",
      methodology: "Metodologia",
      forum: "Fòrum",
    signup: "Inscripcions",
      contact: "Contacte",
      menu: "Menú"
    },
    homeActivities: {
      title: "Les Nostres Activitats",
      card1Title: "Acampades",
      card1Desc: "Cada trimestre feim acampades on posem en pràctica tècniques escoltes i convivim a la natura.",
      card2Title: "Campaments d'Estiu",
      card2Desc: "15 dies d'aventura, aprenentatge i diversió en entorns naturals privilegiats.",
      card3Title: "Servei Comunitari",
      card3Desc: "Projectes solidaris i activitats de voluntariat per millorar la nostra comunitat.",
      cta: "Veure totes les activitats"
    },
    homeCta: {
      title: "Vols Formar-ne Part?",
      desc: "Uneix-te a la nostra gran família escolta i viu una experiència educativa única",
      primary: "Anar a inscripcions",
      secondary: "Segueix-nos a Instagram"
    },
    forumUi: {
      heroKicker: "Comunitat Myotragus",
      heroTitle: "Fòrum del grup",
      heroSubtitle: "Un espai segur per compartir avisos, resoldre dubtes i proposar noves aventures.",
      heroPrimary: "Obrir tauler",
      heroSecondary: "Contactar amb l'equip",
      boardBadge: "Comunitat",
      boardTitle: "Tauler de missatges",
      boardDesc: "Els missatges es guarden perquè tota la comunitat et pugui llegir. Respecta la Llei Escolta i evita dades personals.",
      newPost: "Crear nou missatge",
      searchPlaceholder: "Cercar missatges...",
      sortLabel: "Ordenar per:",
      sortNewest: "Més recents",
      sortOldest: "Més antics",
      name: "Nom",
      category: "Categoria",
      categories: { general: "General", actividades: "Activitats", ayuda: "Ajuda", anuncios: "Anuncis" },
      message: "Missatge",
      publish: "Publicar",
      cancel: "Cancel·lar",
      empty: "Encara no hi ha missatges. Sigues la primera persona a escriure!",
      clearAll: "Esborrar tot (només en aquest dispositiu)",
      confirmTitle: "Confirmar acció",
      confirmText: "Segur que vols continuar?",
      yes: "Sí",
      no: "No",
      deleteOne: "Vols esborrar aquest missatge?",
      clearAllConfirm: "Això eliminarà tots els missatges guardats en aquest dispositiu. Continuar?"
    },
    forum: {
      notePublic: "Recomanació: identifica sempre la secció o activitat sobre la qual escrius. Els missatges es publiquen de manera visible per a tota la comunitat."
    },
    volunteer: {
      title: "Voluntariat",
      subtitle: "T'agradaria ser scouter o col·laborar amb el grup? Suma't com a voluntari/ària i ajuda a educar en valors.",
      cta: "Vull ser voluntari/ària"
    },
    recentRegs: {
      title: "Inscripcions recents",
      loading: "Carregant...",
      empty: "Encara no hi ha inscripcions públiques.",
      child: "Nom",
      section: "Secció",
      date: "Data"
    },
    hero: {
      kicker: "Grup Escolta Myotragus 684",
      title: "Aventures que eduquen i transformen",
      subtitle: "Escoltisme a Palma amb esperit ASDE",
      description: "Des de 1984 acompanyem infants i joves amb activitats a l'aire lliure, servei i lideratge per construir una societat més justa.",
    join: "Començar inscripció",
    learn: "Veure seccions",
      stats: {
        years: "Anys d'educant",
        scouts: "Joves actius",
        sections: "Seccions progressives"
      }
    },
    about: {
      title: "Qui Som",
      lead: "El Grup Escolta Myotragus 684 va néixer el 1984 a Palma de Mallorca amb la missió d'educar infants i joves en valors fonamentals a través de l'escoltisme.",
      description: "Som un grup aconfessional i laic, pertanyent a ASDE-Scouts d'Espanya i ASDE Balears, compromesos amb l'educació no formal basada en la metodologia escolta creada per Baden-Powell.",
      since: "Des de 1984",
      values: {
        education: {
          title: "Educació en Valors",
          desc: "Promovem la responsabilitat, solidaritat, respecte i compromís social"
        },
        inclusion: {
          title: "Inclusió",
          desc: "Acceptem totes les persones sense discriminació per origen, religió o condició"
        },
        commitment: {
          title: "Compromís Social",
          desc: "Treballem per un món més just, participatiu i sostenible"
        },
        learning: {
          title: "Aprendre Fent",
          desc: "Metodologia activa basada en l'experiència i el contacte amb la natura"
        }
      }
    },
    sections: {
      title: "Les Nostres Seccions Educatives",
      intro: "Organitzem les nostres activitats per franges d'edat, adaptant la metodologia escolta a cada etapa del desenvolupament",
      register: "Inscriu el teu fill/a",
      beavers: {
        title: "Castors",
        age: "6-8 anys",
        desc: "Primers passos en l'escoltisme. Aprenen jugant, desenvolupant habilitats socials i descobrint el món que els envolta.",
        feature1: "Jocs cooperatius",
        feature2: "Primeres sortides a la natura",
        feature3: "Desenvolupament de la creativitat"
      },
      cubs: {
        title: "Llops",
        age: "8-11 anys",
        desc: "Basat en \"El Llibre de la Selva\". Desenvolupament de la personalitat a través del joc i l'aprenentatge en grup.",
        feature1: "Manada com a \"família feliç\"",
        feature2: "Jocs de pistes i aventures",
        feature3: "Primeres acampades"
      },
      scouts: {
        title: "Scouts",
        age: "11-14 anys",
        desc: "Vida en patrulles, aventura i tècniques escoltes. Desenvolupament de l'autonomia i treball en equip.",
        feature1: "Sistema de patrulles",
        feature2: "Campaments i raids",
        feature3: "Tècniques d'orientació i pionerisme"
      },
      explorers: {
        title: "Pioners",
        age: "14-17 anys",
        desc: "Projectes de servei comunitari. Desenvolupament de l'esperit crític i compromís social.",
        feature1: "Empreses i projectes",
        feature2: "Servei a la comunitat",
        feature3: "Grans rutes i expedicions"
      },
      rovers: {
        title: "Rutes",
        age: "17-21 anys",
        desc: "Compromís personal i social. Preparació per a la vida adulta amb responsabilitat i servei.",
        feature1: "Projectes de servei",
        feature2: "Rutes internacionals",
        feature3: "Formació de monitors"
      }
    },
    registration: {
      title: "Inscripció a",
      child: {
        title: "Dades de l'infant o jove",
        name: "Nom",
        surname: "Cognoms",
        birthdate: "Data de naixement",
        gender: "Gènere",
        genderOptions: {
          notSay: "Prefereixo no dir-ho",
          male: "Masculí",
          female: "Femení",
          other: "Altre"
        },
        health: "Informació mèdica rellevant (al·lèrgies, medicació, etc.)"
      },
      contact: {
        title: "Dades de contacte",
        name: "Nom del tutor/a",
        relation: "Relació",
        relationOptions: {
          mother: "Mare",
          father: "Pare",
          legal: "Tutor/a legal",
          other: "Altre"
        },
        email: "Email",
        phone: "Telèfon",
        address: "Adreça"
      },
      additional: {
        title: "Informació addicional",
        comments: "Comentaris o informació addicional",
        privacy: "He llegit i accepto la política de privacitat",
        image: "Autoritzo la presa i publicació d'imatges del meu fill/a en les activitats del grup"
      },
      submit: "Enviar inscripció",
      cancel: "Cancel·lar",
      success: {
        title: "Inscripció enviada amb èxit!",
        message: "Gràcies pel teu interès en el Grup Escolta Myotragus. Ens posarem en contacte amb tu aviat per completar el procés d'inscripció.",
        button: "Acceptar"
      },
      required: "Camp obligatori"
    },
    footer: {
      contact: "Contacte",
      email: "Email:",
      phone: "Telèfon:",
      location: "Local:",
      meetings: "Reunions:",
      links: "Enllaços",
      privacy: "Política de privacitat",
      terms: "Termes d'ús",
      copyright: "Grup Escolta Myotragus 684",
      credits: "Lloc web desenvolupat per Tero"
    },
    activitiesPage: {
      hero: {
        kicker: "Agenda 2024 · 2025",
        title: "Activitats Escoltes",
        subtitle: "Una aventura educativa contínua: natura, servei i vida en grup a cada trimestre.",
        btnCalendar: "Veure calendari",
        btnSignup: "Vull inscriure'm"
      },
      overview: {
        badge: "Allò que vivim",
        title: "Moments clau del curs escolta",
        desc: "Combem sortides, tallers i projectes de servei perquè cada secció creixi al seu ritme amb experiències memorables.",
        cards: {
          camp: {
            title: "Sortides i campaments",
            desc: "Exploram la Serra de Tramuntana, platges i espais naturals de l'illa en diversos nivells de dificultat.",
            li1: "Acampades trimestrals per seccions",
            li2: "Campament d'estiu de 15 dies",
            li3: "Raids i travessies per a pioners i rutes"
          },
          service: {
            title: "Servei a la comunitat",
            desc: "Desenvolupam projectes solidaris i mediambientals per deixar una petjada positiva.",
            li1: "Recollides d'aliments i campanyes solidàries",
            li2: "Accions de neteja de litoral i boscos",
            li3: "Projectes d'empresa escolta dissenyats pel propi grup"
          },
          skills: {
            title: "Habilitats i progressió",
            desc: "La metodologia escolta ens permet avançar per etapes amb objectius adaptats a cada edat.",
            li1: "Competències a l'aire lliure i vida en patrulla",
            li2: "Tallers creatius, STEM i primers auxilis",
            li3: "Rutes urbanes i activitats de ciutat"
          }
        }
      },
      calendar: {
        title: "Calendari 2024 · 2025",
        intro: "Les reunions regulars són els dissabtes de 17:00 a 19:30 h a Palma. A més, programam sortides trimestrals i projectes especials. Aquest calendari s'actualitza mensualment.",
        add: "Afegir al meu calendari",
        follow: "Seguiment a xarxes",
        first: "Primer trimestre",
        second: "Segon trimestre",
        third: "Tercer trimestre",
        sep: { m: "Setembre", d: "Inici de curs, presentació de scouters i jocs de benvinguda." },
        oct: { m: "Octubre", d: "Sortida de convivència per seccions i tallers d'habilitats bàsiques." },
        nov: { m: "Novembre", d: "Acció solidària amb entitats locals i hike de patrulles." },
        dec: { m: "Desembre", d: "Acampada d'hivern i convivència amb famílies." },
        jan: { m: "Gener", d: "Projecte de servei comunitari i formació per a scouters joves." },
        feb: { m: "Febrer", d: "Setmana del Pensament Escolta amb activitats intersecció." },
        mar: { m: "Març", d: "Raid de pioners i travessia costanera per a rutes." },
        apr: { m: "Abril", d: "Sortida de natura i participació en trobades ASDE." },
        jun: { m: "Juny", d: "Festa de final de curs i preparació del campament d'estiu." },
        note: "* Les excursions i projectes poden variar segons disponibilitat d'espais i meteorologia. Comunicarem canvis per email i canals oficials."
      },
      sampler: {
        badge: "Metodologia",
        title: "Progressió adaptada a cada secció",
        desc: "Castors, llops, scouts, pioners i rutes segueixen itineraris específics amb responsabilitat creixent.",
        explore: { title: "Exploració i joc", desc: "Per a castors i llops l'objectiu és descobrir l'entorn amb dinàmiques cooperatives, contes i petites aventures." },
        patrol: { title: "Vida en patrulla", desc: "A la tropa i unitat fomentam l'autonomia i lideratge a través de patrulles i equips de projecte." },
        commit: { title: "Compromís i servei", desc: "Les rutes dissenyen projectes socials d'impacte i fan rutes llargues com a preparació per a la vida adulta." }
      },
      cta: {
        title: "T'agradaria viure aquestes experiències?",
        desc: "Estem oberts a noves incorporacions durant l'any. Escriu-nos i t'orientarem segons secció i disponibilitat de places.",
        primary: "Anar a inscripcions"
      }
    },
    teachingsPage: {
      title: "Ensenyances",
      lead: "Objectius educatius i metodologia: el mètode escolta, valors i habilitats per a la vida.",
      valuesTitle: "Valors i Llei Escolta",
      valuesDesc: "Honestedat, respecte i compromís amb la comunitat i el medi ambient.",
      skillsTitle: "Habilitats pràctiques",
      skillsDesc: "Primers auxilis, nusos, orientació, cuina de camp i lideratge.",
      ctaTitle: "Vols saber-ne més o participar?",
      ctaDesc: "Contacta amb nosaltres per assistir a una sessió o rebre més informació.",
      contact: "Contactar",
      seeActivities: "Veure activitats"
    }
  },
  
  // Inglés
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      sections: "Sections",
      activities: "Activities",
      methodology: "Methodology",
      forum: "Forum",
    signup: "Enroll",
      contact: "Contact",
      menu: "Menu"
    },
    homeActivities: {
      title: "Our Activities",
      card1Title: "Camps",
      card1Desc: "Each term we go camping to practice scout skills and live together in nature.",
      card2Title: "Summer Camps",
      card2Desc: "15 days of adventure, learning and fun in outstanding natural environments.",
      card3Title: "Community Service",
      card3Desc: "Solidarity projects and volunteering activities to improve our community.",
      cta: "See all activities"
    },
    homeCta: {
      title: "Want to Join?",
      desc: "Join our big scout family and live a unique educational experience",
      primary: "Go to enrollment",
      secondary: "Follow us on Instagram"
    },
    forumUi: {
      heroKicker: "Myotragus Community",
      heroTitle: "Group Forum",
      heroSubtitle: "A safe space to share notices, solve doubts and propose new adventures.",
      heroPrimary: "Open board",
      heroSecondary: "Contact the team",
      boardBadge: "Community",
      boardTitle: "Message board",
      boardDesc: "Messages are saved so the whole community can read you. Respect the Scout Law and avoid personal data.",
      newPost: "Create new message",
      searchPlaceholder: "Search messages...",
      sortLabel: "Sort by:",
      sortNewest: "Newest",
      sortOldest: "Oldest",
      name: "Name",
      category: "Category",
      categories: { general: "General", actividades: "Activities", ayuda: "Help", anuncios: "Announcements" },
      message: "Message",
      publish: "Publish",
      cancel: "Cancel",
      empty: "There are no messages yet. Be the first to write!",
      clearAll: "Clear all (only on this device)",
      confirmTitle: "Confirm action",
      confirmText: "Are you sure you want to continue?",
      yes: "Yes",
      no: "No",
      deleteOne: "Do you want to delete this message?",
      clearAllConfirm: "This will remove all messages stored on this device. Continue?"
    },
    forum: {
      notePublic: "Recommendation: always identify the section or activity you are writing about. Messages are publicly visible to the whole community."
    },
    volunteer: {
      title: "Volunteering",
      subtitle: "Would you like to become a leader or collaborate with the group? Join as a volunteer and help educate in values.",
      cta: "I want to volunteer"
    },
    recentRegs: {
      title: "Recent registrations",
      loading: "Loading...",
      empty: "There are no public registrations yet.",
      child: "Name",
      section: "Section",
      date: "Date"
    },
    hero: {
      kicker: "Scout Group Myotragus 684",
      title: "Adventures that shape and inspire",
      subtitle: "Scouting in Palma with the ASDE spirit",
      description: "Since 1984 we guide children and youth through outdoor activities, service and leadership to build a fairer society.",
    join: "Start enrollment",
    learn: "See sections",
      stats: {
        years: "Years guiding",
        scouts: "Active youth",
        sections: "Progressive sections"
      }
    },
    about: {
      title: "About Us",
      lead: "The Scout Group Myotragus 684 was founded in 1984 in Palma de Mallorca with the mission of educating children and young people in fundamental values through scouting.",
      description: "We are a secular, non-denominational group, belonging to ASDE-Scouts of Spain and ASDE Balearics, committed to non-formal education based on the scout methodology created by Baden-Powell.",
      since: "Since 1984",
      values: {
        education: {
          title: "Education in Values",
          desc: "We promote responsibility, solidarity, respect and social commitment"
        },
        inclusion: {
          title: "Inclusion",
          desc: "We accept all people without discrimination based on origin, religion or condition"
        },
        commitment: {
          title: "Social Commitment",
          desc: "We work for a more just, participatory and sustainable world"
        },
        learning: {
          title: "Learning by Doing",
          desc: "Active methodology based on experience and contact with nature"
        }
      }
    },
    sections: {
      title: "Our Educational Sections",
      intro: "We organize our activities by age groups, adapting the scout methodology to each stage of development",
      register: "Register your child",
      beavers: {
        title: "Beavers",
        age: "6-8 years",
        desc: "First steps in scouting. They learn by playing, developing social skills and discovering the world around them.",
        feature1: "Cooperative games",
        feature2: "First outings in nature",
        feature3: "Development of creativity"
      },
      cubs: {
        title: "Cubs",
        age: "8-11 years",
        desc: "Based on \"The Jungle Book\". Personality development through play and group learning.",
        feature1: "Pack as a \"happy family\"",
        feature2: "Tracking games and adventures",
        feature3: "First camping experiences"
      },
      scouts: {
        title: "Scouts",
        age: "11-14 years",
        desc: "Life in patrols, adventure and scout techniques. Development of autonomy and teamwork.",
        feature1: "Patrol system",
        feature2: "Camps and raids",
        feature3: "Orientation and pioneering techniques"
      },
      explorers: {
        title: "Explorers",
        age: "14-17 years",
        desc: "Community service projects. Development of critical thinking and social commitment.",
        feature1: "Enterprises and projects",
        feature2: "Community service",
        feature3: "Major routes and expeditions"
      },
      rovers: {
        title: "Rovers",
        age: "17-21 years",
        desc: "Personal and social commitment. Preparation for adult life with responsibility and service.",
        feature1: "Service projects",
        feature2: "International routes",
        feature3: "Leader training"
      }
    },
    registration: {
      title: "Registration for",
      child: {
        title: "Child or youth information",
        name: "Name",
        surname: "Surname",
        birthdate: "Date of birth",
        gender: "Gender",
        genderOptions: {
          notSay: "Prefer not to say",
          male: "Male",
          female: "Female",
          other: "Other"
        },
        health: "Relevant medical information (allergies, medication, etc.)"
      },
      contact: {
        title: "Contact information",
        name: "Guardian's name",
        relation: "Relationship",
        relationOptions: {
          mother: "Mother",
          father: "Father",
          legal: "Legal guardian",
          other: "Other"
        },
        email: "Email",
        phone: "Phone",
        address: "Address"
      },
      additional: {
        title: "Additional information",
        comments: "Comments or additional information",
        privacy: "I have read and accept the privacy policy",
        image: "I authorize the taking and publication of images of my child in group activities"
      },
      submit: "Submit registration",
      cancel: "Cancel",
      success: {
        title: "Registration successfully sent!",
        message: "Thank you for your interest in Scout Group Myotragus. We will contact you shortly to complete the registration process.",
        button: "Accept"
      },
      required: "Required field"
    },
    footer: {
      contact: "Contact",
      email: "Email:",
      phone: "Phone:",
      location: "Location:",
      meetings: "Meetings:",
      links: "Links",
      privacy: "Privacy policy",
      terms: "Terms of use",
      copyright: "Scout Group Myotragus 684",
      credits: "Website developed by Tero"
    },
    activitiesPage: {
      hero: {
        kicker: "Agenda 2024 · 2025",
        title: "Scout Activities",
        subtitle: "An ongoing educational adventure: nature, service and group life each term.",
        btnCalendar: "View calendar",
        btnSignup: "I want to enroll"
      },
      overview: {
        badge: "What we live",
        title: "Key moments of the scout year",
        desc: "We combine outings, workshops and service projects so each section grows at its own pace with memorable experiences.",
        cards: {
          camp: {
            title: "Outings and camps",
            desc: "We explore the Serra de Tramuntana, beaches and natural areas of the island at different difficulty levels.",
            li1: "Quarterly camps by section",
            li2: "15-day summer camp",
            li3: "Raids and treks for explorers and rovers"
          },
          service: {
            title: "Community service",
            desc: "We develop solidarity and environmental projects to leave a positive mark.",
            li1: "Food drives and solidarity campaigns",
            li2: "Coastal and forest clean-up actions",
            li3: "Scout enterprise projects designed by the group"
          },
          skills: {
            title: "Skills and progression",
            desc: "The scout method lets us advance by stages with goals adapted to each age.",
            li1: "Outdoor skills and patrol life",
            li2: "Creative, STEM and first aid workshops",
            li3: "Urban routes and city activities"
          }
        }
      },
      calendar: {
        title: "Calendar 2024 · 2025",
        intro: "Regular meetings are on Saturdays from 17:00 to 19:30 in Palma. We also plan quarterly outings and special projects. This calendar updates monthly.",
        add: "Add to my calendar",
        follow: "Follow on social",
        first: "First term",
        second: "Second term",
        third: "Third term",
        sep: { m: "September", d: "Start of the year, leaders presentation and welcome games." },
        oct: { m: "October", d: "Section meet-up and basic skills workshops." },
        nov: { m: "November", d: "Solidarity action with local entities and patrol hike." },
        dec: { m: "December", d: "Winter camp and family meet-up." },
        jan: { m: "January", d: "Community service project and training for young leaders." },
        feb: { m: "February", d: "Scout Thinking Day week with cross-section activities." },
        mar: { m: "March", d: "Explorers raid and coastal trek for rovers." },
        apr: { m: "April", d: "Nature outing and participation in ASDE gatherings." },
        jun: { m: "June", d: "End-of-year party and summer camp preparation." },
        note: "* Outings and projects may vary depending on availability and weather. We communicate changes via email and official channels."
      },
      sampler: {
        badge: "Methodology",
        title: "Progression adapted to each section",
        desc: "Beavers, cubs, scouts, explorers and rovers follow specific paths with increasing responsibility.",
        explore: { title: "Exploration and play", desc: "For beavers and cubs the goal is to discover the environment through cooperative dynamics, stories and small adventures." },
        patrol: { title: "Patrol life", desc: "In troop and explorers we foster autonomy and leadership through patrols and project teams." },
        commit: { title: "Commitment and service", desc: "Rovers design impactful social projects and undertake long routes as preparation for adult life." }
      },
      cta: {
        title: "Would you like to live these experiences?",
        desc: "We welcome new members throughout the year. Write to us and we'll guide you according to the section and places available.",
        primary: "Go to enrollment"
      }
    },
    teachingsPage: {
      title: "Teachings",
      lead: "Educational goals and methodology: the scout method, values and life skills.",
      valuesTitle: "Values and Scout Law",
      valuesDesc: "Honesty, respect and commitment to the community and the environment.",
      skillsTitle: "Practical skills",
      skillsDesc: "First aid, knots, navigation, camp cooking and leadership.",
      ctaTitle: "Want to learn more or join?",
      ctaDesc: "Contact us to attend a meeting or receive more information.",
      contact: "Contact",
      seeActivities: "See activities"
    }
  }
};

// Función para obtener una traducción en un idioma
function getTranslation(lang, key) {
  // Divide la clave en sus partes (por ejemplo, "nav.home" -> ["nav", "home"])
  const keys = key.split('.');
  
  // Comienza en el objeto de traducción del idioma seleccionado
  let translation = translations[lang];
  
  // Recorre las claves para obtener el valor
  for (const k of keys) {
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      // Si no existe la traducción, devuelve la clave
      return key;
    }
  }
  
  return translation;
}

// Función para cambiar el idioma de toda la página
function changeLanguage(lang) {
  // Actualiza el atributo de idioma del documento
  document.body.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang);
  
  // Actualiza todos los elementos con atributo data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = getTranslation(lang, key);
  });
  
  // Actualiza los placeholders de los inputs
  const inputs = document.querySelectorAll('[data-i18n-placeholder]');
  inputs.forEach(input => {
    const key = input.getAttribute('data-i18n-placeholder');
    input.setAttribute('placeholder', getTranslation(lang, key));
  });
  
  // Actualiza botones de selección de idioma
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  
  // Guarda la preferencia de idioma
  localStorage.setItem('myotragus-language', lang);
  
  // Disparar evento personalizado para componentes que necesiten saber del cambio
  const event = new CustomEvent('languageChanged', { detail: { language: lang } });
  document.dispatchEvent(event);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Recuperar idioma guardado o usar el predeterminado (español)
  const savedLanguage = localStorage.getItem('myotragus-language') || 'es';
  
  // Aplicar el idioma guardado
  changeLanguage(savedLanguage);
  
  // Configurar los botones de cambio de idioma
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      changeLanguage(lang);
    });
  });
});