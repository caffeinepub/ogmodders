import {
  ArrowLeft,
  BarChart3,
  Car,
  ChevronRight,
  Code2,
  Crosshair,
  Download,
  ExternalLink,
  Map as MapIcon,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  Shield,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiDiscord, SiX, SiYoutube } from "react-icons/si";

// ── Types ──────────────────────────────────────────────────────
interface Mod {
  id: number;
  title: string;
  category: string;
  author: string;
  tags: string[];
  image: string;
  description: string;
  downloadUrl: string;
}

// ── Constants ──────────────────────────────────────────────────
const INITIAL_MODS: Mod[] = [];

const CATEGORIES_LIST = ["Vehicles", "Weapons", "Scripts", "Maps", "Player"];

const ADMIN_PIN = "4098203457810923";

// ── Category style helpers ─────────────────────────────────────
function getCategoryClass(category: string): string {
  const map: Record<string, string> = {
    Vehicles: "cat-vehicles",
    Weapons: "cat-weapons",
    Scripts: "cat-scripts",
    Maps: "cat-maps",
    Player: "cat-player",
  };
  return map[category] ?? "cat-vehicles";
}

// ── Hover helpers ──────────────────────────────────────────────
function applyHover(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(el.style, styles);
}

// ── Animated Counter ──────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const display =
    target >= 1_000_000
      ? `${(count / 1_000_000).toFixed(1)}M`
      : target >= 1_000
        ? `${(count / 1_000).toFixed(0)}K`
        : count.toString();

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ── PIN Modal ──────────────────────────────────────────────────
function PinModal({
  isOpen,
  onSuccess,
  onClose,
}: {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (pin === ADMIN_PIN) {
      setPin("");
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[79]"
        style={{ background: "oklch(0 0 0 / 0.55)" }}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
      />
      {/* Modal panel */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-sm animate-slide-in-up pointer-events-auto"
          onKeyDown={handleKeyDown}
          style={{
            background: "oklch(0.10 0 0)",
            border: "1px solid oklch(0.25 0 0)",
            borderRadius: "4px",
            boxShadow: "0 24px 64px oklch(0 0 0 / 0.6)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid oklch(0.20 0 0)" }}
          >
            <div className="flex items-center gap-2.5">
              <Shield
                className="w-4 h-4"
                style={{ color: "oklch(0.82 0.20 128)" }}
              />
              <h2
                className="font-display font-black text-sm uppercase tracking-widest"
                style={{ color: "oklch(0.90 0 0)" }}
              >
                Admin Access
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center transition-colors"
              style={{ color: "oklch(0.50 0 0)", borderRadius: "2px" }}
              onMouseEnter={(e) =>
                applyHover(e.currentTarget as HTMLElement, {
                  color: "oklch(0.82 0.20 128)",
                })
              }
              onMouseLeave={(e) =>
                applyHover(e.currentTarget as HTMLElement, {
                  color: "oklch(0.50 0 0)",
                })
              }
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p
              className="font-body text-xs mb-4"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Enter your admin PIN to access the Mod Manager.
            </p>

            <div className="mb-4">
              <label
                htmlFor="pin-input"
                className="font-display font-bold text-[10px] uppercase tracking-widest block mb-1.5"
                style={{ color: "oklch(0.50 0 0)" }}
              >
                PIN
              </label>
              <input
                ref={inputRef}
                id="pin-input"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter PIN..."
                autoComplete="current-password"
                className="w-full px-3 py-2.5 text-sm font-mono-gta outline-none transition-all"
                style={{
                  background: "oklch(0.15 0 0)",
                  border: error
                    ? "1px solid oklch(0.55 0.22 22)"
                    : "1px solid oklch(0.28 0 0)",
                  borderRadius: "2px",
                  color: "oklch(0.90 0 0)",
                  letterSpacing: "0.2em",
                }}
                onFocus={(e) =>
                  !error &&
                  applyHover(e.target as HTMLElement, {
                    borderColor: "oklch(0.82 0.20 128 / 0.6)",
                    boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                  })
                }
                onBlur={(e) =>
                  !error &&
                  applyHover(e.target as HTMLElement, {
                    borderColor: "oklch(0.28 0 0)",
                    boxShadow: "none",
                  })
                }
              />
              {error && (
                <p
                  className="mt-1.5 font-display font-bold text-[10px] uppercase tracking-wider animate-slide-in-up"
                  style={{ color: "oklch(0.65 0.22 22)" }}
                >
                  Incorrect PIN — try again
                </p>
              )}
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2.5 font-display font-black text-xs uppercase tracking-widest transition-all duration-150"
                style={{
                  background: "oklch(0.82 0.20 128)",
                  color: "oklch(0.08 0 0)",
                  borderRadius: "2px",
                  boxShadow: "0 0 14px oklch(0.82 0.20 128 / 0.35)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    boxShadow:
                      "0 0 22px oklch(0.82 0.20 128 / 0.55), 0 2px 10px oklch(0.82 0.20 128 / 0.3)",
                  })
                }
                onMouseLeave={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    boxShadow: "0 0 14px oklch(0.82 0.20 128 / 0.35)",
                  })
                }
              >
                Unlock
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 font-display font-black text-xs uppercase tracking-widest transition-all duration-150"
                style={{
                  background: "transparent",
                  color: "oklch(0.55 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    color: "oklch(0.80 0 0)",
                    borderColor: "oklch(0.38 0 0)",
                  })
                }
                onMouseLeave={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    color: "oklch(0.55 0 0)",
                    borderColor: "oklch(0.25 0 0)",
                  })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Admin Panel ───────────────────────────────────────────────
const EMPTY_FORM: Omit<Mod, "id"> = {
  title: "",
  category: "Vehicles",
  author: "",
  tags: [],
  image: "",
  description: "",
  downloadUrl: "",
};

function AdminPanel({
  mods,
  setMods,
  isOpen,
  onClose,
}: {
  mods: Mod[];
  setMods: React.Dispatch<React.SetStateAction<Mod[]>>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [editingMod, setEditingMod] = useState<Mod | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Mod, "id">>(EMPTY_FORM);

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingMod(null);
    setIsAdding(true);
  };

  const openEdit = (mod: Mod) => {
    setFormData({
      title: mod.title,
      category: mod.category,
      author: mod.author,
      tags: mod.tags,
      image: mod.image,
      description: mod.description,
      downloadUrl: mod.downloadUrl,
    });
    setEditingMod(mod);
    setIsAdding(true);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingMod(null);
    setFormData(EMPTY_FORM);
  };

  const saveForm = () => {
    if (!formData.title.trim()) return;
    if (editingMod) {
      setMods((prev) =>
        prev.map((m) =>
          m.id === editingMod.id ? { ...formData, id: editingMod.id } : m,
        ),
      );
    } else {
      setMods((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    cancelForm();
  };

  const deleteMod = (mod: Mod) => {
    if (window.confirm(`Delete "${mod.title}"? This cannot be undone.`)) {
      setMods((prev) => prev.filter((m) => m.id !== mod.id));
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "oklch(0.14 0 0)",
    border: "1px solid oklch(0.24 0 0)",
    color: "oklch(0.88 0 0)",
    borderRadius: "2px",
    outline: "none",
    width: "100%",
    padding: "8px 12px",
    fontSize: "12px",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    color: "oklch(0.50 0 0)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: "4px",
    fontFamily: '"Bricolage Grotesque", sans-serif',
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60]"
          style={{ background: "oklch(0 0 0 / 0.6)" }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close panel"
        />
      )}

      {/* Slide-in Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] flex flex-col overflow-hidden"
        style={{
          width: "min(480px, 100vw)",
          background: "oklch(0.10 0 0)",
          borderLeft: "1px solid oklch(0.22 0 0)",
          boxShadow: "-8px 0 40px oklch(0 0 0 / 0.6)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Panel Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            borderBottom: "1px solid oklch(0.20 0 0)",
            background: "oklch(0.07 0 0)",
          }}
        >
          <div className="flex items-center gap-3">
            <Settings
              className="w-5 h-5"
              style={{ color: "oklch(0.82 0.20 128)" }}
            />
            <h2
              className="font-display font-black text-base uppercase tracking-widest"
              style={{ color: "oklch(0.82 0.20 128)" }}
            >
              Mod Manager
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-all duration-150"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.25 0 0)",
              color: "oklch(0.55 0 0)",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                color: "oklch(0.82 0.20 128)",
                borderColor: "oklch(0.82 0.20 128 / 0.4)",
              })
            }
            onMouseLeave={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                color: "oklch(0.55 0 0)",
                borderColor: "oklch(0.25 0 0)",
              })
            }
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!isAdding ? (
            /* ── Mod List ───────────────────────────────── */
            <div className="p-6">
              {/* Add New Mod Button */}
              <button
                type="button"
                onClick={openAdd}
                className="w-full flex items-center justify-center gap-2 py-3 mb-6 font-display font-black text-xs uppercase tracking-widest transition-all duration-150"
                style={{
                  background: "oklch(0.82 0.20 128)",
                  color: "oklch(0.08 0 0)",
                  borderRadius: "2px",
                  boxShadow: "0 0 16px oklch(0.82 0.20 128 / 0.3)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    boxShadow:
                      "0 0 24px oklch(0.82 0.20 128 / 0.5), 0 2px 12px oklch(0.82 0.20 128 / 0.3)",
                  })
                }
                onMouseLeave={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    boxShadow: "0 0 16px oklch(0.82 0.20 128 / 0.3)",
                  })
                }
              >
                <Plus className="w-4 h-4" />
                Add New Mod
              </button>

              {/* Stats */}
              <div
                className="flex items-center gap-2 mb-4 px-3 py-2"
                style={{
                  background: "oklch(0.14 0 0)",
                  border: "1px solid oklch(0.20 0 0)",
                  borderRadius: "2px",
                }}
              >
                <BarChart3
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.82 0.20 128)" }}
                />
                <span
                  className="font-mono-gta text-xs font-semibold"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  {mods.length} mod{mods.length !== 1 ? "s" : ""} total
                </span>
              </div>

              {/* Mod list */}
              {mods.length === 0 ? (
                <div
                  className="py-10 text-center"
                  style={{ color: "oklch(0.38 0 0)" }}
                >
                  <p className="font-display font-bold text-xs uppercase tracking-wider">
                    No mods yet
                  </p>
                  <p className="font-body text-xs mt-1">
                    Click "Add New Mod" to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mods.map((mod) => (
                    <div
                      key={mod.id}
                      className="flex items-center gap-3 p-3"
                      style={{
                        background: "oklch(0.14 0 0)",
                        border: "1px solid oklch(0.20 0 0)",
                        borderRadius: "2px",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-display font-bold text-xs uppercase tracking-wide truncate"
                          style={{ color: "oklch(0.88 0 0)" }}
                        >
                          {mod.title}
                        </p>
                        <span
                          className={`text-[9px] font-display font-bold uppercase tracking-wider px-1.5 py-0.5 mt-1 inline-block ${getCategoryClass(mod.category)}`}
                          style={{ borderRadius: "2px" }}
                        >
                          {mod.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => openEdit(mod)}
                          className="w-7 h-7 flex items-center justify-center transition-all duration-150"
                          style={{
                            background: "oklch(0.17 0 0)",
                            border: "1px solid oklch(0.26 0 0)",
                            color: "oklch(0.55 0 0)",
                            borderRadius: "2px",
                          }}
                          onMouseEnter={(e) =>
                            applyHover(e.currentTarget as HTMLElement, {
                              color: "oklch(0.82 0.20 128)",
                              borderColor: "oklch(0.82 0.20 128 / 0.4)",
                              background: "oklch(0.82 0.20 128 / 0.1)",
                            })
                          }
                          onMouseLeave={(e) =>
                            applyHover(e.currentTarget as HTMLElement, {
                              color: "oklch(0.55 0 0)",
                              borderColor: "oklch(0.26 0 0)",
                              background: "oklch(0.17 0 0)",
                            })
                          }
                          aria-label={`Edit ${mod.title}`}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMod(mod)}
                          className="w-7 h-7 flex items-center justify-center transition-all duration-150"
                          style={{
                            background: "oklch(0.17 0 0)",
                            border: "1px solid oklch(0.26 0 0)",
                            color: "oklch(0.55 0 0)",
                            borderRadius: "2px",
                          }}
                          onMouseEnter={(e) =>
                            applyHover(e.currentTarget as HTMLElement, {
                              color: "oklch(0.60 0.22 22)",
                              borderColor: "oklch(0.60 0.22 22 / 0.4)",
                              background: "oklch(0.60 0.22 22 / 0.1)",
                            })
                          }
                          onMouseLeave={(e) =>
                            applyHover(e.currentTarget as HTMLElement, {
                              color: "oklch(0.55 0 0)",
                              borderColor: "oklch(0.26 0 0)",
                              background: "oklch(0.17 0 0)",
                            })
                          }
                          aria-label={`Delete ${mod.title}`}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Add / Edit Form ──────────────────────── */
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                {editingMod ? (
                  <Pencil
                    className="w-4 h-4"
                    style={{ color: "oklch(0.82 0.20 128)" }}
                  />
                ) : (
                  <Plus
                    className="w-4 h-4"
                    style={{ color: "oklch(0.82 0.20 128)" }}
                  />
                )}
                <h3
                  className="font-display font-black text-sm uppercase tracking-widest"
                  style={{ color: "oklch(0.82 0.20 128)" }}
                >
                  {editingMod ? "Edit Mod" : "Add New Mod"}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="mod-title" style={labelStyle}>
                    Title *
                  </label>
                  <input
                    id="mod-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Mod title..."
                    style={inputStyle}
                    onFocus={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.82 0.20 128 / 0.6)",
                        boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                      })
                    }
                    onBlur={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.24 0 0)",
                        boxShadow: "none",
                      })
                    }
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="mod-category" style={labelStyle}>
                    Category
                  </label>
                  <select
                    id="mod-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.82 0.20 128 / 0.6)",
                        boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                      })
                    }
                    onBlur={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.24 0 0)",
                        boxShadow: "none",
                      })
                    }
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option
                        key={c}
                        value={c}
                        style={{
                          background: "oklch(0.14 0 0)",
                          color: "oklch(0.82 0.20 128)",
                        }}
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="mod-author" style={labelStyle}>
                    Author
                  </label>
                  <input
                    id="mod-author"
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, author: e.target.value }))
                    }
                    placeholder="Your username..."
                    style={inputStyle}
                    onFocus={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.82 0.20 128 / 0.6)",
                        boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                      })
                    }
                    onBlur={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.24 0 0)",
                        boxShadow: "none",
                      })
                    }
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="mod-description" style={labelStyle}>
                    Description
                  </label>
                  <textarea
                    id="mod-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your mod..."
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "88px",
                    }}
                    onFocus={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.82 0.20 128 / 0.6)",
                        boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                      })
                    }
                    onBlur={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.24 0 0)",
                        boxShadow: "none",
                      })
                    }
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="mod-tags" style={labelStyle}>
                    Tags{" "}
                    <span style={{ color: "oklch(0.38 0 0)" }}>
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    id="mod-tags"
                    type="text"
                    value={formData.tags.join(", ")}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="realistic, cars, hd..."
                    style={inputStyle}
                    onFocus={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.82 0.20 128 / 0.6)",
                        boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                      })
                    }
                    onBlur={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.24 0 0)",
                        boxShadow: "none",
                      })
                    }
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="mod-image" style={labelStyle}>
                    Image URL
                  </label>
                  <input
                    id="mod-image"
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, image: e.target.value }))
                    }
                    placeholder="https://... or /assets/..."
                    style={inputStyle}
                    onFocus={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.82 0.20 128 / 0.6)",
                        boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                      })
                    }
                    onBlur={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.24 0 0)",
                        boxShadow: "none",
                      })
                    }
                  />
                </div>

                {/* Download URL */}
                <div>
                  <label htmlFor="mod-download-url" style={labelStyle}>
                    Download URL
                  </label>
                  <input
                    id="mod-download-url"
                    type="text"
                    value={formData.downloadUrl}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        downloadUrl: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    style={inputStyle}
                    onFocus={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.82 0.20 128 / 0.6)",
                        boxShadow: "0 0 10px oklch(0.82 0.20 128 / 0.15)",
                      })
                    }
                    onBlur={(e) =>
                      applyHover(e.target as HTMLElement, {
                        borderColor: "oklch(0.24 0 0)",
                        boxShadow: "none",
                      })
                    }
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={saveForm}
                    className="flex-1 py-3 font-display font-black text-xs uppercase tracking-widest transition-all duration-150"
                    style={{
                      background: "oklch(0.82 0.20 128)",
                      color: "oklch(0.08 0 0)",
                      borderRadius: "2px",
                      boxShadow: "0 0 14px oklch(0.82 0.20 128 / 0.3)",
                    }}
                    onMouseEnter={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        boxShadow:
                          "0 0 22px oklch(0.82 0.20 128 / 0.5), 0 2px 10px oklch(0.82 0.20 128 / 0.3)",
                      })
                    }
                    onMouseLeave={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        boxShadow: "0 0 14px oklch(0.82 0.20 128 / 0.3)",
                      })
                    }
                  >
                    {editingMod ? "Save Changes" : "Add Mod"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex-1 py-3 font-display font-black text-xs uppercase tracking-widest transition-all duration-150"
                    style={{
                      background: "transparent",
                      color: "oklch(0.55 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "2px",
                    }}
                    onMouseEnter={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        color: "oklch(0.82 0 0)",
                        borderColor: "oklch(0.38 0 0)",
                      })
                    }
                    onMouseLeave={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        color: "oklch(0.55 0 0)",
                        borderColor: "oklch(0.25 0 0)",
                      })
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar({
  searchQuery,
  onSearchChange,
  onAdminClick,
}: {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onAdminClick: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Mods", href: "#mods" },
    { label: "Vehicles", href: "#vehicles" },
    { label: "Weapons", href: "#weapons" },
    { label: "Scripts", href: "#scripts" },
    { label: "Maps", href: "#maps" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.08 0 0 / 0.98)"
          : "oklch(0.08 0 0 / 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "oklch(0.28 0 0)" : "oklch(0.22 0 0)"}`,
        boxShadow: scrolled ? "0 4px 30px oklch(0 0 0 / 0.35)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a href="#home" className="flex-shrink-0">
            <img
              src="/assets/generated/ogmodders-logo-transparent.dim_600x150.png"
              alt="OGModders"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-xs font-display font-bold tracking-widest"
                style={{ color: "oklch(0.68 0 0)" }}
                onMouseEnter={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    color: "oklch(0.82 0.20 128)",
                  })
                }
                onMouseLeave={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    color: "oklch(0.68 0 0)",
                  })
                }
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: "oklch(0.82 0.20 128)" }}
              />
              <input
                type="text"
                placeholder="SEARCH MODS..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-display font-semibold tracking-wider outline-none transition-all"
                style={{
                  background: "oklch(0.14 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "2px",
                  color: "oklch(0.90 0 0)",
                }}
                onFocus={(e) =>
                  applyHover(e.target as HTMLElement, {
                    borderColor: "oklch(0.82 0.20 128 / 0.6)",
                    boxShadow: "0 0 12px oklch(0.82 0.20 128 / 0.18)",
                  })
                }
                onBlur={(e) =>
                  applyHover(e.target as HTMLElement, {
                    borderColor: "oklch(0.25 0 0)",
                    boxShadow: "none",
                  })
                }
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Admin button */}
            <button
              type="button"
              onClick={onAdminClick}
              className="flex items-center gap-1.5 px-3 py-2 font-display font-black text-[10px] uppercase tracking-widest transition-all duration-150"
              style={{
                background: "oklch(0.82 0.20 128 / 0.14)",
                border: "1px solid oklch(0.82 0.20 128 / 0.38)",
                color: "oklch(0.82 0.20 128)",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) =>
                applyHover(e.currentTarget as HTMLElement, {
                  background: "oklch(0.82 0.20 128 / 0.24)",
                  borderColor: "oklch(0.82 0.20 128 / 0.65)",
                  boxShadow: "0 0 12px oklch(0.82 0.20 128 / 0.2)",
                })
              }
              onMouseLeave={(e) =>
                applyHover(e.currentTarget as HTMLElement, {
                  background: "oklch(0.82 0.20 128 / 0.14)",
                  borderColor: "oklch(0.82 0.20 128 / 0.38)",
                  boxShadow: "none",
                })
              }
              aria-label="Admin panel"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: "oklch(0.82 0.20 128)" }}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="lg:hidden pb-4 pt-2 border-t"
            style={{ borderColor: "oklch(0.22 0 0)" }}
          >
            {/* Mobile search */}
            <div className="relative mb-3">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: "oklch(0.82 0.20 128)" }}
              />
              <input
                type="text"
                placeholder="SEARCH MODS..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-display font-semibold tracking-wider outline-none"
                style={{
                  background: "oklch(0.14 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "2px",
                  color: "oklch(0.90 0 0)",
                }}
              />
            </div>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2 px-3 text-xs font-display font-bold tracking-widest transition-colors"
                style={{ color: "oklch(0.65 0 0)" }}
                onClick={() => setMenuOpen(false)}
                onMouseEnter={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    color: "oklch(0.82 0.20 128)",
                  })
                }
                onMouseLeave={(e) =>
                  applyHover(e.currentTarget as HTMLElement, {
                    color: "oklch(0.65 0 0)",
                  })
                }
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ── Hero Section ───────────────────────────────────────────────
function HeroSection({ modCount }: { modCount: number }) {
  return (
    <section
      id="home"
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background hero image with dark overlay (hero stays dark on white page) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1400x500.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.06 0 0 / 0.80) 0%, oklch(0.06 0 0 / 0.65) 35%, oklch(0.06 0 0 / 0.88) 78%, oklch(0.06 0 0) 100%)",
        }}
      />
      {/* Side vignettes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, oklch(0.06 0 0 / 0.75) 0%, transparent 28%, transparent 72%, oklch(0.06 0 0 / 0.75) 100%)",
        }}
      />
      {/* Fine scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 0.025) 2px, oklch(0 0 0 / 0.025) 4px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-16">
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 text-xs font-display font-bold tracking-widest uppercase animate-slide-in-up"
          style={{
            background: "oklch(0.82 0.20 128 / 0.12)",
            border: "1px solid oklch(0.82 0.20 128 / 0.32)",
            color: "oklch(0.82 0.20 128)",
            borderRadius: "2px",
          }}
        >
          <Zap className="w-3 h-3 animate-pulse-glow" />
          LOS SANTOS&#39; FINEST MOD HUB
        </div>

        {/* Main headline */}
        <h1
          className="font-display font-black uppercase leading-[0.9] mb-6 text-glow-dark"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
        >
          <span className="block" style={{ color: "oklch(0.97 0 0)" }}>
            THE ULTIMATE
          </span>
          <span
            className="block text-glow-primary"
            style={{ color: "oklch(0.82 0.20 128)" }}
          >
            GTA 5 MOD HUB
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="font-body text-lg mb-10 max-w-2xl mx-auto animate-slide-in-up"
          style={{
            color: "oklch(0.72 0 0)",
            animationDelay: "0.1s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          Download and discover the best GTA 5 mods — vehicles, weapons,
          scripts, maps, and more. Curated by{" "}
          <span style={{ color: "oklch(0.82 0.20 128)" }}>OGModders</span>.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-14 animate-slide-in-up"
          style={{
            animationDelay: "0.2s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <a
            href="#mods"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-display font-black text-sm uppercase tracking-widest transition-all duration-200"
            style={{
              background: "oklch(0.82 0.20 128)",
              color: "oklch(0.08 0 0)",
              borderRadius: "2px",
              boxShadow: "0 0 20px oklch(0.82 0.20 128 / 0.55)",
            }}
            onMouseEnter={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                boxShadow:
                  "0 0 32px oklch(0.82 0.20 128 / 0.8), 0 4px 20px oklch(0.82 0.20 128 / 0.4)",
                transform: "translateY(-2px)",
              })
            }
            onMouseLeave={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                boxShadow: "0 0 20px oklch(0.82 0.20 128 / 0.55)",
                transform: "none",
              })
            }
          >
            BROWSE MODS <ChevronRight className="w-4 h-4" />
          </a>
          <a
            href="#categories"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-display font-black text-sm uppercase tracking-widest transition-all duration-200"
            style={{
              background: "transparent",
              color: "oklch(0.92 0 0)",
              border: "1px solid oklch(0.55 0 0)",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                borderColor: "oklch(0.82 0 0)",
                color: "oklch(1 0 0)",
                boxShadow: "0 0 16px oklch(1 0 0 / 0.12)",
              })
            }
            onMouseLeave={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                borderColor: "oklch(0.55 0 0)",
                color: "oklch(0.92 0 0)",
                boxShadow: "none",
              })
            }
          >
            VIEW CATEGORIES
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="inline-flex flex-wrap items-center justify-center animate-slide-in-up"
          style={{
            background: "oklch(0.10 0 0 / 0.88)",
            border: "1px solid oklch(0.25 0 0)",
            borderRadius: "2px",
            animationDelay: "0.3s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          {[
            {
              icon: <BarChart3 className="w-4 h-4" />,
              value: modCount,
              suffix: "",
              label: "MODS AVAILABLE",
            },
            {
              icon: <Car className="w-4 h-4" />,
              value: 5,
              suffix: "",
              label: "CATEGORIES",
            },
            {
              icon: <Download className="w-4 h-4" />,
              value: 1,
              suffix: "",
              label: "UPLOADER",
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-6 py-4"
              style={{
                borderRight: i < 2 ? "1px solid oklch(0.22 0 0)" : "none",
              }}
            >
              <div style={{ color: "oklch(0.82 0.20 128)" }}>{stat.icon}</div>
              <div>
                <div
                  className="font-display font-black text-xl leading-none"
                  style={{ color: "oklch(0.82 0.20 128)" }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div
                  className="font-display font-bold text-[9px] tracking-widest mt-0.5"
                  style={{ color: "oklch(0.45 0 0)" }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Categories Section ─────────────────────────────────────────
const CATEGORIES_DATA = [
  {
    name: "Vehicles",
    image: "/assets/generated/mod-vehicles.dim_400x250.jpg",
    icon: <Car className="w-5 h-5" />,
    color: "oklch(0.50 0.18 250)",
    bgLight: "oklch(0.93 0.06 250)",
    borderLight: "oklch(0.78 0.12 250)",
  },
  {
    name: "Weapons",
    image: "/assets/generated/mod-weapons.dim_400x250.jpg",
    icon: <Crosshair className="w-5 h-5" />,
    color: "oklch(0.52 0.22 22)",
    bgLight: "oklch(0.96 0.04 22)",
    borderLight: "oklch(0.82 0.10 22)",
  },
  {
    name: "Scripts",
    image: "/assets/generated/mod-scripts.dim_400x250.jpg",
    icon: <Code2 className="w-5 h-5" />,
    color: "oklch(0.48 0.16 142)",
    bgLight: "oklch(0.93 0.06 142)",
    borderLight: "oklch(0.78 0.10 142)",
  },
  {
    name: "Maps",
    image: "/assets/generated/mod-maps.dim_400x250.jpg",
    icon: <MapIcon className="w-5 h-5" />,
    color: "oklch(0.52 0.18 55)",
    bgLight: "oklch(0.95 0.05 55)",
    borderLight: "oklch(0.80 0.10 55)",
  },
  {
    name: "Player",
    image: "/assets/generated/mod-player.dim_400x250.jpg",
    icon: <User className="w-5 h-5" />,
    color: "oklch(0.48 0.16 300)",
    bgLight: "oklch(0.94 0.04 300)",
    borderLight: "oklch(0.80 0.08 300)",
  },
];

function CategoriesSection({
  onFilterSelect,
}: { onFilterSelect: (cat: string) => void }) {
  return (
    <section id="categories" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="section-title-line mb-3">
          <h2
            className="font-display font-black text-3xl uppercase tracking-wider"
            style={{ color: "oklch(0.12 0 0)" }}
          >
            Browse by Category
          </h2>
        </div>
        <p
          className="ml-7 font-body text-sm"
          style={{ color: "oklch(0.50 0 0)" }}
        >
          Find exactly what you need across all mod types
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES_DATA.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => onFilterSelect(cat.name.toUpperCase())}
            className="group relative overflow-hidden card-hover text-left"
            style={{
              borderRadius: "4px",
              border: `1.5px solid ${cat.borderLight}`,
              background: cat.bgLight,
              aspectRatio: "1/1",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              padding: "1rem",
            }}
            onMouseEnter={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                background: cat.bgLight,
                borderColor: cat.color,
                boxShadow: `0 8px 32px ${cat.color}30`,
              })
            }
            onMouseLeave={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                background: cat.bgLight,
                borderColor: cat.borderLight,
                boxShadow: "none",
              })
            }
          >
            {/* Background image (subtle) */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-18 transition-opacity duration-300"
              loading="lazy"
            />
            {/* Icon */}
            <div
              className="relative z-10 w-10 h-10 flex items-center justify-center mb-3"
              style={{
                background: `${cat.color}18`,
                border: `1.5px solid ${cat.color}40`,
                borderRadius: "4px",
                color: cat.color,
              }}
            >
              {cat.icon}
            </div>
            {/* Name */}
            <h3
              className="relative z-10 font-display font-black text-base uppercase tracking-wide"
              style={{ color: "oklch(0.15 0 0)" }}
            >
              {cat.name}
            </h3>
            <p
              className="relative z-10 font-mono-gta text-xs font-semibold mt-0.5"
              style={{ color: cat.color }}
            >
              Explore →
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Mod Detail Page ────────────────────────────────────────────
function ModDetailPage({
  mod,
  onBack,
}: {
  mod: Mod;
  onBack: () => void;
}) {
  return (
    <div
      className="min-h-screen pt-20 pb-16"
      style={{ background: "oklch(1 0 0)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-8 mt-4 font-display font-bold text-sm uppercase tracking-wider transition-all duration-150"
          style={{ color: "oklch(0.50 0 0)" }}
          onMouseEnter={(e) =>
            applyHover(e.currentTarget as HTMLElement, {
              color: "oklch(0.82 0.20 128)",
            })
          }
          onMouseLeave={(e) =>
            applyHover(e.currentTarget as HTMLElement, {
              color: "oklch(0.50 0 0)",
            })
          }
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mods
        </button>

        <div
          className="overflow-hidden animate-slide-in-up"
          style={{
            border: "1.5px solid oklch(0.88 0 0)",
            borderRadius: "8px",
            boxShadow: "0 4px 24px oklch(0 0 0 / 0.08)",
          }}
        >
          {/* Hero image */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "16/7" }}
          >
            <img
              src={
                mod.image || "/assets/generated/hero-banner.dim_1400x500.jpg"
              }
              alt={mod.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, oklch(1 0 0 / 0.8) 100%)",
              }}
            />
            {/* Category badge overlay */}
            <div className="absolute top-4 left-4">
              <span
                className={`text-xs font-display font-bold uppercase tracking-wider px-3 py-1.5 ${getCategoryClass(mod.category)}`}
                style={{ borderRadius: "4px" }}
              >
                {mod.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className="px-6 sm:px-8 py-8"
            style={{ background: "oklch(1 0 0)" }}
          >
            {/* Title */}
            <h1
              className="font-display font-black text-3xl sm:text-4xl uppercase leading-tight tracking-wide mb-2"
              style={{ color: "oklch(0.10 0 0)" }}
            >
              {mod.title}
            </h1>

            {/* Author */}
            {mod.author && (
              <div className="flex items-center gap-2 mb-6">
                <User
                  className="w-4 h-4"
                  style={{ color: "oklch(0.55 0 0)" }}
                />
                <span
                  className="font-mono-gta text-sm font-semibold"
                  style={{ color: "oklch(0.45 0 0)" }}
                >
                  by {mod.author}
                </span>
              </div>
            )}

            {/* Divider */}
            <div
              className="mb-6"
              style={{ borderTop: "1.5px solid oklch(0.90 0 0)" }}
            />

            {/* Description */}
            {mod.description ? (
              <div className="mb-8">
                <h2
                  className="font-display font-black text-xs uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.50 0 0)" }}
                >
                  Description
                </h2>
                <p
                  className="font-body text-base leading-relaxed"
                  style={{ color: "oklch(0.25 0 0)" }}
                >
                  {mod.description}
                </p>
              </div>
            ) : (
              <p
                className="font-body text-base mb-8 italic"
                style={{ color: "oklch(0.65 0 0)" }}
              >
                No description provided.
              </p>
            )}

            {/* Tags */}
            {mod.tags.length > 0 && (
              <div className="mb-8">
                <h2
                  className="font-display font-black text-xs uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.50 0 0)" }}
                >
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono-gta font-semibold uppercase tracking-wider px-3 py-1.5"
                      style={{
                        background: "oklch(0.93 0.04 128)",
                        border: "1px solid oklch(0.82 0.08 128)",
                        color: "oklch(0.38 0.14 128)",
                        borderRadius: "4px",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download button */}
            <div
              className="pt-6"
              style={{ borderTop: "1.5px solid oklch(0.90 0 0)" }}
            >
              {mod.downloadUrl ? (
                <a
                  href={mod.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 font-display font-black text-sm uppercase tracking-widest transition-all duration-200"
                  style={{
                    background: "oklch(0.82 0.20 128)",
                    color: "oklch(0.08 0 0)",
                    borderRadius: "4px",
                    boxShadow: "0 0 20px oklch(0.82 0.20 128 / 0.4)",
                  }}
                  onMouseEnter={(e) =>
                    applyHover(e.currentTarget as HTMLElement, {
                      boxShadow:
                        "0 0 32px oklch(0.82 0.20 128 / 0.65), 0 4px 20px oklch(0.82 0.20 128 / 0.35)",
                      transform: "translateY(-2px)",
                    })
                  }
                  onMouseLeave={(e) =>
                    applyHover(e.currentTarget as HTMLElement, {
                      boxShadow: "0 0 20px oklch(0.82 0.20 128 / 0.4)",
                      transform: "none",
                    })
                  }
                >
                  <Download className="w-4 h-4" />
                  Download Mod
                </a>
              ) : (
                <div
                  className="inline-flex items-center gap-3 px-8 py-4 font-display font-black text-sm uppercase tracking-widest"
                  style={{
                    background: "oklch(0.92 0 0)",
                    color: "oklch(0.58 0 0)",
                    borderRadius: "4px",
                    border: "1.5px solid oklch(0.85 0 0)",
                    cursor: "not-allowed",
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download Not Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mod Card ───────────────────────────────────────────────────
function ModCard({ mod, onClick }: { mod: Mod; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-hover group flex flex-col overflow-hidden text-left w-full"
      style={{
        background: "oklch(1 0 0)",
        border: "1.5px solid oklch(0.88 0 0)",
        borderRadius: "6px",
        boxShadow: "0 1px 4px oklch(0 0 0 / 0.06)",
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {mod.image ? (
          <img
            src={mod.image}
            alt={mod.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "oklch(0.94 0.03 128)" }}
          >
            <Shield
              className="w-10 h-10"
              style={{ color: "oklch(0.72 0.10 128)" }}
            />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 55%, oklch(1 0 0 / 0.8) 100%)",
          }}
        />
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 ${getCategoryClass(mod.category)}`}
            style={{ borderRadius: "3px" }}
          >
            {mod.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-3 gap-2">
        {/* Title */}
        <h3
          className="font-display font-black text-sm uppercase leading-tight tracking-wide line-clamp-2"
          style={{ color: "oklch(0.12 0 0)" }}
        >
          {mod.title}
        </h3>

        {/* Author */}
        {mod.author && (
          <div className="flex items-center gap-1.5">
            <User
              className="w-3 h-3 flex-shrink-0"
              style={{ color: "oklch(0.60 0 0)" }}
            />
            <span
              className="text-xs font-mono-gta font-semibold truncate"
              style={{ color: "oklch(0.52 0 0)" }}
            >
              {mod.author}
            </span>
          </div>
        )}

        {/* Tags */}
        {mod.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {mod.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono-gta font-semibold uppercase tracking-wider px-1.5 py-0.5"
                style={{
                  background: "oklch(0.94 0.02 128)",
                  border: "1px solid oklch(0.85 0.04 128)",
                  color: "oklch(0.45 0.10 128)",
                  borderRadius: "3px",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Click hint */}
        <div
          className="flex items-center justify-between pt-2 mt-1"
          style={{ borderTop: "1px solid oklch(0.92 0 0)" }}
        >
          <span
            className="text-[10px] font-display font-bold uppercase tracking-wider"
            style={{ color: "oklch(0.65 0 0)" }}
          >
            Click to view
          </span>
          <ChevronRight
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
            style={{ color: "oklch(0.82 0.20 128)" }}
          />
        </div>
      </div>
    </button>
  );
}

// ── Featured Mods ──────────────────────────────────────────────
const FILTER_TABS = ["ALL", "VEHICLES", "WEAPONS", "SCRIPTS", "MAPS", "PLAYER"];

function FeaturedMods({
  mods,
  searchQuery,
  activeFilter,
  onFilterChange,
  onModClick,
}: {
  mods: Mod[];
  searchQuery: string;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  onModClick: (mod: Mod) => void;
}) {
  const filtered = mods.filter((mod) => {
    const matchesFilter =
      activeFilter === "ALL" || mod.category.toUpperCase() === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="mods" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="section-title-line mb-3">
          <h2
            className="font-display font-black text-3xl uppercase tracking-wider"
            style={{ color: "oklch(0.12 0 0)" }}
          >
            All Mods
          </h2>
        </div>
        <p
          className="ml-7 font-body text-sm"
          style={{ color: "oklch(0.50 0 0)" }}
        >
          Click any mod to view details and download
        </p>
      </div>

      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-1.5 mb-8 p-1.5 w-fit"
        style={{
          background: "oklch(0.95 0 0)",
          border: "1.5px solid oklch(0.88 0 0)",
          borderRadius: "6px",
        }}
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onFilterChange(tab)}
            className="px-4 py-2 text-xs font-display font-bold uppercase tracking-wider transition-all duration-150"
            style={{
              borderRadius: "4px",
              background:
                activeFilter === tab ? "oklch(0.82 0.20 128)" : "transparent",
              color:
                activeFilter === tab ? "oklch(0.08 0 0)" : "oklch(0.45 0 0)",
              boxShadow:
                activeFilter === tab
                  ? "0 0 12px oklch(0.82 0.20 128 / 0.35)"
                  : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center" style={{ color: "oklch(0.55 0 0)" }}>
          <div
            className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
            style={{
              background: "oklch(0.94 0.03 128)",
              border: "2px solid oklch(0.85 0.06 128)",
              borderRadius: "12px",
            }}
          >
            <Shield
              className="w-8 h-8"
              style={{ color: "oklch(0.72 0.12 128)" }}
            />
          </div>
          <p
            className="font-display font-bold text-lg uppercase tracking-wider mb-2"
            style={{ color: "oklch(0.22 0 0)" }}
          >
            {mods.length === 0 ? "No mods uploaded yet" : "No mods found"}
          </p>
          <p className="font-body text-sm" style={{ color: "oklch(0.55 0 0)" }}>
            {mods.length === 0
              ? "The admin will add mods soon — check back later!"
              : "Try a different filter or search term"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mod) => (
            <ModCard key={mod.id} mod={mod} onClick={() => onModClick(mod)} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="pt-16 pb-8 px-4"
      style={{
        background: "oklch(0.08 0 0)",
        borderTop: "2px solid oklch(0.14 0 0)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b"
          style={{ borderColor: "oklch(0.18 0 0)" }}
        >
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/ogmodders-logo-transparent.dim_600x150.png"
              alt="OGModders"
              className="h-10 w-auto mb-4"
            />
            <p
              className="font-body text-sm leading-relaxed max-w-xs"
              style={{ color: "oklch(0.45 0 0)" }}
            >
              The premier destination for GTA 5 mods, scripts, vehicles and
              more. Built by modders, for modders.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {[
                {
                  icon: <SiDiscord className="w-4 h-4" />,
                  href: "#discord",
                  label: "Discord",
                },
                {
                  icon: <SiYoutube className="w-4 h-4" />,
                  href: "#youtube",
                  label: "YouTube",
                },
                {
                  icon: <SiX className="w-4 h-4" />,
                  href: "#twitter",
                  label: "X",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "oklch(0.14 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    color: "oklch(0.48 0 0)",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) =>
                    applyHover(e.currentTarget as HTMLElement, {
                      color: "oklch(0.82 0.20 128)",
                      borderColor: "oklch(0.82 0.20 128 / 0.4)",
                    })
                  }
                  onMouseLeave={(e) =>
                    applyHover(e.currentTarget as HTMLElement, {
                      color: "oklch(0.48 0 0)",
                      borderColor: "oklch(0.22 0 0)",
                    })
                  }
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-display font-black text-xs uppercase tracking-widest mb-5"
              style={{ color: "oklch(0.82 0.20 128)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "All Mods", href: "#mods" },
                { label: "Vehicles", href: "#mods" },
                { label: "Weapons", href: "#mods" },
                { label: "Scripts", href: "#mods" },
                { label: "Maps", href: "#mods" },
                { label: "Player", href: "#mods" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-xs transition-colors inline-flex items-center gap-1.5"
                    style={{ color: "oklch(0.45 0 0)" }}
                    onMouseEnter={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        color: "oklch(0.82 0.20 128)",
                      })
                    }
                    onMouseLeave={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        color: "oklch(0.45 0 0)",
                      })
                    }
                  >
                    <ChevronRight className="w-2.5 h-2.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="font-display font-black text-xs uppercase tracking-widest mb-5"
              style={{ color: "oklch(0.82 0.20 128)" }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
                { label: "DMCA", href: "#dmca" },
                { label: "Terms of Service", href: "#terms" },
                { label: "Privacy Policy", href: "#privacy" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-body text-xs transition-colors inline-flex items-center gap-1.5"
                    style={{ color: "oklch(0.45 0 0)" }}
                    onMouseEnter={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        color: "oklch(0.82 0.20 128)",
                      })
                    }
                    onMouseLeave={(e) =>
                      applyHover(e.currentTarget as HTMLElement, {
                        color: "oklch(0.45 0 0)",
                      })
                    }
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="font-mono-gta text-[11px]"
            style={{ color: "oklch(0.35 0 0)" }}
          >
            © {year} OGModders. All Rights Reserved. Not affiliated with
            Rockstar Games or Take-Two Interactive.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-gta text-[11px] transition-colors"
            style={{ color: "oklch(0.35 0 0)" }}
            onMouseEnter={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                color: "oklch(0.82 0.20 128)",
              })
            }
            onMouseLeave={(e) =>
              applyHover(e.currentTarget as HTMLElement, {
                color: "oklch(0.35 0 0)",
              })
            }
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>

        <p
          className="mt-3 font-mono-gta text-[10px] text-center"
          style={{ color: "oklch(0.28 0 0)" }}
        >
          OGModders is a fan-made mod repository. All mods are created by
          independent users. We do not host any copyrighted game files. Use mods
          at your own risk.
        </p>
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [mods, setMods] = useState<Mod[]>(INITIAL_MODS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.title = "OGModders – The Ultimate GTA 5 Mod Hub";
  }, []);

  const handleAdminClick = () => {
    setPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);
    setAdminOpen(true);
  };

  const handleModClick = (mod: Mod) => {
    setSelectedMod(mod);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToMods = () => {
    setSelectedMod(null);
  };

  const handleFilterSelect = (cat: string) => {
    setActiveFilter(cat);
    // Scroll to mods section
    document.getElementById("mods")?.scrollIntoView({ behavior: "smooth" });
  };

  // If a mod is selected, show detail page
  if (selectedMod) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(1 0 0)" }}>
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdminClick={handleAdminClick}
        />
        <main>
          <ModDetailPage mod={selectedMod} onBack={handleBackToMods} />
        </main>
        <Footer />
        <PinModal
          isOpen={pinModalOpen}
          onSuccess={handlePinSuccess}
          onClose={() => setPinModalOpen(false)}
        />
        <AdminPanel
          mods={mods}
          setMods={setMods}
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "oklch(1 0 0)" }}>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdminClick={handleAdminClick}
      />
      <main>
        <HeroSection modCount={mods.length} />
        {/* Light background sections */}
        <div style={{ background: "oklch(1 0 0)" }}>
          <CategoriesSection onFilterSelect={handleFilterSelect} />
          <FeaturedMods
            mods={mods}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onModClick={handleModClick}
          />
        </div>
      </main>
      <Footer />
      <PinModal
        isOpen={pinModalOpen}
        onSuccess={handlePinSuccess}
        onClose={() => setPinModalOpen(false)}
      />
      <AdminPanel
        mods={mods}
        setMods={setMods}
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}
