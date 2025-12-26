# 💰 Spendary - Gestión Inteligente de Gastos

<div align="center">
  <img src="public/Logo Spendary.png" alt="Spendary Logo" width="200"/>
  
  ### Tu aliado para el control financiero personal
  
  ![React](https://img.shields.io/badge/React-18.3-blue)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
  ![Vite](https://img.shields.io/badge/Vite-Latest-purple)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)
</div>

---

## 📖 Descripción

**Spendary** es una aplicación web moderna y elegante diseñada para ayudarte a gestionar tus gastos personales de manera intuitiva y visual. Organiza tus gastos por categorías, visualiza tendencias, compara períodos y mantén el control total de tus finanzas.

## ✨ Características Principales

- 📊 **Dashboard Interactivo**: Visualiza tus gastos del mes actual con gráficos y estadísticas
- 💳 **Categorías Organizadas**: Gestiona gastos en tres categorías principales:
  - 💳 Tarjetas de crédito/débito
  - 🔧 Servicios (Netflix, Spotify, etc.)
  - 🍔 Comida y alimentación
- 📅 **Historial Completo**: Consulta todos tus gastos con filtros avanzados
- 📈 **Comparación de Períodos**: Compara gastos entre diferentes meses
- 🎨 **Interfaz Moderna**: Diseño limpio con soporte para tema claro y oscuro
- 📱 **Responsive Design**: Funciona perfectamente en móvil, tablet y desktop
- ⚡ **Rendimiento Optimizado**: Carga rápida y experiencia fluida
- 🔐 **Autenticación Segura**: Sistema de login con Supabase (próximamente)

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con tecnologías modernas de desarrollo web:

- **[React 18](https://react.dev/)** - Biblioteca para construir interfaces de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript con tipado estático
- **[Vite](https://vitejs.dev/)** - Build tool ultrarrápido
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI reutilizables y accesibles
- **[Radix UI](https://www.radix-ui.com/)** - Primitivas UI sin estilos
- **[Framer Motion](https://www.framer.com/motion/)** - Animaciones fluidas
- **[React Router](https://reactrouter.com/)** - Navegación entre páginas
- **[TanStack Query](https://tanstack.com/query/)** - Gestión de estado asíncrono
- **[date-fns](https://date-fns.org/)** - Utilidades para manejo de fechas
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[Supabase](https://supabase.com/)** - Backend as a Service (Base de datos y autenticación)

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18 o superior) - [Instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** o **yarn** o **bun**

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <URL_DEL_REPOSITORIO>
cd Spendary
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
bun install
```

3. **Configurar variables de entorno** (Opcional - Para Supabase)
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env y agregar tus credenciales de Supabase
# VITE_SUPABASE_URL=tu_url_de_supabase
# VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🗄️ Configuración de Supabase

Para conectar la aplicación con Supabase y tener persistencia de datos:

1. Lee la guía completa en [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. Ejecuta el script SQL en tu proyecto de Supabase ([supabase-schema.sql](supabase-schema.sql))
3. Configura las variables de entorno en `.env`

## 📁 Estructura del Proyecto

```
Spendary/
├── public/              # Archivos estáticos
│   ├── Logo Spendary.png
│   └── robots.txt
├── src/
│   ├── components/      # Componentes React
│   │   ├── dashboard/   # Componentes del dashboard
│   │   ├── expenses/    # Componentes de gastos
│   │   ├── layout/      # Layout y navegación
│   │   └── ui/          # Componentes UI (shadcn)
│   ├── context/         # Context API (Estado global)
│   │   ├── AuthContext.tsx
│   │   └── ExpenseContext.tsx
│   ├── lib/             # Utilidades y configuración
│   │   ├── supabase.ts
│   │   ├── supabaseService.ts
│   │   └── utils.ts
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── AddExpense.tsx
│   │   ├── History.tsx
│   │   ├── Compare.tsx
│   │   └── AuthPage.tsx
│   ├── types/           # Tipos TypeScript
│   │   └── expense.ts
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Punto de entrada
├── supabase-schema.sql  # Schema de la base de datos
├── SUPABASE_SETUP.md    # Guía de configuración
└── package.json
```

## 🎯 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Compilar en modo desarrollo
npm run build:dev

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 🎨 Características de UI/UX

- **Tema Oscuro/Claro**: Alterna entre modos con un solo clic
- **Animaciones Suaves**: Transiciones y animaciones con Framer Motion
- **Diseño Responsive**: Adaptado para todos los dispositivos
- **Tarjetas Interactivas**: Visualización atractiva de datos
- **Gráficos Visuales**: Representación gráfica de gastos
- **Navegación Intuitiva**: Menú claro y fácil de usar

## 📊 Funcionalidades por Página

### 🏠 Dashboard
- Resumen mensual de gastos totales
- Comparación con el mes anterior
- Desglose por categorías
- Últimos 5 gastos registrados
- Gráfico de distribución por categorías

### ➕ Agregar Gasto
- Formulario simple e intuitivo
- Selección de categoría con iconos
- Selector de fecha
- Campo de descripción
- Validación de campos

### 📜 Historial
- Lista completa de todos los gastos
- Filtros por fecha y categoría
- Búsqueda por descripción
- Opciones de editar y eliminar
- Paginación de resultados

### 📈 Comparar
- Selecciona dos períodos diferentes
- Visualización lado a lado
- Gráficos comparativos
- Análisis de diferencias
- Identificación de tendencias

## 🔐 Seguridad

- Autenticación con Supabase
- Row Level Security (RLS) en base de datos
- Variables de entorno para credenciales sensibles
- Validación de datos en cliente y servidor

## 🚀 Deploy

### Opción 1: Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Opción 2: Netlify
```bash
# Build del proyecto
npm run build

# Subir la carpeta dist/ a Netlify
```

### Opción 3: GitHub Pages
- Configura GitHub Pages en la configuración del repositorio
- El build se generará automáticamente con GitHub Actions

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si deseas contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**Santiago**
- Proyecto personal de gestión de finanzas

## 🙏 Agradecimientos

- shadcn/ui por los componentes UI
- Lucide por los iconos
- Supabase por el backend
- La comunidad de React por las herramientas increíbles

---

<div align="center">
  Hecho con ❤️ por Santiago
  
  ⭐ Si te gusta el proyecto, no olvides darle una estrella
</div>
