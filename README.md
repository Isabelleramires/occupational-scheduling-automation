## 🗓️ Occupational Scheduling Automation

**Occupational Health Scheduling & Convocation Automation — Portfolio Demo**  
🔍 Connecting workflows, APIs, and user-centered digital solutions.

![Project Status](https://img.shields.io/badge/Status-Discontinued-6C757D?style=for-the-badge)
![Project Type](https://img.shields.io/badge/Type-Portfolio%20Demo-673AB7?style=for-the-badge)

---

### 🚀 About the Project

An experimental prototype designed to explore the automation of occupational health exam convocations and appointments. The project brings together **JavaScript, API development, workflow orchestration, and a web-based scheduling experience**.

Development was discontinued after the scheduling platform used in the original context introduced an equivalent feature. This repository is a **separately built, independent demonstration** for learning and portfolio purposes, not the original operational system.

> **Demo only:** All employees, clinics, events, and schedules are fictional. No real appointments are booked, no private systems are accessed, and no sensitive data or credentials are included.

---

### 🔧 Technical Skills

![REST API](https://img.shields.io/badge/REST%20API-009688?style=for-the-badge&logoColor=white)
![SOAP](https://img.shields.io/badge/SOAP%20%2F%20XML-607D8B?style=for-the-badge&logoColor=white)
![Automation](https://img.shields.io/badge/Workflow%20Automation-E91E63?style=for-the-badge&logoColor=white)
![HMAC](https://img.shields.io/badge/HMAC--SHA256-455A64?style=for-the-badge&logoColor=white)

---

### 💻 Programming & Databases

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

*PostgreSQL/Supabase are represented by an optional SQL schema and isolated adapter example; they are not connected to the live demo interface.*

---

### 🌐 Web Development

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)

*n8n is included as an importable sample workflow, not an active integration.*

---

### 📌 Main Features

- **Employee scheduling portal:** view a fictional convocation, required exams, available clinics, dates, and times.
- **Appointment confirmation & rescheduling:** simulate appointment changes and view a confirmation summary.
- **Management dashboard:** browse fictional convocations, filter by status, search, add sample records, and reset demo data.
- **REST integration example:** validate and normalize JSON, then generate a sample SOAP/XML payload without sending it externally.
- **Signed token example:** issue and verify time-limited HMAC tokens containing opaque demo identifiers, not personal information.
- **Integration references:** sample n8n workflow and optional Supabase schema/adapter for architectural exploration.

The scheduling portal and dashboard share data using browser `localStorage`. This makes the UI easy to explore **without a database or external account**, but does not provide real availability, multiuser synchronization, or production-grade authorization.

---

### 🖥️ Project Preview

| Employee Scheduling Portal | Management Dashboard |
| :---: | :---: |
| ![Demo scheduling portal](occupational-scheduling-automation/docs/preview-portal.png) | ![Demo management dashboard](occupational-scheduling-automation/docs/preview-dashboard.png) |
  

---

### ⚙️ Getting Started

**Requirements:** Node.js 20 or later. No external packages or accounts required.

```bash
npm start
```

Open the **[Scheduling Portal](http://localhost:3000)** or the **[Management Dashboard](http://localhost:3000/prestador.html)** locally. The portal and dashboard share demo data when opened in the same browser.

To run automated tests:

```bash
npm test
```

#### REST API Example

```bash
curl -X POST http://localhost:3000/api/integration-preview \
  -H "Content-Type: application/json" \
  -d '{"externalId":"DEMO-EVENT-001","examType":"Periódico","unit":"Unidade Demonstrativa","exams":["Avaliação clínica","Audiometria"]}'
```

This endpoint validates a fictional event and returns a normalized JSON response with illustrative SOAP/XML. **It never calls an external SOAP service.** The additional `/api/demo-token` endpoint demonstrates signed tokens; to use it, set a private `DEMO_TOKEN_SECRET` with at least 32 characters. Token issuance is illustrative, **not a complete authentication system**.

---

### 📂 Repository Structure

```text
api/                 REST demo endpoints
lib/                 Validation, integrations, and token examples
public/              Scheduling portal and dashboard
workflows/           Sample n8n workflow (inactive)
supabase/            Optional schema and adapter references
samples/             Fictional event payloads
tests/               Automated tests
docs/                Screenshots and architecture notes
server.js            Local Node.js server
vercel.json          Serverless route configuration
```

For more details, see [Architecture Notes](docs/ARQUITETURA.md) and [Security Notes](SECURITY.md).

---

### 🚧 Project Status

**Experimental project · Development discontinued · Independent portfolio demonstration**

The original exploration was discontinued after equivalent scheduling functionality became available in the software used at the time. The repository documents the technical concepts explored and offers a **safe, fictional implementation** for demonstration.

This is **not** production software: real systems, corporate authentication, live clinic calendars, message delivery, and multiuser persistence are intentionally outside its scope.

---

### 👩‍💻 Developed by

**Isabelle Ramires** · [@Ramirescodes0](https://github.com/Ramirescodes0)

*Portfolio project focused on integration, automation, and software development.*
