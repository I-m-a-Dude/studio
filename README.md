# MediView - MRI Analysis Platform

This is a Next.js application built with Firebase Studio for visualizing and analyzing MRI scans.

## Getting Started

To get started with the project, take a look at the main page component in `src/pages/home.tsx`. The application is structured with a focus on simplicity and maintainability, using a clear separation of concerns between pages, components, utilities, and types.

## Project Structure

The `src` directory is organized as follows:

-   **`/app`**: Contains the Next.js routing files for the App Router. Each folder represents a URL segment.
-   **`/components`**: Holds all reusable React components.
    -   **`/components/ui`**: Contains the unstyled UI components from ShadCN.
-   **`/pages`**: Contains the main page components that are imported by the router files in `/app`.
-   **`/types`**: Stores all shared TypeScript type definitions and interfaces.
-   **`/utils`**: A home for utility functions, custom hooks, API service calls, and Zustand state management stores.

## Production Dependencies

- **Framework**: `next`
- **React**: `react`, `react-dom`
- **UI Components & Styling**:
  - `class-variance-authority`
  - `clsx`
  - `geist` (for fonts)
  - `lucide-react` (for icons)
  - `recharts` (for charts)
  - `@radix-ui/*` (for unstyled, accessible UI primitives)
  - `tailwind-merge`
  - `tailwindcss-animate`
- **MRI Processing**:
  - `nifti-reader-js` (for reading .nii files)
  - `pako` (for decompressing .nii.gz files)
- **State Management**: `zustand`
- **Utilities**: `zod`

## Development Dependencies

- **TypeScript & Types**: `@types/node`, `@types/pako`, `@types/react`, `@types/react-dom`, `typescript`
- **Styling**: `postcss`, `tailwindcss`
