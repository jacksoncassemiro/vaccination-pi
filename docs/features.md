# Funcionalidades do Sistema

[Voltar ao Índice](./index.md)

Esta seção descreve em detalhes cada uma das funcionalidades principais do sistema VacinaPI.

## Gerenciamento de Pacientes

- **Cadastro de Pacientes**:
  - Campos: Nome completo, CPF, Data de Nascimento, Endereço Completo (CEP, Rua, Número, Complemento, Bairro, Cidade, Estado), Telefone.
  - Validações: CPF único, formato de data, campos obrigatórios.
- **Visualização de Pacientes**:
  - Listagem paginada de todos os pacientes cadastrados.
  - Campos exibidos na listagem: Nome, CPF, Data de Nascimento.
  - Opção de busca por nome ou CPF.
- **Edição de Pacientes**:
  - Permite alterar todas as informações do paciente, exceto CPF (para manter a integridade).
- **Exclusão de Pacientes**:
  - Remove o registro do paciente do sistema.
  - Confirmação antes da exclusão.

## Gerenciamento de Vacinas

- **Cadastro de Vacinas**:
  - Campos: Nome da Vacina, Fabricante, Tipo (ex: Atenuada, Inativada, Subunidade).
  - Validações: Campos obrigatórios.
- **Visualização de Vacinas**:
  - Listagem paginada de todas as vacinas cadastradas.
  - Campos exibidos: Nome da Vacina, Fabricante, Tipo.
  - Opção de busca por nome da vacina.
- **Edição de Vacinas**:
  - Permite alterar todas as informações da vacina.
- **Exclusão de Vacinas**:
  - Remove o registro da vacina do sistema.
  - Confirmação antes da exclusão.

## Registro de Vacinação

- **Criação de Registro de Vacinação**:
  - Seleção de Paciente (busca por nome ou CPF).
  - Seleção de Vacina (busca por nome).
  - Campos: Data da Dose, Lote da Vacina, Local de Aplicação (Unidade de Saúde), Nome do Aplicador.
  - Validações: Data válida, campos obrigatórios.
- **Visualização de Registros de Vacinação**:
  - Listagem paginada de todos os registros.
  - Campos exibidos: Nome do Paciente, Nome da Vacina, Data da Dose, Local de Aplicação.
  - Filtros por paciente, por vacina, por período.
- **Edição de Registros de Vacinação**:
  - Permite alterar informações do registro, como data, lote, local e aplicador.
- **Exclusão de Registros de Vacinação**:
  - Remove o registro de vacinação.
  - Confirmação antes da exclusão.

## Dashboard Interativo

- **Visualizações de Dados**:
  - **Total de Doses Aplicadas**: Número total de vacinas administradas.
  - **Distribuição por Tipo de Vacina**: Gráfico de pizza mostrando a proporção de cada tipo de vacina aplicada.
  - **Vacinação por Faixa Etária**: Gráfico de barras mostrando o número de doses por faixas etárias (ex: 0-5 anos, 6-17 anos, 18-59 anos, 60+ anos).
  - **Vacinação por Localização (Bairro/Cidade)**: Mapa de calor ou gráfico de barras mostrando a distribuição geográfica das vacinações.
  - **Tendências Semanais/Mensais**: Gráfico de linha mostrando o número de doses aplicadas ao longo do tempo.
  - **Horários de Pico de Vacinação**: Gráfico mostrando os horários com maior volume de vacinação.
- **Filtros Avançados**:
  - **Período**: Selecionar um intervalo de datas para análise dos dados.
  - **Faixa Etária**: Filtrar dados por grupos etários específicos.
  - **Tipo de Vacina**: Visualizar dados para um ou mais tipos de vacina.
  - **Localização**: Filtrar por bairro ou cidade.

## Exportação de Dados

- **Exportar para PDF**:
  - Listagem de Pacientes.
  - Listagem de Vacinas.
  - Listagem de Registros de Vacinação (com filtros aplicados).
  - Relatórios do Dashboard (visualizações específicas).

## Autenticação e Segurança

- **Login de Usuário**: Acesso ao sistema mediante nome de usuário e senha.
- **Logout de Usuário**: Encerramento seguro da sessão.
- **Gerenciamento de Sessão**: Controle de sessões ativas.
- **Proteção de Rotas**: Rotas administrativas e de usuário protegidas.

## Interface e Experiência do Usuário

- **Responsividade**: Interface adaptável para desktops, tablets e smartphones.
- **Navegação Intuitiva**: Menus e fluxos de tela claros e fáceis de usar.
- **Feedback ao Usuário**: Mensagens de sucesso, erro e carregamento.
- **Acessibilidade**: Componentes e design seguindo boas práticas de acessibilidade (WCAG).
