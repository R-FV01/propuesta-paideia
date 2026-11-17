import heroImage from '../assets/hero-paideia.png'
import americaFacade from '../assets/paideia america.png'
import cedenoFacade from '../assets/paideia cedeño.png'
import febreroFacade from '../assets/paideia 22 de febrero.png'
import whyImage from '../assets/paideia por que elegirnos.png'
import faqImage from '../assets/paideia faq.png'
import admissionImage from '../assets/admision-aula.jpg'
import aboutImage from '../assets/nosotros-hero.jpg'
import community1 from '../assets/nosotros-comunidad-1.jpg'
import community2 from '../assets/nosotros-comunidad-2.jpg'
import community3 from '../assets/nosotros-comunidad-3.jpg'
import community4 from '../assets/nosotros-comunidad-4.jpg'
import community5 from '../assets/nosotros-comunidad-5.jpg'
import community6 from '../assets/nosotros-comunidad-6.jpg'
import heroChild from '../assets/hero-nino.webp'
import directorImage from '../assets/directora-rosa-diaz.jpg'

export const defaultSections = {
  global: {
    brandName: 'Paideia', brandSubtitle: 'College',
    homeLabel: 'Inicio', aboutLabel: 'Nosotros', educationLabel: 'Propuesta educativa', levelsLabel: 'Niveles', approachLabel: 'Nuestro enfoque', lifeLabel: 'Vida Paideia', campusesLabel: 'Sedes', newsLabel: 'Noticias', contactLabel: 'Contacto', admissionLabel: 'Admisión 2027',
    whatsappNumber: '51908805756', whatsappMessage: 'Hola, quisiera más información sobre las matrículas 2027 en Paideia College.',
  },
  // Paleta institucional (página 2 del diseño en Canva).
  brandTheme: { blueColor: '#2556a3', orangeColor: '#f28a3a', navyColor: '#17386f', deepNavyColor: '#163160', creamColor: '#f1efea', skyColor: '#92d2ea', yellowColor: '#fed61c', periwinkleColor: '#8fafd6', tealColor: '#2f6e8c' },
  theme: { primaryColor: '#e09f12', accentColor: '#f47a1f', navyColor: '#12295c', backgroundColor: '#fafafa' },
  homeHero: {
    badge: 'Preadmisión 2027 abierta',
    title: 'Acompañamos su crecimiento, impulsamos su futuro. ¡Matrículas 2027 abiertas!',
    buttonLabel: 'Más información',
    image: heroChild, imageAlt: 'Estudiante de Paideia College con uniforme levantando el pulgar',
  },
  welcome: {
    kicker: 'Bienvenidos a I.E.P. Paideia', title: 'Aprender con amor,', highlight: 'crecer con propósito',
    paragraphs: [
      { id: 'p1', text: 'Somos una institución educativa privada con 19 años al servicio de la comunidad trujillana. Acompañamos a nuestros estudiantes en cada etapa de su crecimiento, promoviendo una formación cognitiva, emocional y espiritual que fortalece su confianza, autonomía, pensamiento crítico y compromiso con su entorno.' },
      { id: 'p2', text: 'En Paideia creemos que educar es acompañar a cada estudiante a descubrir sus capacidades, desarrollar su creatividad y aprender con felicidad. Por ello, contamos con una metodología propia, alineada con el Currículo Nacional de Educación Básica (CNEB), que impulsa el desarrollo progresivo de competencias mediante experiencias significativas y desafíos que estimulan el pensamiento.' },
      { id: 'p3', text: 'Nuestra propuesta educativa se sostiene en tres pilares: **educar con amor, promover experiencias de alta demanda cognitiva y construir un entorno de bienestar y seguridad.** Así, buscamos formar personas autónomas, responsables e íntegras, preparadas para afrontar los desafíos de la sociedad y contribuir positivamente a su entorno.' },
      { id: 'p4', text: 'Nos guía el compromiso de brindar una educación en la que el amor, la integridad y la mejora continua sean parte de cada experiencia, porque estamos convencidos de que aprender con felicidad y desarrollar el pensamiento van de la mano.\n**En Paideia, educamos para aprender, crecer y trascender.**' },
    ],
    directorName: 'Rosa Arleti Díaz Aponte', directorRole: 'Directora de la institución educativa',
    image: directorImage, imageAlt: 'Rosa Arleti Díaz Aponte, directora de Paideia College',
  },
  whyHome: {
    title: '¿Por qué elegir', highlight: 'Paideia', titleEnd: 'este 2027?',
    reasons: [
      { id: 'metodologia', title: 'Metodología propia', text: 'Modelo de enseñanza basado en cuatro etapas: **explorar, comprender, aplicar y crear**, que promueve el pensamiento crítico, la autonomía y el aprendizaje a través de experiencias significativas.' },
      { id: 'docentes', title: 'Docentes comprometidos', text: 'Acompañamiento cercano que fortalece el desarrollo académico, emocional y personal de cada estudiante, respetando su ritmo y potencial.' },
      { id: 'talleres', title: 'Talleres y formación integral', text: 'Actividades artísticas, deportivas y formativas que impulsan el descubrimiento de talentos, la creatividad y el desarrollo de nuevas habilidades.' },
      { id: 'fe', title: 'Educación en la fe y valores', text: 'Formación basada en el amor, la integridad y la mejora continua, en un ambiente que refleja la fe cristiana y el amor de un hogar cristiano.' },
    ],
  },
  proposal: {
    title: 'Nuestra Propuesta', highlight: 'Educativa',
    items: [
      { id: 'formacion', name: 'Formación integral', text: 'Desarrollamos lo cognitivo, lo emocional y lo espiritual para que cada estudiante crezca con confianza, autonomía y valores.', image: community4, imageAlt: 'Estudiantes de Paideia en una presentación artística' },
      { id: 'ambientes', name: 'Ambientes que inspiran', text: 'Espacios seguros, luminosos y pensados para explorar, jugar, investigar y aprender con felicidad en cada una de nuestras sedes.', image: admissionImage, imageAlt: 'Aula de Paideia con estudiantes trabajando en equipo' },
      { id: 'profesores', name: 'Profesores expertos', text: 'Un equipo docente en formación continua que acompaña de cerca, reta con amor y potencia el talento de cada estudiante.', image: community3, imageAlt: 'Docentes de Paideia acompañando a sus estudiantes' },
    ],
  },
  steps: {
    kicker: 'Sigue estos pasos', title: 'Proceso de', highlight: 'admisión',
    items: [
      { id: 'paso-1', title: 'Solicita información', text: 'Escríbenos por WhatsApp o completa el formulario de admisión con los datos del estudiante y el nivel de interés.' },
      { id: 'paso-2', title: 'Visita guiada', text: 'Agenda una visita a la sede de tu preferencia y conoce nuestras aulas, ambientes y propuesta educativa.' },
      { id: 'paso-3', title: 'Entrevista familiar', text: 'Conversamos con la familia y el estudiante para conocer sus expectativas, fortalezas y necesidades.' },
      { id: 'paso-4', title: 'Matrícula', text: 'Presenta los documentos requeridos y asegura la vacante para el año escolar 2027.' },
    ],
  },
  hero: { eyebrow: 'Una educación con propósito', title: 'Paideia, formamos con propósito', subtitle: 'Explora · Comprende · Aplica · Crea', image: heroImage, imageAlt: 'Estudiante de Paideia sonriendo con sus cuadernos', primaryButton: { label: 'Conoce nuestra propuesta', href: '#niveles' }, secondaryButton: { label: 'Admisión 2027', href: '#admision' } },
  levels: {
    kicker: 'Una educación para cada etapa', title: 'El camino para crecer y liderar', intro: 'En Paideia acompañamos a cada estudiante con una educación cercana, retadora y diseñada para su momento de vida.',
    cardKicker: 'Nuestros niveles académicos', buttonLabel: 'Más información',
    items: [
      { id: 'nido', number: '01', name: 'Nido', tagline: 'Donde nace la curiosidad', age: 'Desde los 18 meses', image: aboutImage, imageAlt: 'Docente de Paideia jugando con niños del nivel Nido', color: '#1596d0', soft: '#c4e8fb', text: 'Un espacio lleno de cariño y descubrimientos donde los más pequeños comienzan a explorar el mundo con confianza y alegría.' },
      { id: 'inicial', number: '02', name: 'Inicial', tagline: 'Donde aprender es una aventura', age: '3 a 5 años', image: whyImage, imageAlt: 'Docente acompañando a una niña de Inicial en una actividad', color: '#ef7827', soft: '#fff1b8', text: 'Experiencias de juego y exploración que estimulan la creatividad, la autonomía y el desarrollo de nuevas habilidades.' },
      { id: 'primaria', number: '03', name: 'Primaria', tagline: 'Donde las ideas crecen', age: '6 a 11 años', image: heroImage, imageAlt: 'Estudiante de Primaria de Paideia con sus cuadernos', color: '#46a870', soft: '#ffdcbc', text: 'Aprendizajes significativos que fortalecen el pensamiento crítico, la curiosidad y la confianza para afrontar nuevos retos.' },
      { id: 'secundaria', number: '04', name: 'Secundaria', tagline: 'Donde se construye el futuro', age: '12 a 16 años', image: faqImage, imageAlt: 'Estudiantes de Secundaria de Paideia concentrados en clase', color: '#5142a4', soft: '#cddffb', text: 'Una formación que impulsa la autonomía, el pensamiento crítico y la responsabilidad para enfrentar los desafíos de la sociedad.' },
    ],
  },
  campuses: {
    kicker: 'Siempre cerca de tu familia', title: 'Encuentra tu sede Paideia', intro: 'Tres espacios para aprender, descubrir y construir un gran futuro.', buttonLabel: 'Conoce más',
    items: [
      { id: 'sede-trujillo', number: '01', name: 'Sede Trujillo', district: 'Trujillo', address: 'Av. América Sur 3845', fullAddress: 'Av. América Sur 3845, Trujillo, Perú', reference: 'Frente al Jardín Botánico', detail: 'Un espacio para aprender, crear y desarrollar grandes metas.', image: americaFacade, imageAlt: 'Fachada de la sede Trujillo', color: 'gold' },
      { id: 'sede-manuel-cedeno', number: '02', name: 'Sede Manuel Cedeño', district: 'La Esperanza', address: 'Jr. Manuel Cedeño 980', fullAddress: 'Jr. Manuel Cedeño 980, La Esperanza, Trujillo, Perú', reference: 'A 5 cuadras de la Plaza de Armas', detail: 'Acompañamiento cercano para crecer con confianza y valores.', image: cedenoFacade, imageAlt: 'Fachada de la sede Manuel Cedeño', color: 'blue' },
      { id: 'sede-22-febrero', number: '03', name: 'Sede 22 de Febrero', district: 'La Esperanza', address: '22 de Febrero 623', fullAddress: '22 de Febrero 623, La Esperanza, Trujillo, Perú', reference: 'A 2 cuadras de la Comisaría Bellavista', detail: 'Una comunidad que impulsa talentos y sueños todos los días.', image: febreroFacade, imageAlt: 'Fachada de la sede 22 de Febrero', color: 'coral' },
    ],
  },
  why: { image: whyImage, imageAlt: 'Docente de Paideia acompañando a una niña en una actividad de aprendizaje', kicker: '¿Por qué elegirnos?', title: 'Aprender con alegría. Crecer con valores.', intro: 'Lo que nos mueve es verlos descubrir de lo que son capaces. En Paideia, cada estudiante cuenta.', reasons: [
    { id: 'cercania', title: 'Acompañamiento cercano', text: 'Conocemos sus fortalezas y acompañamos cada paso para que aprenda a su ritmo y crezca con confianza.', icon: 'heart' },
    { id: 'valores', title: 'Valores que se viven', text: 'El respeto, la empatía y la responsabilidad forman parte de lo que aprendemos y compartimos cada día.', icon: 'star' },
    { id: 'vida', title: 'Aprender para la vida', text: 'Despertamos la curiosidad con experiencias que invitan a pensar, crear y descubrir nuevas posibilidades.', icon: 'book' },
  ] },
  about: { kicker: 'Conoce Paideia', title: 'Una escuela que cree en cada futuro.', intro: 'Somos una comunidad educativa que acompaña a niñas, niños y adolescentes para que aprendan con confianza, vivan sus valores y descubran su mejor versión.', image: aboutImage, imageAlt: 'Docente Paideia acompañando el aprendizaje de una estudiante', buttonLabel: 'Conoce nuestra propuesta', buttonHref: '#niveles', imageBadgeTitle: 'Desde 2007', imageBadgeText: 'Educando con propósito', galleryKicker: 'Comunidad Paideia', galleryTitle: 'Momentos que nos unen y nos inspiran.', gallery: [community1, community2, community3, community4, community5, community6].map((image, index) => ({ id: `community-${index + 1}`, image, imageAlt: `Momento de la comunidad Paideia ${index + 1}` })) },
  faq: { image: faqImage, imageAlt: 'Estudiantes de Paideia concentrados en una actividad académica', visualKicker: 'Paideia responde', visualTitle: 'Estamos para acompañarte', kicker: 'Resolvemos tus dudas', title: 'Preguntas frecuentes', intro: 'Queremos que elijas con tranquilidad. Aquí encontrarás respuestas a las consultas más comunes de las familias.' },
  admission: { image: admissionImage, imageAlt: 'Estudiantes de Paideia trabajando en equipo en el aula', kicker: 'Vacantes limitadas', title: 'Proceso de Admisión 2027', imageKicker: 'Nido · Inicial · Primaria · Secundaria', imageCaption: 'Agenda una visita y conoce nuestras aulas', submitLabel: 'Solicitar información' },
  footer: {
    description: 'Educamos con cercanía, propósito y la convicción de que cada estudiante puede liderar su propio futuro.',
    socialsTitle: 'Síguenos',
    socials: [
      { id: 'instagram', name: 'instagram', label: '@ieppaideia', href: 'https://www.instagram.com/ieppaideia/' },
      { id: 'tiktok', name: 'tiktok', label: '@iep.paideia', href: 'https://www.tiktok.com/@iep.paideia' },
      { id: 'facebook', name: 'facebook', label: 'IEP Paideia', href: 'https://www.facebook.com/ieppaideia/' },
    ],
    exploreTitle: 'Enlaces rápidos',
    exploreLinks: [
      { id: 'inicio', label: 'Inicio', href: '#inicio' }, { id: 'nosotros', label: 'Nosotros', href: '#nosotros' }, { id: 'metodologia', label: 'Metodología', href: '#por-que-elegirnos' }, { id: 'niveles', label: 'Niveles académicos', href: '#niveles' }, { id: 'matriculas', label: 'Matrículas 2027', href: '#admision' },
    ],
    locationsTitle: 'Sedes',
    locations: [
      { id: 'trujillo', name: 'Sede La Merced', address: 'Av. América Sur 3841, Urb. La Merced. Frente al Jardín Botánico' }, { id: 'febrero', name: 'Sede La Esperanza', address: 'Calle 22 de Febrero 623, La Esperanza' }, { id: 'cedeno', name: 'Sede La Esperanza', address: 'Calle Manuel Cedeño 980, La Esperanza' },
    ],
    contactTitle: 'Contáctanos', phoneLabel: '908 805 756 - 906 121 637', phoneHref: 'https://wa.me/51908805756', email: 'informes@paideia.edu.pe', schedule: 'Lunes a viernes\n8:00 a. m. — 2:00 p. m.', admissionButton: { label: 'Admisión 2027', href: '#admision' }, copyrightName: 'Paideia College', privacyLabel: 'Privacidad', privacyHref: '#privacidad', termsLabel: 'Términos y condiciones', termsHref: '#terminos',
  },
}

export const defaultNews = [
  { id: 'desfile', slug: 'desfile', category: 'Eventos', level: 'General', date: 'SEP 2026', title: 'Nuestra delegación brilló en el Desfile Cívico Escolar', excerpt: 'Estudiantes, docentes y familias recorrieron las calles con disciplina, alegría y mucho orgullo Paideia.', body: 'Con banderas en alto y paso firme, nuestra delegación participó en el Desfile Cívico Escolar. Escolta, banda y estudiantes de todos los niveles demostraron el compromiso, la puntualidad y el amor por el Perú que trabajamos cada día en el aula. ¡Gracias a las familias que nos acompañaron!', image: community6, imageAlt: 'Delegación Paideia en un desfile escolar', featured: true, sortOrder: 10 },
  { id: 'admision', slug: 'admision', category: 'Comunicados', level: 'General', date: 'OCT 2026', title: 'Proceso de Admisión 2027: vacantes abiertas', excerpt: 'Conoce los pasos, requisitos y fechas para asegurar la vacante de tu hijo.', body: 'Iniciamos el Proceso de Admisión 2027 para Nido, Inicial, Primaria y Secundaria en nuestras tres sedes. Completa el formulario de admisión y un asesor te contactará para agendar una visita guiada, una entrevista familiar y resolver todas tus dudas. Las vacantes son limitadas.', image: heroImage, imageAlt: 'Proceso de admisión Paideia', featured: false, sortOrder: 20 },
  { id: 'psicomotricidad', slug: 'psicomotricidad', category: 'Académico', level: 'Inicial', date: 'SEP 2026', title: 'Taller de juego y psicomotricidad en Inicial', excerpt: 'Aprender moviéndose: coordinación, equilibrio y trabajo en equipo.', body: 'Nuestros pequeños de Inicial vivieron una mañana de circuitos, aros y pelotas para fortalecer su coordinación, su equilibrio y su confianza. El juego dirigido es una de las herramientas que usamos para que aprendan explorando.', image: aboutImage, imageAlt: 'Estudiantes en taller de psicomotricidad', featured: false, sortOrder: 30 },
  { id: 'cronograma', slug: 'cronograma', category: 'Comunicados', level: 'General', date: 'OCT 2026', title: 'Cronograma de actividades de octubre', excerpt: 'Reuniones de padres, jornadas pedagógicas y fechas importantes del mes.', body: 'Compartimos el cronograma de octubre: reuniones de padres por nivel, entrega de informes de progreso, jornada pedagógica y actividades por el Mes de la Canción Criolla. Revisa la agenda de tu hijo y mantente atento a nuestros canales oficiales.', image: community1, imageAlt: 'Actividades de la comunidad Paideia', featured: false, sortOrder: 40 },
  { id: 'ajedrez', slug: 'ajedrez', category: 'Deportes y Arte', level: 'Secundaria', date: 'NOV 2026', title: 'Resultados del Torneo Interescolar de Ajedrez', excerpt: 'Estrategia, concentración y juego limpio en cada partida.', body: 'Nuestro equipo de ajedrez de Secundaria compitió en el Torneo Interescolar demostrando concentración, estrategia y deportividad. Felicitamos a todos los participantes y a sus entrenadores por representar a Paideia con excelencia.', image: community2, imageAlt: 'Estudiantes Paideia en actividad escolar', featured: false, sortOrder: 50 },
  { id: 'maestro', slug: 'maestro', category: 'Eventos', level: 'General', date: 'JUL 2026', title: 'Celebramos el Día del Maestro', excerpt: 'Un homenaje a quienes inspiran, guían y acompañan cada día.', body: 'Nuestra comunidad rindió homenaje a los docentes Paideia con una ceremonia llena de gratitud. Gracias por enseñar con vocación, paciencia y cariño, y por creer en el futuro de cada estudiante.', image: community3, imageAlt: 'Docentes de la comunidad Paideia', featured: false, sortOrder: 60 },
  { id: 'danza', slug: 'danza', category: 'Deportes y Arte', level: 'Secundaria', date: 'AGO 2026', title: 'Danza y marcha: talento en cada paso', excerpt: 'Nuestras estudiantes se lucieron con una coreografía llena de ritmo.', body: 'Las estudiantes de Secundaria presentaron una coreografía preparada durante semanas en los talleres de arte. Disciplina, coordinación y mucho entusiasmo en cada paso.', image: community4, imageAlt: 'Presentación de danza de estudiantes Paideia', featured: false, sortOrder: 70 },
  { id: 'lectura', slug: 'lectura', category: 'Académico', level: 'Secundaria', date: 'AGO 2026', title: 'Semana de la lectura y la escritura', excerpt: 'Círculos de lectura, cuentos propios y debates en cada aula.', body: 'Durante la Semana de la Lectura, nuestros estudiantes participaron en círculos literarios, escribieron sus propios relatos y debatieron sobre sus libros favoritos. Leer nos ayuda a pensar, imaginar y comprender el mundo.', image: faqImage, imageAlt: 'Estudiantes durante la semana de lectura', featured: false, sortOrder: 80 },
]

export const cloneDefaults = () => ({ sections: structuredClone(defaultSections), news: structuredClone(defaultNews) })
