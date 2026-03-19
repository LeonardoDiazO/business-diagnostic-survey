/**
 * ENCUESTA DIAGNÓSTICO DE NEGOCIOS
 * Google Apps Script → Google Sheets
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 * ─────────────────────────────
 * 1. Abre Google Drive → "Nuevo" → "Google Sheets" → ponle nombre: "Encuestas Negocios"
 * 2. En esa hoja ve al menú: Extensiones → Apps Script
 * 3. Borra todo el código que aparece por defecto
 * 4. Copia y pega TODO este archivo
 * 5. Guarda (Ctrl+S) → ponle nombre al proyecto: "Encuesta API"
 * 6. Clic en "Implementar" → "Nueva implementación"
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier persona (Anyone)
 * 7. Clic en "Implementar" → copia la URL que te da (termina en /exec)
 * 8. Pega esa URL en el archivo HTML donde dice SCRIPT_URL
 * ─────────────────────────────
 */

// Encabezados de la hoja de cálculo (se crean automáticamente)
const HEADERS = [
  'Fecha',
  'Hora',
  'Tipo de negocio',
  'Años en el negocio',
  'Tamaño del equipo',
  'Principal problema',
  'Control actual',
  'Dispositivos que usa',
  'Comodidad con tecnología',
  'Varita mágica',
  'Disposición de pago',
  'Nombre',
  'Nombre del negocio',
  'WhatsApp',
  'Ciudad',
];

/**
 * Recibe las respuestas de la encuesta (POST)
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Crear encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Parsear datos recibidos
    const data = JSON.parse(e.postData.contents);

    // Timestamp en zona horaria Colombia
    const now = new Date();
    const tz = 'America/Bogota';

    const fila = [
      Utilities.formatDate(now, tz, 'yyyy-MM-dd'),
      Utilities.formatDate(now, tz, 'HH:mm'),
      data.tipo      || '',
      data.anos      || '',
      data.tamano    || '',
      data.dolor     || '',
      data.control      || '',
      data.dispositivos || '',
      data.tech         || '',
      data.varita    || '',
      data.pago      || '',
      data.nombre    || '',
      data.negocio   || '',
      data.cel       || '',
      data.ciudad    || '',
    ];

    sheet.appendRow(fila);

    // Formato automático: resaltar filas nuevas según dolor principal
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, HEADERS.length).setBorder(
      false, false, true, false, false, false,
      '#e0e0e0', SpreadsheetApp.BorderStyle.SOLID
    );

    return _json({ ok: true, message: 'Respuesta guardada' });

  } catch (err) {
    return _json({ ok: false, error: err.message });
  }
}

/**
 * Prueba de conexión (GET) — para verificar que el endpoint funciona
 */
function doGet(e) {
  return _json({ ok: true, message: 'Encuesta activa y funcionando' });
}

/**
 * Helper: devuelve JSON con headers CORS para que el HTML pueda conectarse
 */
function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
