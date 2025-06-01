# Solução de Problemas Comuns (Troubleshooting)

Esta seção visa ajudar a resolver problemas comuns que podem surgir durante a configuração, desenvolvimento ou execução do projeto VacinaPI.

## Problemas de Configuração e Instalação

1.  **Erro ao instalar dependências (`yarn install`)**

    - **Sintoma**: `yarn install` falha com mensagens de erro relacionadas a pacotes específicos ou conflitos de versão.
    - **Solução**:
      - Verifique sua versão do Node.js e Yarn. Certifique-se de que são compatíveis com os requisitos do projeto (veja `docs/setup.md` ou `package.json` engines).
      - Tente limpar o cache do Yarn: `yarn cache clean`.
      - Exclua a pasta `node_modules` e o arquivo `yarn.lock` e tente rodar `yarn install` novamente.
      - Verifique se há problemas de rede que possam estar impedindo o download de pacotes.
      - Se o erro for específico de um pacote, pesquise a mensagem de erro online, pois pode ser um problema conhecido com aquele pacote ou suas dependências.

2.  **Aplicação não inicia (`yarn dev`)**

    - **Sintoma**: O comando `yarn dev` falha ou a aplicação não carrega no navegador em `http://localhost:3000`.
    - **Solução**:
      - Verifique o console para mensagens de erro. Elas geralmente indicam o problema (ex: variável de ambiente faltando, erro de sintaxe no código).
      - **Variáveis de Ambiente**: Certifique-se de que o arquivo `.env.local` existe na raiz do projeto e que as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretamente configuradas.
      - **Porta em Uso**: Verifique se a porta 3000 (ou a porta que o Next.js está tentando usar) não está sendo utilizada por outro processo. Você pode tentar especificar uma porta diferente: `yarn dev -p 3001`.
      - **Erro de Código**: Um erro recente no código pode impedir a compilação. Verifique os últimos arquivos modificados.

3.  **Problemas de Conexão com o Supabase**
    - **Sintoma**: Erros relacionados à busca ou envio de dados para o Supabase (ex: "fetch failed", "Unauthorized", erros de RLS).
    - **Solução**:
      - **Credenciais**: Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env.local` estão corretas e correspondem às do seu projeto Supabase.
      - **Esquema do Banco de Dados**: Confirme que você executou o script `docs/database_schema.sql` no SQL Editor do seu projeto Supabase e que as tabelas foram criadas corretamente.
      - **Políticas de Row Level Security (RLS)**:
        - Verifique se as políticas de RLS estão configuradas corretamente para as tabelas no Supabase. Por padrão, o acesso pode ser restrito.
        - Para desenvolvimento, você pode temporariamente criar políticas mais permissivas (ex: permitir SELECT para `authenticated` ou `public` roles) para isolar o problema. Lembre-se de configurar políticas seguras para produção.
        - Consulte a documentação do Supabase sobre RLS.
      - **Rede**: Verifique sua conexão com a internet.
      - **Limites do Supabase**: Se você estiver no plano gratuito, verifique se não atingiu nenhum limite de uso da API ou do banco de dados.

## Problemas de Desenvolvimento

1.  **Linting falha (`yarn lint`)**

    - **Sintoma**: O comando `yarn lint` reporta erros ou avisos.
    - **Solução**:
      - Abra os arquivos indicados pelo linter e corrija os problemas de acordo com as regras do ESLint configuradas no projeto.
      - Muitos editores de código (como o VS Code com a extensão ESLint) podem mostrar esses erros diretamente no editor e oferecer sugestões de correção automática.

2.  **Componente não renderiza como esperado / Erros de JavaScript no Console do Navegador**

    - **Sintoma**: Um componente está quebrado, não exibe dados ou ocorrem erros no console de desenvolvedor do navegador.
    - **Solução**:
      - **Verifique as Props**: Certifique-se de que todas as props necessárias estão sendo passadas para o componente e com os tipos corretos.
      - **Estado e Lógica**: Use as ferramentas de desenvolvedor do React (React DevTools) para inspecionar o estado e as props do componente. Depure a lógica do componente.
      - **Chamadas de API**: Se o componente depende de dados de uma API, verifique a aba "Network" nas ferramentas de desenvolvedor do navegador para garantir que as chamadas estão sendo feitas corretamente e retornando os dados esperados.
      - **Mensagens de Erro**: Analise cuidadosamente as mensagens de erro no console. Elas geralmente apontam para a origem do problema.

3.  **Estilos CSS não aplicados corretamente (Mantine UI / Tailwind CSS)**
    - **Sintoma**: Os estilos visuais não estão como deveriam.
    - **Solução**:
      - **Conflitos de CSS**: Inspecione os elementos no navegador para ver quais estilos estão sendo aplicados e se há conflitos de especificidade.
      - **Configuração do Mantine**: Verifique se o `MantineProvider` está configurado corretamente na raiz da sua aplicação (geralmente em `src/app/layout.tsx` ou um arquivo similar).
      - **Classes Tailwind**: Se estiver usando Tailwind CSS diretamente, certifique-se de que as classes estão corretas e que o Tailwind está processando seus arquivos CSS. Verifique o arquivo de configuração `tailwind.config.js`.
      - **Ordem de Importação de CSS**: Em alguns casos, a ordem de importação dos arquivos CSS pode ser importante.

## Problemas com Build e Deploy

1.  **Build falha (`yarn build`)**

    - **Sintoma**: O processo de build é interrompido com erros.
    - **Solução**:
      - As mensagens de erro do build geralmente são informativas. Podem indicar problemas de tipagem TypeScript que não foram pegos durante o desenvolvimento, erros de importação, ou problemas de configuração do Next.js.
      - Verifique se todas as dependências estão corretamente instaladas.
      - Tente limpar o cache do Next.js: exclua a pasta `.next` e tente o build novamente.

2.  **Problemas após o Deploy (ex: na Vercel)**
    - **Sintoma**: A aplicação funciona localmente mas apresenta erros ou comportamento inesperado após o deploy.
    - **Solução**:
      - **Variáveis de Ambiente**: Certifique-se de que todas as variáveis de ambiente necessárias (como as do Supabase) estão configuradas corretamente nas configurações do seu provedor de hospedagem (ex: Vercel Environment Variables).
      - **Logs do Servidor**: Verifique os logs da sua aplicação no painel do provedor de hospedagem. Eles podem conter erros que não ocorrem localmente.
      - **Diferenças de Build**: O ambiente de build do provedor pode ter pequenas diferenças. Verifique as configurações de build (versão do Node.js, etc.).
      - **Caminhos de Arquivo e Case Sensitivity**: Sistemas de arquivos em ambientes de deploy (geralmente baseados em Linux) são case-sensitive, enquanto o Windows não é. Verifique se os caminhos de importação de arquivos e componentes correspondem exatamente (maiúsculas/minúsculas).

## Dicas Gerais

- **Mantenha as dependências atualizadas**: Use `yarn outdated` para verificar pacotes desatualizados e atualize-os com cautela (`yarn upgrade nome-do-pacote` ou `yarn upgrade-interactive`).
- **Use o Controle de Versão (Git)**: Faça commits frequentes. Se algo quebrar, você pode facilmente reverter para uma versão anterior que funcionava.
- **Leia a Documentação**: Consulte a documentação do Next.js, Mantine, Supabase e outras bibliotecas que você está usando.
- **Procure Online**: Se você encontrar uma mensagem de erro específica, copie e cole no Google. É provável que outra pessoa já tenha enfrentado o mesmo problema.

Se você encontrar um problema não listado aqui e conseguir resolvê-lo, considere contribuir para esta seção da documentação!
