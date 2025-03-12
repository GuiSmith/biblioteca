# Biblioteca
Biblioteca para disciplina de Programacão 1 - Sistemas Unoesc

## Configuração de Ambiente
### Banco de Dados - PostgreSQL

Considerando um ambiente Linux Ubuntu:

1. **Instale o PostgreSQL:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. **Verifique se o serviço está em execução:**
```bash
sudo systemctl status postgresql
```

3. **Configurar o Banco de Dados**

3.1 **Conectar ao PostgreSQL como superusuário:**
```bash
sudo -u postgres psql
```

3.2 **Criar o banco de dados `biblioteca`:**
```sql
CREATE DATABASE biblioteca;
```

3.3 **Criar o usuário `biblioteca_user`:**
```sql
CREATE USER biblioteca_user WITH PASSWORD 'Senha123@';
```

3.4 **Criar um schema específico para a aplicação:**
```sql
CREATE SCHEMA biblioteca_schema AUTHORIZATION biblioteca_user;
```

3.5 **Conceder permissões adequadas ao usuário no schema criado:**
```sql
GRANT USAGE, CREATE ON SCHEMA biblioteca_schema TO biblioteca_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA biblioteca_schema TO biblioteca_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA biblioteca_schema
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO biblioteca_user;
```

3.6 **Definir o schema padrão ao conectar no banco:**
```sql
ALTER ROLE biblioteca_user SET search_path TO biblioteca_schema;
```

### Conectar ao Banco
Para acessar o banco com o novo usuário:
```bash
psql -U biblioteca_user -d biblioteca -h localhost -W
```

