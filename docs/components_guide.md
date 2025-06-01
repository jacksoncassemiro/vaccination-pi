# Guia de Componentes Reutilizáveis

Esta seção documenta os principais componentes de UI reutilizáveis desenvolvidos especificamente para o projeto VacinaPI. O objetivo é fornecer uma referência rápida sobre como e quando utilizá-los.

Para componentes da biblioteca Mantine UI, consulte a [documentação oficial do Mantine](https://mantine.dev/).

[Voltar ao Índice](./index.md)

---

## Estrutura dos Componentes

Os componentes reutilizáveis estão localizados em `src/components/`. Eles são organizados nas seguintes subpastas:

- `src/components/ui/`: Componentes de UI genéricos e blocos de construção (botões, inputs, modais, etc.).
- `src/components/forms/`: Componentes específicos para formulários ou partes de formulários.
- `src/components/tables/`: Componentes para exibição e interação com tabelas de dados.
- `src/components/features/`: Componentes maiores que encapsulam funcionalidades específicas (ex: um card de resumo de paciente).
- `src/components/layouts/`: Componentes para a estrutura geral das páginas (ex: `BaseAppShell`).
- `src/components/charts/`: Componentes para visualização de dados (gráficos).

Cada subpasta geralmente contém um arquivo `index.ts` que exporta todos os componentes daquele diretório para facilitar as importações.

## Componentes Notáveis

Abaixo está uma lista de alguns componentes chave e como usá-los. Esta lista será expandida conforme o projeto evolui.

---

### 1. `SearchableSelect`

- **Localização**: `src/components/ui/SearchableSelect.tsx`
- **Descrição**: Um componente de select que permite busca e filtragem de opções. Construído sobre o `Select` do Mantine, mas com funcionalidades adicionais para lidar com grandes listas de dados ou busca assíncrona (se implementado).
- **Props Principais**:
  - `data`: `Array<{ value: string; label: string }>` - As opções para o select.
  - `label`: `string` - O rótulo do campo select.
  - `placeholder`: `string` - Texto de placeholder para o input.
  - `value`: `string | null` - O valor atualmente selecionado.
  - `onChange`: `(value: string | null) => void` - Função chamada quando o valor muda.
  - `error`: `string | ReactNode` - Mensagem de erro a ser exibida.
  - `required`: `boolean` - Se o campo é obrigatório.
  - `disabled`: `boolean` - Se o campo está desabilitado.
  - `onSearchChange`: `(query: string) => void` (Opcional) - Função para lidar com a mudança na busca, útil para selects com dados carregados dinamicamente.
- **Exemplo de Uso**:

  ```tsx
  import { SearchableSelect } from "@/components/ui";

  const MyFormComponent = () => {
  	const [selectedValue, setSelectedValue] = useState<string | null>(null);
  	const options = [
  		{ value: "option1", label: "Opção 1" },
  		{ value: "option2", label: "Opção 2" },
  	];

  	return (
  		<SearchableSelect
  			label="Selecione uma Opção"
  			placeholder="Digite para buscar..."
  			data={options}
  			value={selectedValue}
  			onChange={setSelectedValue}
  		/>
  	);
  };
  ```

---

### 2. `ConfirmationModal`

- **Localização**: `src/components/ui/ConfirmationModal.tsx`
- **Descrição**: Um modal genérico para solicitar confirmação do usuário antes de realizar uma ação destrutiva (ex: exclusão).
- **Props Principais**:
  - `opened`: `boolean` - Controla a visibilidade do modal.
  - `onClose`: `() => void` - Função chamada quando o modal é fechado (pelo botão de fechar ou clique fora).
  - `onConfirm`: `() => void` - Função chamada quando o usuário clica no botão de confirmação.
  - `title`: `string` - Título do modal.
  - `message`: `string | ReactNode` - Mensagem principal do modal.
  - `confirmText`: `string` (Opcional, default: "Confirmar") - Texto do botão de confirmação.
  - `cancelText`: `string` (Opcional, default: "Cancelar") - Texto do botão de cancelamento.
  - `isLoading`: `boolean` (Opcional) - Se `true`, exibe um loader no botão de confirmação.
- **Exemplo de Uso**:

  ```tsx
  import { ConfirmationModal } from "@/components/ui";
  import { useDisclosure } from "@mantine/hooks";
  import { Button } from "@mantine/core";

  const MyComponentWithDelete = () => {
  	const [opened, { open, close }] = useDisclosure(false);

  	const handleDelete = () => {
  		// Lógica de exclusão aqui
  		console.log("Item excluído");
  		close();
  	};

  	return (
  		<>
  			<Button color="red" onClick={open}>
  				Excluir Item
  			</Button>
  			<ConfirmationModal
  				opened={opened}
  				onClose={close}
  				onConfirm={handleDelete}
  				title="Confirmar Exclusão"
  				message="Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
  			/>
  		</>
  	);
  };
  ```

---

### 3. `FormPageLayout`

- **Localização**: `src/components/layouts/FormPageLayout.tsx`
- **Descrição**: Um layout padrão para páginas de formulário (cadastro/edição), fornecendo um título, um botão de voltar e uma área de conteúdo para o formulário.
- **Props Principais**:
  - `title`: `string` - O título da página do formulário.
  - `backHref`: `string` - O URL para onde o botão "Voltar" deve navegar.
  - `children`: `ReactNode` - O conteúdo do formulário.
- **Exemplo de Uso**:

  ```tsx
  // Em src/app/(authenticated)/patients/form/page.tsx
  import { FormPageLayout } from "@/components/layouts";
  import { PatientForm } from "@/components/forms"; // Exemplo de formulário

  export default function PatientFormPage() {
  	return (
  		<FormPageLayout title="Cadastrar Novo Paciente" backHref="/patients">
  			<PatientForm />
  		</FormPageLayout>
  	);
  }
  ```

---

### 4. `DataTable`

- **Localização**: `src/components/tables/DataTable.tsx`
- **Descrição**: Um componente para renderizar tabelas de dados com funcionalidades como paginação, ordenação e ações por linha. (Este componente pode ser uma abstração sobre `MantineDataTable` ou uma implementação customizada).
- **Props Principais (Exemplo)**:
  - `columns`: `Array<ColumnDefinition>` - Definição das colunas da tabela.
  - `data`: `Array<any>` - Os dados a serem exibidos.
  - `isLoading`: `boolean` - Indica se os dados estão carregando.
  - `pagination`: `PaginationProps` - Configurações de paginação.
  - `onRowClick`: `(row: any) => void` - Função chamada ao clicar em uma linha.
  - `actions`: `(row: any) => ReactNode` - Função que retorna elementos de ação para cada linha (ex: botões de editar/excluir).
- **Exemplo de Uso**:

  ```tsx
  // (Este é um exemplo conceitual, a API real pode variar)
  import { DataTable } from "@/components/tables";

  const PatientListPage = ({ patients, pagination }) => {
  	const columns = [
  		{ accessor: "full_name", Header: "Nome Completo" },
  		{ accessor: "cpf", Header: "CPF" },
  		// ... outras colunas
  	];

  	const handleEdit = (patient) => {
  		/* ... */
  	};
  	const handleDelete = (patient) => {
  		/* ... */
  	};

  	return (
  		<DataTable
  			columns={columns}
  			data={patients}
  			pagination={pagination}
  			actions={(patient) => (
  				<>
  					<Button size="xs" onClick={() => handleEdit(patient)}>
  						Editar
  					</Button>
  					<Button size="xs" color="red" onClick={() => handleDelete(patient)}>
  						Excluir
  					</Button>
  				</>
  			)}
  		/>
  	);
  };
  ```

---

### 5. `ConnectionStatus`

- **Localização**: `src/components/ui/ConnectionStatus.tsx`
- **Descrição**: Exibe um indicador visual do status da conexão com a internet.
- **Props Principais**: Nenhuma prop explícita, ele gerencia seu estado internamente.
- **Exemplo de Uso**:
  Geralmente incluído no layout principal da aplicação, como o `BaseAppShell.tsx`.
  ```tsx
  // Em src/components/layouts/BaseAppShell.tsx
  import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
  // ...
  return (
  	<AppShell /* ... */>
  		<AppShell.Header>
  			{/* ... */}
  			<ConnectionStatus />
  		</AppShell.Header>
  		{/* ... */}
  	</AppShell>
  );
  ```

---

_Esta documentação deve ser atualizada à medida que novos componentes são desenvolvidos ou os existentes são modificados._
