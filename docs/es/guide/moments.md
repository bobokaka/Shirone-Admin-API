---
title: Momentos
description: Publica y gestiona momentos — estado de ánimo, lugar, etiquetas, subida de hasta nueve imágenes archivadas automáticamente por lotes, además de pulido por IA y sugerencias de etiquetas.
---

# Momentos

Los «momentos» son un formato más ligero que los artículos: un pensamiento, unas imágenes, un icono de estado de ánimo. El compositor está arriba de la página y el flujo de momentos debajo; escribes y publicas al instante.

![Momentos](/assets/guide/moments.png)

## Publicar un momento

La tarjeta del compositor, de arriba abajo:

1. **Texto** — caja multilínea con lo que piensas ahora mismo
2. **Zona de imágenes** — hasta **9 imágenes**; pulsa + para elegirlas o pégalas directamente
3. **Fila de metadatos** — estado de ánimo / lugar / etiquetas / fecha de publicación / fijado
4. **Fila de acciones** — Pulir con IA (con IA activada) / Guardar borrador / Publicar momento

### Iconos de estado de ánimo

Nueve estados de ánimo predefinidos: 😊 feliz, 🤩 emocionado, 😐 tranquilo, 😔 apagado, 😢 triste, ❤️ me gusta, 🎉 celebración, ☕ cafecito, 🌙 buenas noches. Los iconos se guardan por nombre Iconify (todos incluidos localmente, sin peticiones de red) y la interfaz del blog los renderiza como el icono correspondiente.

### Cómo se archivan las imágenes

Todas las imágenes de una misma publicación entran en **el mismo directorio de lote**:

```
public/images/moments/<yyyymmdd-HHmmss>/   # el número de lote coincide con el nombre del archivo del momento
├── 1.webp
└── 2.webp
```

Aunque se suban varias en paralelo, van al mismo lote (el número de lote se genera por adelantado). Esta regla de directorios no es arbitraria — el pipeline de generación de miniaturas del tema **escanea únicamente** `public/images/moments/`; si las imágenes del momento se colocan en otro sitio, la interfaz del blog no puede generar miniaturas, así que el backend impone esta ubicación en disco.

> [!TIP]
> Quitar una imagen antes de publicar solo la excluye de esa publicación; el archivo sigue en el repositorio. Al eliminar un momento completo, sus imágenes también se conservan; límpialas a mano si lo necesitas.

### Asistencia de IA (opcional)

Con la IA activada, el compositor añade dos accesos:

- **Pulir con IA** — reescribe el texto en streaming y el resultado «crece» directamente en la caja de entrada (natural y coloquial, conservando tono y hechos); puede detenerse en cualquier momento y al detenerse se recupera el texto original
- **Sugerencias de IA** — extrae 2–4 etiquetas del texto (fusionadas y sin duplicados con las existentes) y deduce el estado de ánimo (sin sobrescribir una elección ya hecha)

## Gestionar el flujo de momentos

La lista inferior admite filtros combinables y paginación (8 por página):

| Filtro | Nota |
|------|------|
| Caja de búsqueda | Coincide con texto, lugar y etiquetas |
| Desplegable de estado | Todos / Publicados / Borradores |
| Selección múltiple de etiquetas | Pulsar una etiqueta en una tarjeta también filtra rápido (pulsar de nuevo la cancela) |
| Solo fijados | Casilla de verificación |

Cada tarjeta de momento ofrece:

- **Editar** — el contenido vuelve al compositor de arriba (las imágenes recién subidas entran en un **lote nuevo**, sin mezclarse con el directorio antiguo); tras editar, pulsa «Publicar momento» para guardar
- **Alternar fijado** — fija o desfija con un clic y la lista se refresca al instante
- **Eliminar** — tras doble confirmación elimina el archivo `.md` (las imágenes se conservan)

## Diferencias entre momentos y artículos

| | Artículos | Momentos |
|---|------|------|
| Formato de contenido | Texto largo + sistema de metadatos | Texto corto + imágenes + estado de ánimo |
| Almacenamiento | `content/posts/<slug>/index.md` | `content/moments/<yyyymmdd-HHmmss>.md` |
| Uso típico | Tutoriales, notas, reflexión profunda | Actualidades, pensamientos sueltos, notas al vuelo |

## Próximos pasos

- Usa los [Datos estructurados](./data.md) para mostrar tus dispositivos, animes y enlaces de amigos
- Con el contenido escrito, pasa a [Commit y publicación](./publish.md)
