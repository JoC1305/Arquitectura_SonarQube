# 🎮 GamesGauges - Aplicación React

## 📁 Contenido

Esta carpeta contiene **todo el código fuente** de la aplicación React de GamesGauges.

# GamesGauges

**Instrucciones rápidas para usuario final: instalación, uso y despliegue.**

**Instalación**
- **Prerequisitos:** `Node.js` (recomendado v16 o superior) y `npm`.
- **Instalar dependencias:** desde la raíz del proyecto ejecuta:

```powershell
npm install
```

- **Variables de entorno necesarias:** crea un archivo `.env.local` en la raíz con al menos:

```
VITE_SUPABASE_URL=tu_proyecto_supabase_url
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```

**Uso (Desarrollo)**
- **Iniciar servidor de desarrollo:**

```powershell
npm run dev
```

- Abre `http://localhost:5173` en tu navegador (Vite usa por defecto el puerto `5173`).
- **Construir para producción:**

```powershell
npm run build
```

- **Previsualizar la build localmente:**

```powershell
npm run preview
```

La compilación producirá la carpeta `dist/`, lista para desplegar.

**Despliegue**
- Opción recomendada — Vercel:

```powershell
npm i -g vercel
vercel --prod
```

- Alternativa — Netlify (CLI):

```powershell
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

- Alternativa simple: subir el contenido de la carpeta `dist/` al servicio de hosting de tu preferencia (FTP, S3, cPanel, etc.).

**Notas importantes**
- Asegúrate de configurar las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el entorno de producción (panel de Vercel/Netlify o tu hosting) para que la app se conecte a Supabase.
- Si despliegas usando Git (Vercel/Netlify), vincula el repositorio y el servicio detectará el comando de build `npm run build` automáticamente.
