# Arquitetura do Sistema VacinaPI

Este documento descreve a arquitetura do sistema VacinaPI, detalhando a estrutura do frontend, a interação com o backend (Supabase) e a organização geral do projeto.

## Visão Geral da Arquitetura

O VacinaPI é uma aplicação web Single Page Application (SPA) construída com Next.js para o frontend e utiliza o Supabase como Backend-as-a-Service (BaaS) para autenticação, banco de dados (PostgreSQL) e, potencialmente, storage e functions.

### Fluxo de Dados Principal

1.  **Usuário Interage com a UI**: O usuário acessa a aplicação através de um navegador web. As interações são capturadas pelos componentes React.
2.  **Componentes React**: Gerenciam o estado da UI e lidam com eventos do usuário.
3.  **Hooks e Contextos**: Lógica de estado compartilhada e acesso a funcionalidades transversais (como autenticação, tema) são gerenciados por hooks customizados e pela Context API do React.
4.  **Server Actions / Funções de Serviço**: Para operações de dados (CRUD), o frontend invoca Server Actions do Next.js ou funções de serviço que encapsulam a lógica de comunicação com o Supabase.
5.  **Supabase Client**: As Server Actions/funções de serviço utilizam o cliente JavaScript do Supabase para interagir com o banco de dados (consultas, inserções, atualizações, exclusões) e serviços de autenticação.
6.  **Banco de Dados Supabase (PostgreSQL)**: Armazena todos os dados da aplicação, como informações de pacientes, vacinas e registros de vacinação.
7.  **Supabase Auth**: Gerencia a autenticação dos usuários, incluindo login, registro e gerenciamento de sessão.
8.  **Retorno e Atualização da UI**: Os dados retornados pelo Supabase são processados e utilizados para atualizar a interface do usuário, fornecendo feedback visual ao usuário.

## Arquitetura do Frontend

O frontend é construído utilizando Next.js com o App Router, o que permite uma estrutura baseada em pastas para rotas e layouts.

### Principais Tecnologias do Frontend

- **Next.js (App Router)**: Framework React para renderização no servidor (SSR), geração de sites estáticos (SSG), e componentização.
- **React**: Biblioteca para construir interfaces de usuário componentizadas.
- **Mantine UI**: Biblioteca de componentes React que fornece um conjunto rico de elementos de UI pré-construídos e customizáveis.
- **TypeScript**: Adiciona tipagem estática ao JavaScript.
- **Tailwind CSS**: (Integrado ao Mantine) Utilizado para estilizações utilitárias.
- **Zod**: Para validação de esquemas de dados.
- **Mantine Form**: Para gerenciamento de formulários, integrado com Zod (via `mantine-form-zod-resolver`).
- **jsPDF & jsPDF-AutoTable**: Bibliotecas para a geração de relatórios em PDF.
- **Day.js**: Para manipulação e formatação de datas.
- **React Icons**: Para utilização de ícones SVG.
- **Recharts**: Para a criação de gráficos e visualizações de dados.
- **i18next**: Para internacionalização (i18n) da aplicação.

### Estrutura de Pastas do Frontend (`src/`)

A estrutura de pastas do projeto é organizada para promover modularidade e escalabilidade:

- **`src/app/`**: Contém todas as rotas, layouts e páginas da aplicação, seguindo as convenções do Next.js App Router.
  - **`(authenticated)/`**: Agrupa rotas que requerem autenticação do usuário.
    - `layout.tsx`: Layout principal para páginas autenticadas (inclui navegação, header, etc.).
    - `page.tsx`: Página inicial do dashboard após o login.
    - `patients/`: Rotas relacionadas ao CRUD de pacientes (`/patients`, `/patients/form`).
    - `vaccines/`: Rotas relacionadas ao CRUD de tipos de vacinas (`/vaccines`, `/vaccines/form`).
    - `vaccinations/`: Rotas relacionadas ao CRUD de registros de vacinação (`/vaccinations`, `/vaccinations/form`).
  - **`(public)/`**: Agrupa rotas públicas, como a página de login.
    - `auth/`: Rota para a página de autenticação.
  - `layout.tsx`: Layout raiz da aplicação.
  - `loading.tsx`, `error.tsx`, `not-found.tsx`: Arquivos especiais do Next.js para estados de carregamento, erro e páginas não encontradas.
- **`src/assets/`**: Arquivos estáticos como imagens e logos.
- **`src/components/`**: Componentes React reutilizáveis, organizados por tipo/funcionalidade.
  - `charts/`: Componentes específicos para gráficos do dashboard.
  - `features/`: Componentes que encapsulam funcionalidades específicas (ex: `UserMenu`).
  - `forms/`: Componentes de campos de formulário reutilizáveis (ex: `PatientFormFields`).
  - `layouts/`: Componentes de layout estruturais (ex: `AppHeader`, `CrudPageLayout`).
  - `tables/`: Componentes para exibição de dados em tabelas (ex: `PatientsTable`).
  - `ui/`: Componentes de UI básicos e genéricos (ex: `LoadingScreen`, `Logo`, `SearchableSelect`).
  - `index.ts`: Arquivo que exporta todos os componentes principais para facilitar importações.
- **`src/constants/`**: Constantes utilizadas em toda a aplicação (ex: cores, textos de botões).
- **`src/contexts/`**: Contextos React para gerenciamento de estado global (ex: `AuthProvider`, `ThemeProvider`).
- **`src/hooks/`**: Hooks customizados para lógica reutilizável e gerenciamento de estado.
  - `queries/`: Hooks específicos para TanStack Query (React Query).
- **`src/lib/`**: Funções utilitárias e integrações com bibliotecas de terceiros (ex: `viaCep.ts`).
- **`src/schemas/`**: Esquemas de validação Zod para formulários e dados.
- **`src/services/`**: (Opcional, pode ser substituído por Server Actions) Funções para interagir com APIs ou serviços externos.
- **`src/styles/`**: Arquivos de estilo globais.
- **`src/types/`**: Definições de tipos TypeScript para a aplicação.
- **`src/utils/`**: Funções utilitárias genéricas.
  - `supabase/`: Configuração e helpers para o cliente Supabase.
- **`src/middleware.ts`**: Middleware do Next.js para lógica de requisição/resposta (ex: proteção de rotas).

### Gerenciamento de Estado

- **Estado Local do Componente**: Utiliza `useState` e `useReducer` para estados confinados a componentes individuais.
- **Estado Compartilhado (Client-Side)**: A Context API do React é usada para estados globais como informações do usuário autenticado e preferências de tema.
- **Estado do Servidor (Server-Side State) e Cache de Dados**: A busca de dados e o gerenciamento de cache podem ser feitos com Server Actions do Next.js, e/ou hooks `useEffect` / `useState` para dados mais simples, ou bibliotecas como SWR/React Query se a complexidade aumentar (atualmente não listado como dependência direta, mas TanStack Query foi mencionado anteriormente e pode ser uma consideração futura se o gerenciamento de estado do servidor se tornar mais complexo).

### Roteamento

O roteamento é gerenciado pelo App Router do Next.js, que utiliza convenções baseadas em sistema de arquivos. Rotas dinâmicas são usadas para páginas de edição e visualização de itens específicos.

### Autenticação

A autenticação é tratada pelo Supabase Auth.

- O `middleware.ts` verifica o status de autenticação do usuário e redireciona para a página de login se necessário para rotas protegidas.
- O `AuthProvider` (contexto) disponibiliza as informações do usuário autenticado e funções de login/logout para os componentes.
- As interações com o Supabase Auth (login, logout, obter usuário) são encapsuladas em hooks ou funções utilitárias.

## Arquitetura do Backend (Supabase)

O Supabase fornece a infraestrutura de backend necessária.

### Banco de Dados

- **PostgreSQL**: O Supabase utiliza um banco de dados PostgreSQL relacional.
- **Esquema**: As tabelas (`patients`, `vaccines`, `vaccination_records`) são definidas para armazenar os dados da aplicação. Chaves estrangeiras são usadas para manter a integridade relacional. O esquema detalhado pode ser encontrado em `docs/database_schema.md`.
- **Row Level Security (RLS)**: Políticas de RLS são configuradas no Supabase para garantir que os usuários só possam acessar e modificar os dados aos quais têm permissão (geralmente, dados associados ao seu `user_id`).

### Autenticação (Supabase Auth)

- Gerencia o ciclo de vida completo do usuário: registro, login (com email/senha), logout, recuperação de senha.
- Tokens JWT são usados para gerenciar sessões de usuário.

### APIs (Supabase Auto-generated)

- O Supabase gera automaticamente APIs RESTful e GraphQL para interagir com o banco de dados.
- O cliente JavaScript do Supabase (`@supabase/supabase-js`) é usado no frontend (dentro de Server Actions ou funções de serviço) para consumir essas APIs de forma segura e conveniente.

## Comunicação Frontend-Backend

- **Server Actions**: Para mutações de dados (criar, atualizar, excluir) e buscas de dados (Read), o Next.js Server Actions são utilizados. Eles permitem que funções assíncronas sejam executadas no servidor diretamente a partir de componentes do cliente, simplificando a lógica de API e melhorando a segurança.
- O cliente JavaScript do Supabase (`@supabase/supabase-js`) é usado dentro das Server Actions para interagir com o banco de dados.

## Considerações de Segurança

- **Variáveis de Ambiente**: Credenciais sensíveis (como chaves de API do Supabase) são armazenadas em variáveis de ambiente (`.env.local`) e não são expostas no bundle do cliente.
- **Row Level Security (RLS)**: Fundamental para proteger os dados no Supabase, garantindo que os usuários só acessem seus próprios dados.
- **Validação de Entrada**: Zod é usado para validar todas as entradas do usuário, tanto no frontend (formulários) quanto no backend (Server Actions) para prevenir dados malformados.
- **Proteção CSRF/XSS**: Next.js e as práticas de desenvolvimento React ajudam a mitigar esses riscos, mas é importante estar ciente (ex: sanitizar saídas, usar `HttpOnly` cookies quando aplicável).
- **HTTPS**: Sempre utilizar HTTPS em produção.

Este documento fornece uma visão geral da arquitetura. Para detalhes mais específicos sobre cada parte, consulte as seções relevantes na documentação.
