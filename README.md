# Atelier — tema Shopify de producto único

Tema Online Store 2.0 pensado para tiendas de un solo producto: la home
ES la página de producto. Estilo landing de conversión: barra de aviso,
insignia de "pocas unidades", valoración con estrellas, insignias pequeñas,
packs de precio tipo "compra 1 / compra 2 y llévate 1 gratis", aviso de
stock limitado, botón de compra grande, mensaje de autenticidad, iconos de
confianza, zoom en la foto, historia del producto, notas de producto,
testimonios, FAQ, página de contacto y pantalla de "próximamente" para
cuando la tienda está protegida con contraseña.

**Los archivos del tema están en la raíz del repositorio** (`layout/`,
`sections/`, `templates/`, `config/`, `assets/`, `snippets/`, `locales/`),
que es exactamente la estructura que exige la integración de Shopify con
GitHub.

## Conectar este repositorio con Shopify

1. En el admin de Shopify: **Tienda online → Temas → Añadir tema → Conectar desde GitHub**.
2. Autoriza la app de Shopify en GitHub y elige la cuenta
   `adriacarcereny0-debug` y el repositorio `shopify`.
3. Selecciona la rama que quieres conectar (por ejemplo `main`, o esta rama
   de trabajo si quieres probar antes de fusionar).
4. Shopify creará un tema no publicado enlazado a esa rama. Ábrelo con
   **Vista previa**, y cuando te convenza, **Publicar**.

Cómo funciona la sincronización una vez conectado:

- Cada `git push` a la rama conectada actualiza el tema en Shopify en unos segundos.
- Cada cambio que hagas en el **editor de temas** de Shopify (colores, textos,
  bloques) se devuelve al repositorio como un commit automático sobre
  `config/settings_data.json` y los `templates/*.json`.
- Por eso conviene hacer `git pull` antes de tocar código en local: Shopify
  puede haber commiteado cambios del editor.
- Una rama = un tema. Si quieres un entorno de pruebas, conecta una segunda
  rama a un segundo tema no publicado.

Si prefieres instalarlo sin GitHub: comprime el **contenido** de esta carpeta
(no la carpeta en sí) en un `.zip` y súbelo en **Temas → Añadir tema → Subir archivo zip**.

## Desarrollo en local (opcional)

```bash
npm install -g @shopify/cli
shopify theme dev --store tu-tienda.myshopify.com   # vista previa en caliente
shopify theme check                                  # linter del tema
shopify theme push --unpublished                     # subir sin publicar
```

`shopify theme check` pasa sin errores. Quedan avisos de `RemoteAsset` por
cargar las fuentes desde Google Fonts (ver "Notas técnicas").

## Cómo añadir tu producto

- Ve a **Tienda online → Temas → Personalizar**, abre la página "Inicio".
- En la sección "Producto", elige tu producto en el ajuste "Producto destacado".
- Los bloques de "Ficha" y "Mensajes de confianza" son editables ahí mismo.
- La página de producto real (`/products/tu-producto`) usa el mismo diseño
  automáticamente, sin necesidad de tocar nada más.

## Importante sobre los packs de precio (Compra 1 / Compra 2 y llévate 1 gratis)

Los precios de cada pack son texto editable, no un descuento automático.
Para que el importe que ves en pantalla coincida con lo que se cobra de
verdad, crea en **Shopify Admin → Descuentos** una promoción automática que
aplique ese mismo descuento a partir de esa cantidad (por ejemplo "2x1" o
"20% en pedidos de 3 unidades"). El tema añade al carrito la cantidad
indicada en cada pack; el descuento lo aplica Shopify.

## Qué puedes editar sin tocar código

- Colores, tipografía, ancho y redondeo: **Personalizar tema → Configuración del tema**.
- Logo global y nombre de marca: **Configuración del tema → Marca** (se usa
  también en la pantalla de "próximamente").
- Historia del producto, notas, testimonios y FAQ: cada sección tiene sus
  propios bloques editables.
- Cabecera (logo específico, barra de aviso, enlaces): sección "Cabecera".

## Qué incluye

| Carpeta | Contenido |
| --- | --- |
| `layout/` | `theme.liquid` (layout principal) y `password.liquid` (tienda protegida) |
| `templates/` | home, producto, colección, carrito, blog, artículo, búsqueda, páginas, 404, tarjeta regalo |
| `templates/customers/` | login, registro, cuenta, pedido, direcciones, restablecer y activar contraseña |
| `sections/` | cabecera, pie, producto, historia, notas, testimonios, FAQ, contacto, carrito, contenido simple |
| `snippets/` | iconos, precio, buscador |
| `assets/` | `theme.css` y `theme.js` |
| `locales/` | `en.default.json` (los textos visibles están escritos en español en las plantillas) |

## Notas técnicas

- Fuentes: Sora / Fraunces (titulares), Manrope / Public Sans (texto) e
  IBM Plex Mono (etiquetas), cargadas desde Google Fonts. Todas las opciones
  del selector de tipografía están precargadas. Para máximo rendimiento
  puedes auto-alojarlas como assets del tema más adelante (eso también
  eliminaría los avisos `RemoteAsset` de Theme Check).
- El carrito usa `/cart/add.js` y `/cart/change.js` (AJAX), sin recargar la
  página al añadir productos. Las rutas se pasan a JavaScript desde Liquid
  vía `window.themeRoutes`, así que el tema funciona también en tiendas con
  prefijo de idioma o mercado.
- Textos en español, escritos directamente en las plantillas. Si más adelante
  quieres varios idiomas, se puede migrar a `locales/*.json`.
