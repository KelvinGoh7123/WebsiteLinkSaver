import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  onSnapshot,
  Timestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { WebsiteLink, WebsiteLinkInput } from "../types";

const COLLECTION_NAME = "websites";

function mapWebsite(snapshot: QueryDocumentSnapshot): WebsiteLink {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name ?? "",
    url: data.url ?? "",
    imageUrl: data.imageUrl ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    isFavorite: data.isFavorite === true,
    createdAt: data.createdAt?.toDate?.() ?? new Date(0),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(0),
  };
}

function sortByNewest(websites: WebsiteLink[]): WebsiteLink[] {
  return [...websites].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export const websiteService = {
  async addWebsite(websiteData: WebsiteLinkInput): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...websiteData,
        isFavorite: websiteData.isFavorite || false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding website:", error);
      throw error;
    }
  },

  subscribeToWebsites(
    onData: (websites: WebsiteLink[], fromCache: boolean) => void,
    onError: (error: Error) => void
  ): () => void {
    const websitesQuery = query(collection(db, COLLECTION_NAME));
    return onSnapshot(
      websitesQuery,
      (snapshot) => {
        onData(
          sortByNewest(snapshot.docs.map(mapWebsite)),
          snapshot.metadata.fromCache
        );
      },
      (error) => onError(error)
    );
  },

  async updateWebsite(
    id: string,
    websiteData: Partial<WebsiteLinkInput>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...websiteData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating website:", error);
      throw error;
    }
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        isFavorite,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  },

  async renameCategory(ids: string[], category: string): Promise<void> {
    const next = category.trim();
    if (!next || ids.length === 0) return;

    try {
      for (let index = 0; index < ids.length; index += 400) {
        const batch = writeBatch(db);
        for (const id of ids.slice(index, index + 400)) {
          batch.update(doc(db, COLLECTION_NAME, id), {
            category: next,
            updatedAt: Timestamp.now(),
          });
        }
        await batch.commit();
      }
    } catch (error) {
      console.error("Error renaming category:", error);
      throw error;
    }
  },

  async deleteWebsite(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting website:", error);
      throw error;
    }
  },
};
