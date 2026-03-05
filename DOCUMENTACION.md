# Documentación Técnica - PF Mortadela Web ARM

Sistema de gestión de producción para línea de mortadela desarrollado con **Next.js 14+**, **TypeScript** y **TailwindCSS**.

---

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Contextos de la Aplicación](#contextos-de-la-aplicación)
3. [Sistema de Autenticación](#sistema-de-autenticación)
4. [Roles, Accesos y Permisos](#roles-accesos-y-permisos)
5. [Comunicación con APIs](#comunicación-con-apis)
6. [WebSocket - Datos en Tiempo Real](#websocket---datos-en-tiempo-real)
7. [Sistema de Configuraciones](#sistema-de-configuraciones)
8. [Internacionalización (i18n)](#internacionalización-i18n)
9. [Flujo de Navegación](#flujo-de-navegación)
10. [Estructura de Datos](#estructura-de-datos)

---

## Arquitectura General

### Estructura de Carpetas

```
├── app/                      # Rutas y páginas (App Router de Next.js)
│   ├── (Maquinaria)/        # Grupo de rutas para Armado/Desarmado
│   ├── api/                 # Funciones de fetch con autenticación
│   ├── bootstrap/           # Configuración inicial (crear superadmin)
│   ├── config_equipos/      # Configuración de equipos
│   ├── config_user/         # Gestión de usuarios
│   └── login/               # Autenticación
├── components/              # Componentes reutilizables
├── context/                 # Proveedores de contexto React
├── hooks/                   # Custom hooks
├── lib/                     # Utilidades y tipos base
├── locales/                 # Traducciones (español/inglés)
├── mocks/                   # Datos mock para desarrollo
├── services/                # Servicios de API
├── types/                   # Definiciones TypeScript
└── utils/                   # Utilidades y validaciones
```

### Jerarquía de Providers

```tsx
<ThemeProvider>
  <AuthProvider>
    <AppProvider>
      <LayoutClient>
        {children}
      </LayoutClient>
    </AppProvider>
  </AuthProvider>
</ThemeProvider>
```

---

## Contextos de la Aplicación

### 1. AppContext (`context/AppContext.tsx`)

Gestiona la dirección del servidor target (IP:Puerto del PLC/backend de producción).

```typescript
interface AppContextType {
  targetAddress: string | null;    // Ej: "192.168.1.100:8080"
  setTargetAddress: (address: string | null) => void;
}
```

**Funcionalidad:**
- Almacena `targetAddress` en `localStorage` para persistencia
- Se usa para construir URLs de API de configuraciones y WebSocket
- Todas las llamadas a la API de producción dependen de este valor

**Uso:**
```typescript
const { targetAddress, setTargetAddress } = useApp();
```

---

### 2. AuthContext (`context/AuthProvider.tsx`)

Maneja la autenticación, sesión de usuario y protección de rutas.

```typescript
interface AuthContextType {
  user: UserSession | null;        // Datos completos del usuario
  email: string | null;
  username: string | null;
  nombre: string | null;
  apellido: string | null;
  rol: string | null;              // "superadmin" | "admin" | "user"
  habilitado: boolean | null;      // Usuario activo/inactivo
  reporte: boolean | null;         // Recibe reportes por email
  loading: boolean;                // Estado de carga de sesión
  login: (username, password) => Promise<ApiResponse>;
  register: (data) => Promise<ApiResponse>;  // Deshabilitado actualmente
  logout: () => Promise<boolean>;
}
```

**Flujo de Verificación de Sesión (`checkSession`):**

1. Verifica si el sistema necesita setup inicial (`/needs-setup`)
2. Si necesita setup → redirige a `/bootstrap`
3. Lee token de `localStorage` (`access_token`)
4. Intenta hidratar usuario desde `localStorage`
5. Decodifica JWT para obtener datos básicos
6. Valida sesión con el backend (`/check`)
7. Actualiza estado del usuario

**Almacenamiento de Token:**
- `localStorage.access_token`: Token JWT
- `localStorage.user`: Objeto JSON con datos del usuario
- `Cookies.access_token`: Cookie para requests

**Rutas Públicas (sin autenticación):**
- `/login`
- `/register`
- `/bootstrap`
- `/login/recuperacion`
- `/login/recuperacion/reset_pass`

---

## Sistema de Autenticación

### Endpoints de Autenticación

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/needs-setup` | GET | Verifica si hay usuarios en BD |
| `/create-superadmin` | POST | Crea primer superadmin |
| `/login` | POST | Autenticación de usuario |
| `/logout` | POST | Cierra sesión |
| `/check` | GET | Valida sesión activa |

### Función `authFetch` (`app/api/api.ts`)

Wrapper de `fetch()` que:
- Añade header `Authorization: Bearer {token}` automáticamente
- Configura `Content-Type: application/json`
- Incluye `credentials: "include"` para cookies

```typescript
const response = await authFetch(`${process.env.NEXT_PUBLIC_API_AUTH_URL}/usuarios`);
```

### Verificación de Token (`lib/auth.ts`)

```typescript
verifyToken(token): payload | null
```
- Decodifica JWT sin validación criptográfica
- Verifica expiración (`exp`)
- Retorna payload o null si inválido/expirado

---

## Roles, Accesos y Permisos

### Tipos de Rol

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `superadmin` | Administrador principal | Acceso total, gestión de admins |
| `admin` | Administrador | Gestión de usuarios normales |
| `user` | Usuario operador | Solo visualización y operación básica |

### Estructura de Usuario

```typescript
interface User {
  id: number;
  email: string;
  username: string;           // Único, usado para login
  nombre: string;
  apellido: string;
  rol: "superadmin" | "admin" | "user";
  habilitado: boolean;        // 1 = activo, 0 = inactivo
  reporte: boolean;           // Recibe reportes automáticos
}
```

### Acciones por Rol

**Superadmin:**
- Crear usuarios de cualquier rol
- Editar/eliminar cualquier usuario
- Habilitar/deshabilitar usuarios
- Acceso a configuración de equipos

**Admin:**
- Crear usuarios con rol `user`
- Editar usuarios de su creación
- Acceso a configuraciones

**User:**
- Solo visualización
- Operación de maquinaria
- Sin acceso a configuración de usuarios

### Gestión de Usuarios (`config_user/page.tsx`)

Funciones disponibles:
- `refetchUsuarios()`: Recarga lista de usuarios
- `deshabilitarUsuario(username)`: Desactiva usuario
- `habilitarUsuario(username)`: Reactiva usuario
- `eliminarUsuario(username)`: Elimina permanentemente
- `editarUsuario(id, username)`: Abre modal de edición

---

## Comunicación con APIs

### Variables de Entorno

```env
NEXT_PUBLIC_API_AUTH_URL=      # URL del backend de autenticación
NEXT_PUBLIC_CAMARAS_URL=       # URL para sistema de cámaras externo
```

### APIs de Autenticación

Base URL: `process.env.NEXT_PUBLIC_API_AUTH_URL`

| Endpoint | Método | Body | Descripción |
|----------|--------|------|-------------|
| `/usuarios` | GET | - | Lista todos los usuarios |
| `/crear_usuario` | POST | User object | Crea nuevo usuario |
| `/eliminar_usuario` | DELETE | `{username}` | Elimina usuario |
| `/habilitar_usuario` | POST | `{username}` | Activa usuario |
| `/deshabilitar_usuario` | POST | `{username}` | Desactiva usuario |

### APIs de Configuraciones

Base URL: `http://{targetAddress}`

| Endpoint | Método | Params/Body | Descripción |
|----------|--------|-------------|-------------|
| `/configuraciones/lista-recetas` | GET | - | Lista de recetas disponibles |
| `/configuraciones/datos-recetas` | GET | `?id_receta=X` | Datos de una receta |
| `/configuraciones/lista-torres` | GET | `?id_receta=X` | Torres de una receta |
| `/configuraciones/niveles-torre` | GET | `?id_torre=X` | Niveles de una torre |
| `/configuraciones/tomar-datos-torre` | POST | TorreData | Envía configuración de torre |
| `/configuraciones/tomar-datos-niveles` | POST | NivelData | Envía correcciones de niveles |
| `/configuraciones/reset-datos-niveles` | POST | ResetFallasData | Resetea fallas |

### Servicio de Configuraciones (`services/configuracionesApi.ts`)

```typescript
// Soporta modo MOCK para desarrollo
export const configuracionesApi = MOCK_MODE 
  ? mockConfiguracionesApi 
  : realConfiguracionesApi;
```

**Métodos disponibles:**
- `obtenerListaRecetas()`
- `obtenerDatosRecetas(idReceta)`
- `obtenerListaTorres(idReceta)`
- `obtenerNivelesTorre(idTorre)`
- `enviarDatosTorre(datos, reintentos?)`
- `enviarDatosNiveles(datos)`
- `resetearFallasNivel(datos)`

---

## WebSocket - Datos en Tiempo Real

### Hook `useWebSocket` (`utils/useWebSocket.tsx`)

Conexión WebSocket para recibir datos de producción en tiempo real.

```typescript
const { data, isConnected, error, reconnect } = useWebSocket(pollId);
```

**URL de Conexión:**
```
ws://{targetAddress}/ws/{pollId}
```

### Estructura de Datos WebSocket

```typescript
interface WebSocketResponse {
  machineStatus: MachineStatus;   // Estado de la máquina
  processData: ProcessData;        // Datos del proceso
  technicalData: TechnicalData;    // Datos técnicos
  alarms: Alarm[];                 // Alarmas activas
  extraData: any[];                // Datos adicionales
}
```

**Formato de mensaje recibido:**
```json
[MachineStatus, ProcessData, TechnicalData, Alarms[], ExtraData[]]
```

### Reconexión Automática

- Reintento automático cada 3 segundos si se pierde conexión
- Manejo de errores con estado `error`
- Función `reconnect()` para forzar reconexión manual

---

## Sistema de Configuraciones

### Tipos de Correcciones

| Tipo | ID | Descripción |
|------|-----|-------------|
| HN | 1 | Altura de niveles |
| ChG | 2 | Corrección de guardado |
| ChB | - | Corrección de bajada |
| FA | 3 | Reset de fallas |
| uHN | - | Micro-altura de niveles |

### Estructura de Datos de Torre

```typescript
interface TorreData {
  id: string;
  hBastidor?: number | null;      // Altura de bastidor
  hAjuste?: number | null;        // Altura de ajuste
  hAjusteN1?: number | null;      // Ajuste nivel 1
  DisteNivel?: number | null;     // Distancia entre niveles
  ActualizarTAG?: string;         // Tag de actualización
  id_recetario: number;           // ID de receta asociada
}
```

### Estructura de Datos de Nivel

```typescript
interface NivelData {
  id: string;
  tipo: string;                   // "1" = Altura, "2" = Guardado, "3" = Fallas
  Correccion1?: number | null;
  Correccion2?: number | null;
  // ... hasta Correccion10
}
```

### Hook `useConfiguracionData`

Custom hook que centraliza toda la lógica de configuraciones:
- Carga de recetas, torres y niveles
- Estado de formularios
- Validaciones
- Envío de datos al backend

---

## Internacionalización (i18n)

### Configuración (`i18n.ts`)

```typescript
i18n.init({
  resources: { es: spanish, en: english },
  lng: "es",                    // Idioma por defecto
  fallbackLng: "es",
  ns: ["locales"],
});
```

### Archivos de Traducción

- `locales/spanish.json`
- `locales/english.json`

### Estructura de Traducciones

```json
{
  "mayus": {
    "general": "GENERAL",
    "armado": "ARMADO",
    "crearUsuario": "CREAR USUARIO"
  },
  "min": {
    "usuario": "Usuario",
    "contra": "Contraseña",
    "acceder": "Acceder"
  }
}
```

### Uso en Componentes

```typescript
const { t } = useTranslation();
// ...
<label>{t("min.usuario")}</label>
```

### Persistencia de Idioma

- Guardado en `localStorage.selectedLanguage`
- Respaldo en `Cookies.selectedLanguage`
- Se carga automáticamente al iniciar la app

---

## Flujo de Navegación

### Rutas Principales

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Home | Vista general |
| `/login` | Login | Autenticación |
| `/bootstrap` | BootstrapPage | Setup inicial |
| `/armado` | Armado | Proceso de armado |
| `/desarmado` | Desarmado | Proceso de desarmado |
| `/config_user` | ConfiguracionUsuario | Gestión de usuarios |
| `/config_equipos` | ConfigEquipos | Configuración de equipos |

### Flujo de Inicio

```
┌─────────────────┐
│  App Inicia     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     Si
│ ¿Needs Setup?   │────────► /bootstrap (Crear Superadmin)
└────────┬────────┘
         │ No
         ▼
┌─────────────────┐     No
│ ¿Hay Token?     │────────► /login
└────────┬────────┘
         │ Si
         ▼
┌─────────────────┐     No
│ ¿Token Válido?  │────────► /login
└────────┬────────┘
         │ Si
         ▼
┌─────────────────┐
│    / (Home)     │
└─────────────────┘
```

### Protección de Rutas

El `AuthProvider` verifica automáticamente:
1. Si el usuario está autenticado
2. Si está en una ruta pública
3. Redirige según corresponda

---

## Estructura de Datos

### Datos de Receta

```typescript
interface DatoReceta {
  id: number;
  texto: string;           // Label descriptivo
  dato: string | null;     // Valor actual
  icono: StaticImageData | ReactNode;  // Icono asociado
}
```

### Datos de Corrección

```typescript
interface DatoCorreccion {
  id: number;
  texto: string;           // Nombre del campo
  dato: string | null;     // Valor de corrección
}
```

### Respuesta de Recetas

```typescript
interface RecetaResponse {
  DatosRecetas: Array<{
    nroGripper?: number;
    tipoMolde?: string;
    anchoProducto?: number;
    altoProducto?: number;
    largoProducto?: number;
    pesoProducto?: number;
    moldesNivel?: number;
    productosMolde?: number;
    altoMolde?: number;
    largoMolde?: number;
    ajusteAltura?: number;
    cantidadNiveles?: number;
    deltaNiveles?: number;
    n1Altura?: number;
    bastidorAltura?: number;
    ajusteN1Altura?: number;
  }>;
}
```

### Respuesta de Niveles de Torre

```typescript
interface NivelesTorreResponse {
  DatosTorre?: {
    hBastidor?: number;
    hAjuste?: number;
    hAjusteN1?: number;
    DisteNivel?: number;
    ActualizarTAG?: string;
  };
  DatosNivelesHN?: number[];    // Array de 10 valores
  DatosNivelesChG?: number[];
  DatosNivelesChB?: number[];
  DatosNivelesFallas?: number[];
  DatosNivelesuHN?: number[];
}
```

---

## Mock Mode

Para desarrollo sin conexión al backend real:

```typescript
// services/mockConfiguracionesApi.ts
export const MOCK_MODE = true;  // Cambiar a false para producción
```

Los mocks cargan datos desde `mocks/configuraciones/`:
- `lista-recetas.json`
- `datos-recetas.json`
- `lista-torres.json`
- `niveles-torre.json`

---

## Temas y Estilos

### ThemeProvider

Soporte para tema claro/oscuro usando `next-themes`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
```

### Variables CSS Principales

- `--background`: Color de fondo principal
- `--background2`: Fondo secundario
- `--background3`: Fondo terciario
- `--texto`: Color de texto principal
- `--texto-header`: Color de texto del header

---

## Notas Importantes

1. **Target Address**: Siempre verificar que `targetAddress` esté configurado antes de hacer llamadas a la API de producción.

2. **Tokens JWT**: Se decodifican en cliente sin verificación criptográfica. La validación real ocurre en el backend.

3. **WebSocket**: Requiere que el servidor de producción soporte conexiones WebSocket en la ruta `/ws/{pollId}`.

4. **Roles**: El sistema no permite crear usuarios con rol `superadmin` desde la UI (solo desde bootstrap).

5. **Persistencia**: Los datos críticos se guardan en `localStorage` para mantener sesión entre recargas.
