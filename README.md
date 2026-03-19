# Encuesta de Diagnóstico de Negocios

Herramienta para levantar información de campo en pequeños y medianos negocios. Se usa de forma presencial (puerta a puerta) para identificar los dolores reales del empresario antes de desarrollar una solución tecnológica.

---

## ¿Para qué sirve?

Cuando quieres desarrollar un producto o app para microempresarios pero no sabes exactamente qué problema resolver, esta encuesta te ayuda a:

- Descubrir qué les genera más estrés o les quita más tiempo
- Saber con qué herramientas trabajan hoy
- Medir si estarían dispuestos a pagar por una solución
- Capturar sus palabras exactas (pregunta de la "varita mágica")
- Guardar todo automáticamente en Google Sheets para analizarlo

---

## Archivos del proyecto

```
business-diagnostic-survey/
├── index.html                           ← El formulario (abrir en el celular)
├── assets/
│   ├── style.css                        ← Estilos visuales
│   └── app.js                           ← Lógica del formulario + envío a Sheets
├── backend/
│   └── google-apps-script.js            ← Código del backend en Google
├── .gitignore
└── README.md                            ← Este archivo
```

---

## Configuración inicial (una sola vez)

### Paso 1 — Crear la hoja de Google Sheets

1. Ve a [drive.google.com](https://drive.google.com)
2. Clic en **"Nuevo" → "Google Sheets"**
3. Ponle nombre: `Encuestas Negocios` (o el que prefieras)

---

### Paso 2 — Crear el backend con Google Apps Script

1. Dentro de esa hoja ve a: **Extensiones → Apps Script**
2. Borra todo el código que aparece por defecto
3. Copia y pega el contenido completo del archivo `google-apps-script.js`
4. Guarda con **Ctrl+S** — ponle nombre al proyecto: `Encuesta API`

---

### Paso 3 — Publicar como aplicación web

1. Clic en **"Implementar" → "Nueva implementación"**
2. En "Tipo" selecciona: **Aplicación web**
3. Configura así:
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier persona
4. Clic en **"Implementar"**
5. Google te pedirá autorizar permisos — acéptalos
6. **Copia la URL** que aparece al final (termina en `/exec`)

---

### Paso 4 — Conectar el formulario con la hoja

Abre `assets/app.js` con cualquier editor de texto y busca esta línea:

```js
const SCRIPT_URL = 'PEGAR_AQUI_LA_URL_DE_APPS_SCRIPT';
```

Reemplázala con tu URL:

```js
const SCRIPT_URL = 'https://script.google.com/macros/s/TU_ID_AQUI/exec';
```

Guarda el archivo.

---

### Paso 5 — Probar que funciona

1. Abre `encuesta_diagnostico_negocios.html` en el celular o navegador
2. Responde todas las preguntas y clic en **"Guardar respuestas"**
3. Ve a tu Google Sheets — debe aparecer una fila nueva con fecha, hora y todas las respuestas

---

## Uso en campo

- Abre el archivo HTML directamente en el celular (no necesita hosting ni internet para mostrarse)
- **Si hay señal:** las respuestas se envían al instante a Google Sheets
- **Si no hay señal:** se guardan en el teléfono y se envían automáticamente cuando vuelve el internet
- Cada encuesta queda como una fila en la hoja con timestamp

---

## La encuesta — 8 preguntas (~5 minutos)

| # | Sección | Pregunta |
|---|---------|----------|
| 1 | Perfil | ¿Qué tipo de negocio tienes? |
| 2 | Perfil | ¿Cuánto tiempo lleva abierto tu negocio? |
| 3 | Perfil | ¿Cuántas personas trabajan aquí? |
| 4 | **Dolor** ⭐ | ¿Qué parte del negocio te quita más tiempo o te genera más problemas? |
| 5 | Dolor | ¿Cómo llevas el control de tu negocio hoy? |
| 6 | Tecnología | ¿Te sientes cómodo/a usando el celular para el negocio? |
| 7 | Tecnología | Si tuvieras una varita mágica, ¿qué le quitarías a tu negocio HOY? |
| 8 | Validación | ¿Pagarías por una app que te resuelva ese problema? |

Al final hay una sección opcional de datos de contacto (nombre, negocio, WhatsApp, ciudad).

---

## Columnas en Google Sheets

Cada respuesta genera una fila con estas columnas:

| Columna | Contenido |
|---------|-----------|
| Fecha | yyyy-MM-dd |
| Hora | HH:mm (zona horaria Colombia) |
| Tipo de negocio | Tienda / Restaurante / Servicios... |
| Años en el negocio | Menos de 1 año / 1-3 / 3-10 / +10 |
| Tamaño del equipo | Solo yo / 2-5 / 6-20 / +20 |
| Principal problema | Máx. 2 dolores seleccionados |
| Control actual | Memoria / Cuaderno / Excel / App / Ninguno |
| Comodidad tecnología | Sí / Más o menos / Prefiero no |
| Varita mágica | Texto libre del empresario |
| Disposición de pago | Sí / Depende / Gratis / No sé |
| Nombre | (opcional) |
| Nombre del negocio | (opcional) |
| WhatsApp | (opcional) |
| Ciudad | (opcional) |

---

## Analizar los resultados

Con los datos en Google Sheets puedes:

- **Filtrar por dolor principal** → ver cuál se repite más → eso es lo que debes desarrollar primero
- **Agrupar por tipo de negocio** → identificar si el problema es transversal o específico de un sector
- **Revisar las "varitas mágicas"** → son frases directas del empresario, úsalas para nombrar funciones de la app
- **Cruzar dolor + disposición de pago** → validar si el segmento con mayor dolor también está dispuesto a pagar

---

## Requisitos

- Un celular o computador con navegador web
- Una cuenta de Google (para Google Sheets + Apps Script)
- No requiere servidor, hosting, ni conocimientos de programación para usarlo

---

## Personalización

Para adaptar la encuesta a tu mercado o región:

- **Cambiar el precio de referencia** en la pregunta 8 (actualmente `$20.000/mes` en pesos colombianos)
- **Agregar o quitar opciones de dolor** en la pregunta 4 según el sector que estés explorando
- **Cambiar la zona horaria** en `google-apps-script.js` (línea `const tz = 'America/Bogota'`)
