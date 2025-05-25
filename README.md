# VacinaPI

Sistema de gerenciamento de vacinação construído com Next.js, Supabase e Mantine UI.

## Getting Started

Este projeto usa **Yarn** como gerenciador de pacotes. Primeiro, instale as dependências:

```bash
yarn install
```

Em seguida, execute o servidor de desenvolvimento:

```bash
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a página modificando `src/app/page.tsx`. A página atualiza automaticamente conforme você edita o arquivo.

## Configuração do Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:

   ```bash
   copy .env.example .env.local
   ```

2. Configure as variáveis de ambiente no arquivo `.env.local` com suas credenciais do Supabase.

## Scripts Disponíveis

- `yarn dev` - Inicia o servidor de desenvolvimento
- `yarn build` - Constrói a aplicação para produção
- `yarn start` - Inicia o servidor de produção
- `yarn lint` - Executa o linter ESLint

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca de interface do usuário
- **Mantine v8** - Biblioteca de componentes UI
- **Supabase** - Backend-as-a-Service (autenticação, banco de dados)
- **TypeScript** - Linguagem de programação
- **Tailwind CSS v4** - Framework CSS utilitário
- **Yarn** - Gerenciador de pacotes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
