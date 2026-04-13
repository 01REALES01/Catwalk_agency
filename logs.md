Prompt 0 (google stitch):
Hola. Quiero que actúes como un Director de Arte de Alta Costura y un Diseñador UX/UI Senior. Vamos a crear la interfaz web completa para 'Catwal', una agencia de modelaje de élite.
El Alma y la Estética del Proyecto:
Queremos que cuando alguien abra esta página, sienta que está hojeando una edición de lujo de la revista Vogue o Harper's Bazaar. El estilo debe ser minimalista, editorial, asimétrico y sumamente elegante.
Tu paleta de colores principal debe ser un juego profundo de blancos (off-white, cremas muy sutiles) y negros puros, pero confío en tu ojo de diseñador para que introduzcas un único color de acento (quizás un tono 'nude' editorial, arena, o un rojo vino profundo) para guiar la atención en los botones principales. Usa tipografías sans-serif geométricas y juega mucho con el tamaño: títulos gigantes y textos descriptivos pequeños. Siéntete libre de experimentar con el layout, confío en tu creatividad.
La plataforma tiene 3 tipos de usuarios, por lo que necesito que diseñes 4 vistas clave:
1. Landing Page (Para atrapar al cliente y al aspirante):
Esta es nuestra carta de presentación. Necesito un 'Hero Section' espectacular que deje sin aliento, tal vez con un gran título y una fotografía imponente. Más abajo, una sección para mostrar a nuestras 'Top Models' en un formato de galería creativa (no el típico grid aburrido, sorpréndeme). También incluye una pequeña sección que hable de nuestra filosofía ('Where Elegance Meets the Runway') y llamadas a la acción claras para contratar modelos o aplicar a la agencia.
2. Perfil Público de la Modelo (El Portfolio):
Esta es la página que verá el cliente cuando haga clic en una modelo. Tiene que ser inmaculada. Imagina un espacio donde podamos ver su nombre en grande, una lista súper limpia con sus medidas (Altura, Busto, Cintura, Zapatos, Color de Ojos, etc.), y luego una galería deslumbrante donde ella pueda exhibir sus mejores fotografías. Ponle un botón prominente para que el cliente pueda 'Solicitar un Booking'.
3. Dashboard Privado de la Modelo:
Aquí es donde la magia ocurre para nuestros talentos. Diseña un panel de control limpio y acogedor donde la modelo, una vez iniciada su sesión, pueda gestionar su carrera. Necesita un formulario estilizado para actualizar sus medidas físicas y, lo más importante, una zona de 'Drag & Drop' muy visual y atractiva donde pueda subir sus 'Digitals' (fotografías crudas) e información personal.
4. Panel de Administración (El Cuartel General):
Este es el panel para el dueño de Catwal. Necesita una vista de control general. Imagina una tabla moderna o un grid donde el administrador pueda ver a todos los usuarios/modelos registrados. Debe tener interruptores (toggles) o botones elegantes que le permitan hacer dos cosas vitales: aprobar a una nueva modelo para que sea visible al público, o marcar a una modelo como 'Destacada' para que aparezca en la Landing Page.



Prompt 1:
Eres un Arquitecto de Software Senior, un Tech Lead experto en Next.js 14 (App Router) y un maestro en Prompt Engineering. Tu objetivo es ayudarme a construir el MVP (Producto Mínimo Viable) de una plataforma web para una agencia de modelaje llamada "Lumina Models".

Tu filosofía de desarrollo es la simplicidad extrema y la robustez. No asumes cosas, no escribes código espagueti y, sobre todo, no intentas construir todo de una sola vez. Vas a guiarme estrictamente paso a paso, esperando mi confirmación antes de avanzar a la siguiente fase.

Stack Tecnológico Estricto

Framework: Next.js 14 (usando App Router).

Estilos y UI: Tailwind CSS y Shadcn UI (para componentes limpios, accesibles y rápidos).

Backend / Base de Datos / Auth: Supabase (PostgreSQL).

Integración Externa: API de OpenAI (se implementará al final).

El Alcance Estricto del MVP (No te desvíes de esto)

Base de Datos y Auth: Esquema relacional en Supabase para usuarios y perfiles de modelos. Sistema de login/registro.

Dashboard de Modelo (Privado): Un formulario donde la modelo logueada puede ingresar sus datos físicos (altura, color de ojos, talla) y experiencia.

Directorio Público (Landing Page): Un grid visual que muestra a las modelos registradas extrayendo la información de Supabase.

Generación de Biografía (Punto Extra): Un botón en el dashboard que, al presionarlo, envíe los datos de la modelo a la API de OpenAI y devuelva un párrafo de "Biografía Profesional" redactado de forma atractiva.

Plan de Ejecución Paso a Paso (Tu flujo de trabajo)

Fase 1: Setup y Base de Datos. Solo comandos CLI y código SQL. Nada de UI.

Fase 2: Conexión Supabase y Auth. Configuración de variables de entorno y protección de rutas.

Fase 3: Desarrollo del Dashboard. Creación de los formularios para la carga de datos del perfil.

Fase 4: Desarrollo del Directorio Público. El grid de la página de inicio.

Fase 5: Integración con OpenAI. La conexión con la API externa.

Tu Primera Tarea (Fase 1)
Entiende todo el contexto anterior. Si lo has comprendido, ejecuta estrictamente lo siguiente y detente:

Dame los comandos de CLI exactos que debo correr en mi terminal para inicializar el proyecto con Next.js y Tailwind CSS.

Diseña el esquema SQL para Supabase. Necesito dos tablas: users (manejada por Supabase Auth) y model_profiles (vinculada al user_id, con campos para nombre, altura, color_ojos, medidas, bio_profesional). Dame el script SQL listo para copiar y ejecutar en el panel de Supabase.

IMPORTANTE: No escribas ningún componente de React ni código de Next.js todavía. Solo entrégame los comandos de inicialización y el script SQL. Pregúntame si logré ejecutar esto con éxito antes de pasar a la Fase 2.


prompt 3
eleji el comand 2 opcional, y ya ejecute el script de sql
ahora si comenzemos con el proyecto, ya lo entiendes, ahora aprovecharia para crear el frontend de la app usando como base la carpeta @stitch ahi esta toda la informacion del fronten, tanto web como mobile, con .md e imagenes de referencia