# Segurança e uso responsável

Este repositório é uma demonstração independente, sem operação real.

- Os dados de interface são fictícios e armazenados somente no `localStorage`.
- Não adicione CPF, telefone, e-mail, dados de saúde, nomes reais de colaboradores ou identificadores de clínicas.
- Não versione `.env`, senhas, tokens, chaves de API, URLs privadas, exportações de banco, logs reais ou arquivos de clientes.
- As rotas de API não acessam terceiros. O adapter Supabase é apenas um exemplo opcional e não é importado pelas rotas públicas.
- O emissor de tokens é didático e **não é uma autenticação de usuários real**.
- Não implemente envio a sistemas reais ou persistência de dados pessoais antes de uma revisão de segurança, privacidade e autorização.
- Antes de publicar, verifique também o histórico Git. A remoção de um segredo do commit atual não elimina o histórico anterior; credenciais já expostas devem ser revogadas e substituídas.
- Caso seja usado um repositório anteriormente associado a um projeto privado, prefira **criar um repositório novo**, sem preservar o histórico antigo.

Nunca copie arquivos de ambientes corporativos para este repositório.
