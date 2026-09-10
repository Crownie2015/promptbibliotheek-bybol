# Promptbibliotheek

Interactieve promptbibliotheek voor Bybol-cursisten. Kies een categorie, beantwoord een paar vragen, en krijg een kant-en-klare AI-prompt om te plakken in ChatGPT, Gemini of Claude.

## Lokaal draaien

Vereist Node 18 of hoger en de Vercel CLI (`npm install -g vercel`).

```bash
vercel dev
```

Dat start zowel de statische site als de backend-functie in `api/`. Zet lokaal een `.env` met:

```
OPENROUTER_API_KEY=...
TOEGANGSCODE=...
```

## Live zetten

Gekoppeld aan Vercel via deze GitHub-repo. Een push naar `main` deployt automatisch. De omgevingsvariabelen `OPENROUTER_API_KEY` en `TOEGANGSCODE` staan bij Vercel ingesteld, niet in deze repo.
