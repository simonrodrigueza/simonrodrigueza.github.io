# simonrodrigueza.github.io

Página personal de Simón Rodríguez Arango, hecha con [Astro](https://astro.build) y publicada en GitHub Pages.

---

## 1. Instalar lo necesario (una sola vez)

1. **Git**: https://git-scm.com/download/win (deja las opciones por defecto).
2. **Node.js 22 o más nuevo (versión LTS)**: https://nodejs.org
3. Recomendado: **Visual Studio Code** para editar los archivos: https://code.visualstudio.com

Para comprobar que quedaron instalados, abre una terminal (PowerShell) y escribe:

```
git --version
node --version
```

## 2. Ver la página en tu computador

Abre una terminal **dentro de esta carpeta** (en VS Code: menú *Terminal → New Terminal*) y ejecuta:

```
npm install      # solo la primera vez: descarga Astro
npm run dev      # inicia la página en modo edición
```

Abre http://localhost:4321 en el navegador. Cada vez que guardes un archivo, la página se actualiza sola.
Para detenerla, presiona `Ctrl + C` en la terminal.

## 3. Dónde se edita cada cosa

| Qué quieres cambiar | Archivo |
|---|---|
| Texto de cada sección (inglés) | `src/content/en/*.md` |
| Texto de cada sección (español) | `src/content/es/*.md` |
| Correo, ORCID, ADS, GitHub | `src/data/site.ts` |
| Frase de presentación arriba del detector | `src/data/site.ts` → `intro` |
| Etapas de la animación, mapas de color y frases bajo el detector | `src/data/visuals.ts` |
| Estilos generales (colores, tamaños) | `src/styles/global.css` |

### Cómo está hecho un archivo de sección

```markdown
---
id: research                 # no lo cambies: conecta la sección con su mapa de color
label: Research              # nombre en el menú
title: Disks under extreme UV light
plate: …                     # ya no se usa (las frases del detector están en visuals.ts)
facts:                       # filas con puntos guía
  - { k: Collaboration, v: "XUE · JWST/MIRI" }
figure:
  src: /images/thesis.png    # imagen en public/images/ (vacío = recuadro de relleno)
  alt: Descripción de la imagen
  caption: Texto del pie de figura
  ratio: "4 / 3"
---

Aquí va el texto normal de la sección. Puedes usar **negrita**, *cursiva*,
[enlaces](https://ejemplo.com) y listas:

- Primer punto
- Segundo punto

### Un subtítulo

Cada línea que empieza con `###` crea un subtítulo numerado (II.1, II.2…)
que toma el color de la etapa. Úsalos para ir agregando proyectos o temas.
```

- **Tu foto**: guárdala en `public/images/` (por ejemplo `foto.jpg`) y en `src/content/en/1-about.md` y `src/content/es/1-about.md` pon `src: /images/foto.jpg`.
- **Tu CV**: guarda el PDF como `public/cv.pdf`. El botón de descarga aparece solo.
- Cualquier campo que dejes vacío (`''`) en `site.ts` simplemente no se muestra.

## 4. Publicarla en internet (una sola vez)

0. **Mueve el archivo `deploy.yml`** (está en la raíz de esta carpeta) a `.github\workflows\deploy.yml`.
   En PowerShell, dentro de esta carpeta:

   ```
   mkdir .github\workflows
   move deploy.yml .github\workflows\deploy.yml
   ```

   (Es el archivo que le dice a GitHub cómo publicar la página.)

1. En GitHub, crea un repositorio **público** llamado exactamente `simonrodrigueza.github.io`
   (sin README, sin .gitignore: vacío).
2. En la terminal, dentro de esta carpeta:

   ```
   git init
   git add .
   git commit -m "Primera versión de la página"
   git branch -M main
   git remote add origin https://github.com/simonrodrigueza/simonrodrigueza.github.io.git
   git push -u origin main
   ```

3. En el repositorio en GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Ve a la pestaña **Actions**: en 1–2 minutos termina y la página queda en
   **https://simonrodrigueza.github.io**

## 5. Actualizarla después

Edita lo que quieras, revisa con `npm run dev`, y luego:

```
git add .
git commit -m "Actualizo investigación"
git push
```

GitHub la vuelve a publicar sola.

## Detalles técnicos

- Al bajar por la página, el detector muestra una nube que colapsa en un disco: cada sección es una etapa
  (nube → disco → anillos → planetas → fotoevaporación → sistema despejado).
- El interruptor *Animation ON/OFF* del encabezado oculta el detector; la página recuerda la elección.
- Si el sistema tiene activado “reducir movimiento”, la animación arranca apagada.
- Sin JavaScript, la página se muestra en una sola columna, solo con el texto.
- Versión en español en `/es/`; el botón EN/ES conserva la sección abierta.
