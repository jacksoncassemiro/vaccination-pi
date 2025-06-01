# Esquema do Banco de Dados

Esta seção descreve a estrutura do banco de dados PostgreSQL utilizado pelo VacinaPI, gerenciado através do Supabase.

## Diagrama Entidade-Relacionamento (DER)

(Opcional: Se possível, inclua uma imagem ou representação textual do DER aqui para visualização das relações.)

## Tabelas Principais

### 1. `patients` (Pacientes)

Armazena informações sobre os pacientes cadastrados.

| Coluna               | Tipo de Dado               | Restrições                                 | Descrição                                                |
| -------------------- | -------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `id`                 | `uuid`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Identificador único do paciente (gerado automaticamente) |
| `created_at`         | `timestamp with time zone` | `DEFAULT now()`                            | Data e hora de criação do registro                       |
| `full_name`          | `text`                     | `NOT NULL`                                 | Nome completo do paciente                                |
| `cpf`                | `varchar(11)`              | `NOT NULL`, `UNIQUE`                       | CPF do paciente (sem formatação, 11 dígitos)             |
| `birth_date`         | `date`                     | `NOT NULL`                                 | Data de nascimento do paciente                           |
| `phone_number`       | `varchar(15)`              |                                            | Número de telefone do paciente                           |
| `address_cep`        | `varchar(8)`               |                                            | CEP do endereço (sem formatação, 8 dígitos)              |
| `address_street`     | `text`                     |                                            | Rua do endereço                                          |
| `address_number`     | `varchar(10)`              |                                            | Número do endereço                                       |
| `address_complement` | `text`                     |                                            | Complemento do endereço                                  |
| `address_district`   | `text`                     |                                            | Bairro do endereço                                       |
| `address_city`       | `text`                     |                                            | Cidade do endereço                                       |
| `address_state`      | `varchar(2)`               |                                            | UF do estado (ex: SP, RJ)                                |
| `user_id`            | `uuid`                     | `REFERENCES auth.users(id)`                | ID do usuário que cadastrou (opcional, se aplicável)     |

**Índices:**

- `idx_patients_cpf`: Índice na coluna `cpf` para buscas rápidas.
- `idx_patients_full_name`: Índice na coluna `full_name` para buscas por nome.

### 2. `vaccines` (Vacinas)

Armazena informações sobre os tipos de vacinas disponíveis.

| Coluna         | Tipo de Dado               | Restrições                                 | Descrição                                              |
| -------------- | -------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| `id`           | `uuid`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Identificador único da vacina (gerado automaticamente) |
| `created_at`   | `timestamp with time zone` | `DEFAULT now()`                            | Data e hora de criação do registro                     |
| `name`         | `text`                     | `NOT NULL`                                 | Nome da vacina (ex: Coronavac, Pfizer)                 |
| `manufacturer` | `text`                     | `NOT NULL`                                 | Fabricante da vacina                                   |
| `type`         | `text`                     |                                            | Tipo da vacina (ex: mRNA, Vetor Viral)                 |

**Índices:**

- `idx_vaccines_name`: Índice na coluna `name` para buscas rápidas.

### 3. `vaccination_records` (Registros de Vacinação)

Armazena os registros de vacinação, associando pacientes a vacinas.

| Coluna             | Tipo de Dado               | Restrições                                               | Descrição                                                |
| ------------------ | -------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `id`               | `uuid`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`               | Identificador único do registro (gerado automaticamente) |
| `created_at`       | `timestamp with time zone` | `DEFAULT now()`                                          | Data e hora de criação do registro                       |
| `patient_id`       | `uuid`                     | `NOT NULL`, `REFERENCES patients(id) ON DELETE CASCADE`  | ID do paciente vacinado                                  |
| `vaccine_id`       | `uuid`                     | `NOT NULL`, `REFERENCES vaccines(id) ON DELETE RESTRICT` | ID da vacina aplicada                                    |
| `application_date` | `date`                     | `NOT NULL`                                               | Data em que a dose foi aplicada                          |
| `dose_batch`       | `text`                     |                                                          | Lote da vacina aplicada                                  |
| `application_site` | `text`                     |                                                          | Local onde a vacina foi aplicada (UBS, etc.)             |
| `applicator_name`  | `text`                     |                                                          | Nome do profissional que aplicou a vacina                |
| `notes`            | `text`                     |                                                          | Observações adicionais sobre a aplicação                 |

**Índices:**

- `idx_vaccination_records_patient_id`: Para buscar registros por paciente.
- `idx_vaccination_records_vaccine_id`: Para buscar registros por vacina.
- `idx_vaccination_records_application_date`: Para filtrar registros por data.

## Relações

- Um `patient` pode ter muitos `vaccination_records`.
- Uma `vaccine` pode estar em muitos `vaccination_records`.
- Cada `vaccination_record` pertence a um único `patient` e a uma única `vaccine`.

## Script SQL para Criação das Tabelas

O script SQL para criar estas tabelas no Supabase está localizado em `docs/database_schema.sql`.

```sql
-- docs/database_schema.sql

-- Habilitar a extensão pgcrypto se ainda não estiver habilitada (necessária para gen_random_uuid())
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de Pacientes
CREATE TABLE public.patients (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    full_name text NOT NULL,
    cpf character varying(11) NOT NULL,
    birth_date date NOT NULL,
    phone_number character varying(15),
    address_cep character varying(8),
    address_street text,
    address_number character varying(10),
    address_complement text,
    address_district text,
    address_city text,
    address_state character varying(2),
    user_id uuid REFERENCES auth.users(id),
    CONSTRAINT patients_pkey PRIMARY KEY (id),
    CONSTRAINT patients_cpf_key UNIQUE (cpf)
);

-- Índices para a tabela de pacientes
CREATE INDEX idx_patients_cpf ON public.patients USING btree (cpf);
CREATE INDEX idx_patients_full_name ON public.patients USING btree (full_name);

-- Comentários para a tabela de pacientes e suas colunas
COMMENT ON TABLE public.patients IS 'Armazena informações sobre os pacientes cadastrados.';
COMMENT ON COLUMN public.patients.cpf IS 'CPF do paciente (sem formatação, 11 dígitos)';
COMMENT ON COLUMN public.patients.address_cep IS 'CEP do endereço (sem formatação, 8 dígitos)';
COMMENT ON COLUMN public.patients.address_state IS 'UF do estado (ex: SP, RJ)';


-- Tabela de Vacinas
CREATE TABLE public.vaccines (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    manufacturer text NOT NULL,
    type text,
    CONSTRAINT vaccines_pkey PRIMARY KEY (id)
);

-- Índices para a tabela de vacinas
CREATE INDEX idx_vaccines_name ON public.vaccines USING btree (name);

-- Comentários para a tabela de vacinas
COMMENT ON TABLE public.vaccines IS 'Armazena informações sobre os tipos de vacinas disponíveis.';
COMMENT ON COLUMN public.vaccines.name IS 'Nome da vacina (ex: Coronavac, Pfizer)';
COMMENT ON COLUMN public.vaccines.type IS 'Tipo da vacina (ex: mRNA, Vetor Viral)';


-- Tabela de Registros de Vacinação
CREATE TABLE public.vaccination_records (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    patient_id uuid NOT NULL,
    vaccine_id uuid NOT NULL,
    application_date date NOT NULL,
    dose_batch text,
    application_site text,
    applicator_name text,
    notes text,
    CONSTRAINT vaccination_records_pkey PRIMARY KEY (id),
    CONSTRAINT vaccination_records_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
    CONSTRAINT vaccination_records_vaccine_id_fkey FOREIGN KEY (vaccine_id) REFERENCES public.vaccines(id) ON DELETE RESTRICT
);

-- Índices para a tabela de registros de vacinação
CREATE INDEX idx_vaccination_records_patient_id ON public.vaccination_records USING btree (patient_id);
CREATE INDEX idx_vaccination_records_vaccine_id ON public.vaccination_records USING btree (vaccine_id);
CREATE INDEX idx_vaccination_records_application_date ON public.vaccination_records USING btree (application_date);

-- Comentários para a tabela de registros de vacinação
COMMENT ON TABLE public.vaccination_records IS 'Armazena os registros de vacinação, associando pacientes a vacinas.';
COMMENT ON COLUMN public.vaccination_records.application_site IS 'Local onde a vacina foi aplicada (UBS, etc.)';

-- Habilitar Row Level Security (RLS) para todas as tabelas (recomendado pelo Supabase)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (Exemplos - ajuste conforme necessário para sua lógica de autenticação/autorização)
-- Permitir que usuários autenticados leiam todos os pacientes
CREATE POLICY "Allow authenticated users to read patients"
ON public.patients
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuários autenticados insiram, atualizem e deletem seus próprios pacientes (se houver user_id)
-- CREATE POLICY "Allow users to manage their own patients"
-- ON public.patients
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados leiam todas as vacinas
CREATE POLICY "Allow authenticated users to read vaccines"
ON public.vaccines
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuários autenticados leiam todos os registros de vacinação
CREATE POLICY "Allow authenticated users to read vaccination records"
ON public.vaccination_records
FOR SELECT
TO authenticated
USING (true);

-- Adicionar políticas para INSERT, UPDATE, DELETE conforme a necessidade da aplicação.
-- Por exemplo, permitir que usuários autenticados criem registros de vacinação:
CREATE POLICY "Allow authenticated users to create vaccination records"
ON public.vaccination_records
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update vaccination records"
ON public.vaccination_records
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete vaccination records"
ON public.vaccination_records
FOR DELETE
TO authenticated
USING (true);


-- Se você tiver uma tabela de usuários específica no schema public (além da auth.users do Supabase)
-- e quiser relacionar, ajuste a referência user_id na tabela patients.
-- Por padrão, o Supabase usa auth.users para autenticação.

-- Considere adicionar mais índices conforme os padrões de consulta da sua aplicação se tornarem mais claros.
```

Este script deve ser executado no SQL Editor do seu projeto Supabase para configurar o banco de dados.
