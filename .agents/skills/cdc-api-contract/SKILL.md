---
name: cdc-api-contract
description: Automates the generation of Consumer-Driven Contracts (CDC) API specifications (OpenAPI YAML) from Svelte frontend Zod schemas and Mock repositories.
---

# Consumer-Driven Contracts (CDC) API Generator

**Context:**
This skill helps agents bridge the Domain-Driven Design (DDD) frontend architecture with backend API generation by creating OpenAPI 3.0 YAML specifications based on the CDC pattern. It uses Zod schemas (as the single source of truth for the contract) and Mock Repositories (for injecting realistic example data).

**When to use:**
- User asks to "generate API contract", "create CDC contract", "sync API", or mentions "zod-to-openapi".
- User completes slicing a DDD module and wants to prepare the API specifications for the backend team.

## Workflow

1. **Understand the Target Module:**
   - Identify which domain module the user wants to generate a contract for (e.g., `auth`, `employee`, `attendance`).

2. **Prepare the Generation Approach:**
   - To keep the frontend autonomous, the contract is generated using a programmatic script.
   - If a generator script does not exist, write a Node.js utility script (e.g., in `scripts/generate-contract.ts`) that uses a library like `@asteasolutions/zod-to-openapi` or parses the schemas directly.
   - The script must read the target module's schemas from `src/lib/domain/[module].schema.ts` and mock examples from `src/lib/infrastructure/[module].repository.mock.ts`.

3. **Generate the OpenAPI File:**
   - The script must output a valid OpenAPI 3.0.x Specification in **YAML** format.
   - **Naming Convention & Location:** Save the generated file locally at `docs/api-contracts/[domain]/[api-contract-name].yaml` within the frontend repository (e.g., `docs/api-contracts/auth/auth-service.yaml`). This organized local directory will later act as the source directory for the GitHub Actions sync to `hris-docs`.

4. **Formatting Rules for the OpenAPI Contract:**
   - Request bodies, query parameters, and response structures must match the Zod schemas perfectly.
   - **Nested Objects over Flat Fields:** When referencing related entities, use nested objects instead of flat properties. For example, use `category: { id: string, name: string }` instead of `categoryId: string, categoryName: string`. This makes UI binding (like Comboboxes that need both a value and a display label) much more robust. This rule MUST be reflected in the Zod schemas themselves.
   - **Explicit Required/Optional Fields:** Clearly demarcate which fields are required and which are optional in the OpenAPI schema based on the Zod definitions (e.g., mapping Zod's `.optional()` to omitting it from the OpenAPI `required` array). This provides a strict guarantee to the Backend on exactly what payload shape must be served or accepted.
   - The dummy data extracted from the Mock repository MUST be injected into the `example` or `examples` field of the OpenAPI schema.
   - Ensure `operationId` clearly describes the action and aligns with the DDD Repository method name (e.g., `loginUser`, `getEmployeeById`).

5. **Limitations (Do Not Execute Yet):**
   - **DO NOT** set up GitHub Actions or remote syncing to the `hris-docs` repository automatically.
   - Simply generate the file locally. Syncing will be handled manually or by a separate future step.

6. **Post-Generation:**
   - Confirm to the user that the YAML file has been generated.
   - Briefly summarize the endpoints that were created in the contract.
