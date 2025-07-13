import { MriUploader } from '@/components/mri-uploader';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-2xl"></div>
      
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
