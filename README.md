# VacinaPI

Sistema de gerenciamento de vacinação construído com Next.js, Supabase e Mantine UI, projetado para atender aos requisitos de um sistema completo de cadastro, consulta, edição e exclusão de registros de vacinação, além da geração de relatórios.

## Visão Geral

O VacinaPI é uma aplicação web moderna e responsiva que permite o gerenciamento eficaz de informações de pacientes e vacinas. Ele oferece funcionalidades CRUD completas para pacientes, vacinas e registros de vacinação, além de um dashboard com visualizações de dados e filtros para análise.

**Para uma documentação mais detalhada sobre o projeto, arquitetura e funcionalidades, consulte a [Documentação Completa](./docs/index.md).**

## Funcionalidades Principais

- **Gerenciamento de Pacientes**: Cadastro, visualização, edição e exclusão de pacientes, incluindo informações como nome completo, CPF, data de nascimento, endereço e telefone.
- **Gerenciamento de Vacinas**: Cadastro, visualização, edição e exclusão de tipos de vacinas, incluindo fabricante e tipo.
- **Registro de Vacinação**: Criação, visualização, edição e exclusão de registros de vacinação, associando pacientes a vacinas, com informações sobre data da dose, lote e local de aplicação.
- **Dashboard Interativo**: Visualização de estatísticas de vacinação, como total de doses aplicadas, distribuição por tipo de vacina, por idade, por localização, tendências semanais e horários de pico.
- **Filtros Avançados no Dashboard**: Capacidade de filtrar os dados do dashboard por período, faixa etária, tipo de vacina e localização.
- **Exportação de Dados**: Funcionalidade para exportar dados de pacientes, vacinas e registros de vacinação para PDF.
- **Autenticação de Usuários**: Sistema de login e logout seguro utilizando Supabase Auth.
- **Interface Responsiva e Moderna**: Construída com Mantine UI para uma experiência de usuário agradável em diferentes dispositivos.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização no servidor e geração de sites estáticos.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Mantine UI**: Biblioteca de componentes React, incluindo:
  - `@mantine/core`: Componentes base e hooks.
  - `@mantine/form`: Gerenciamento de formulários (integrado com Zod via `mantine-form-zod-resolver`).
  - `@mantine/dates`: Componentes de data (calendários, seletores de data).
  - `@mantine/charts`: Componentes para visualização de dados e gráficos.
  - `@mantine/hooks`: Coleção de hooks utilitários.
  - `@mantine/modals`: Gerenciamento de modais.
  - `@mantine/notifications`: Sistema de notificações.
- **Supabase**: Plataforma Backend-as-a-Service para autenticação e banco de dados PostgreSQL.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Zod**: Biblioteca para validação de esquemas de dados.
- **jsPDF & jsPDF-AutoTable**: Para geração de relatórios em PDF.
- **Day.js**: Biblioteca para manipulação de datas.
- **React Icons**: Biblioteca de ícones.
- **Recharts**: Biblioteca para criação de gráficos (usada complementarmente ou integrada com `@mantine/charts`).
- **i18next**: Framework de internacionalização.
- **ESLint**: Para linting de código JavaScript e TypeScript.
- **Yarn**: Gerenciador de pacotes.

## Estrutura do Projeto

O projeto segue uma estrutura organizada para facilitar a manutenção e o desenvolvimento. Para mais detalhes, veja a seção [Estrutura do Projeto](./docs/architecture.md) na documentação.

## Configuração do Ambiente

1.  **Pré-requisitos**:
    - Node.js (versão recomendada: >=18.x)
    - Yarn (gerenciador de pacotes)
2.  **Clone o repositório**:
    ```bash
    git clone https://github.com/jacksoncassemiro/vaccination-pi.git
    cd vaccination-pi
    ```
3.  **Instale as dependências**:
    ```bash
    yarn install
    ```
4.  **Configuração do Supabase**:
    - Crie um projeto no [Supabase](https://supabase.com/).
    - No painel do seu projeto Supabase, vá para "SQL Editor" e execute o script SQL encontrado em `docs/database_schema.sql` para criar as tabelas necessárias.
    - Copie o arquivo `.env.example` para `.env.local`:
      ```bash
      copy .env.example .env.local
      ```
    - Preencha as variáveis de ambiente no arquivo `.env.local` com as suas credenciais do Supabase (URL do projeto e chave `anon`):
      ```env
      NEXT_PUBLIC_SUPABASE_URL=SUA_URL_SUPABASE
      NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE
      ```

## Scripts Disponíveis

- `yarn dev`: Inicia o servidor de desenvolvimento em `http://localhost:3000`.
- `yarn build`: Compila a aplicação para produção.
- `yarn start`: Inicia o servidor de produção (requer `yarn build` primeiro).
- `yarn lint`: Executa o linter (ESLint) para verificar a qualidade do código.

## Como Contribuir

Contribuições são bem-vindas! Por favor, leia as [Diretrizes de Contribuição](./docs/contributing.md) antes de enviar um Pull Request.

## Licença

Este projeto é licenciado sob a Licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes (Nota: Adicionar um arquivo LICENSE se necessário).

## Mais Informações (Next.js)

Para saber mais sobre o Next.js, consulte os seguintes recursos:

- [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre os recursos e a API do Next.js.
- [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo do Next.js.

Você pode conferir o [repositório GitHub do Next.js](https://github.com/vercel/next.js) - seu feedback e contribuições são bem-vindos!

## Deploy na Vercel

A maneira mais fácil de implantar seu aplicativo Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira a [documentação de implantação do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
