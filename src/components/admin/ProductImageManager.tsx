import { useRef, useState } from "react";
import { Upload, X, Star, Image as ImageIcon, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  mainImage: string | null;
  gallery: string[];
  onChange: (mainImage: string | null, gallery: string[]) => void;
};

const BUCKET = "product-images";

async function uploadOne(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function ProductImageManager({ mainImage, gallery, onChange }: Props) {
  const mainRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const setMain = (url: string | null) => onChange(url, gallery);
  const setGallery = (g: string[]) => onChange(mainImage, g);

  const handleMainFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    try {
      setMain(await uploadOne(f));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(files.map(uploadOne));
      const next = [...gallery, ...urls];
      onChange(mainImage ?? urls[0] ?? null, next);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const removeFromGallery = (url: string) => {
    setGallery(gallery.filter((u) => u !== url));
  };

  const promoteToMain = (url: string) => {
    const rest = gallery.filter((u) => u !== url);
    const previousMain = mainImage;
    onChange(url, previousMain && previousMain !== url ? [previousMain, ...rest] : rest);
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    if (!mainImage) setMain(u);
    else setGallery([...gallery, u]);
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div>
        <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Image principale</div>
        <div className="flex gap-3">
          <div className="relative h-32 w-32 flex-none border border-border bg-secondary/30">
            {mainImage ? (
              <>
                <img src={mainImage} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMain(null)}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 hover:bg-destructive hover:text-destructive-foreground"
                  aria-label="Retirer l'image principale"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => mainRef.current?.click()}
              className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest hover:bg-secondary disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" /> {mainImage ? "Changer l'image" : "Upload une image"}
            </button>
            <input ref={mainRef} type="file" accept="image/*" className="hidden" onChange={handleMainFile} />
            <div className="flex gap-1">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Coller une URL d'image"
                className="border border-border bg-transparent px-2 py-1 text-xs"
              />
              <button
                type="button"
                onClick={addUrl}
                className="inline-flex items-center gap-1 border border-border px-2 py-1 text-xs hover:bg-secondary"
              >
                <Link2 className="h-3 w-3" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Galerie ({gallery.length})</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => galleryRef.current?.click()}
            className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-secondary disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> Add à la galerie
          </button>
          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFiles} />
        </div>
        {gallery.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {gallery.map((url) => (
              <div key={url} className="group relative aspect-square border border-border bg-secondary/30">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-end justify-between gap-1 bg-black/40 p-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => promoteToMain(url)}
                    className="rounded bg-background/90 p-1 hover:bg-copper hover:text-white"
                    aria-label="Définir comme image principale"
                    title="Image principale"
                  >
                    <Star className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromGallery(url)}
                    className="rounded bg-background/90 p-1 hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Retirer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Aucune image dans la galerie.</p>
        )}
      </div>
      {busy && <p className="text-xs text-muted-foreground">Téléversement en cours…</p>}
    </div>
  );
}
