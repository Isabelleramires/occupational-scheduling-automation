# Arquitetura da demonstração

```text
                         ┌─────────────────────────┐
                         │ Navegador (dados demo)  │
                         │ Portal + Painel de gestão│
                         └────────────┬────────────┘
                                      │
                                  localStorage
                               (simulação local)

   Exemplo n8n             ┌──────────────────────────┐
   Webhook → Code ── HTTP →│ POST /api/integration-   │
                           │ preview (Node / Vercel)  │
                           └────────────┬─────────────┘
                                        │
                          validação → JSON normalizado
                                        │
                            SOAP XML ilustrativo
                           (NENHUM ENVIO EXTERNO)

   Exemplo opcional isolado: schema.sql + adapter Supabase
   (não importado pelo portal ou pelas APIs públicas)
```

## Fluxo visual

1. `index.html` lê uma convocação fictícia identificada na URL (`?id=DEMO-1001`).
2. O usuário confirma dados e exames, escolhe clínica, data e horário fictícios.
3. `data.js` persiste o resultado no `localStorage` deste navegador.
4. `prestador.html` consulta o mesmo armazenamento e atualiza o painel.
5. A página de integração oferece o endpoint REST separado do fluxo local.

## APIs demonstrativas

| Método | Caminho | Comportamento |
| --- | --- | --- |
| GET | `/api/health` | Retorna status de demonstração |
| POST | `/api/integration-preview` | Valida evento fictício e produz XML de exemplo |
| POST | `/api/demo-token` | Emite token HMAC opcional para ID fictício |
| GET | `/api/demo-token` | Valida o token recebido em `Authorization: Bearer ...` |

A emissão de token não concede acesso a dados protegidos; foi incluída exclusivamente para demonstrar assinatura, expiração e comparação segura.

## Ajustes para uso real (não incluídos)

Seriam necessários: login/autorização em backend, banco configurado para múltiplos usuários, bloqueio de slots de forma atômica, auditoria e retenção apropriada, revisão de privacidade, gerenciamento de credenciais e contratos documentados com provedores reais.
