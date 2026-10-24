import { FormEvent, useEffect, useRef, useState } from "react";
import { WebsiteLink } from "../types";
import { websiteService } from "../services/websiteService";
import { lookupPage } from "../services/metadataService";
import CategoryField, { useSavedCategories } from "./CategoryField";
import {
  ensureHttps,
  faviconUrl,
  findSavedWebsite,
  getLastCategory,
  looksLikeUrl,
  rememberCategory,
  resolveCategory,
  titleFromUrl,
} from "../utils/links";

interface QuickAddProps {
  websites: WebsiteLink[];
  onSaved: (name: string) => void;
  onShowExisting: (website: WebsiteLink) => void;
}

const QuickAdd = ({ websites, onSaved, onShowExisting }: QuickAddProps) => {
  const categories = useSavedCategories();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState(getLastCategory);
  const [expanded, setExpanded] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [detailsTouched, setDetailsTouched] = useState(false);
  const [duplicate, setDuplicate] = useState<WebsiteLink | null>(null);
  const websitesRef = useRef(websites);
  const nameTouchedRef = useRef(false);
  const detailsTouchedRef = useRef(false);
  websitesRef.current = websites;
  nameTouchedRef.current = nameTouched;
  detailsTouchedRef.current = detailsTouched;

  useEffect(() => {
    if (!looksLikeUrl(url)) {
      setDuplicate(null);
      return;
    }
    setDuplicate(findSavedWebsite(ensureHttps(url), websites) ?? null);
  }, [url, websites]);

  useEffect(() => {
    if (!looksLikeUrl(url)) {
      setLookingUp(false);
      return;
    }

    const normalized = ensureHttps(url);
    if (findSavedWebsite(normalized, websitesRef.current)) {
      setLookingUp(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      if (findSavedWebsite(normalized, websitesRef.current)) {
        setLookingUp(false);
        return;
      }
      setLookingUp(true);
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      lookupPage(normalized, controller.signal)
        .then((metadata) => {
          window.clearTimeout(timeout);
          if (!metadata || controller.signal.aborted) return;
          if (!nameTouchedRef.current) setName(metadata.title);
          if (!detailsTouchedRef.current) {
            setDescription(metadata.description);
            setImageUrl(metadata.imageUrl);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLookingUp(false);
        });
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [url]);

  const reset = () => {
    setUrl("");
    setName("");
    setDescription("");
    setImageUrl("");
    setExpanded(false);
    setNameTouched(false);
    setDetailsTouched(false);
    setDuplicate(null);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setName("");
    setDescription("");
    setImageUrl("");
    setNameTouched(false);
    setDetailsTouched(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!looksLikeUrl(url) || saving || duplicate) return;

    const normalized = ensureHttps(url);
    const existing = findSavedWebsite(normalized, websites);
    if (existing) {
      setDuplicate(existing);
      return;
    }

    try {
      setSaving(true);
      const metadata = await lookupPage(normalized);
      const resolvedCategory = resolveCategory(category, categories);
      const savedName = (nameTouched ? name : name || metadata?.title || titleFromUrl(normalized)).trim();
      const savedDescription = (detailsTouched ? description : description || metadata?.description || "").trim();
      const savedImage =
        (detailsTouched ? imageUrl : imageUrl || metadata?.imageUrl || faviconUrl(normalized)).trim();

      await websiteService.addWebsite({
        name: savedName || titleFromUrl(normalized),
        url: normalized,
        imageUrl: savedImage || faviconUrl(normalized),
        description: savedDescription,
        category: resolvedCategory,
        isFavorite: false,
      });

      rememberCategory(resolvedCategory);
      onSaved(savedName || titleFromUrl(normalized));
      reset();
      setCategory(resolvedCategory || getLastCategory());
    } catch (error) {
      console.error("Error saving link:", error);
      alert("Failed to save the link. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const ready = looksLikeUrl(url);

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(event) => handleUrlChange(event.target.value)}
          placeholder="Paste a link, like godly.website"
          className="input-field"
          aria-label="Link to save"
        />
        <button
          type="submit"
          className="btn-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!ready || saving || lookingUp || Boolean(duplicate)}
        >
          {saving ? "Saving..." : "Save link"}
        </button>
      </div>

      {lookingUp && (
        <p className="mt-2 text-sm text-gray-500">Looking up the page…</p>
      )}

      {duplicate && (
        <p className="mt-2 text-sm text-amber-700">
          Already saved as {duplicate.name}.{" "}
          <button
            type="button"
            onClick={() => onShowExisting(duplicate)}
            className="font-medium text-primary-700 hover:text-primary-800"
          >
            Show it
          </button>
        </p>
      )}

      {ready && !duplicate && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Saving as{" "}
            <span className="font-medium text-gray-900">
              {name || "this link"}
            </span>
          </p>
          <div className="mt-3">
            <CategoryField value={category} onChange={setCategory} />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {expanded ? "Hide details" : "Edit name, note, or image"}
          </button>
          {expanded && (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setNameTouched(true);
                  setName(event.target.value);
                }}
                placeholder="Website name"
                className="input-field"
              />
              <textarea
                value={description}
                onChange={(event) => {
                  setDetailsTouched(true);
                  setDescription(event.target.value);
                }}
                rows={3}
                placeholder="Notes"
                className="input-field resize-none"
              />
              <input
                type="text"
                inputMode="url"
                value={imageUrl}
                onChange={(event) => {
                  setDetailsTouched(true);
                  setImageUrl(event.target.value);
                }}
                placeholder="Image URL (optional)"
                className="input-field"
              />
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default QuickAdd;
