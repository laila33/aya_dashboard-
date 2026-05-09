# Aya Sweets Dashboard Architecture (STRUCTURE.md)

## 1. Project Overview
Aya Sweets dashboard is a focused internal UI for menu control only. The system scope is intentionally small and includes:
- Category management
- Product management
- Basic store settings
- Menu preview access

This project does **not** include operational or SaaS-heavy modules (orders, analytics, payments, roles, reports, etc.).

Core stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

Design intent:
- Arabic-first, RTL layout
- Friendly bakery identity (pastel pink, soft rose, white)
- Minimal, clean, rounded, soft-shadow UI
- Right-side navigation with clear brand presence

## 2. App Routes
Planned routes:
- `/login`
- `/dashboard`
- `/dashboard/categories`
- `/dashboard/products`
- `/dashboard/settings`
- `/dashboard/preview`

Route behavior notes:
- `/dashboard` acts as a simple entry/overview page for navigation and lightweight summary.
- `/dashboard/preview` provides a button/link experience to open or simulate public menu preview.

## 3. Folder Structure
```text
src/
  app/
    login/
      page.tsx
    dashboard/
      layout.tsx
      page.tsx
      categories/
        page.tsx
      products/
        page.tsx
      settings/
        page.tsx
      preview/
        page.tsx

  components/
    layout/
      DashboardShell.tsx
      Sidebar.tsx
      DashboardHeader.tsx
      MobileSidebar.tsx

    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Textarea.tsx
      Select.tsx
      Switch.tsx
      Modal.tsx
      Badge.tsx
      EmptyState.tsx

    dashboard/
      StatCard.tsx
      DataTable.tsx
      CategoryRow.tsx
      ProductRow.tsx
      CategoryCard.tsx

    forms/
      CategoryForm.tsx
      ProductForm.tsx
      StoreSettingsForm.tsx

  data/
    mockCategories.ts
    mockProducts.ts
    mockStore.ts

  types/
    category.ts
    product.ts
    store.ts

  lib/
    cn.ts
    constants.ts
```

Notes:
- Feature pages remain under `app/` using App Router conventions.
- Reusable visual primitives stay in `components/ui`.
- Domain-level dashboard renderers stay in `components/dashboard`.
- Forms are isolated in `components/forms` to keep page components small.

## 4. Component Responsibilities
Layout components:
- `DashboardShell.tsx`: Main RTL dashboard frame (right sidebar + content region + mobile handling).
- `Sidebar.tsx`: Desktop right sidebar navigation, logo area, primary links, preview action.
- `DashboardHeader.tsx`: Top bar per dashboard page (title, optional action slot, contextual breadcrumbs if needed).
- `MobileSidebar.tsx`: Mobile drawer version of sidebar with same nav links and branding.

UI primitives:
- `Button.tsx`: Shared button variants (primary gradient, secondary, danger, ghost) with consistent radius.
- `Card.tsx`: Rounded container with soft border/shadow for sections and lists.
- `Input.tsx`: Text input base style for forms and filters.
- `Textarea.tsx`: Multi-line input for descriptions.
- `Select.tsx`: Category chooser and simple dropdown interactions.
- `Switch.tsx`: Active/inactive state toggles.
- `Modal.tsx`: Centered modal shell with dimmed overlay and close behavior.
- `Badge.tsx`: Small status labels (active/inactive, discount markers).
- `EmptyState.tsx`: Reusable empty-list placeholder for categories/products.

Dashboard components:
- `StatCard.tsx`: Lightweight KPI-like count card (only simple counts, no analytics charts).
- `DataTable.tsx`: Shared table wrapper for categories/products with consistent spacing and headers.
- `CategoryRow.tsx`: Single category row renderer with actions (edit/toggle/delete UI-only for now).
- `ProductRow.tsx`: Single product row renderer with category, price, discount, and actions.
- `CategoryCard.tsx`: Optional mobile-friendly category summary card.

Form components:
- `CategoryForm.tsx`: Add/edit category fields and validation display.
- `ProductForm.tsx`: Add/edit product fields, including optional discount fields.
- `StoreSettingsForm.tsx`: Store identity/contact/basic info fields.

## 5. Data Models (TypeScript)

### Category
```ts
export interface Category {
  id: string;
  name: string;
  image: string;
  isActive: boolean;
  productCount: number;
  sortOrder: number;
}
```

### Product
```ts
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  price: number;
  discountPercent?: number;
  priceAfterDiscount?: number;
  isActive: boolean;
  hasDiscount: boolean;
}
```

### Store
```ts
export interface Store {
  name: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  logo: string;
  currency: string;
}
```

Model notes:
- IDs are strings for flexibility with future backend integration.
- `discountPercent` and `priceAfterDiscount` are optional and used only when `hasDiscount` is true.

## 6. UI Rules
Mandatory UI constraints for all future implementation:
- RTL everywhere (`dir="rtl"` globally where appropriate).
- Sidebar is on the right; content area on the left.
- No analytics modules, no charts, no business intelligence widgets.
- Tables must keep simple bakery-dashboard feel and match reference spacing density.
- Modals are centered with dimmed overlay and clear primary action.
- Primary buttons use pink gradient styling.
- Use simple line-style icons.
- Cards use `rounded-2xl` baseline.
- Borders are soft pink (example family: `#F8D5DF`).
- Page/background tones follow soft pastel pink/rose family (example family: `#FFF6F8`, `#FDEBF1`).
- Visual tone must remain friendly and professional, never corporate-heavy or dark.

## 7. Development Batches

### Batch 1
- Project cleanup
- Global theme tokens (colors, radius, shadows, spacing)
- `STRUCTURE.md`
- Base App Router layout scaffolding

### Batch 2
- Login page UI (Arabic RTL, brand style)

### Batch 3
- Dashboard shell
- Right sidebar
- Header
- Responsive mobile sidebar behavior

### Batch 4
- Categories page
- Add/Edit category modal
- Category form wiring with mock data state

### Batch 5
- Products page
- Add/Edit product modal
- Product form wiring with mock data state

### Batch 6
- Settings page
- Store settings form and save button UI state

### Batch 7
- Responsive polish
- Framer Motion micro-interactions/transitions
- Final visual cleanup and consistency pass

## 8. Rules For Future Implementation
- Never build unrelated features beyond agreed scope.
- Never add analytics/charts/orders/payments/reports/roles.
- Keep components small and single-responsibility.
- Start with local mock data only.
- No backend integration yet.
- No real authentication logic yet (UI flow only).
- Keep codebase clean, typed, and scalable for later API integration.
- Favor reusable primitives over duplicated styling.

## Scope Guardrail (Strict)
Only these modules are in scope:
1. Login page
2. Dashboard layout
3. Categories management
4. Products management
5. Add/Edit category modal
6. Add/Edit product modal
7. Simple settings page
8. Preview menu link/button

Anything outside this list is excluded unless explicitly approved.
