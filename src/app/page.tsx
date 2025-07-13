import { MriUploader } from '@/components/mri-uploader';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground p-4">
      <header className="absolute top-0 left-0 p-6">
        <Logo />
      </header>
      <main className="flex flex-col items-center text-center w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          MRI Analysis Platform
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
          Upload your .nii or .nii.gz file to begin instant visualization and AI-powered analysis.
        </p>
        <MriUploader />
      </main>
      <footer className="absolute bottom-4 text-xs text-muted-foreground">
        MediView &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
