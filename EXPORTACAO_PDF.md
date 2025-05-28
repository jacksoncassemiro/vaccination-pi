# Funcionalidade de Exportação PDF - Pacientes

## Visão Geral

A funcionalidade de exportação PDF foi implementada na página de pacientes do sistema de vacinação, permitindo gerar relatórios em PDF tanto para a lista completa de pacientes quanto para pacientes individuais.

## Funcionalidades Implementadas

### 1. Exportação em Lote (Lista Completa)

- **Localização**: Botão "Exportar PDF" na página principal de pacientes
- **Funcionalidade**: Exporta todos os pacientes visíveis na lista atual
- **Formato**: Tabela em orientação paisagem (landscape) com todas as informações relevantes
- **Características**:
  - Título dinâmico que inclui termos de busca quando aplicáveis
  - Data e hora de geração
  - Total de pacientes incluídos
  - Cabeçalho e rodapé automáticos
  - Paginação automática para listas grandes

### 2. Exportação Individual

- **Localização**: Ícone de download (FileDown) nas ações de cada paciente na tabela
- **Funcionalidade**: Exporta ficha detalhada de um paciente específico
- **Formato**: Documento em retrato (portrait) com layout de ficha
- **Características**:
  - Informações completas do paciente
  - Layout organizado e profissional
  - Nome do arquivo personalizado com nome do paciente

## Tecnologias Utilizadas

### Bibliotecas

- **jsPDF**: Biblioteca principal para geração de PDFs
- **jspdf-autotable**: Plugin para criação de tabelas automatizadas
- **@types/jspdf**: Tipos TypeScript (nota: removível pois jsPDF já inclui tipos)

### Hook Customizado

- **usePdfExport**: Hook que encapsula toda a lógica de geração de PDF
- **Localização**: `src/hooks/usePdfExport.ts`

## Estrutura de Arquivos

```
src/
├── hooks/
│   ├── usePdfExport.ts          # Hook principal com lógica de PDF
│   └── index.ts                 # Exportação do hook
├── app/patients/
│   └── page.tsx                 # Página principal com botão de exportação
└── components/
    └── PatientsTable.tsx        # Tabela com botões individuais
```

## Como Usar

### Para Exportar Lista Completa

1. Navegue para a página de pacientes (`/patients`)
2. Opcionalmente, use a busca para filtrar pacientes
3. Clique no botão "Exportar PDF" no cabeçalho da página
4. O arquivo será baixado automaticamente

### Para Exportar Paciente Individual

1. Na tabela de pacientes, localize o paciente desejado
2. Clique no ícone de download (verde) nas ações do paciente
3. O arquivo PDF da ficha será baixado automaticamente

## Configurações do PDF

### Exportação em Lote

- **Orientação**: Paisagem (landscape)
- **Formato**: A4
- **Colunas**: Nome, CPF, Data Nascimento, Telefone, Endereço, Bairro/Cidade, CEP
- **Estilo**: Tabela com cabeçalho azul e linhas alternadas

### Exportação Individual

- **Orientação**: Retrato (portrait)
- **Formato**: A4
- **Layout**: Ficha com campos organizados verticalmente
- **Estilo**: Layout limpo e profissional

## Personalização

O hook `usePdfExport` aceita opções para personalizar a exportação:

```typescript
interface PdfExportOptions {
	title?: string; // Título do documento
	includeHeader?: boolean; // Incluir cabeçalho
	includeFooter?: boolean; // Incluir rodapé
	orientation?: "portrait" | "landscape"; // Orientação
}
```

## Nomes de Arquivos

### Lista Completa

- Formato: `pacientes_YYYY-MM-DD.pdf`
- Exemplo: `pacientes_2025-05-27.pdf`

### Paciente Individual

- Formato: `paciente_NOME_PACIENTE_YYYY-MM-DD.pdf`
- Exemplo: `paciente_João_Silva_2025-05-27.pdf`

## Benefícios

1. **Relatórios Profissionais**: PDFs com layout profissional e organizado
2. **Flexibilidade**: Exportação em lote ou individual conforme necessidade
3. **Rastreabilidade**: Data e hora de geração incluídas automaticamente
4. **Usabilidade**: Interface intuitiva com tooltips explicativos
5. **Performance**: Geração rápida no lado do cliente
6. **Acessibilidade**: Funciona offline após carregamento dos dados

## Limitações e Considerações

1. **Tamanho da Lista**: Para listas muito grandes, considere implementar paginação na exportação
2. **Imagens**: Atualmente não inclui fotos dos pacientes (pode ser adicionado futuramente)
3. **Histórico**: Não inclui histórico de vacinações (escopo futuro)
4. **Personalização**: Layouts fixos (pode ser expandido para templates customizáveis)

## Próximos Passos Sugeridos

1. **Filtros Avançados**: Permitir exportação com filtros por data, idade, etc.
2. **Templates**: Adicionar múltiplos templates de PDF
3. **Gráficos**: Incluir gráficos e estatísticas nos relatórios
4. **Agendamento**: Permitir exportação automática/agendada
5. **Histórico de Vacinação**: Incluir dados de vacinação nos PDFs individuais
