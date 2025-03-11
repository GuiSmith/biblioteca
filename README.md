# biblioteca
biblioteca para disciplina de programação 1 Sistemas Unoesc
# Configuração de ambiente
## Banco de dados - PostgreSQL
Considerando que esteja em um ambiente linux ubuntu:

1. Instale o PostgreSQL:
``` bash
sudo apt update
sudo apt install postgresql postgresql-contrib 
```
1.1 Verifique se o serviço está em execução:
``` bash
sudo systemctl status postgresql
```

3.1 Conecta rao PostgreSQL como super usuário
``` bash
sudo -u postgres psql
```
3.2 Criar o banco de dados **biblioteca**:
``` sql
CREATE DATABASE biblioteca;
```
3.3 Criar o usuário
``` sql
CREATE USER biblioteca WITH PASSWORD 'Senha123@';
```
3.4 Conceder permissões
``` sql
GRANT ALL PRIVILEGES ON DATABASE biblioteca TO biblioteca;

GRANT USAGE ON SCHEMA public TO biblioteca;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO biblioteca;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO biblioteca;

GRANT CREATE ON SCHEMA public TO biblioteca;
```