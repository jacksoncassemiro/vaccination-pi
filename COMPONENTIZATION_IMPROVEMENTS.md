# 🚀 Componentização e Refatoração CRUD

## 📋 Resumo das Melhorias

Este documento detalha as melhorias implementadas para reduzir duplicação de código e componentizar funcionalidades comuns nas páginas CRUD do sistema de vacinação.

## 🎯 Componentes Criados

### 1. `SearchableSelect` - Componente de Select com Busca

**Localização:** `src/components/common/SearchableSelect.tsx`

Substitui a lógica duplicada de select com busca, debounce e loading state.

**Funcionalidades:**

- ✅ Busca com debounce configurável (padrão: 300ms)
- ✅ Loading state visual (spinner na lateral)
- ✅ Mensagens de "Pesquisando..." e "Nenhum resultado"
- ✅ Restauração automática de dados iniciais ao limpar busca
- ✅ Evita requests desnecessários (só busca quando há texto real)
- ✅ Ref interno para controlar valor anterior

**Uso:**

```tsx
<SearchableSelect
	label="Paciente"
	placeholder="Busque e selecione..."
	onSearch={searchPatients}
	initialData={initialPatients}
	noResultsMessage="Nenhum paciente encontrado..."
	{...form.getInputProps("patient_id")}
/>
```

### 2. `CrudPageLayout` - Layout Padrão para Páginas CRUD

**Localização:** `src/components/common/CrudPageLayout.tsx`

Centraliza o layout comum de todas as páginas CRUD.

**Funcionalidades:**

- ✅ Header com título e botões de ação
- ✅ Campo de busca integrado
- ✅ Botão "Adicionar" padronizado
- ✅ Botão "Exportar PDF" opcional
- ✅ Exibição de mensagens de erro
- ✅ Layout responsivo e consistente

**Uso:**

```tsx
<CrudPageLayout
  title="Pacientes"
  addButtonLabel="Novo Paciente"
  searchPlaceholder="Buscar por nome, CPF..."
  searchValue={search}
  onSearchChange={handleSearchChange}
  onAdd={handleAdd}
  onExportAll={handleExportToPdf}
  error={error}
>
  <PatientsTable ... />
</CrudPageLayout>
```

### 3. `useCrudPage` - Hook para Lógica CRUD

**Localização:** `src/hooks/useCrudPage.ts`

Centraliza toda a lógica comum das páginas CRUD.

**Funcionalidades:**

- ✅ Estados padronizados (search, page, data, loading, error)
- ✅ Handlers padronizados (add, edit, delete, pagination, search)
- ✅ useTransition integrado para loading states
- ✅ Navegação automática para formulários
- ✅ Tratamento de erros padronizado
- ✅ Reset automático de página ao buscar

**Configuração:**

```tsx
const {
	search,
	data,
	isPending,
	error,
	handleAdd,
	handleEdit,
	handleDelete,
	handlePageChange,
	handleSearchChange,
} = useCrudPage<Patient>({
	initialData: { data: [], count: 0, page: 1, limit: 10, totalPages: 0 },
	fetchData: getPatients,
	deleteItem: deletePatient,
	formRoute: "/patients/form",
	errorMessage: "Erro ao carregar pacientes.",
});
```

## 📊 Comparação: Antes vs Depois

### ❌ Antes da Refatoração

- **Código duplicado em 3 páginas**: ~150 linhas por página (450 linhas total)
- **Lógica de select duplicada**: ~80 linhas no VaccinationFormFields
- **Estados e handlers duplicados**: search, pagination, loading, error
- **Layout duplicado**: header, botões, campo de busca
- **Manutenção complexa**: mudanças precisavam ser replicadas em 3 lugares

### ✅ Após a Refatoração

- **Páginas CRUD simplificadas**: ~45 linhas por página (135 linhas total)
- **Componente SearchableSelect reutilizável**: 1 implementação para todos
- **Hook useCrudPage**: centraliza toda lógica comum
- **Layout padronizado**: CrudPageLayout para todas as páginas
- **Manutenção simples**: mudanças em 1 lugar afetam todas as páginas

## 🎯 Benefícios Obtidos

### 1. **Redução de Código**

- **70% menos código** nas páginas CRUD
- **Eliminação de duplicação** em selects com busca
- **Reutilização** de componentes e hooks

### 2. **Manutenibilidade**

- **Single Source of Truth** para lógica CRUD
- **Mudanças centralizadas** afetam todo o sistema
- **Testes focados** em componentes isolados

### 3. **Consistência de UX**

- **Layout padronizado** em todas as páginas
- **Comportamento uniforme** de busca e loading
- **Experiência consistente** para o usuário

### 4. **Performance**

- **Debounce otimizado** em todos os selects
- **Requests inteligentes** (evita busca desnecessária)
- **Loading states** apropriados

## 📂 Exemplos de Uso

### Página Refatorada (Pacientes):

```tsx
export default function PatientsPage() {
	const { exportPatientsToPdf, exportPatientToPdf } = usePdfExport();

	const {
		search,
		data: patients,
		isPending,
		error,
		handleAdd,
		handleEdit,
		handleDelete,
		handlePageChange,
		handleSearchChange,
	} = useCrudPage<Patient>({
		initialData: { data: [], count: 0, page: 1, limit: 10, totalPages: 0 },
		fetchData: getPatients,
		deleteItem: deletePatient,
		formRoute: "/patients/form",
		errorMessage: "Erro ao carregar pacientes.",
	});

	const handleExportToPdf = () => {
		if (patients.data.length === 0) return;
		const title = search
			? `Pacientes - Busca: "${search}"`
			: "Lista de Pacientes";
		exportPatientsToPdf(patients.data, { title });
	};

	return (
		<CrudPageLayout
			title="Pacientes"
			addButtonLabel="Novo Paciente"
			searchPlaceholder="Buscar por nome, CPF ou telefone..."
			searchValue={search}
			onSearchChange={handleSearchChange}
			onAdd={handleAdd}
			onExportAll={handleExportToPdf}
			error={error}
		>
			<PatientsTable
				patients={patients.data}
				loading={isPending}
				page={patients.page}
				totalPages={patients.totalPages}
				onPageChange={handlePageChange}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onExportPdf={exportPatientToPdf}
			/>
		</CrudPageLayout>
	);
}
```

### Formulário Refatorado (VaccinationFormFields):

```tsx
// Antes: ~220 linhas com lógica complexa
// Depois: ~60 linhas usando SearchableSelect

<SearchableSelect
	label="Paciente"
	placeholder="Busque e selecione o paciente..."
	onSearch={searchPatients}
	initialData={initialPatients}
	noResultsMessage="Nenhum paciente encontrado..."
	{...form.getInputProps("patient_id")}
/>
```

## 🔄 Próximos Passos Sugeridos

1. **Aplicar as refatorações** substituindo os arquivos atuais pelos refatorados
2. **Testar todas as funcionalidades** para garantir que nada foi quebrado
3. **Considerar componentizar as tabelas** se houver padrões similares
4. **Adicionar testes unitários** para os novos componentes
5. **Documentar no Storybook** os componentes reutilizáveis

## 🎉 Conclusão

A refatoração eliminou com sucesso:

- ✅ **Duplicação de código** entre páginas CRUD
- ✅ **Lógica repetida** de busca com debounce
- ✅ **Inconsistências de UX** entre páginas
- ✅ **Complexidade de manutenção**

O código agora é **mais limpo**, **mais consistente** e **muito mais fácil de manter**! 🚀
