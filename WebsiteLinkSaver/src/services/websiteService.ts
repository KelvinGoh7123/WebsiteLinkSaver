import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { WebsiteLink, WebsiteLinkInput } from "../types";

const COLLECTION_NAME = "websites";

export const websiteService = {
  // Add a new website link
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

  // Get all website links
  async getAllWebsites(): Promise<WebsiteLink[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      const websites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as WebsiteLink[];

      // Sort by creation date in memory
      return websites.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    } catch (error) {
      console.error("Error getting websites:", error);
      throw error;
    }
  },

  // Get favorite websites
  async getFavoriteWebsites(): Promise<WebsiteLink[]> {
    try {
      // First get all documents, then filter and sort in memory to avoid index requirements
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      const websites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as WebsiteLink[];

      // Filter favorites and sort by creation date
      return websites
        .filter((website) => website.isFavorite === true)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error getting favorite websites:", error);
      throw error;
    }
  },

  // Update a website link
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

  // Toggle favorite status
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

  // Delete a website link
  async deleteWebsite(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting website:", error);
      throw error;
    }
  },
};
