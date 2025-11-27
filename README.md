# 💬 AI Chat

Una aplicación de chat moderna e interactiva construida con React, TypeScript y la API de Google Gemini. Interfaz tipo ChatGPT/Gemini con soporte completo para Markdown, historial de conversación a corto plazo y diseño responsive.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20.19.0 o superior (recomendado 22.12.0+)
- npm o yarn
- Una API Key de Google Gemini ([Obtener aquí](https://aistudio.google.com/apikey))

### Instalación

1. **Clona el repositorio o navega al directorio del proyecto**

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` y agrega tu API Key:

```env
VITE_GEMINI_API_KEY=tu_clave_api_real_aqui
VITE_GEMINI_MODEL=gemini-1.5-flash
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Construir para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

### Vista previa de producción

```bash
npm run preview
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `VITE_GEMINI_API_KEY` | Tu API Key de Google Gemini | ✅ Sí | - |
| `VITE_GEMINI_MODEL` | Modelo de Gemini a usar | ❌ No | `gemini-pro` |

### Modelos Disponibles

- `gemini-pro` - Modelo estándar, balanceado
- `gemini-1.5-pro` - Modelo más potente, mejor para tareas complejas
- `gemini-1.5-flash` - Modelo rápido y eficiente (recomendado)
- `gemini-2.0-flash-exp` - Versión experimental

## 🛠️ Tecnologías

- **React 19.2.0** - Biblioteca UI
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.2.4** - Build tool y dev server
- **Tailwind CSS 4.1.17** - Framework CSS utility-first
- **@google/generative-ai** - SDK oficial de Google Gemini
- **react-markdown** - Renderizado de Markdown
- **remark-gfm** - Soporte para GitHub Flavored Markdown
- **@heroicons/react** - Iconos SVG

## 🎯 Uso

1. **Inicia la aplicación** con `npm run dev`
2. **Abre tu navegador** en `http://localhost:5173`
3. **Escribe tu mensaje** en el campo de entrada
4. **Presiona Enter** o haz clic en el botón de enviar
5. **Disfruta de la conversación** con respuestas renderizadas en Markdown

### Características de la Interfaz

- **Pantalla de bienvenida** cuando no hay mensajes
- **Indicador de escritura** mientras el modelo procesa
- **Scroll automático** a los nuevos mensajes
- **Timestamps** en cada mensaje
- **Soporte para código** con resaltado de sintaxis
- **Listas, tablas y enlaces** renderizados correctamente

## 🐛 Solución de Problemas

### Error: "API Key no configurada"

Asegúrate de que:
- El archivo `.env` existe en la raíz del proyecto
- La variable `VITE_GEMINI_API_KEY` está correctamente definida
- Has reiniciado el servidor de desarrollo después de crear/modificar `.env`

### Error: "Modelo no encontrado"

Verifica que el modelo especificado en `VITE_GEMINI_MODEL` esté disponible. Prueba con `gemini-pro` o `gemini-1.5-flash`.

### El historial no se mantiene

El historial se mantiene durante la sesión actual. Al recargar la página, se reinicia. Para persistencia, considera agregar almacenamiento local (localStorage).

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🙏 Agradecimientos

Mirai