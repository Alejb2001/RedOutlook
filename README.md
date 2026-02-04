# OfficeReddit

Un cliente de Reddit con interfaz de Outlook Web para navegación discreta.

## Stack Tecnológico

- **Backend**: ASP.NET Core Web API (.NET 8)
- **Frontend**: Angular 19 con Tailwind CSS
- **Comunicación**: El backend actúa como proxy hacia la API de Reddit

## Estructura del Proyecto

```
RedOutlook/
├── Controllers/           # Controladores de API
│   └── RedditController.cs
├── Models/               # Modelos de datos
│   ├── RedditPost.cs
│   └── RedditApiResponse.cs
├── Services/             # Servicios de negocio
│   ├── IRedditService.cs
│   └── RedditService.cs
├── ClientApp/            # Aplicación Angular
│   └── src/
│       └── app/
│           ├── components/
│           │   ├── sidebar/
│           │   ├── mail-list/
│           │   ├── reading-pane/
│           │   └── toolbar/
│           ├── models/
│           └── services/
├── Program.cs
└── OfficeReddit.csproj
```

## Requisitos

- .NET 8 SDK
- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)

## Desarrollo

### Ejecutar el Backend

```bash
dotnet run
```

El servidor se iniciará en `http://localhost:5000`

### Ejecutar el Frontend (desarrollo)

```bash
cd ClientApp
npm install
npm start
```

La aplicación Angular se iniciará en `http://localhost:4200` con proxy al backend.

### Ejecutar ambos juntos

```bash
# Terminal 1 - Backend
dotnet run

# Terminal 2 - Frontend
cd ClientApp
npm start
```

## Compilar para Producción

```bash
dotnet publish -c Release
```

Esto compilará Angular automáticamente y copiará los archivos a `wwwroot`.

## API Endpoints

- `GET /api/reddit/posts?subreddit=all&limit=25` - Obtener posts
- `GET /api/reddit/posts/{subreddit}/{postId}` - Obtener post específico
- `GET /api/reddit/subreddits/popular?limit=10` - Obtener subreddits populares

## Características

- Interfaz idéntica a Outlook Web
- Barra lateral con subreddits (como carpetas)
- Lista de posts como emails no leídos
- Panel de lectura con contenido del post
- Colores institucionales de Microsoft (#0078d4)
- Seguimiento de posts leídos (localStorage)

## Licencia

MIT
