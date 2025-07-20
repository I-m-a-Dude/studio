import { Logo } from '@/components/logo';
import { MriUploader } from '@/components/mri-uploader';

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background text-foreground p-4">
      <main className="flex flex-col items-center text-center w-full max-w-2xl">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          MRI Analysis Platform
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
          Upload your .nii or .nii.gz file to begin instant visualization and
          AI-powered analysis.
        </p>
        <MriUploader />
      </main>
    </div>
  );
}
