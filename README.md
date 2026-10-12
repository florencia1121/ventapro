# VentaPro

Demo de punto de venta y administración comercial creada por **FC Dev**.

## Demo en línea

[Abrir VentaPro](https://ventapro-fcdev.vercel.app)

## Ejecutar en local

Requisitos: Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Vite mostrará la URL local en la terminal, habitualmente `http://localhost:5173`.

## Compilar para producción

```bash
npm run build
npm run preview
```

El sitio generado queda en `dist/` y se puede publicar en Vercel. El proyecto incluye `vercel.json` para configurar el build y la navegación de una sola página.

## Incluye

- Caja con búsqueda, categorías, carrito, descuentos, cobro y comprobante imprimible.
- Catálogo de productos, edición, fotografías y control de stock.
- Registro y detalle de ventas, clientes e informes con exportación CSV.
- Persistencia local en el navegador y datos ficticios para explorar la demo.

> **Importante:** esta versión es exclusivamente demostrativa. Los datos viven en `localStorage`, no se sincronizan entre dispositivos y no son almacenamiento seguro para ventas reales. Las imágenes de ejemplo requieren conexión a Internet.
