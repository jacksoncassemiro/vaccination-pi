# Diretrizes de Contribuição

Agradecemos seu interesse em contribuir para o projeto VacinaPI! Para garantir um processo de contribuição tranquilo e eficaz, por favor, siga estas diretrizes.

[Voltar ao Índice](./index.md)

## Como Contribuir

Existem várias maneiras de contribuir para o projeto:

- **Relatando Bugs:** Se você encontrar um bug, por favor, crie uma [Issue](https://github.com/seu-usuario/vaccination-pi/issues) detalhando o problema, os passos para reproduzi-lo e o comportamento esperado.
- **Sugerindo Melhorias:** Novas ideias e sugestões de funcionalidades são bem-vindas. Crie uma [Issue](https://github.com/seu-usuario/vaccination-pi/issues) descrevendo sua sugestão.
- **Escrevendo Código:** Se você deseja corrigir um bug ou implementar uma nova funcionalidade.
- **Melhorando a Documentação:** A documentação clara é crucial. Se você vir áreas que podem ser melhoradas, sinta-se à vontade para contribuir.

## Primeiros Passos para Contribuir com Código

1.  **Faça um Fork do Repositório:**
    Clique no botão "Fork" no canto superior direito da página do repositório no GitHub ([https://github.com/seu-usuario/vaccination-pi](https://github.com/seu-usuario/vaccination-pi)) para criar uma cópia do projeto em sua conta.

2.  **Clone o seu Fork:**
    Clone o repositório que você acabou de "forkar" para a sua máquina local:

    ```bash
    git clone https://github.com/SEU-NOME-DE-USUARIO/vaccination-pi.git
    cd vaccination-pi
    ```

3.  **Crie uma Branch para sua Contribuição:**
    Crie uma nova branch para trabalhar em sua funcionalidade ou correção. Use um nome descritivo para a branch (por exemplo, `feature/nova-tela-pacientes` ou `fix/bug-login`).

    ```bash
    git checkout -b nome-da-sua-branch
    ```

4.  **Configure o Ambiente de Desenvolvimento:**
    Siga as instruções no arquivo [`docs/setup.md`](./setup.md) para configurar o ambiente de desenvolvimento e instalar as dependências.

5.  **Faça suas Alterações:**
    Implemente sua funcionalidade, corrija o bug ou melhore a documentação.

6.  **Siga os Padrões de Código:**

    - Mantenha o estilo de código existente.
    - Utilize o ESLint para verificar a qualidade do código (`yarn lint`). Corrija quaisquer erros ou avisos apontados pelo linter.
    - Escreva código claro, conciso e bem comentado quando necessário.

7.  **Escreva Testes (se aplicável):**
    Se você estiver adicionando uma nova funcionalidade ou corrigindo um bug crítico, por favor, adicione testes unitários ou de integração para cobrir suas alterações.

8.  **Faça Commits Significativos:**
    Use mensagens de commit claras e descritivas. Siga o padrão de [Commits Semânticos](https://www.conventionalcommits.org/pt-br/v1.0.0/) se possível (ex: `feat: Adiciona funcionalidade X`, `fix: Corrige bug Y na tela Z`, `docs: Atualiza documentação da API`).

    ```bash
    git add .
    git commit -m "feat: Descrição da sua alteração"
    ```

9.  **Mantenha sua Branch Atualizada:**
    Antes de enviar seu Pull Request, sincronize sua branch com a branch principal (`main` ou `develop`) do repositório original para evitar conflitos:

    ```bash
    git remote add upstream https://github.com/seu-usuario/vaccination-pi.git # Adiciona o repositório original como upstream (só precisa fazer uma vez)
    git fetch upstream
    git rebase upstream/main # ou upstream/develop
    ```

10. **Envie suas Alterações para o seu Fork:**

    ```bash
    git push origin nome-da-sua-branch
    ```

11. **Abra um Pull Request (PR):**
    - Vá para a página do seu fork no GitHub.
    - Clique no botão "Compare & pull request" para a branch que você acabou de enviar.
    - Selecione a branch base correta no repositório original (geralmente `main` ou `develop`).
    - Forneça um título claro e uma descrição detalhada das alterações que você fez no Pull Request.
    - Se o seu PR resolve uma Issue existente, mencione-a na descrição (ex: `Closes #123`).
    - Aguarde a revisão do seu PR. Esteja preparado para discutir suas alterações e fazer ajustes se necessário.

## Padrões de Código e Estilo

- **TypeScript**: O projeto utiliza TypeScript. Certifique-se de que seu código está devidamente tipado.
- **Mantine UI**: Siga as convenções e utilize os componentes do Mantine UI sempre que possível para manter a consistência visual.
- **ESLint**: Execute `yarn lint` para garantir que seu código está em conformidade com as regras de linting do projeto.
- **Comentários**: Comente partes complexas do código ou lógicas que não são imediatamente óbvias.

## Revisão de Código

- Todos os Pull Requests serão revisados por um ou mais mantenedores do projeto.
- Seja receptivo a feedback e esteja disposto a fazer alterações em seu PR.
- A revisão visa garantir a qualidade, consistência e manutenibilidade do código.

## Comunidade

Se tiver dúvidas, você pode abrir uma Issue ou participar das discussões do projeto.

Obrigado por contribuir para o VacinaPI!
