# Étape 1 : Génération de l'index
FROM node:20-slim AS builder
WORKDIR /app

# On copie tout le projet
COPY . .

# On génère l'index.html final (le script utilise uniquement des modules natifs Node.js)
RUN node scripts/generate_docs_index.cjs

# Étape 2 : Serveur de production (Nginx)
FROM nginx:stable-alpine

# On copie le dossier docs (qui contient maintenant l'index.html à jour et le style.css)
COPY --from=builder /app/docs /usr/share/nginx/html

# Configuration Nginx de base pour éviter les problèmes de cache
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
