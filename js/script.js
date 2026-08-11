(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var routes = {
    '#/': 'view-inicio',
    '#/especialidades': 'view-especialidades',
    '#/nosotros': 'view-nosotros',
    '#/convenios': 'view-convenios',
    '#/contacto': 'view-contacto',
  };

  function handleRoute() {
    var hash = window.location.hash || '#/';
    if (!routes[hash]) hash = '#/';

    document.querySelectorAll('.spa-view').forEach(function (view) {
      var active = view.id === routes[hash];
      view.classList.toggle('active', active);
      view.hidden = !active;
    });

    document.querySelectorAll('.main-nav a, .mobile-bottom-nav a').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  document.querySelectorAll('.faq-question').forEach(function (btn) {
    var answer = btn.nextElementSibling;
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = null;
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });

  var WHATSAPP_NUMBER = '56959256206';
  var waFloatBtn = document.getElementById('waFloatBtn');
  var waModal = document.getElementById('waModal');
  var waCloseBtn = document.getElementById('waCloseBtn');
  var waBody = document.getElementById('waBody');
  var state = { name: '', reason: '', detail: '' };

  if (!waFloatBtn || !waModal || !waCloseBtn || !waBody) return;

  function bookUrl() {
    var button = document.querySelector('.btn-nav');
    return button ? button.href : '#/contacto';
  }

  function openModal() {
    waModal.hidden = false;
    renderStepName();
  }

  function closeModal() {
    waModal.hidden = true;
    state = { name: '', reason: '', detail: '' };
  }

  waFloatBtn.addEventListener('click', openModal);
  waCloseBtn.addEventListener('click', closeModal);
  waModal.addEventListener('click', function (event) {
    if (event.target === waModal) closeModal();
  });

  function renderStepName() {
    waBody.innerHTML =
      '<div class="wa-step"><p class="wa-msg">Estimado(a) paciente, soy el asistente de la clínica. Para ahorrar tiempo, te sugerimos agendar directamente online 24/7. Es instantáneo y sin llamadas.</p><button class="wa-option-btn" id="waDirectBook" style="margin-bottom: 16px; border-color: var(--teal); background: rgba(66, 138, 151, 0.05); text-align: center; font-weight: 600; width: 100%;"><i class="ri-calendar-check-line" style="margin-right: 6px; vertical-align: middle;"></i> Reservar Hora Online (Dentalink)</button><p class="wa-msg">Si tienes otra consulta clínica, escribe tu nombre para ayudarte:</p><input type="text" class="wa-text-input" id="waNameInput" placeholder="Escribe tu nombre" autofocus><button class="wa-final-btn" id="waNameNext">Continuar</button></div>';
    document.getElementById('waDirectBook').addEventListener('click', function () {
      window.open(bookUrl(), '_blank', 'noopener');
      closeModal();
    });
    var input = document.getElementById('waNameInput');
    var next = document.getElementById('waNameNext');
    function submitName() {
      state.name = input.value.trim() || 'Paciente';
      renderStepReason();
    }
    next.addEventListener('click', submitName);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') submitName();
    });
  }

  function renderStepReason() {
    waBody.innerHTML =
      '<div class="wa-step"><p class="wa-msg">Gracias, ' +
      escapeHtml(state.name) +
      '. ¿En qué podemos ayudarte?</p><div class="wa-options"><button class="wa-option-btn" data-reason="Dolor o urgencia dental"><i class="ri-alert-line" style="margin-right: 6px; color: var(--teal); vertical-align: middle;"></i> Dolor o urgencia dental</button><button class="wa-option-btn" data-reason="Tratamiento de Endodoncia"><i class="ri-tooth-line" style="margin-right: 6px; color: var(--teal); vertical-align: middle;"></i> Tratamiento de Endodoncia</button><button class="wa-option-btn" data-reason="Presupuestos o reembolsos"><i class="ri-bank-card-line" style="margin-right: 6px; color: var(--teal); vertical-align: middle;"></i> Presupuestos o reembolsos</button><button class="wa-option-btn" data-reason="Consulta general o controles"><i class="ri-shield-user-line" style="margin-right: 6px; color: var(--teal); vertical-align: middle;"></i> Consulta general o controles</button><button class="wa-option-btn" data-reason="Otro asunto clínico"><i class="ri-chat-3-line" style="margin-right: 6px; color: var(--teal); vertical-align: middle;"></i> Otro asunto clínico</button></div></div>';
    waBody.querySelectorAll('.wa-option-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.reason = btn.getAttribute('data-reason') || 'Otro asunto';
        if (state.reason === 'Dolor o urgencia dental') renderStepUrgency();
        else if (state.reason === 'Tratamiento de Endodoncia')
          renderAuto(
            'Tratamiento de Endodoncia',
            'El Dr. Matías Valenzuela es cirujano dentista especialista certificado en Endodoncia. Realiza tratamientos de conducto de alta complejidad utilizando instrumentación moderna y técnicas indoloras para salvar piezas dentales.',
            'Agendar evaluación en Dentalink',
            'Consultar dudas adicionales sobre Endodoncia'
          );
        else if (state.reason === 'Presupuestos o reembolsos')
          renderAuto(
            'Pagos y Reembolsos',
            'Operamos como consulta particular con derecho a reembolso. Emitimos Boletas de Honorarios Electrónicas detalladas al finalizar la sesión, compatibles con Fonasa, Isapres y seguros complementarios.',
            'Agendar mi hora online',
            'Consultar sobre convenios o reembolsos específicos'
          );
        else if (state.reason === 'Consulta general o controles')
          renderAuto(
            'Consulta General y Controles',
            'Las evaluaciones de rutina, limpiezas y profilaxis se agendan de forma 100% autónoma en Dentalink. Puedes ver disponibilidad exacta en tiempo real y reservar el horario que más te acomode.',
            'Agendar control online',
            'Consultar dudas adicionales sobre control general'
          );
        else {
          state.detail = 'Consulta sobre otro asunto clínico.';
          renderFinal(false);
        }
      });
    });
  }

  function renderAuto(title, text, bookLabel, detail) {
    waBody.innerHTML =
      '<div class="wa-step"><p class="wa-msg"><strong>' +
      title +
      ':</strong></p><p class="wa-msg">' +
      text +
      '</p><div class="wa-options"><button class="wa-option-btn" id="waAutoBook" style="font-weight: 700; border-color: var(--teal); background: rgba(66, 138, 151, 0.05);"><i class="ri-calendar-check-line" style="margin-right: 6px; vertical-align: middle;"></i> ' +
      bookLabel +
      '</button><button class="wa-option-btn" id="waAutoChat"><i class="ri-question-line" style="margin-right: 6px; vertical-align: middle;"></i> Aún tengo otra duda específica</button><button class="wa-option-btn btn-ghost" id="waAutoBack" style="margin-top: 10px; border-color: transparent;"><i class="ri-arrow-left-line" style="margin-right: 6px; vertical-align: middle;"></i> Volver</button></div></div>';
    document.getElementById('waAutoBook').addEventListener('click', function () {
      window.open(bookUrl(), '_blank', 'noopener');
      closeModal();
    });
    document.getElementById('waAutoChat').addEventListener('click', function () {
      state.detail = detail;
      renderFinal(false);
    });
    document.getElementById('waAutoBack').addEventListener('click', renderStepReason);
  }

  function renderStepUrgency() {
    waBody.innerHTML =
      '<div class="wa-step"><p class="wa-msg">Entendido. ¿Qué tipo de urgencia presentas?</p><div class="wa-options"><button class="wa-option-btn" id="waUrgentSevere"><i class="ri-alert-line" style="margin-right: 6px; color: #dc3545; vertical-align: middle;"></i> Dolor muy fuerte / Emergencia hoy</button><button class="wa-option-btn" id="waUrgentModerate"><i class="ri-time-line" style="margin-right: 6px; color: #fd7e14; vertical-align: middle;"></i> Molestia moderada que puede esperar</button><button class="wa-option-btn btn-ghost" id="waUrgentBack" style="margin-top: 10px; border-color: transparent;"><i class="ri-arrow-left-line" style="margin-right: 6px; vertical-align: middle;"></i> Volver</button></div></div>';
    document.getElementById('waUrgentSevere').addEventListener('click', function () {
      state.detail = 'Dolor agudo muy fuerte, necesita atención hoy';
      renderFinal(true);
    });
    document.getElementById('waUrgentModerate').addEventListener('click', function () {
      renderAuto(
        'Molestia moderada',
        'Para dolores moderados, molestias tolerables o controles preventivos, te sugerimos agendar una hora de evaluación online. Asegura tu bloque de atención al instante sin esperas.',
        'Agendar hora online (Dentalink)',
        'Molestia moderada, desea hablar de todas formas'
      );
    });
    document.getElementById('waUrgentBack').addEventListener('click', renderStepReason);
  }

  function renderFinal(isUrgent) {
    var intro = isUrgent
      ? 'Te conectaremos con el Dr. Matías Valenzuela de forma prioritaria por tu urgencia.'
      : 'Te conectaremos con el Dr. Matías Valenzuela.';
    var message = isUrgent
      ? 'Hola Kika, soy ' +
        state.name +
        '. Tengo una URGENCIA de dolor muy fuerte y necesito atención hoy por favor. (Enviado desde el asistente virtual web).'
      : 'Hola Kika, soy ' +
        state.name +
        ". Leí las respuestas del asistente automático sobre '" +
        state.reason +
        "', pero tengo la siguiente consulta específica: " +
        (state.detail || '') +
        '. (Enviado desde el asistente virtual web).';
    var waLink = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    waBody.innerHTML =
      '<div class="wa-step"><p class="wa-msg">' +
      intro +
      '</p><p class="wa-msg">Presiona el botón para abrir tu WhatsApp con el mensaje ya redactado. ¡Ahorrarás tiempo en tu contacto!</p><a class="wa-final-btn" href="' +
      waLink +
      '" target="_blank" rel="noopener"><i class="ri-whatsapp-line" style="margin-right: 6px; font-size: 1.1rem; vertical-align: middle;"></i> Habla con Kika</a><button class="wa-option-btn btn-ghost" id="waFinalBack" style="margin-top: 15px; border-color: transparent; width: 100%;"><i class="ri-arrow-left-line" style="margin-right: 6px; vertical-align: middle;"></i> Volver</button></div>';
    document.getElementById('waFinalBack').addEventListener('click', renderStepReason);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
