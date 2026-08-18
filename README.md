# StudyOS

Aplicação pessoal para acompanhar estudos para concursos públicos.

## Configuração inicial

1. Copie `.env.example` para `.env.local` e informe a URL e a chave pública do projeto Supabase.
2. No painel do Supabase, abra **SQL Editor > New query**.
3. Cole e execute o conteúdo de `supabase/migrations/20260818000100_initial_schema.sql`.
4. Em **Authentication > Users**, crie o usuário que será usado no StudyOS.
5. Inicie o app com `npm run dev` e acesse `http://localhost:3000`.

O script cria as tabelas `subjects`, `study_sessions` e `question_logs`, o enum de tipos de sessão, índices e políticas de acesso para usuários autenticados.
