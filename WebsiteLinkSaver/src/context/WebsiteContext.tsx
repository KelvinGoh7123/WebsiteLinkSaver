import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { websiteService } from "../services/websiteService";
import { imageService } from "../services/imageService";
import { WebsiteLink, WebsiteLinkInput } from "../types";

interface WebsiteContextValue {
  websites: WebsiteLink[];
  loading: boolean;
  syncing: boolean;
  deleteWebsite: (id: string) => Promise<void>;
  updateWebsite: (
    id: string,
    data: Partial<WebsiteLinkInput>
  ) => Promise<void>;
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
}

const WebsiteContext = createContext<WebsiteContextValue | null>(null);

const shrinkAttempted = new Set<string>();
let shrinkQueue: WebsiteLink[] = [];
let shrinking = false;

async function drainShrinkQueue() {
  if (shrinking) return;
  shrinking = true;
  try {
    while (shrinkQueue.length > 0) {
      const website = shrinkQueue.shift();
      if (!website) continue;
      try {
        const compressed = await imageService.compressDataUrl(
          website.imageUrl
        );
        if (compressed.length + 5_000 < website.imageUrl.length) {
          await websiteService.updateWebsite(website.id, {
            imageUrl: compressed,
          });
        }
      } catch (error) {
        console.warn("Could not shrink stored image:", website.id, error);
      }
    }
  } finally {
    shrinking = false;
    if (shrinkQueue.length > 0) {
      void drainShrinkQueue();
    }
  }
}

function queueOversizedImages(websites: WebsiteLink[]) {
  for (const website of websites) {
    if (shrinkAttempted.has(website.id)) continue;
    if (!imageService.isOversizedDataUrl(website.imageUrl)) continue;
    shrinkAttempted.add(website.id);
    shrinkQueue.push(website);
  }
  void drainShrinkQueue();
}

export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [websites, setWebsites] = useState<WebsiteLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const reportedError = useRef(false);

  useEffect(() => {
    const unsubscribe = websiteService.subscribeToWebsites(
      (data, fromCache) => {
        // An empty local cache arrives before the server on a first visit.
        // Keep the spinner until the server answers, so the empty state does not flash.
        if (fromCache && data.length === 0) {
          return;
        }
        setWebsites(data);
        setLoading(false);
        setSyncing(fromCache);
        queueOversizedImages(data);
      },
      (error) => {
        console.error("Error loading websites:", error);
        setLoading(false);
        setSyncing(false);
        if (!reportedError.current) {
          reportedError.current = true;
          alert(
            "Failed to load websites. Please check your Firebase configuration."
          );
        }
      }
    );

    return unsubscribe;
  }, []);

  const deleteWebsite = (id: string) => websiteService.deleteWebsite(id);
  const updateWebsite = (id: string, data: Partial<WebsiteLinkInput>) =>
    websiteService.updateWebsite(id, data);
  const toggleFavorite = (id: string, isFavorite: boolean) =>
    websiteService.toggleFavorite(id, isFavorite);

  return (
    <WebsiteContext.Provider
      value={{
        websites,
        loading,
        syncing,
        deleteWebsite,
        updateWebsite,
        toggleFavorite,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsites = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error("useWebsites must be used within WebsiteProvider");
  }
  return context;
};
