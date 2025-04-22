<p align="center" width="100%">
  <img alt="Kid Care Cards Logo" src="public/icons/icon-128x128.png">
</p>

# About the Project

Kid Care Cards is a private, personalized knowledge base to track their children’s symptoms, health solutions, and care outcomes, helping families manage illnesses effectively and confidently.

The data you enter is client-side encrypted using the Web Crypto API, and a user specific salt that is stored in the database and is unique to each user.

[![Netlify Status](https://api.netlify.com/api/v1/badges/f375c920-39c3-4052-b08c-603a6e10dc39/deploy-status)](https://app.netlify.com/sites/kidcarecards/deploys)

# Self hosting

To run this self-hosted version of the app, you'll need to have a Supabase project and set up the environment variables. See [.env.example](.env.example) for the required variables.

## Tech Stack

- Supabase
- Next.js
- Tailwind CSS
- TypeScript

## Getting Started

After cloning the repo, run the following command to install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Supabase

You'll need to create a new project in Supabase and add the following environment variables to your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY
```

## Dictation

To use the dictation feature, you'll need an OpenAI API key. You can get one from [OpenAI](https://platform.openai.com/api-keys). Put this in the `.env` file as `OPENAI_API_KEY`.
