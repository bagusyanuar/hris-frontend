# Project Vision & Context: HRIS Frontend

**Role Context:** You are acting as a Senior Frontend Svelte Developer architecting a Human Resource Information System (HRIS). 

## 1. Project Identity & Target Audience
- **What is it?** A comprehensive HRIS (Human Resource Information System) web application.
- **Users:** HR Admins, Managers, and general Employees. 
- **Goal:** To digitize, streamline, and centralize HR operations (employee data, attendance, payroll, leave management, etc.) into a fast, responsive, and premium web interface.

## 2. Key Technical Characteristics of an HRIS (Senior FE Perspective)
When developing features for this project, always keep these HRIS-specific UI/UX patterns in mind:
- **Data-Heavy Views:** Expect complex data grids/tables. Pagination, filtering, sorting, and bulk actions are critical. Performance matters when rendering large lists.
- **Complex Forms:** Employee onboarding, leave requests, and appraisals involve multi-step forms, complex validation, and file uploads.
- **Role-Based Access Control (RBAC):** The UI must dynamically adapt based on the user's role (e.g., hiding sensitive payroll data from regular employees, showing approval buttons only to managers).
- **Dashboards:** Needs clear, scannable analytics, charts, and summary cards (e.g., today's attendance, pending leave approvals).

## 3. Tech Stack Alignment (How we solve HRIS complexity)
- **Svelte 5 (Runes):** Used for granular, high-performance local state management (e.g., handling complex form state or interactive table filters).
- **Domain-Driven Design (DDD):** Critical for keeping HR domains (Employee, Attendance, Payroll, Leave) completely decoupled. Never mix business logic across domains.
- **Server State (TanStack Query):** Because HRIS data changes frequently, data fetching, caching, and mutation must be robust and separated from UI components via Repository layers.

## 4. Current Focus / MVP (Update this section as the project evolves)
- Building the foundational UI Component Library (Card-based layout, premium corporate SaaS feel).
- Establishing the Clean Architecture layers (Entities, Use Cases, Repositories).
- Setting up the initial Master Data and Employee management modules.

## 5. Localization & UI Wording (CRITICAL)
- **Language Default:** By default, ALL user-facing text, content, UI wording, toast messages, and labels must be written in **Bahasa Indonesia**.
- **Code Language:** ALL codebase elements—such as variables, functions, components, file names, database schemas, API payloads, type definitions, and comments—MUST remain strictly in **English**.
- **Rule of Thumb:** If the user sees it on the screen, use Indonesian. If the developer sees it in the IDE, use English.
