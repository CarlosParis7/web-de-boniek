# DARIIFILMS - Guía de Configuración

## 🖼️ Cambiar Fotos del Portafolio

Las fotos se cargan dinámicamente desde `portfolio-data.js`. Para añadir o cambiar fotos:

### Editar `portfolio-data.js`

```javascript
const portfolioData = [
    {
        id: 1,
        title_es: "Editorial Noir",        // Título en español
        title_en: "Editorial Noir",        // Título en inglés
        location_es: "París / Moda",       // Ubicación en español
        location_en: "Paris / Fashion",    // Ubicación en inglés
        image: "https://...",              // URL de la imagen
        size: "vertical",                  // Tamaño: "vertical", "horizontal", "large"
        hidden: false                      // true = oculto inicialmente (ver con botón "Ver Más")
    }
    // ... más items
];
```

### Tamaños disponibles:
- **vertical**: 3/4 aspect ratio (columna de 4 unidades)
- **horizontal**: 16/9 aspect ratio (columna de 6 unidades)
- **large**: 4/3 aspect ratio (columna de 8 unidades)

### Márgenes (opcional):
Editar `marginClasses` para agregar espacios entre items.

## 📧 Configurar Formulario de Email

El formulario usa **Formspree** (servicio gratuito, sin backend necesario).

### Pasos:

1. **Crear cuenta en Formspree:**
   - Ir a https://formspree.io
   - Sign up y crear una cuenta

2. **Crear nuevo formulario:**
   - En dashboard, crear "New Form"
   - Dar nombre (ej: "DARIIFILMS Booking")
   - Copiar el Form ID (ejemplo: `myzdbqan`)

3. **Actualizar script.js:**
   En `script.js`, línea ~460, cambiar:
   ```javascript
   // Reemplazar YOUR_FORM_ID con tu ID de Formspree
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

4. **Prueba:**
   - Enviar un formulario en el sitio
   - Verificar email de confirmación en Formspree

## 📱 Actualizar Números de WhatsApp

Hay **2 lugares** donde cambiar:

### 1. Footer (línea ~335)
```html
<a href="https://wa.me/YOUR_WHATSAPP_NUMBER">
```

### 2. Floating Badge (línea ~345)
```html
<a href="https://wa.me/YOUR_WHATSAPP_NUMBER">
```

**Formato del número:**
- Incluir código de país sin `+`
- Ejemplo: `34600000000` (España), `5491100000000` (Argentina)
- Formato: `https://wa.me/CODIGOPAIS + NUMERO`

## 🎨 Optimización de Imágenes (Bonus)

Las imágenes cargan con:
- ✅ **Lazy loading** automático (`loading="lazy"`)
- ✅ **Lightbox** al hacer click
- ✅ **Responsive** con srcset (puedes agregar)

### Para mejorar performance, usa:
```html
<img 
    src="image.webp" 
    srcset="image-mobile.webp 640w, image-desktop.webp 1200w"
    loading="lazy"
    alt="Descripción"
>
```

## 🌐 Hosting & Deploy

Este sitio está optimizado para:
- **Netlify** (gratis, con HTTPS)
- **Vercel** (gratis, con HTTPS)
- **GitHub Pages** (gratis, estático)

### Para Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📝 Cambios Recientes

✅ Portfolio dinámico
✅ Formulario funcional con validación
✅ Lazy loading en imágenes
✅ Cierre de lightbox con ESC
✅ WhatsApp configurable
✅ Código limpio y reutilizable

---

**¿Preguntas?** Revisar `script.js` y `portfolio-data.js` para más detalles.
