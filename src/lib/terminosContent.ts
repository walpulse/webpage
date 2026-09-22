export type TerminosSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: { title: string; body: string }[];
};

export type TerminosCopy = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  intro: string[];
  sections: TerminosSection[];
};

const es: TerminosCopy = {
  title: "Términos y Condiciones de Uso de Walpulse",
  lastUpdatedLabel: "Última actualización",
  lastUpdated: "18 de setiembre de 2026",
  intro: [
    'Bienvenido a Walpulse ("nosotros", "nuestro", "la Plataforma"). Los presentes Términos y Condiciones ("Términos") rigen el acceso y uso del sitio web www.walpulse.com, sus subdominios, APIs, herramientas de análisis y cualquier otro servicio asociado (en adelante, el "Servicio").',
    'Al acceder o utilizar nuestro Servicio, usted ("el Usuario", "el Cliente", "el Receptor") acepta estar legalmente vinculado por estos Términos. Si no está de acuerdo con alguno de los términos aquí expuestos, no debe utilizar Walpulse.',
  ],
  sections: [
    {
      id: "1",
      title: "1. Descripción del Servicio",
      paragraphs: [
        "Walpulse es una plataforma de análisis on-chain que provee información estructurada sobre direcciones de billeteras de criptomonedas (wallets). El Servicio se ofrece en diferentes niveles de profundidad (Básica, Estándar o Experta) y evalúa diversas señales, tales como:",
      ],
      bullets: [
        "Origen: Procedencia de los fondos.",
        "Actividad: Comportamiento y flujo on-chain en ventanas de tiempo determinadas.",
        "Presencia: Presencia y madurez en múltiples redes.",
        "Portafolio: Composición económica de la wallet (disponible según el nivel contratado).",
        "Motor de Riesgos: Herramientas de puntuación parametrizables.",
      ],
    },
    {
      id: "2",
      title: "2. Naturaleza de la Información y Exención de Responsabilidad (Disclaimer)",
      subsections: [
        {
          title: "2.1. Proveedores de Señales, No Asesores",
          body: "Walpulse actúa exclusivamente como un proveedor de datos e inteligencia on-chain. Nosotros creamos las señales, pero la interpretación y la decisión de interactuar comercial o financieramente con una wallet corresponden única y exclusivamente al Receptor.",
        },
        {
          title: "2.2. No es Asesoramiento",
          body: "Ninguna información, calificación (A–F), métrica o reporte generado por Walpulse constituye asesoramiento financiero, legal, fiscal o de inversión.",
        },
        {
          title: "2.3. No es una Herramienta de Cumplimiento Oficial",
          body: "Aunque Walpulse proporciona señales sobre exposición a riesgos o screening orientativo de fondeadores, nuestros reportes no sustituyen los procedimientos formales y obligatorios de Conozca a su Cliente (KYC) o Prevención de Lavado de Dinero (AML) requeridos por la ley aplicable al Usuario.",
        },
      ],
    },
    {
      id: "3",
      title: "3. Fuentes de Datos y Exactitud",
      paragraphs: [
        "Los datos proporcionados por Walpulse provienen del escaneo de redes blockchain públicas y de proveedores de datos externos. Debido a la naturaleza descentralizada e inmutable de las blockchains:",
      ],
      bullets: [
        "No garantizamos que la información esté libre de errores, omisiones o retrasos en la sincronización.",
        "No nos hacemos responsables por la interrupción de servicios de nodos de terceros, bifurcaciones de red (forks), o fallos inherentes a los protocolos blockchain analizados.",
      ],
    },
    {
      id: "4",
      title: "4. Licencia de Uso y Restricciones",
      paragraphs: [
        "Sujeto al cumplimiento de estos Términos y al pago del nivel contratado (Tier), Walpulse otorga al Usuario una licencia limitada, no exclusiva, intransferible y revocable para acceder y utilizar el Servicio para fines comerciales internos.",
        "El Usuario tiene estrictamente prohibido:",
      ],
      bullets: [
        "Copiar, modificar, distribuir, vender o revender los datos en bruto (raw data) de Walpulse a terceros sin una licencia comercial específica.",
        'Realizar ingeniería inversa, descompilar o intentar extraer el código fuente o los algoritmos del "Motor de Riesgos".',
        "Utilizar web scrapers, bots u otros medios automatizados para extraer datos de la Plataforma saltándose los límites de nuestra API.",
        "Utilizar la información para acosar, rastrear a individuos con fines ilícitos o violar leyes de privacidad aplicables.",
      ],
    },
    {
      id: "5",
      title: "5. Pagos y Suscripciones (Tiers)",
      bullets: [
        "El acceso a funcionalidades avanzadas (como análisis de Portafolio o profundidad Experta) está sujeto al pago de tarifas según el plan seleccionado.",
        "Las tarifas no son reembolsables salvo disposición legal en contrario.",
        "Walpulse se reserva el derecho de modificar los precios de suscripción notificando al Usuario con al menos [30 días] de anticipación.",
      ],
    },
    {
      id: "6",
      title: "6. Propiedad Intelectual",
      paragraphs: [
        'Todos los derechos, títulos e intereses sobre el Servicio, incluyendo, pero no limitado a, el diseño de la plataforma, bases de datos, algoritmos de análisis de señales, logotipos y marcas comerciales (incluyendo el término "Walpulse"), son propiedad exclusiva de [Nombre de tu Empresa/Entidad Legal] y están protegidos por las leyes de propiedad intelectual internacionales y locales.',
      ],
    },
    {
      id: "7",
      title: "7. Limitación de Responsabilidad",
      paragraphs: [
        "En la máxima medida permitida por la ley aplicable, Walpulse, sus directores, empleados o socios no serán responsables por ningún daño directo, indirecto, incidental, especial o consecuente, incluyendo, sin limitación, pérdida de beneficios, pérdida de fondos criptográficos, transacciones fallidas, daños a la reputación, o sanciones regulatorias impuestas al Usuario, que resulten del uso o la incapacidad de usar los análisis y señales proporcionados por la Plataforma.",
      ],
    },
    {
      id: "8",
      title: "8. Modificaciones a los Términos",
      paragraphs: [
        "Nos reservamos el derecho de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 15 días de antelación antes de que los nuevos términos entren en vigencia. El uso continuado del Servicio después de dichos cambios constituye la aceptación de los nuevos Términos.",
      ],
    },
    {
      id: "9",
      title: "9. Ley Aplicable y Jurisdicción",
      paragraphs: [
        "Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República Oriental del Uruguay, sin dar efecto a ninguna disposición sobre conflicto de leyes. Cualquier disputa que surja en relación con estos Términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes de la ciudad de Montevideo, Uruguay.",
      ],
    },
    {
      id: "10",
      title: "10. Contacto",
      paragraphs: [
        "Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos en:",
      ],
      bullets: [
        "Correo electrónico: carolina.rodriguez@walpulse.com",
        "Formulario de contacto: www.walpulse.com/es/contacto",
      ],
    },
  ],
};

const en: TerminosCopy = {
  title: "Walpulse Terms of Use",
  lastUpdatedLabel: "Last updated",
  lastUpdated: "September 18, 2026",
  intro: [
    'Welcome to Walpulse ("we", "our", "the Platform"). These Terms and Conditions ("Terms") govern access to and use of the website www.walpulse.com, its subdomains, APIs, analysis tools, and any other associated services (collectively, the "Service").',
    'By accessing or using our Service, you ("the User", "the Client", "the Recipient") agree to be legally bound by these Terms. If you do not agree with any of the terms set out here, you must not use Walpulse.',
  ],
  sections: [
    {
      id: "1",
      title: "1. Description of the Service",
      paragraphs: [
        "Walpulse is an on-chain analysis platform that provides structured information about cryptocurrency wallet addresses. The Service is offered at different depth levels (Basic, Standard, or Expert) and evaluates various signals, including:",
      ],
      bullets: [
        "Origin: Source of funds.",
        "Activity: On-chain behavior and flows over defined time windows.",
        "Presence: Presence and maturity across multiple networks.",
        "Portfolio: Economic composition of the wallet (available according to the contracted tier).",
        "Risk Engine: Parametrizable scoring tools.",
      ],
    },
    {
      id: "2",
      title: "2. Nature of the Information and Disclaimer",
      subsections: [
        {
          title: "2.1. Signal Providers, Not Advisors",
          body: "Walpulse acts exclusively as a provider of on-chain data and intelligence. We create the signals, but interpretation and the decision to interact commercially or financially with a wallet belong solely to the Recipient.",
        },
        {
          title: "2.2. Not Advice",
          body: "No information, grade (A–F), metric, or report generated by Walpulse constitutes financial, legal, tax, or investment advice.",
        },
        {
          title: "2.3. Not an Official Compliance Tool",
          body: "Although Walpulse provides signals on risk exposure or orientative funder screening, our reports do not replace the formal and mandatory Know Your Customer (KYC) or Anti-Money Laundering (AML) procedures required by the law applicable to the User.",
        },
      ],
    },
    {
      id: "3",
      title: "3. Data Sources and Accuracy",
      paragraphs: [
        "Data provided by Walpulse comes from scanning public blockchain networks and external data providers. Due to the decentralized and immutable nature of blockchains:",
      ],
      bullets: [
        "We do not guarantee that the information is free from errors, omissions, or synchronization delays.",
        "We are not responsible for interruptions of third-party node services, network forks, or failures inherent to the blockchain protocols analyzed.",
      ],
    },
    {
      id: "4",
      title: "4. License and Restrictions",
      paragraphs: [
        "Subject to compliance with these Terms and payment of the contracted tier, Walpulse grants the User a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for internal commercial purposes.",
        "The User is strictly prohibited from:",
      ],
      bullets: [
        "Copying, modifying, distributing, selling, or reselling Walpulse raw data to third parties without a specific commercial license.",
        'Reverse engineering, decompiling, or attempting to extract the source code or algorithms of the "Risk Engine".',
        "Using web scrapers, bots, or other automated means to extract data from the Platform while bypassing our API limits.",
        "Using the information to harass, track individuals for unlawful purposes, or violate applicable privacy laws.",
      ],
    },
    {
      id: "5",
      title: "5. Payments and Subscriptions (Tiers)",
      bullets: [
        "Access to advanced features (such as Portfolio analysis or Expert depth) is subject to payment of fees according to the selected plan.",
        "Fees are non-refundable except where required by law.",
        "Walpulse reserves the right to modify subscription prices by notifying the User at least [30 days] in advance.",
      ],
    },
    {
      id: "6",
      title: "6. Intellectual Property",
      paragraphs: [
        'All rights, title, and interest in the Service, including but not limited to the platform design, databases, signal analysis algorithms, logos, and trademarks (including the term "Walpulse"), are the exclusive property of [Nombre de tu Empresa/Entidad Legal] and are protected by international and local intellectual property laws.',
      ],
    },
    {
      id: "7",
      title: "7. Limitation of Liability",
      paragraphs: [
        "To the maximum extent permitted by applicable law, Walpulse, its directors, employees, or partners shall not be liable for any direct, indirect, incidental, special, or consequential damages, including without limitation loss of profits, loss of crypto funds, failed transactions, reputational harm, or regulatory sanctions imposed on the User, arising from the use of or inability to use the analyses and signals provided by the Platform.",
      ],
    },
    {
      id: "8",
      title: "8. Changes to the Terms",
      paragraphs: [
        "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will attempt to provide at least 15 days' notice before the new terms take effect. Continued use of the Service after such changes constitutes acceptance of the new Terms.",
      ],
    },
    {
      id: "9",
      title: "9. Governing Law and Jurisdiction",
      paragraphs: [
        "These Terms shall be governed by and construed in accordance with the laws of the Oriental Republic of Uruguay, without giving effect to any conflict-of-laws provisions. Any dispute arising in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of the city of Montevideo, Uruguay.",
      ],
    },
    {
      id: "10",
      title: "10. Contact",
      paragraphs: [
        "If you have any questions about these Terms and Conditions, please contact us at:",
      ],
      bullets: [
        "Email: carolina.rodriguez@walpulse.com",
        "Contact form: www.walpulse.com/en/contacto",
      ],
    },
  ],
};

const pt: TerminosCopy = {
  title: "Termos e Condições de Uso da Walpulse",
  lastUpdatedLabel: "Última atualização",
  lastUpdated: "18 de setembro de 2026",
  intro: [
    'Bem-vindo à Walpulse ("nós", "nosso", "a Plataforma"). Os presentes Termos e Condições ("Termos") regem o acesso e uso do site www.walpulse.com, seus subdomínios, APIs, ferramentas de análise e quaisquer outros serviços associados (em conjunto, o "Serviço").',
    'Ao acessar ou utilizar nosso Serviço, você ("o Usuário", "o Cliente", "o Receptor") aceita estar legalmente vinculado a estes Termos. Se não concordar com algum dos termos aqui expostos, não deve utilizar a Walpulse.',
  ],
  sections: [
    {
      id: "1",
      title: "1. Descrição do Serviço",
      paragraphs: [
        "A Walpulse é uma plataforma de análise on-chain que fornece informações estruturadas sobre endereços de carteiras de criptomoedas (wallets). O Serviço é oferecido em diferentes níveis de profundidade (Básica, Standard ou Expert) e avalia diversos sinais, tais como:",
      ],
      bullets: [
        "Origem: Procedência dos fundos.",
        "Atividade: Comportamento e fluxo on-chain em janelas de tempo determinadas.",
        "Presença: Presença e maturidade em múltiplas redes.",
        "Portfólio: Composição econômica da wallet (disponível conforme o nível contratado).",
        "Motor de Riscos: Ferramentas de pontuação parametrizáveis.",
      ],
    },
    {
      id: "2",
      title: "2. Natureza da Informação e Isenção de Responsabilidade (Disclaimer)",
      subsections: [
        {
          title: "2.1. Provedores de Sinais, Não Assessores",
          body: "A Walpulse atua exclusivamente como provedora de dados e inteligência on-chain. Nós criamos os sinais, mas a interpretação e a decisão de interagir comercial ou financeiramente com uma wallet cabem única e exclusivamente ao Receptor.",
        },
        {
          title: "2.2. Não é Assessoria",
          body: "Nenhuma informação, nota (A–F), métrica ou relatório gerado pela Walpulse constitui assessoria financeira, jurídica, fiscal ou de investimento.",
        },
        {
          title: "2.3. Não é uma Ferramenta Oficial de Compliance",
          body: "Embora a Walpulse forneça sinais sobre exposição a riscos ou screening orientativo de financiadores, nossos relatórios não substituem os procedimentos formais e obrigatórios de Conheça Seu Cliente (KYC) ou Prevenção à Lavagem de Dinheiro (AML) exigidos pela lei aplicável ao Usuário.",
        },
      ],
    },
    {
      id: "3",
      title: "3. Fontes de Dados e Exatidão",
      paragraphs: [
        "Os dados fornecidos pela Walpulse provêm da varredura de redes blockchain públicas e de provedores de dados externos. Devido à natureza descentralizada e imutável das blockchains:",
      ],
      bullets: [
        "Não garantimos que a informação esteja livre de erros, omissões ou atrasos de sincronização.",
        "Não nos responsabilizamos pela interrupção de serviços de nós de terceiros, forks de rede ou falhas inerentes aos protocolos blockchain analisados.",
      ],
    },
    {
      id: "4",
      title: "4. Licença de Uso e Restrições",
      paragraphs: [
        "Sujeito ao cumprimento destes Termos e ao pagamento do nível contratado (Tier), a Walpulse concede ao Usuário uma licença limitada, não exclusiva, intransferível e revogável para acessar e utilizar o Serviço para fins comerciais internos.",
        "O Usuário tem estritamente proibido:",
      ],
      bullets: [
        "Copiar, modificar, distribuir, vender ou revender os dados brutos (raw data) da Walpulse a terceiros sem uma licença comercial específica.",
        'Realizar engenharia reversa, descompilar ou tentar extrair o código-fonte ou os algoritmos do "Motor de Riscos".',
        "Utilizar web scrapers, bots ou outros meios automatizados para extrair dados da Plataforma contornando os limites da nossa API.",
        "Utilizar a informação para assediar, rastrear indivíduos com fins ilícitos ou violar leis de privacidade aplicáveis.",
      ],
    },
    {
      id: "5",
      title: "5. Pagamentos e Assinaturas (Tiers)",
      bullets: [
        "O acesso a funcionalidades avançadas (como análise de Portfolio ou profundidade Expert) está sujeito ao pagamento de tarifas conforme o plano selecionado.",
        "As tarifas não são reembolsáveis salvo disposição legal em contrário.",
        "A Walpulse reserva-se o direito de modificar os preços de assinatura notificando o Usuário com pelo menos [30 días] de antecedência.",
      ],
    },
    {
      id: "6",
      title: "6. Propriedade Intelectual",
      paragraphs: [
        'Todos os direitos, títulos e interesses sobre o Serviço, incluindo, mas não se limitando a, o design da plataforma, bases de dados, algoritmos de análise de sinais, logotipos e marcas comerciais (incluindo o termo "Walpulse"), são propriedade exclusiva de [Nombre de tu Empresa/Entidad Legal] e estão protegidos pelas leis de propriedade intelectual internacionais e locais.',
      ],
    },
    {
      id: "7",
      title: "7. Limitação de Responsabilidade",
      paragraphs: [
        "Na máxima medida permitida pela lei aplicável, a Walpulse, seus diretores, empregados ou sócios não serão responsáveis por qualquer dano direto, indireto, incidental, especial ou consequente, incluindo, sem limitação, perda de lucros, perda de fundos cripto, transações falhas, danos à reputação ou sanções regulatórias impostas ao Usuário, decorrentes do uso ou da incapacidade de usar as análises e sinais fornecidos pela Plataforma.",
      ],
    },
    {
      id: "8",
      title: "8. Modificações aos Termos",
      paragraphs: [
        "Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 15 dias de antecedência antes que os novos termos entrem em vigor. O uso continuado do Serviço após tais mudanças constitui a aceitação dos novos Termos.",
      ],
    },
    {
      id: "9",
      title: "9. Lei Aplicável e Jurisdição",
      paragraphs: [
        "Estes Termos serão regidos e interpretados de acordo com as leis da República Oriental do Uruguai, sem dar efeito a qualquer disposição sobre conflito de leis. Qualquer disputa relacionada a estes Termos estará sujeita à jurisdição exclusiva dos tribunais competentes da cidade de Montevidéu, Uruguai.",
      ],
    },
    {
      id: "10",
      title: "10. Contato",
      paragraphs: [
        "Se tiver alguma pergunta sobre estes Termos e Condições, entre em contato conosco em:",
      ],
      bullets: [
        "E-mail: carolina.rodriguez@walpulse.com",
        "Formulário de contato: www.walpulse.com/pt/contacto",
      ],
    },
  ],
};

export const terminosByLocale: Record<string, TerminosCopy> = { es, en, pt };

export function getTerminosCopy(locale: string): TerminosCopy {
  return terminosByLocale[locale] ?? terminosByLocale.es;
}
