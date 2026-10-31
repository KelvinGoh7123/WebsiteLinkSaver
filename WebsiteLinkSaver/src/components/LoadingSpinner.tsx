import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-950" />
      <p className="mt-4 text-sm text-neutral-500">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
