# Changelog - DARIIFILMS

## [2.0] - 2026-05-30

### ✨ NUEVO
- **Portfolio dinámico**: Archivo `portfolio-data.js` con estructura JSON para fácil actualización de fotos
- **Formulario funcional**: Integración con Formspree para recibir consultas por email
- **Validación de formulario**: Required fields y validaciones básicas
- **Lazy loading**: Las imágenes se cargan bajo demanda para mejor performance
- **ESC key**: Cierre de lightbox al presionar ESC

### 🔧 MEJORADO
- **Código reutilizable**: Funciones `attachLightboxListeners()` y `attachMagneticEffect()` para dinámicas
- **WhatsApp configurable**: Placeholders claros para actualizar números de contacto
- **Reset de formulario**: Limpia datos después de envío exitoso
- **UX en submit**: Muestra "RECIBIDO" con ícono verde después de envío
- **Accesibilidad**: Campos del formulario con nombres (name attribute) para mejor compatibilidad

### 📦 ARCHIVOS NUEVOS
- `portfolio-data.js` - Datos dinámicos del portafolio
- `CONFIG.md` - Guía de configuración
- `CHANGELOG.md` - Este archivo

### 📝 CAMBIOS EN ARCHIVOS EXISTENTES

#### index.html
- Grid masonry ahora se rellena dinámicamente
- Formulario ahora es un `<form>` real con validación
- Campos de input con atributos `name` y `required`
- Números de WhatsApp son placeholders claros

#### script.js
- Nueva función `attachLightboxListeners()` reutilizable
- Nueva función `attachMagneticEffect()` reutilizable
- Nuevo manejador de submit para formulario con validación
- Integración con Formspree
- Cierre de lightbox con ESC key
- Focus sound en inputs del formulario

### 🚀 PRÓXIMAS MEJORAS (Opcional)
- [ ] WebP conversion automática de imágenes
- [ ] Srcset para responsive images
- [ ] Analytics (Google Analytics o Formspree tracking)
- [ ] Compresión automática de imágenes
- [ ] CDN para imágenes (Cloudinary, Imgix)
- [ ] Tests automatizados

### 🔐 CONFIGURACIÓN NECESARIA
1. **Formspree**: Actualizar `YOUR_FORM_ID` en script.js
2. **WhatsApp**: Actualizar `YOUR_WHATSAPP_NUMBER` en index.html (2 lugares)

### 📊 Performance
- Lazy loading reducirá carga inicial
- Imágenes se cargan bajo demanda
- Sin cambios en bundle size (mismas librerías)

### 🎯 Testing Checklist
- [ ] Agregar nueva foto a portfolio-data.js
- [ ] Verificar que aparece correctamente
- [ ] Enviar test de formulario
- [ ] Recibir email en Formspree
- [ ] Hacer click en WhatsApp badges
- [ ] Abrir lightbox y cerrar con ESC
- [ ] Verificar en mobile

---
Versión anterior: 1.0 (Estructura base)
