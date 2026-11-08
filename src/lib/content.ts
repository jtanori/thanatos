// Base de conocimiento editorial — textos que el rol Editor puede modificar desde /editor
// Estos son los fallbacks si la tabla interpretations está vacía.

export const ASC_CONTENT: Record<string, { title: string; short: string; full: string; premium: string }> = {
  Aries: {
    title: "Ascendente en Aries — El año del inicio valiente",
    short: "Tono del año: iniciativa, coraje y arranque. Se te pide liderar tu propio camino.",
    full: "Con Ascendente en Aries, la Revolución Solar tiñe tus próximos 12 meses de fuego cardinal. La vida te empuja a actuar primero y perfeccionar después. Es un año para abrir ciclos: mudanzas, lanzamientos, decisiones que llevabas postergando. El cuerpo pide movimiento y la mente, retos claros. Cuidado con la impulsividad en discusiones y con quemar energía en mil frentes.",
    premium: "Estratégicamente: Marte (regente) marca dónde poner el esfuerzo. Si Marte cae en casas angulares (1,4,7,10), los inicios tienen tracción extra. Rituales: deporte matutino, metas de 90 días, decir no a lo que te frena. Meses clave: los 3 primeros tras tu cumpleaños para sembrar; el mes 7 para revisar. Pregunta guía: ¿qué haría si confiara plenamente en mí?",
  },
  Tauro: {
    title: "Ascendente en Tauro — El año de construir lo duradero",
    short: "Tono del año: estabilidad, cuerpo y recursos. Consolidar lo que tiene valor real.",
    full: "Con Ascendente en Tauro, el año pide calma fértil: menos prisa, más cimientos. Temas de dinero, placer, alimentación y hogar toman protagonismo. Es excelente para ahorrar, mejorar tu casa, cultivar relaciones que nutren y sostener rutinas que cuidan tu sistema nervioso. La sombra: rigidez o apego a lo conocido por miedo al cambio.",
    premium: "Venus como regente indica dónde florece la armonía. Si Venus está en casa 2, 6 o 10, hay potencial de ingresos o reconocimiento por constancia. Práctica premium: presupuesto consciente, inversión en calidad sobre cantidad, trabajo corporal. El segundo semestre trae recompensas si fuiste paciente en el primero.",
  },
  Géminis: {
    title: "Ascendente en Géminis — El año de la palabra y el movimiento",
    short: "Tono del año: aprender, comunicar y conectar. Tu curiosidad abre puertas.",
    full: "Ascendente en Géminis: año mental, social y versátil. Estudios, escritura, redes, viajes cortos y nuevas herramientas digitales. Necesitas variedad, pero el reto es no dispersarte. Elige 2-3 frentes y profundiza. Relaciones con hermanos, vecinos y colegas cobran relevancia.",
    premium: "Mercurio manda. Su casa muestra dónde tu mensaje tiene impacto. Si hay stellium en aire, tu voz se multiplica: podcast, newsletter, docencia. Cuidado con el sistema nervioso: pausas sin pantalla, respiración, caminatas. Tránsitos de Mercurio retrógrado te piden revisar contratos.",
  },
  Cáncer: {
    title: "Ascendente en Cáncer — El año del hogar interior",
    short: "Tono del año: sensibilidad, familia y refugio. Volver a lo esencial.",
    full: "Con Ascendente en Cáncer, la Revolución Solar te lleva hacia adentro: hogar, madre, linaje, memoria emocional. Puedes mudarte, reformar, cuidar a alguien o ser cuidado. La intuición se afina; los sueños traen mensajes. Protege tu energía y pon límites amorosos.",
    premium: "La Luna (regente) es tu brújula: su signo y casa en la RS revelan tu necesidad emocional del año. Luna en agua: sanación profunda; en fuego: necesidad de expresarte. Trabajo premium: constelaciones, diario emocional, cocina consciente, terapia. El éxito este año se mide en paz, no en aplausos.",
  },
  Leo: {
    title: "Ascendente en Leo — El año de brillar con corazón",
    short: "Tono del año: creatividad, visibilidad y alegría. Ocupar tu escenario.",
    full: "Ascendente en Leo: el Sol te invita a ser protagonista sin pedir permiso. Proyectos creativos, romance, hijos (propios o simbólicos), juego y generosidad. Si te escondiste, la vida te pondrá focos. Lidera con calidez, no con ego. Cuida el corazón en sentido literal y metafórico.",
    premium: "El Sol en la RS muestra tu misión: su casa es tu escenario anual. Sol en 5 o 10: máxima visibilidad. Sol en 12 o 6: brillo tras bambalinas, salud y servicio. Clave premium: una creación al mes, celebración consciente, límites con la necesidad de aprobación.",
  },
  Virgo: {
    title: "Ascendente en Virgo — El año del orden que libera",
    short: "Tono del año: salud, método y servicio. Pequeños hábitos, grandes cambios.",
    full: "Ascendente en Virgo: año de afinar. Salud, trabajo cotidiano, organización y discernimiento. Depurar dieta, agenda, armario y mente. Es tiempo de volverte experta/o en algo útil. La autocrítica puede sabotearte: cambia perfección por progreso.",
    premium: "Mercurio en la RS indica tu sistema operativo. Casa 6: salud y rutinas son la palanca; casa 10: reputación por excelencia. Protocolos premium: analíticas, sueño, alimentación antiinflamatoria, sistemas de trabajo. Menos es más: un ritual matutino sostiene todo el año.",
  },
  Libra: {
    title: "Ascendente en Libra — El año del vínculo consciente",
    short: "Tono del año: pareja, alianzas y belleza. Yo + Tú = Nosotros.",
    full: "Con Ascendente en Libra, las relaciones son el espejo y el maestro. Pareja, socios, clientes uno-a-uno. Contratos, bodas, mediaciones. Aprendes a pedir lo que necesitas sin perder armonía. Estética, arte y espacios bellos te recargan.",
    premium: "Venus rige: su posición dice qué relación nutrir. Venus en 7: compromiso o socio clave; en 11: red y comunidad. Práctica premium: conversaciones difíciles con elegancia, acuerdos por escrito, belleza como medicina diaria.",
  },
  Escorpio: {
    title: "Ascendente en Escorpio — El año de la transformación",
    short: "Tono del año: profundidad, crisis fértil y poder personal. Renacer.",
    full: "Ascendente en Escorpio: año intenso y alquímico. Fines necesarios, duelos, sexualidad, dinero compartido, herencias, investigación. Lo que estaba bajo la alfombra sale a la luz para sanarse. No controles: transmuta. Terapia, sombra e intimidad honesta son oro.",
    premium: "Plutón/Marte co-rigen. Casa 8 activa: impuestos, deudas, fusión de recursos. Si hay stellium en agua, el trabajo emocional acelera. Clave premium: soltar una identidad vieja, ritual de cierre, confidencialidad selectiva. Poder = vulnerabilidad bien sostenida.",
  },
  Sagitario: {
    title: "Ascendente en Sagitario — El año de la expansión",
    short: "Tono del año: horizonte, estudios y aventura. Creer en grande.",
    full: "Ascendente en Sagitario: la vida se abre. Viajes largos, universidad, filosofía, espiritualidad, idiomas, publicación. Necesitas sentido; sin él, todo pesa. Apunta alto pero aterriza planes en pasos concretos. Cuidado con prometer de más.",
    premium: "Júpiter rige: su casa es tu campo de suerte. Júpiter en 9 o 1: año de salto cuántico si actúas. Documenta tu filosofía, enseña lo que aprendes. El extranjero (real o simbólico) trae oportunidades. Pregunta: ¿qué verdad estoy lista/o para vivir, no solo para decir?",
  },
  Capricornio: {
    title: "Ascendente en Capricornio — El año de la maestría",
    short: "Tono del año: estructura, carrera y legado. Paso firme hacia la cima.",
    full: "Con Ascendente en Capricornio, el año pide madurez: metas a largo plazo, disciplina amable, autoridad. Carrera, paternidad, compromisos serios. Menos ruido, más resultados. La soledad elegida te fortalece; el aislamiento, no.",
    premium: "Saturno rige: su casa muestra dónde madurar. Saturno en 10: ascenso o mayor responsabilidad; en 4: bases familiares. Estrategia premium: un objetivo anual, revisiones trimestrales, mentores. El prestigio llega por consistencia, no por prisa.",
  },
  Acuario: {
    title: "Ascendente en Acuario — El año de la libertad auténtica",
    short: "Tono del año: comunidad, innovación y desapego. Futuro en presente.",
    full: "Ascendente en Acuario: año de romper moldes. Amistades, colectivos, tecnología, causas. Necesitas aire y autenticidad. Cambios de look, de sistema, de círculo. Si intentas encajar, te marchitas; si innovas, floreces.",
    premium: "Saturno/Urano co-rigen: tensión fértil entre estructura y ruptura. Casa 11 activa: audiencia y tribu. Lanza ese proyecto raro, digitaliza, colabora. Clave: libertad con responsabilidad afectiva.",
  },
  Piscis: {
    title: "Ascendente en Piscis — El año de la entrega creativa",
    short: "Tono del año: espiritualidad, arte y compasión. Disolver para crear.",
    full: "Con Ascendente en Piscis, el velo se adelgaza: sueños, arte, servicio, sanación. Año para perdonar, imaginar y fluir. Cuidado con la evasión (pantallas, sustancias, sacrificio excesivo). Pon forma a lo invisible: obra, práctica, altar cotidiano.",
    premium: "Neptuno/Júpiter rigen: su casa indica dónde soñar con pies en tierra. Casa 12: retiro fértil; casa 5: arte que sana. Práctica premium: meditación, mar, música, ayuda sin auto-abandono. Los límites son tu espiritualidad aplicada.",
  },
};

export const HOUSE_CONTENT: Record<number, { title: string; short: string; full: string; premium: string }> = {
  1: { title: "Sol en Casa 1 — Protagonismo personal", short: "Foco: identidad, cuerpo y nuevos comienzos. Tu energía vital se vuelve visible.", full: "El Sol en casa 1 pone el reflector sobre ti: imagen, vitalidad, iniciativa. Es tu año para reinventarte, cuidar tu cuerpo y tomar la delantera. La gente te nota más; úsalo para lanzar, no para complacer.", premium: "Premium: trabaja marca personal, salud integral y límites. Evita el egocentrismo reactivo. Mejor mes para actuar: el de tu cumpleaños. Afirmación: Yo inicio mi año." },
  2: { title: "Sol en Casa 2 — Recursos y autoestima", short: "Foco: dinero, valores y sustento. Construir seguridad desde adentro.", full: "Sol en casa 2 ilumina ingresos, posesiones y auto-valoración. Año para ordenar finanzas, cobrar lo justo y simplificar. Lo que valoras, crece. Evita gastos por ansiedad.", premium: "Premium: crea colchón, diversifica ingresos, invierte en habilidades que pagan. Ritual: revisión mensual de dinero con gratitud. La autoestima sostiene la cuenta bancaria." },
  3: { title: "Sol en Casa 3 — Mente y entorno", short: "Foco: estudios, comunicación y movilidad. Aprender y compartir.", full: "Sol en casa 3: cursos, escritura, redes cercanas, viajes cortos. Tu mente está fértil. Enseña, publica, conversa. Hermanos y vecinos relevantes.", premium: "Premium: elige un tema y domínalo. Newsletter, podcast o taller corto tienen tracción. Protege tu atención del ruido." },
  4: { title: "Sol en Casa 4 — Hogar y raíces", short: "Foco: familia, vivienda e intimidad. Echar raíces.", full: "Sol en casa 4 lleva la luz al hogar: mudanza, reforma, reconciliación familiar, trabajo interior. Año para nutrir tu base. El éxito externo espera; el interno urge.", premium: "Premium: ordena tu casa = ordena tu mente. Sana linaje, crea refugio. Inversión inmobiliaria o familiar favorable si es consciente." },
  5: { title: "Sol en Casa 5 — Creación y gozo", short: "Foco: romance, arte y juego. Crear por placer.", full: "Sol en casa 5: año luminoso para el corazón. Enamoramientos, hijos, proyectos artísticos, escenario. Juega en serio: la alegría es estrategia. Expresa, no impresiones.", premium: "Premium: una obra, un romance sano, deporte lúdico. Si emprendes, hazlo con brillo. Fertiliza tu niño interior con citas creativas semanales." },
  6: { title: "Sol en Casa 6 — Salud y servicio", short: "Foco: cuerpo, rutinas y trabajo. El método te hace libre.", full: "Sol en casa 6: salud, hábitos y empleo cotidiano. Año para optimizar: chequeos, alimentación, ejercicio, sistemas. Servir bien te posiciona. Cuidado con el agotamiento por exigencia.", premium: "Premium: protocolo de sueño + movimiento + alimentación. Mejora procesos en tu trabajo; pide aumento por eficiencia. Mascotas y colegas importan." },
  7: { title: "Sol en Casa 7 — Alianzas", short: "Foco: pareja y socios. El otro como espejo y palanca.", full: "Sol en casa 7: relaciones uno-a-uno al centro. Compromisos, matrimonio, sociedad, clientes clave. Aprende a negociar ganar-ganar. Si estás soltera/o, alguien significativo puede aparecer.", premium: "Premium: contratos claros, terapia de pareja, elección consciente de socios. Tu crecimiento pasa por el vínculo. Evita ceder tu sol por paz barata." },
  8: { title: "Sol en Casa 8 — Fusión y renacimiento", short: "Foco: intimidad, dinero compartido y sombra. Transformar.", full: "Sol en casa 8: año profundo. Finanzas compartidas, herencias, deudas, sexualidad, duelos. Lo oculto se ilumina para sanarse. Suelta control, abraza regeneración.", premium: "Premium: ordena impuestos y deudas, pon acuerdos sexuales y económicos sobre la mesa. Terapia profunda recomendada. Poder compartido, no lucha de poder." },
  9: { title: "Sol en Casa 9 — Horizonte", short: "Foco: viajes, estudios superiores y sentido. Expandir la mente.", full: "Sol en casa 9: filosofía, universidad, extranjero, publicación. Año para salir del barrio mental. Busca maestros y conviértete en uno. La fe (en ti, en la vida) se reconstruye.", premium: "Premium: gran viaje, máster, libro o docencia. Aprende un idioma. Tu visión del mundo se vuelve tu plan de vida." },
  10: { title: "Sol en Casa 10 — Cima profesional", short: "Foco: carrera, reputación y propósito público. Ser visible.", full: "Sol en casa 10: año de cosecha profesional. Ascensos, reconocimiento, mayor responsabilidad. Tu vocación pide coherencia pública. Cuida tu imagen y a tus mayores.", premium: "Premium: define tu titular profesional del año. Networking estratégico, mentores, portafolio. Equilibra ambición con vida privada para no quemarte." },
  11: { title: "Sol en Casa 11 — Tribu y futuro", short: "Foco: amistades, redes y proyectos colectivos. Soñar en plural.", full: "Sol en casa 11: comunidad, activismo, tecnología, sueños a futuro. Tus amigos te abren puertas. Lanza proyectos grupales, únete a colectivos. El futuro se siembra en red.", premium: "Premium: construye audiencia, colabora, prototipa. Un deseo de hace años puede cumplirse con ayuda. Sé la amiga que quieres tener." },
  12: { title: "Sol en Casa 12 — Retiro fértil", short: "Foco: inconsciente, descanso y espiritualidad. Soltar para renacer.", full: "Sol en casa 12: año de gestación. Menos exposición, más interioridad. Cierra ciclos, perdona, descansa, crea en secreto. Terapia, retiro, arte contemplativo. Lo que sueltes ahora, florece el próximo año.", premium: "Premium: agenda espacios de silencio. Limpia deudas kármicas y físicas. Prepara el gran lanzamiento del siguiente ciclo. Tu poder está en lo invisible." },
};

export const MOON_CONTENT: Record<string, string> = {
  Aries: "Luna en Aries: necesitas autonomía emocional, movimiento y franqueza. Canaliza la impaciencia con deporte y decisiones rápidas pero conscientes.",
  Tauro: "Luna en Tauro: necesitas seguridad sensorial, rutina amable y belleza cotidiana. Cocina, naturaleza y descanso te regulan.",
  Géminis: "Luna en Géminis: necesitas hablar, aprender y variar. Escribe, llama, estudia. El aire fresco mental calma tu ansiedad.",
  Cáncer: "Luna en Cáncer: necesitas hogar, contención y memoria. Cuida y déjate cuidar. Cocina de la abuela, mar, familia.",
  Leo: "Luna en Leo: necesitas juego, reconocimiento y romance. Crea, celebra, ama con teatralidad sana.",
  Virgo: "Luna en Virgo: necesitas orden, salud y utilidad. Limpia, organiza, cuida tu cuerpo. El detalle te da paz.",
  Libra: "Luna en Libra: necesitas armonía, compañía y estética. Conversa, concilia, embellece tu entorno.",
  Escorpio: "Luna en Escorpio: necesitas profundidad, verdad e intimidad. Siente sin miedo, transforma sin drama.",
  Sagitario: "Luna en Sagitario: necesitas horizonte, humor y aventura. Viaja, estudia, ríe. La fe te sostiene.",
  Capricornio: "Luna en Capricornio: necesitas estructura, logro y respeto. Metas claras y autocuidado sobrio.",
  Acuario: "Luna en Acuario: necesitas libertad, amigos y futuro. Desconecta para reconectar, innova tu rutina.",
  Piscis: "Luna en Piscis: necesitas arte, mar y silencio. Medita, sueña, ayuda sin disolverte.",
};

export function getAscFallback(sign: string) {
  return ASC_CONTENT[sign] ?? ASC_CONTENT["Leo"];
}
export function getHouseFallback(house: number) {
  return HOUSE_CONTENT[house] ?? HOUSE_CONTENT[1];
}
