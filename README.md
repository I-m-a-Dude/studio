# MediView - MRI Analysis Platform

This is a Next.js application built with Firebase Studio for visualizing and analyzing MRI scans.

## Getting Started

To get started with the project, take a look at the main page component in `src/pages/home.tsx`. The application is structured with a focus on simplicity and maintainability, using a clear separation of concerns between pages, components, utilities, and types.

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
