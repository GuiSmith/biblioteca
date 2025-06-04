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
psql -U postgres -h localhost
```

3.2 **Criar o banco de dados `biblioteca`:**
```sql
CREATE DATABASE biblioteca;
```

### Conectar ao Banco
Para acessar o banco com o novo usuário:
```bash
psql -U biblioteca_user -d biblioteca -h localhost -W
```

### Configurando migração

1. **Configurar arquivo .env**
Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL=postgresql://biblioteca_user:sua_senha@localhost:5432/biblioteca
```

Altere os valores conforme necessário para o seu ambiente.

2. **Execute a migração**
Utilize a ferramenta de migração do seu projeto (por exemplo, com o Prisma):

```bash
node migrate.js
```