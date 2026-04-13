# My Wiki

My Wiki is a Next.js app that turns uploaded source files into generated wiki pages and answers chat questions only from those pages.

## Project Overview

- Upload documents into the app.
- Generate wiki pages from the uploaded content.
- Ask the chat assistant questions about the generated wiki pages.
- Keep responses grounded in the wiki content only.

This MVP does not use a vector database. Page selection is done from the generated wiki pages on disk, then the chat model is prompted with the selected page excerpts.

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create a local environment file in `my-wiki/.env.local`.

3. Start the development server.

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Local GGUF Chat Server

The chat backend expects an OpenAI-compatible endpoint. A local `llama.cpp` server works well for this MVP.

Example server command:

```bash
./llama-server \
  -m /models/gemma-4-E4B-it-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8080
```

Use the OpenAI-compatible base URL in `.env.local`:

```bash
CHAT_MODEL_BASE_URL=http://127.0.0.1:8080/v1
CHAT_MODEL_API_KEY=local
CHAT_MODEL_NAME=gemma-4-e4-b-it-q4
```

## Environment Variables

Set these values in `my-wiki/.env.local`:

- `CHAT_MODEL_BASE_URL`: OpenAI-compatible chat completion endpoint, such as `http://127.0.0.1:8080/v1`.
- `CHAT_MODEL_API_KEY`: Any placeholder string accepted by your local server. `local` is fine for `llama.cpp`.
- `CHAT_MODEL_NAME`: The model name sent to the endpoint. Use the name expected by your server or a local alias such as `gemma-4-e4-b-it-q4`.

## Product Guardrails

- Chat answers only from generated wiki pages.
- No vector database is used in this MVP.
- If no relevant wiki page exists, the chat refuses to guess.

These guardrails are enforced in the chat route and prompt:

- The route ranks generated wiki pages from local storage before calling the model.
- If nothing relevant is found, the API returns a refusal instead of asking the model to invent an answer.
- The prompt tells the model to answer only from the provided wiki excerpts and to say when the wiki does not contain the answer.

## Verification Commands

Run the full local verification pass from `my-wiki/`:

```bash
npx vitest run
npm run lint
npm run build
```

If `npm run build` emits the known Turbopack tracing warning, treat it as expected for this task unless it blocks the build.
