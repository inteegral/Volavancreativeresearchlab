// VOLAVAN Social Media Campaign Data
// Based on: volavan-social-plan.md

export type PostFormat = 'carousel' | 'reel' | 'single';
export type PostType = 'educativo' | 'provocativo' | 'cita-visual' | 'cita-real';
export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface SocialPost {
  id: string;
  day: number;
  angle: string;
  format: PostFormat;
  type: PostType;
  objective: string;
  isHighlight: boolean;
  hook?: string;
  content: {
    slides?: string[];
    script?: {
      timestamp: string;
      text: string;
    }[];
    imageText?: string;
    caption: string;
  };
  status?: PostStatus;
}

export const angles = [
  { id: 'residencia-instrumento', name: 'La residencia como instrumento', hook: 'No construimos un programa. Construimos unas condiciones.' },
  { id: 'tension-correcta', name: 'Tensión correcta, no talento', hook: 'Seleccionar artistas no significa elegir a los mejores.' },
  { id: 'reflejo-performance', name: 'El reflejo de la performance', hook: 'Todo músico tiene un reflejo de performance. Desaprenderlo lleva tiempo.' },
  { id: 'intimidad-radical', name: 'Intimidad radical', hook: 'Contemporáneo no te pide llegar con un proyecto.' },
  { id: 'intimo-comun', name: 'Lo íntimo → lo común', hook: 'Nueve artistas. Siete días. Un material: el azulejo.' },
  { id: 'disciplinas-cruzadas', name: 'Lo que una disciplina normaliza', hook: 'Un fotógrafo y un sonidista leen la misma ciudad diferente.' },
  { id: 'practica-interrumpida', name: 'Trae tu práctica. Deja que sea interrumpida.', hook: 'No fuiste elegido porque seas el mejor.' }
];

export const socialPosts: SocialPost[] = [
  {
    id: 'day-1',
    day: 1,
    angle: 'Tensión correcta',
    format: 'carousel',
    type: 'educativo',
    objective: 'Guardados',
    isHighlight: true,
    hook: 'Seleccionar artistas no significa elegir a los mejores',
    content: {
      slides: [
        'Seleccionar artistas no significa elegir a los mejores.',
        'En +-SON 2025 revisamos treinta candidaturas. La pregunta no era quién era más impresionante.',
        'Era: ¿qué pasa cuando estas personas están en la misma sala?',
        'Un intérprete de didgeridoo junto a síntesis modular. Una violista clásica junto a alguien que nunca ha leído una partitura.',
        'No como concepto. Porque esa tensión era honesta y viva.',
        '\'A group that genuinely unsettles each other has a chance of producing something surprising.\''
      ],
      caption: '¿Estás buscando un contexto donde te entiendan o uno donde te cambien?'
    }
  },
  {
    id: 'day-4',
    day: 4,
    angle: 'Reflejo performance',
    format: 'reel',
    type: 'provocativo',
    objective: 'Reproducciones',
    isHighlight: false,
    hook: 'Cuando juntas a dos músicos y dices toca...',
    content: {
      script: [
        { timestamp: '0–3 seg', text: 'Cuando juntas a dos músicos y dices toca...' },
        { timestamp: '3–10 seg', text: 'Lo primero que pasa es siempre una forma de presentación. Años desarrollando una voz. El primer instinto es mostrarla.' },
        { timestamp: '10–25 seg', text: 'Pero actuar y escuchar no son lo mismo. Actuar dice: esto es lo que traigo. Escuchar dice: todavía no sé lo que soy.' },
        { timestamp: '25–45 seg', text: 'En +-SON diseñamos el programa en parejas rotativas por eso. En un dúo no puedes esconderte. No puedes llenar el espacio con técnica y llamarlo colaboración.' },
        { timestamp: '45–50 seg', text: '¿Cuándo fue la última vez que trabajaste con alguien que cambió cómo trabajas?' }
      ],
      caption: '¿Cuándo fue la última vez que trabajaste con alguien que cambió cómo trabajas?'
    }
  },
  {
    id: 'day-8',
    day: 8,
    angle: 'Residencia instrumento',
    format: 'single',
    type: 'cita-visual',
    objective: 'Comentarios',
    isHighlight: false,
    content: {
      imageText: 'The residency is not a container for creation. It is a medium.',
      caption: 'La residencia no es el lugar donde ocurre el arte. Es cómo ocurre.\nLo que cambia cuando vives con otros artistas durante una semana no es la cantidad de trabajo que produces. Es la forma en que escuchas.\n¿Cuándo fue la última vez que un contexto cambió lo que eras capaz de hacer?'
    }
  },
  {
    id: 'day-11',
    day: 11,
    angle: 'Intimidad radical',
    format: 'carousel',
    type: 'educativo',
    objective: 'Guardados',
    isHighlight: true,
    hook: 'Contemporáneo no te pide llegar con un proyecto',
    content: {
      slides: [
        'Contemporáneo no te pide llegar con un proyecto. Te pide algo más difícil.',
        'Soltar la necesidad de control.',
        'Dejar que el trabajo nazca del encuentro genuino, no de la intención individual.',
        '\'The capacity to depose one\'s own egocentrism is what opens the space for authentic exchange.\'',
        'Paradójicamente, solo a través de ese gesto de soltar cada artista emerge del todo.'
      ],
      caption: 'La convivencia no es el contexto del trabajo. Es el trabajo.'
    }
  },
  {
    id: 'day-15',
    day: 15,
    angle: 'Trae tu práctica',
    format: 'reel',
    type: 'provocativo',
    objective: 'Reproducciones',
    isHighlight: false,
    content: {
      script: [
        { timestamp: '0–3 seg', text: 'Un artista que sale de una residencia igual que entró ha resistido en lugar de participar.' },
        { timestamp: '3–15 seg', text: 'No fuiste elegido porque seas el mejor en lo que haces. Fuiste elegido por lo que pensamos que puede pasar cuando estás en la sala con estas personas.' },
        { timestamp: '15–30 seg', text: 'Eso exige llegar dispuesto a no saber exactamente adónde va. A dejar espacio para que tu práctica sea interrumpida.' },
        { timestamp: '30–40 seg', text: '¿Puedes hacer algo frente a otros artistas sin saber si funciona?' }
      ],
      caption: '¿Puedes hacer algo frente a otros artistas sin saber si funciona?'
    }
  },
  {
    id: 'day-18',
    day: 18,
    angle: 'Tensión correcta',
    format: 'single',
    type: 'cita-real',
    objective: 'Comentarios',
    isHighlight: true,
    content: {
      imageText: 'We read everything. We listened to everything. We argued about a lot of it.',
      caption: 'Esto es lo que le decimos a cada artista que aplicó a +-SON y no fue seleccionado.\nSi no fuiste seleccionado, casi seguro no tiene nada que ver con la calidad de tu trabajo. Tiene que ver con el grupo específico que estábamos intentando construir ese año.\nOtro año, otra ecuación: la respuesta podría ser diferente.'
    }
  },
  {
    id: 'day-22',
    day: 22,
    angle: 'Disciplinas cruzadas',
    format: 'carousel',
    type: 'educativo',
    objective: 'Guardados',
    isHighlight: false,
    content: {
      slides: [
        'Un fotógrafo y un artista sonoro leen la misma ciudad de forma completamente distinta.',
        'Ese gap es donde ocurre el trabajo que ninguno de los dos podría haber hecho solo.',
        'Welcome Violence reúne fotógrafos, videomakers, escritores, performers y músicos sobre el mismo espacio urbano.',
        'No para construir proyectos compartidos.',
        'Sino porque lo que una disciplina da por sentado, otra lo captura.',
        '\'What one discipline normalises, another might catch.\''
      ],
      caption: '¿Qué verías en tu propio trabajo si lo pasaras por la lógica de una disciplina completamente distinta a la tuya?'
    }
  },
  {
    id: 'day-25',
    day: 25,
    angle: 'Lo íntimo → común',
    format: 'reel',
    type: 'educativo',
    objective: 'Guardados',
    isHighlight: true,
    hook: 'Nueve artistas. Siete días. Un material: el azulejo.',
    content: {
      script: [
        { timestamp: '0–3 seg', text: 'Nueve artistas. Siete días. Un material: el azulejo.' },
        { timestamp: '3–15 seg', text: 'No como objeto decorativo. Como materia viva. Una superficie que ya pertenece a la memoria colectiva antes de que ningún artista la toque.' },
        { timestamp: '15–30 seg', text: 'Cinco sesiones: infancia, juventud, adultez, ruptura, sexualidad.' },
        { timestamp: '30–45 seg', text: 'Al final de la semana, ocho fragmentos individuales colocados juntos sin lógica curatorial. Lo que emerge no lo hizo nadie solo.' },
        { timestamp: '45–50 seg', text: 'Donde la biografía se abre hacia la arqueología colectiva.' }
      ],
      caption: 'Donde la biografía se abre hacia la arqueología colectiva.'
    }
  },
  {
    id: 'day-28',
    day: 28,
    angle: 'Reflejo performance',
    format: 'single',
    type: 'cita-real',
    objective: 'Comentarios',
    isHighlight: false,
    content: {
      imageText: 'None of these discoveries happen in a studio session.',
      caption: 'Las cosas más importantes que pasan en una residencia no ocurren en las sesiones de trabajo.\nOcurren en la cena. En el paseo. En el momento en que nadie está produciendo nada para nadie.\nUna violista descubre que la forma en que un field recordist trata el silencio es más interesante que cualquier cosa que pueda añadir encima.\nEso no se planifica. Se construye viviendo juntos el tiempo suficiente.'
    }
  },
  {
    id: 'day-30',
    day: 30,
    angle: 'Residencia instrumento',
    format: 'carousel',
    type: 'cita-real',
    objective: 'Guardados',
    isHighlight: false,
    content: {
      slides: [
        '¿Qué se llevan los artistas de una residencia Volavan?',
        'No necesariamente una obra terminada.',
        'Algo más difícil de nombrar. Y más útil a largo plazo.',
        'Una práctica más permeable. Más curiosa sobre lo que pasa en los bordes de su competencia.',
        '\'Not answers. A refined capacity for asking.\''
      ],
      caption: 'Esa es la única promesa honesta que podemos hacer. Y es la única que dura.'
    }
  }
];

// Helper functions
export const getPostsByFormat = (format: PostFormat) => 
  socialPosts.filter(post => post.format === format);

export const getHighlightPosts = () => 
  socialPosts.filter(post => post.isHighlight);

export const getPostsByWeek = () => {
  const weeks = [[], [], [], [], []] as SocialPost[][];
  socialPosts.forEach(post => {
    const weekIndex = Math.floor((post.day - 1) / 7);
    if (weekIndex < 5) weeks[weekIndex].push(post);
  });
  return weeks;
};
