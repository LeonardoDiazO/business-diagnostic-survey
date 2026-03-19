// ══════════════════════════════════════════════════
//  CONFIGURACIÓN — Pega aquí la URL de tu Apps Script
// ══════════════════════════════════════════════════
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwg1vtXH64ePefhiLzWdvW7Q971-8lHtG7vEJu6_k8Bu1Bc9ujRHMmBZXwdcjRpbcfK9w/exec';
// Ejemplo: 'https://script.google.com/macros/s/AKfycby.../exec'
// ══════════════════════════════════════════════════

const TOTAL = 9;

// ── Detectar offline ──
function checkOnline() {
  document.getElementById('offlineBadge').style.display =
    navigator.onLine ? 'none' : 'block';
}
window.addEventListener('online',  checkOnline);
window.addEventListener('offline', checkOnline);
checkOnline();

// ── Mostrar / ocultar campo "Otro" ──
function toggleOtro(inputId, checkbox) {
  const input = document.getElementById(inputId);
  if (checkbox.checked) {
    input.classList.add('visible');
    input.focus();
  } else {
    input.classList.remove('visible');
    input.value = '';
  }
}

// ── Mostrar campo "Otro" cuando se califica ese ítem ──
function toggleOtroDolorRating() {
  const input = document.getElementById('otroDolorInput');
  input.classList.add('visible');
  input.focus();
}

// ── Actualizar estilos de opciones ──
function updateOptStyles() {
  document.querySelectorAll('.opt').forEach(opt => {
    const inp = opt.querySelector('input');
    opt.classList.toggle('selected', inp && inp.checked);
  });
}

// ── Barra de progreso ──
function updateProgress() {
  updateOptStyles();

  const checks = [
    document.querySelectorAll('input[name="tipo"]:checked').length > 0,
    !!document.querySelector('input[name="anos"]:checked'),
    !!document.querySelector('input[name="tamano"]:checked'),
    ['dolor_dinero','dolor_inventario','dolor_pedidos','dolor_cobros','dolor_empleados','dolor_tiempo','dolor_ganancias','dolor_otro']
      .some(n => !!document.querySelector(`input[name="${n}"]:checked`)),
    !!document.querySelector('input[name="control"]:checked'),
    document.querySelectorAll('input[name="dispositivos"]:checked').length > 0,
    !!document.querySelector('input[name="tech"]:checked'),
    document.getElementById('varita').value.trim().length > 5,
    !!document.querySelector('input[name="pago"]:checked'),
  ];

  const done = checks.filter(Boolean).length;
  document.getElementById('pbar').style.width = Math.round((done / TOTAL) * 100) + '%';
  document.getElementById('progressText').textContent = `${done} de ${TOTAL}`;

  ['c1','c2','c3','c4','c5','c6','c7','c8','c9'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('answered', checks[i]);
  });
}

// ── Recopilar respuestas ──
function recopilar() {
  return {
    tipo:    [...document.querySelectorAll('input[name="tipo"]:checked')].map(e => {
               const txt = document.getElementById('otroTipo')?.value.trim();
               return e.value === 'Otro tipo de negocio' && txt ? `Otro: ${txt}` : e.value;
             }).join(' / ') || '—',
    anos:    document.querySelector('input[name="anos"]:checked')?.value || '—',
    tamano:  document.querySelector('input[name="tamano"]:checked')?.value || '—',
    dolor_dinero:     document.querySelector('input[name="dolor_dinero"]:checked')?.value || '—',
    dolor_inventario: document.querySelector('input[name="dolor_inventario"]:checked')?.value || '—',
    dolor_pedidos:    document.querySelector('input[name="dolor_pedidos"]:checked')?.value || '—',
    dolor_cobros:     document.querySelector('input[name="dolor_cobros"]:checked')?.value || '—',
    dolor_empleados:  document.querySelector('input[name="dolor_empleados"]:checked')?.value || '—',
    dolor_tiempo:     document.querySelector('input[name="dolor_tiempo"]:checked')?.value || '—',
    dolor_ganancias:  document.querySelector('input[name="dolor_ganancias"]:checked')?.value || '—',
    dolor_otro:       document.querySelector('input[name="dolor_otro"]:checked')?.value || '—',
    dolor_otro_texto: document.getElementById('otroDolorInput')?.value.trim() || '—',
    control:      document.querySelector('input[name="control"]:checked')?.value || '—',
    dispositivos: [...document.querySelectorAll('input[name="dispositivos"]:checked')].map(e => e.value).join(' / ') || '—',
    tech:         document.querySelector('input[name="tech"]:checked')?.value || '—',
    varita:  document.getElementById('varita').value.trim() || '—',
    pago:    document.querySelector('input[name="pago"]:checked')?.value || '—',
    nombre:  document.getElementById('f_nombre').value.trim(),
    negocio: document.getElementById('f_negocio').value.trim(),
    cel:     document.getElementById('f_cel').value.trim(),
    ciudad:  document.getElementById('f_ciudad').value.trim(),
  };
}

// ── Formatear ratings de dolor para mostrar ──
function formatDolorResumen(d) {
  // Compatibilidad con formato anterior (campo único 'dolor')
  if (d.dolor && d.dolor !== '—') return d.dolor;
  const items = [
    ['Dinero',      d.dolor_dinero],
    ['Inventario',  d.dolor_inventario],
    ['Pedidos',     d.dolor_pedidos],
    ['Cobros',      d.dolor_cobros],
    ['Empleados',   d.dolor_empleados],
    ['Tiempo',      d.dolor_tiempo],
    ['Ganancias',   d.dolor_ganancias],
    ['Otro',        d.dolor_otro],
  ].filter(([, v]) => v && v !== '—').map(([k, v]) => `${k}: ${v}`);
  return items.length ? items.join(' · ') : '—';
}

// ── Mostrar resumen en pantalla ──
function mostrarResumen(data) {
  const labels = [
    { q: 'Tipo de negocio',      a: data.tipo    },
    { q: 'Tiempo en el mercado', a: data.anos    },
    { q: 'Tamaño del equipo',    a: data.tamano  },
    { q: 'Dolores de cabeza (1=crítico · 6=manejable)', a: formatDolorResumen(data) },
    { q: 'Control actual',       a: data.control      },
    { q: 'Dispositivos que usa', a: data.dispositivos },
    { q: 'Comodidad tecnología', a: data.tech         },
    { q: 'Varita mágica',        a: data.varita  },
    { q: 'Disposición de pago',  a: data.pago    },
  ];
  if (data.nombre || data.negocio || data.cel) {
    labels.push({ q: 'Contacto', a: [data.nombre, data.negocio, data.cel, data.ciudad].filter(Boolean).join(' · ') });
  }

  const html = labels.map(i =>
    `<div class="summary-item"><strong>${i.q}:</strong> ${i.a}</div>`
  ).join('');

  document.getElementById('summary-content').innerHTML = html;
  document.getElementById('summary').style.display = 'block';
  document.getElementById('summary').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Guardar en localStorage como pendiente ──
function guardarLocal(data) {
  const pendientes = JSON.parse(localStorage.getItem('encuestas_pendientes') || '[]');
  pendientes.push({ data, ts: Date.now() });
  localStorage.setItem('encuestas_pendientes', JSON.stringify(pendientes));
  actualizarBtnSync();
}

// ── Sincronizar pendientes uno por uno (seguro) ──
async function sincronizarPendientes() {
  const pendientes = JSON.parse(localStorage.getItem('encuestas_pendientes') || '[]');
  if (pendientes.length === 0) return;

  const btn = document.getElementById('btnSync');
  if (btn) { btn.disabled = true; btn.textContent = 'Sincronizando...'; }

  const fallidos = [];
  for (const item of pendientes) {
    const ok = await enviar(item.data);
    if (!ok) fallidos.push(item); // si falla, lo conserva
  }

  // Solo guarda los que fallaron — los enviados se eliminan
  localStorage.setItem('encuestas_pendientes', JSON.stringify(fallidos));
  actualizarBtnSync();

  if (btn) {
    btn.disabled = false;
    btn.textContent = fallidos.length === 0
      ? '✅ Todo sincronizado'
      : `⚠️ ${fallidos.length} sin enviar — reintenta`;
    setTimeout(() => actualizarBtnSync(), 3000);
  }
}

// ── Actualizar botón de sincronización ──
function actualizarBtnSync() {
  const pendientes = JSON.parse(localStorage.getItem('encuestas_pendientes') || '[]');
  const btn = document.getElementById('btnSync');
  if (!btn) return;
  if (pendientes.length === 0) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'block';
    btn.textContent = `⬆ Enviar ${pendientes.length} encuesta${pendientes.length !== 1 ? 's' : ''} pendiente${pendientes.length !== 1 ? 's' : ''}`;
    btn.disabled = false;
  }
}

// ── Cuando vuelve internet: sincronizar automáticamente ──
window.addEventListener('online', () => {
  checkOnline();
  sincronizarPendientes();
});

// ── Enviar al servidor (Apps Script) ──
async function enviar(data) {
  if (SCRIPT_URL === 'PEGAR_AQUI_LA_URL_DE_APPS_SCRIPT') {
    console.warn('⚠️ Configura SCRIPT_URL en assets/app.js');
    return false;
  }
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requiere no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return true;
  } catch (e) {
    return false;
  }
}

// ── Guardar principal ──
async function guardar() {
  const btn = document.getElementById('btnGuardar');
  btn.disabled = true;
  btn.textContent = 'Guardando...';

  ['msgOk','msgPending','msgError'].forEach(id =>
    document.getElementById(id).style.display = 'none'
  );

  const data = recopilar();

  // Siempre guardar en historial local (para el contador y la vista)
  guardarHistorial(data);

  if (!navigator.onLine) {
    guardarLocal(data);
    document.getElementById('msgPending').style.display = 'block';
    mostrarResumen(data);
  } else {
    const ok = await enviar(data);
    if (ok || SCRIPT_URL === 'PEGAR_AQUI_LA_URL_DE_APPS_SCRIPT') {
      document.getElementById('msgOk').style.display = 'block';
      mostrarResumen(data);
    } else {
      guardarLocal(data);
      document.getElementById('msgError').style.display = 'block';
      mostrarResumen(data);
    }
  }

  btn.disabled = false;
  btn.textContent = 'Guardar respuestas';
  document.getElementById('btnGuardar').scrollIntoView({ behavior: 'smooth' });
}

// ── Historial: guardar encuesta completada ──
function guardarHistorial(data) {
  const historial = JSON.parse(localStorage.getItem('encuestas_historial') || '[]');
  historial.push({ data, ts: Date.now() });
  localStorage.setItem('encuestas_historial', JSON.stringify(historial));
  actualizarContador();
}

// ── Historial: actualizar el número en el header ──
function actualizarContador() {
  const historial = JSON.parse(localStorage.getItem('encuestas_historial') || '[]');
  document.getElementById('contadorBadge').textContent = historial.length;
}

// ── Historial: mostrar / ocultar panel ──
function toggleHistorial() {
  const panel = document.getElementById('historialPanel');
  const abierto = panel.style.display !== 'none';
  if (abierto) {
    panel.style.display = 'none';
  } else {
    renderHistorial();
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Historial: renderizar lista ──
function renderHistorial() {
  const historial = JSON.parse(localStorage.getItem('encuestas_historial') || '[]');
  const lista = document.getElementById('historialLista');
  const titulo = document.getElementById('historialTitulo');

  titulo.textContent = `${historial.length} encuesta${historial.length !== 1 ? 's' : ''} registrada${historial.length !== 1 ? 's' : ''}`;

  if (historial.length === 0) {
    lista.innerHTML = '<div class="hist-empty">Aún no hay encuestas guardadas</div>';
    return;
  }

  lista.innerHTML = [...historial].reverse().map((entry, i) => {
    const num = historial.length - i;
    const hora = new Date(entry.ts).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const fecha = new Date(entry.ts).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    const d = entry.data;
    const nombre = d.negocio || d.nombre || '—';
    return `
      <div class="hist-item">
        <div class="hist-item-header">
          <span class="hist-num">#${num}</span>
          <span class="hist-hora">${fecha} · ${hora}</span>
        </div>
        <div class="hist-negocio">${nombre}</div>
        <div class="hist-dolor">
          <strong>Tipo:</strong> ${d.tipo} &nbsp;·&nbsp;
          <strong>Dolor:</strong> ${formatDolorResumen(d)}
        </div>
      </div>`;
  }).join('');
}

// ── Permitir desmarcar botones de rating (clic en el mismo = quitar) ──
document.querySelectorAll('.rating-btn input[type=radio]').forEach(radio => {
  radio.addEventListener('mousedown', function() {
    this._preChecked = this.checked;
  });
  radio.addEventListener('touchstart', function() {
    this._preChecked = this.checked;
  }, { passive: true });
  radio.addEventListener('click', function() {
    if (this._preChecked) {
      this.checked = false;
      if (this.name === 'dolor_otro') {
        const inp = document.getElementById('otroDolorInput');
        inp.classList.remove('visible');
        inp.value = '';
      }
      updateProgress();
    }
  });
});

// Inicializar al cargar la página
actualizarContador();
actualizarBtnSync();

// ── Nueva encuesta: limpia todo el formulario ──
function nuevaEncuesta() {
  // Desmarcar todos los checkboxes y radios
  document.querySelectorAll('input[type=checkbox], input[type=radio]').forEach(el => {
    el.checked = false;
  });

  // Ocultar campos "Otro" y limpiarlos
  ['otroTipo','otroDolorInput'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.classList.remove('visible');
  });

  // Limpiar textarea y campos de contacto
  document.getElementById('varita').value = '';
  ['f_nombre','f_negocio','f_cel','f_ciudad'].forEach(id => {
    document.getElementById(id).value = '';
  });

  // Ocultar resumen y mensajes
  document.getElementById('summary').style.display = 'none';
  ['msgOk','msgPending','msgError'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  // Resetear progreso y estilos de tarjetas
  updateProgress();

  // Volver arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
