# Configuração do Ambiente e Instalação

[Voltar ao Índice](./index.md)

Este guia detalha os passos necessários para configurar o ambiente de desenvolvimento e instalar o projeto VacinaPI em sua máquina local.

## Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados:

- **Node.js**: Versão 18.x ou superior. Você pode baixar o Node.js em [nodejs.org](https://nodejs.org/).
- **Yarn**: Gerenciador de pacotes para JavaScript. Se você tem o Node.js instalado, pode instalar o Yarn globalmente via npm (que vem com o Node.js):
  ```bash
  npm install --global yarn
  ```
- **Git**: Sistema de controle de versão. Você pode baixar o Git em [git-scm.com](https://git-scm.com/).

## Passos para Instalação

1.  **Clonar o Repositório:**
    Abra seu terminal ou prompt de comando e clone o repositório do projeto para sua máquina local:

    ```bash
    git clone https://github.com/seu-usuario/vaccination-pi.git
    ```

    Substitua `seu-usuario/vaccination-pi.git` pela URL correta do repositório.
    Navegue até o diretório do projeto:

    ```bash
    cd vaccination-pi
    ```

2.  **Instalar as Dependências:**
    Dentro do diretório do projeto, execute o comando abaixo para instalar todas as dependências listadas no arquivo `package.json`:

    ```bash
    yarn install
    ```

3.  **Configurar Variáveis de Ambiente (Supabase):**
    O projeto utiliza o Supabase para backend (autenticação e banco de dados). Você precisará configurar suas credenciais do Supabase.

    - **Crie um Projeto no Supabase:**
      Se ainda não tiver, crie uma conta e um novo projeto em [supabase.com](https://supabase.com/).
    - **Obtenha as Credenciais da API:**
      No painel do seu projeto Supabase, vá para "Project Settings" (Configurações do Projeto) > "API". Você precisará da `Project URL` e da `anon public` key.
    - **Crie o Arquivo `.env.local`:**
      Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env.local` na raiz do projeto:

      ```bash
      # No Windows (prompt de comando)
      copy .env.example .env.local

      # No Linux ou macOS (terminal)
      # cp .env.example .env.local
      ```

    - **Preencha as Variáveis de Ambiente:**
      Abra o arquivo `.env.local` e adicione suas credenciais do Supabase:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
      NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC_SUPABASE
      ```
      Substitua `SUA_URL_DO_PROJETO_SUPABASE` e `SUA_CHAVE_ANON_PUBLIC_SUPABASE` pelos valores obtidos no painel do Supabase.

4.  **Configurar o Banco de Dados (Supabase):**

    - No painel do seu projeto Supabase, navegue até "SQL Editor".
    - Clique em "+ New query".
    - Copie o conteúdo do arquivo `docs/database_schema.sql` (que contém o script para criar as tabelas necessárias) e cole no editor SQL.
    - Clique em "RUN" para executar o script e criar as tabelas no seu banco de dados Supabase.

5.  **Executar a Aplicação em Modo de Desenvolvimento:**
    Após a configuração bem-sucedida, você pode iniciar o servidor de desenvolvimento:
    ```bash
    yarn dev
    ```
    Isso iniciará a aplicação em `http://localhost:3000` (ou outra porta, se a 3000 estiver ocupada). Abra seu navegador e acesse o endereço para ver a aplicação funcionando.

## Outros Scripts Úteis

- **Build para Produção:**

  ```bash
  yarn build
  ```

  Este comando compila a aplicação para produção, otimizando os arquivos para deploy.

- **Iniciar Servidor de Produção:**

  ```bash
  yarn start
  ```

  Este comando inicia um servidor Node.js que serve a versão de produção da sua aplicação (requer que `yarn build` tenha sido executado antes).

- **Linting:**
  ```bash
  yarn lint
  ```
  Executa o ESLint para verificar a qualidade do código e possíveis erros de formatação ou sintaxe.

Com esses passos, seu ambiente de desenvolvimento para o VacinaPI estará configurado e pronto para uso.
