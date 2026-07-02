# 📩 MateCode — To-Do-App

**MateCode** es una Single Page Application (SPA) responsiva de gestión de tareas diarias, diseñada con un enfoque moderno y minimalista bajo una paleta de colores personalizada de tipo *Warm-Minimalist* (Burgundy, Nude, Rose Smoke y Off Black). Permite crear, listar, editar y eliminar tareas con persistencia en tiempo real en la nube, soporte de prioridades, fechas de vencimiento y un sistema seguro de envío de resúmenes por correo electrónico.

Desarrollada como proyecto integrador del **Módulo 4 de Soy Henry (Full Stack Developer)**.

🌐 **Link de la App:** https://mate-cod-to-do-app.vercel.app/login

---
## 📸 Capturas de Pantalla de la App

### 1. Pantalla de Login (Home)
![Login Page](/src/assets/login-page.png)

### 2. Dashboard (To-Do-App)
![Dashboard Page](/src/assets/dashboard-page.png)

### 3. Dark Mode 🌙
![Ipad Size](/src/assets/ipad-size-dark.png)

![Phone Size](/src/assets/phone-size-dark.png)

### 4. 📨 Correo Recibido
![Email Send](/src/assets/correo-enviado.png)

![Email Recieved](/src/assets/email-recibido.png)

---
## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite |
| **Estilos** | CSS Puro (separado por componentes/páginas) integrado con Variables CSS globales |
| **Base de Datos** | Cloud Firestore (Firebase SDK v9 Modular) |
| **Autenticación** | Firebase Authentication (Email/Password e Inicio con Google) |
| **BFF & Emailing** | Vercel Serverless Functions + AWS SES SDK |
| **Testing** | Vitest + React Testing Library (RTL) |
| **Despliegue** | Vercel (Frontend CI/CD + Serverless APIs) |

---

## 📱 Adaptabilidad Móvil (Responsive Design)

Siguiendo el enfoque *Mobile-First* y en respuesta directa a las correcciones de diseño de entregas anteriores, la aplicación cuenta con un diseño fluido que se adapta perfectamente a diferentes resoluciones:

* **Sizing Fluido:** Se evitó por completo el uso de anchos fijos en píxeles (`px`), implementando en su lugar unidades relativas (`%`, `rem`, `vh`) y la propiedad `box-sizing: border-box` global.
* **Layout Híbrido en Acceso:** En dispositivos móviles, el panel decorativo izquierdo de la pantalla de login/registro se oculta de forma automática para priorizar el espacio del formulario en pantalla táctil, mientras que en pantallas mayores a `768px` se despliega en una cuadrícula de dos columnas equilibradas.
* **Dashboard Adaptable:** El panel del dashboard se reorganiza de un sistema Grid de dos columnas (escritorio) a una única columna vertical en móviles, manteniendo los widgets de estadísticas superiores siempre visibles y fáciles de pulsar.

---

## 🚀 Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo local en tu computadora:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ferposadagarcia/M4-PI-SoyHenry.git
   cd to-do-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de plantilla a tu entorno local:
   ```bash
   cp .env.example .env
   ```
   Abre el archivo `.env` y completa las claves reales de Firebase y AWS.

4. **Correr el servidor local:**
   ```bash
   npm run dev
   ```

5. **Correr funciones del servidor localmente (BFF):**
   Si deseas probar el envío de correos localmente simulando las Serverless Functions de Vercel:
   ```bash
   npx vercel dev
   ```

---

## 🔑 Variables de Entorno Necesarias

El archivo `.env.example` contiene la estructura sin datos sensibles. Para producción en Vercel, estas variables deben configurarse en la pestaña de *Environment Variables*:

```env
# FIREBASE CONFIG (Prefijo VITE_ obligatorio para exponerlas al cliente de React)
VITE_FIREBASE_API_KEY=tu_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain_real
VITE_FIREBASE_PROJECT_ID=tu_project_id_real
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_real
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_real
VITE_FIREBASE_APP_ID=tu_app_id_real

# AWS CONFIG (Sin prefijo VITE_, seguras en el servidor de Vercel)
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=tu_access_key_id_de_aws
AWS_SES_SECRET_ACCESS_KEY=tu_secret_access_key_de_aws
SES_FROM_EMAIL=tu_correo_verificado_en_aws_ses@gmail.com
```

---

## 🏗️ Estructura del Proyecto (Arquitectura de Capas)

El directorio se organiza de forma modular para garantizar una legibilidad impecable y separación estricta de responsabilidades:

```text
to-do-app/
├── api/
│   └── send-email.ts       # BFF: Función Serverless de Vercel (Node.js)
├── src/
│   ├── assets/             # Recursos visuales optimizados (.webp)
│   ├── components/         # Componentes UI reutilizables (TaskForm, TaskCard, EmailSummaryButton)
│   ├── features/auth/      # Lógica de Autenticación (Authenticator, authErrors)
│   ├── hooks/              # Hooks personalizados de React (useTasks)
│   ├── pages/              # Vistas principales (LoginPage, RegisterPage, DashboardPage)
│   ├── services/           # Integraciones externas (firebase, tasksService)
│   ├── types/              # Tipados estrictos de TypeScript (task.ts)
│   ├── App.css             # Archivo de estilos base (limpio de conflictos)
│   ├── App.tsx             # Router y rutas privadas protegidas
│   └── index.css           # Variables globales, resets y tokens de color
├── tests/                  # Suite de pruebas automatizadas con Vitest
│   ├── emailSummary.test.ts
│   └── TaskForm.test.tsx
└── vite.config.ts          # Configuración del compilador y Vitest
```

---

## 🧠 Decisiones Arquitectónicas Clave

| Decisión | Justificación Técnica |
| :--- | :--- |
| **CSS Puro con Variables Globales** | Permite alternar la colorimetría de la app de forma instantánea al conmutar la clase `.dark` en el `<html>` sin tener que escribir clases condicionales en el JSX ni cargar librerías de UI pesadas. |
| **Patrón BFF para Emailing** | Separa de forma segura el cliente del servidor. Las claves privadas de AWS nunca viajan al navegador del usuario; la llamada se hace a una API interna segura que maneja las credenciales encriptadas en Vercel. |
| **Actualizaciones Optimistas** | El hook `useTasks` actualiza la lista en pantalla antes de que Firestore confirme la escritura. Si la red falla, el bloque `catch` revierte el estado y recarga de forma transparente, eliminando la sensación de lentitud por latencia de red. |
| **Separación de Tipos** | Todos los tipos de TypeScript residen de forma pura en `src/types/task.ts`. No importan código de ejecución, evitando la colisión e importación circular durante el empaquetado. |

---

## ✉️ Flujo de Envío de Email de Resumen

El envío de correos sigue una arquitectura segura de backend desvinculado (BFF):

```text
[Cliente: Dashboard]
         │
         ▼ (Presiona "Enviar Resumen")
[React: EmailSummaryButton.tsx]
         │
         ▼ (Hace un POST asíncrono con fetch() a la ruta local)
[Vercel Serverless Function: /api/send-email]
         │
         ▼ (Toma secretamente las credenciales AWS del backend de Vercel)
[AWS SES: Simple Email Service]
         │
         ▼ (Envía el correo de forma encriptada)
[Bandeja de Entrada del Usuario]
```

> [!NOTE]
> Debido a que la cuenta de AWS opera en modo Sandbox, los correos remitente y destinatario deben estar validados en la consola de AWS SES para realizar las pruebas.

---

## 🔒 Reglas de Seguridad de Firestore

Nuestros datos están blindados en el servidor de Google utilizando reglas declarativas que asocian el acceso estrictamente al ID del usuario autenticado (`userId`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Deniega todo acceso no especificado por defecto
    }
    match /tasks/{taskId} {
      allow read, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId && request.resource.data.userId == resource.data.userId;
    }
  }
}
```

---

## 🧪 Pruebas Automáticas (Testing)

Contamos con una suite de pruebas automatizadas que certifica la calidad del código sin depender del estado de la nube ni de la conexión de red:

* **[emailSummary.test.ts] (Tests Unitarios de Funciones Clave):** Valida de forma matemática el generador de plantillas `buildSummary`, asegurando que calcule correctamente las cantidades de tareas pendientes y que estructure los textos de forma idéntica a lo requerido por AWS.
* **[TaskForm.test.tsx] (Tests de Componentes de React):** Utiliza React Testing Library para montar virtualmente el formulario, simular eventos reales de escritura mediante `fireEvent` y verificar que el componente se comunique de forma correcta con el despachador de Firestore usando funciones espía (`vi.fn()`) de Vitest.

---

## 🤖 Desarrollo Asistido por Inteligencia Artificial

La construcción del proyecto se realizó mediante un flujo de programación asistida utilizando Gemini como copiloto de desarrollo técnico.

### Roles del Copiloto e Ingeniero
* **Rol del Copiloto de IA (Asistencia y Depuración):** Propuesta de tipados de TypeScript libres de importaciones circulares, diagnóstico y traducción rápida de errores de Vite y Vercel (como el error de la barra diagonal en CSS o la importación de `addTask`), y maquetación de los bloques de expectativas en RTL.

### Patrones de Uso Descubiertos
* **Validación manual estricta:** Ninguna línea de código sugerida por la IA ingresó al proyecto sin que pudiera explicar exactamente qué hacía y por qué.

* **Consultas incrementales:** Se avanzó módulo por módulo (primero los tipos, luego Firestore, luego el hook, luego los estilos y finalmente el deploy), aislando y depurando cada sección por separado.
