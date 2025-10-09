# ssr-editor-frontend
frontend part for the ssr-editor program / DV1677 JSRamverk

## Link to Azure: 
https://jsramverk-lich23-bfgnhyfrgvhdbyf4.northeurope-01.azurewebsites.net/api

## Link to Github Pages: 
https://vinkeln.github.io/ssr-editor-frontend/

### Clone repo
1. Clone the github repository.
Command: `git clone <repository-url>`
- cd ssr-editor-frontend/frontend

### Application
1. Install all dependencies.
Command: `npm install` or `npm install --force`

2. Start the application.
Command: `npm run dev`

3. Run all tests.
Command: `npm run test`

4. Run ESLint.
Command: `npm run lint`

### Technology
- React: UI-library
- TypeScript: Programming language (TSX)
- Vite: Building tool
- Apollo Client: GraphQL client (instead of REST API)
- React Router: Routing
- Vitest: Testing framework
- Draft.js: Texteditor

### Enviornement (.env)
- Create an ".env" file i the root folder to add enviornement variables.
1. ATLAS_USERNAME="????"
2. ATLAS_PASSWORD="????"
3. REACT_APP_BACKEND_URL=http://localhost:????/api/auth
4. VITE_API_BASE=http://localhost:????/api/documents
