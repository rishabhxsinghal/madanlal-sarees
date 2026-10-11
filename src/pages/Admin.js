import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { auth, db, ADMIN_EMAIL } from "../firebase";
import localProducts from "../data/products";
import normalizeProduct from "../utils/normalizeProduct";
import AdminOrders from "./AdminOrders";

// ---- Cloudinary (fill these two) ----
const CLOUD_NAME = "agggcodl";
const UPLOAD_PRESET = "madanlal_products";
// -------------------------------------

const MAX_PHOTOS = 6;
const MAX_COLOURS = 8;

const CATEGORIES = [
  { value: "silk", label: "Silk" },
  { value: "banarasi", label: "Banarasi" },
  { value: "cotton", label: "Cotton" },
  { value: "festive", label: "Festive" }
];

const BADGES = ["", "NEW", "BESTSELLER", "FESTIVE", "LIMITED"];

// photos copied into public/images/products (used by the one-time import)
const IMPORT_IMAGES = {
  1: ["saree1.jpg", "saree1-2.jpg", "saree1-3.jpg"],
  2: ["saree2.jpg"],
  3: ["saree3.jpg"],
  4: ["saree4.jpg"],
  5: ["saree5.jpg"]
};

const imgPath = (file) => `/images/products/${file}`;

const emptyVariant = () => ({
  colour: "",
  hex: "#8b1a2b",
  stock: "1",
  images: []
});

const emptyForm = () => ({
  docId: "",
  id: 0,
  name: "",
  price: "",
  originalPrice: "",
  category: "silk",
  fabric: "",
  occasion: "",
  badge: "",
  description: "",
  variants: [emptyVariant()]
});

const toNumber = (value) => Number(String(value).replace(/,/g, ""));
const formatPrice = (n) => Number(n).toLocaleString("en-IN");

// shrink a phone photo before uploading (max 1400px wide, JPEG 85%)
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, 1400 / img.width, 2000 / img.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Photo process nahi hui")),
        "image/jpeg",
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Ye photo khul nahi paayi"));
    };

    img.src = url;
  });
}

async function uploadToCloudinary(blob) {
  const body = new FormData();
  body.append("file", blob, "saree.jpg");
  body.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Upload fail ho gaya");
  }

  // f_auto,q_auto: Cloudinary serves the lightest good format for each phone
  return data.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
}

function Admin() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState(null); // null = show the list
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState("");
  const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState("sarees");
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(20);

  const isAdmin = !!user && user.email === ADMIN_EMAIL;

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  useEffect(() => {
    if (!isAdmin) return;

    return onSnapshot(
      collection(db, "products"),
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), docId: d.id }));
        list.sort((a, b) => (b.id || 0) - (a.id || 0));
        setProducts(list);
      },
      (err) => setMessage("Sarees load nahi hui: " + err.message)
    );
  }, [isAdmin]);
    useEffect(() => {
    if (!isAdmin) return;

    return onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snap) =>
        setOrders(snap.docs.map((d) => ({ ...d.data(), docId: d.id }))),
      (err) => setMessage("Orders load nahi hue: " + err.message)
    );
  }, [isAdmin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setLoginError("Email ya password galat hai.");
    }
  };

  // change the stock of one colour
  const changeStock = async (product, variantIndex, delta) => {
    const normalized = normalizeProduct(product);

    const variants = normalized.variants.map((v, i) =>
      i === variantIndex
        ? { ...v, stock: Math.max(0, v.stock + delta) }
        : v
    );

    const total = variants.reduce((sum, v) => sum + v.stock, 0);

    try {
      await updateDoc(doc(db, "products", product.docId), {
        variants,
        stock: total
      });
    } catch (err) {
      setMessage("Stock update nahi hua: " + err.message);
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`"${product.name}" ko hamesha ke liye hata dein?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", product.docId));
      setMessage("Saree hata di gayi.");
    } catch (err) {
      setMessage("Delete nahi hua: " + err.message);
    }
  };

  const importLocal = async () => {
    const names = localProducts.map((p) => p.name);

    if (new Set(names).size !== names.length) {
      setMessage(
        "products.js me do sarees ka naam same hai. Pehle ek ka naam badlo, phir import karo."
      );
      return;
    }

    if (!window.confirm("Purani 5 sarees database me daalein?")) return;

    setBusy(true);
    setMessage("");

    try {
      for (const p of localProducts) {
        const images = (IMPORT_IMAGES[p.id] || []).map(imgPath);

        await setDoc(doc(db, "products", String(p.id)), {
          id: p.id,
          image: images[0] || "",
          images,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice || "",
          category: p.category,
          fabric: p.fabric,
          occasion: p.occasion,
          badge: p.badge || "",
          stock: p.stock,
          description: p.description
        });
      }

      setMessage(`${localProducts.length} sarees import ho gayi.`);
    } catch (err) {
      setMessage("Import nahi hua: " + err.message);
    }

    setBusy(false);
  };

  // ---------- add / edit form ----------

  const openNew = () => {
    setFormError("");
    setMessage("");
    setForm(emptyForm());
  };

  const openEdit = (p) => {
    const n = normalizeProduct(p);

    setFormError("");
    setMessage("");
    setForm({
      docId: p.docId,
      id: n.id,
      name: n.name || "",
      price: String(n.price || "").replace(/,/g, ""),
      originalPrice: n.originalPrice
        ? String(n.originalPrice).replace(/,/g, "")
        : "",
      category: n.category || "silk",
      fabric: n.fabric || "",
      occasion: n.occasion || "",
      badge: n.badge || "",
      description: n.description || "",
      variants: n.variants.map((v) => ({
        colour: v.colour,
        hex: v.hex,
        stock: String(v.stock),
        images: v.images
      }))
    });
  };

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setVariantField = (index, key) => (e) => {
    const value = e.target.value;

    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) =>
        i === index ? { ...v, [key]: value } : v
      )
    }));
  };

  const addColour = () => {
    if (form.variants.length >= MAX_COLOURS) {
      setFormError(`Zyada se zyada ${MAX_COLOURS} colours.`);
      return;
    }

    setFormError("");
    setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  };

  const removeColour = (index) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== index)
    }));

  const handleFiles = (variantIndex) => async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    if (files.length === 0) return;

    if (CLOUD_NAME.startsWith("PASTE")) {
      setFormError("Pehle Admin.js me apna Cloudinary cloud name daalo.");
      return;
    }

    if (form.variants[variantIndex].images.length + files.length > MAX_PHOTOS) {
      setFormError(`Ek colour ki zyada se zyada ${MAX_PHOTOS} photos.`);
      return;
    }

    setFormError("");
    const urls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploading(`Photo ${i + 1}/${files.length} upload ho rahi hai...`);
        const blob = await compressImage(files[i]);
        urls.push(await uploadToCloudinary(blob));
      }
    } catch (err) {
      setFormError("Photo upload nahi hui: " + err.message);
    }

    if (urls.length > 0) {
      setForm((f) => ({
        ...f,
        variants: f.variants.map((v, i) =>
          i === variantIndex ? { ...v, images: [...v.images, ...urls] } : v
        )
      }));
    }

    setUploading("");
  };

  const makeMain = (variantIndex, imageIndex) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => {
        if (i !== variantIndex) return v;

        const images = [...v.images];
        const [picked] = images.splice(imageIndex, 1);
        return { ...v, images: [picked, ...images] };
      })
    }));

  const removePhoto = (variantIndex, imageIndex) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) =>
        i === variantIndex
          ? { ...v, images: v.images.filter((_, j) => j !== imageIndex) }
          : v
      )
    }));

  const saveProduct = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const priceNum = toNumber(form.price);
    const originalNum = form.originalPrice ? toNumber(form.originalPrice) : 0;
    const multi = form.variants.length > 1;

    if (!name) return setFormError("Saree ka naam likho.");

    if (
      products.some(
        (p) =>
          (p.name || "").trim().toLowerCase() === name.toLowerCase() &&
          p.docId !== form.docId
      )
    ) {
      return setFormError(
        "Is naam ki saree pehle se hai. Har saree ka naam alag hona chahiye."
      );
    }

    if (!priceNum || priceNum <= 0) {
      return setFormError("Sahi price likho (sirf number, jaise 4999).");
    }

    if (form.originalPrice && !originalNum) {
      return setFormError(
        "Original price sirf number me likho, ya khali chhod do."
      );
    }

    const seen = new Set();

    for (let i = 0; i < form.variants.length; i++) {
      const v = form.variants[i];
      const label = v.colour.trim() || `Colour ${i + 1}`;

      if (multi && !v.colour.trim()) {
        return setFormError(`Colour ${i + 1} ka naam likho.`);
      }

      if (multi) {
        const key = v.colour.trim().toLowerCase();

        if (seen.has(key)) {
          return setFormError(`"${v.colour.trim()}" colour do baar likha hai.`);
        }

        seen.add(key);
      }

      if (v.images.length === 0) {
        return setFormError(`"${label}" ki kam se kam ek photo daalo.`);
      }
    }

    const variants = form.variants.map((v) => ({
      colour: v.colour.trim(),
      hex: v.hex,
      images: v.images,
      stock: Math.max(0, parseInt(v.stock, 10) || 0)
    }));

    const id = form.id || Date.now();

    const data = {
      id,
      variants,
      image: variants[0].images[0],
      images: variants[0].images,
      stock: variants.reduce((sum, v) => sum + v.stock, 0),
      name,
      price: formatPrice(priceNum),
      originalPrice: originalNum ? formatPrice(originalNum) : "",
      category: form.category,
      fabric: form.fabric.trim(),
      occasion: form.occasion.trim(),
      badge: form.badge,
      description: form.description.trim()
    };

    setSaving(true);

    try {
      await setDoc(doc(db, "products", form.docId || String(id)), data);
      setForm(null);
      setMessage("Saree save ho gayi. Site pe turant dikhegi.");
    } catch (err) {
      setFormError("Save nahi hui: " + err.message);
    }

    setSaving(false);
  };

  const fabricOptions = [
    ...new Set(products.map((p) => p.fabric).filter(Boolean))
  ];
  const occasionOptions = [
    ...new Set(products.map((p) => p.occasion).filter(Boolean))
  ];

  // ---------- screens ----------

  // 1. still checking login
  if (user === undefined) {
    return (
      <div className="admin-page">
        <p className="admin-note">Loading...</p>
      </div>
    );
  }

  // 2. not logged in
  if (!user) {
    return (
      <div className="admin-page">
        <form className="admin-login" onSubmit={handleLogin}>
          <p className="admin-eyebrow">MADANLAL SAREES</p>
          <h1>Admin Login</h1>

          <label htmlFor="admin-email">EMAIL</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="admin-password">PASSWORD</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {loginError && <p className="admin-error">{loginError}</p>}

          <button type="submit" className="admin-btn">
            LOGIN
          </button>
        </form>
      </div>
    );
  }

  // 3. logged in, but not the owner
  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Access Denied</h1>
          <p className="admin-note">Ye account admin nahi hai.</p>
          <button className="admin-btn" onClick={() => signOut(auth)}>
            LOGOUT
          </button>
        </div>
      </div>
    );
  }

  // 4. add / edit form
  if (form) {
    const multi = form.variants.length > 1;

    return (
      <div className="admin-page">
        <div className="admin-wrap">

          <form className="admin-form" onSubmit={saveProduct}>
            <p className="admin-eyebrow">MADANLAL SAREES</p>
            <h1>{form.docId ? "Edit Saree" : "Add New Saree"}</h1>

            {formError && <p className="admin-message">{formError}</p>}

            <div className="admin-field">
              <label htmlFor="f-name">SAREE KA NAAM</label>
              <input
                id="f-name"
                type="text"
                value={form.name}
                onChange={setField("name")}
                placeholder="Jaise: Royal Banarasi Saree"
              />
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="f-price">PRICE (₹)</label>
                <input
                  id="f-price"
                  type="text"
                  inputMode="numeric"
                  value={form.price}
                  onChange={setField("price")}
                  placeholder="4999"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="f-orig">ORIGINAL PRICE (optional)</label>
                <input
                  id="f-orig"
                  type="text"
                  inputMode="numeric"
                  value={form.originalPrice}
                  onChange={setField("originalPrice")}
                  placeholder="6999"
                />
              </div>
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="f-cat">CATEGORY</label>
                <select
                  id="f-cat"
                  value={form.category}
                  onChange={setField("category")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label htmlFor="f-badge">BADGE (photo ke upar ka tag)</label>
                <select
                  id="f-badge"
                  value={form.badge}
                  onChange={setField("badge")}
                >
                  {BADGES.map((b) => (
                    <option key={b || "none"} value={b}>
                      {b || "Koi nahi"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="f-fabric">FABRIC</label>
                <input
                  id="f-fabric"
                  type="text"
                  list="fabric-list"
                  value={form.fabric}
                  onChange={setField("fabric")}
                  placeholder="Pure Silk"
                />
                <datalist id="fabric-list">
                  {fabricOptions.map((f) => (
                    <option key={f} value={f} />
                  ))}
                </datalist>
              </div>

              <div className="admin-field">
                <label htmlFor="f-occasion">OCCASION</label>
                <input
                  id="f-occasion"
                  type="text"
                  list="occasion-list"
                  value={form.occasion}
                  onChange={setField("occasion")}
                  placeholder="Wedding & Festive"
                />
                <datalist id="occasion-list">
                  {occasionOptions.map((o) => (
                    <option key={o} value={o} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="f-desc">DESCRIPTION</label>
              <textarea
                id="f-desc"
                rows="4"
                value={form.description}
                onChange={setField("description")}
                placeholder="Saree ke baare me 1-2 line"
              />
            </div>

            {/* COLOURS */}

            <p className="admin-section-title">
              {multi ? "COLOURS, PHOTOS AUR STOCK" : "PHOTOS AUR STOCK"}
            </p>

            {form.variants.map((v, vi) => (
              <div className="admin-variant" key={vi}>

                <div className="admin-variant-head">
                  <span>{multi ? `COLOUR ${vi + 1}` : "PEHLA COLOUR"}</span>

                  {multi && (
                    <button
                      type="button"
                      className="admin-delete"
                      onClick={() => removeColour(vi)}
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                <div className="admin-row admin-row-colour">
                  <div className="admin-field">
                    <label>
                      COLOUR KA NAAM{multi ? "" : " (optional)"}
                    </label>
                    <input
                      type="text"
                      value={v.colour}
                      onChange={setVariantField(vi, "colour")}
                      placeholder="Maroon"
                    />
                  </div>

                  <div className="admin-field admin-field-small">
                    <label>SHADE</label>
                    <input
                      type="color"
                      value={v.hex}
                      onChange={setVariantField(vi, "hex")}
                    />
                  </div>

                  <div className="admin-field admin-field-small">
                    <label>STOCK</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={v.stock}
                      onChange={setVariantField(vi, "stock")}
                    />
                  </div>
                </div>

                <div className="admin-photos">
                  {v.images.map((url, ii) => (
                    <div className="admin-photo" key={url + ii}>
                      <img src={url} alt="" />

                      {ii === 0 ? (
                        <span className="admin-photo-main">MAIN</span>
                      ) : (
                        <button
                          type="button"
                          className="admin-photo-set"
                          onClick={() => makeMain(vi, ii)}
                        >
                          MAIN BANAO
                        </button>
                      )}

                      <button
                        type="button"
                        className="admin-photo-remove"
                        onClick={() => removePhoto(vi, ii)}
                        aria-label="Photo hatao"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <label className="admin-upload">
                  {uploading || "+ PHOTO ADD KARO"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles(vi)}
                    disabled={!!uploading}
                    hidden
                  />
                </label>

              </div>
            ))}

            <button
              type="button"
              className="admin-add-colour"
              onClick={addColour}
            >
              + DOOSRA COLOUR ADD KARO
            </button>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn"
                disabled={saving || !!uploading}
              >
                {saving ? "SAVING..." : "SAVE SAREE"}
              </button>

              <button
                type="button"
                className="admin-btn-outline"
                onClick={() => setForm(null)}
                disabled={saving}
              >
                CANCEL
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

   // 5. admin panel
  const newOrders = orders.filter((o) => o.status === "new").length;
  const searchText = search.trim().toLowerCase();

  const filtered = products.filter((p) => {
    const n = normalizeProduct(p);

    if (categoryFilter !== "all" && n.category !== categoryFilter) {
      return false;
    }

    if (
      stockFilter === "low" &&
      !n.variants.some((v) => v.stock > 0 && v.stock <= 2)
    ) {
      return false;
    }

    if (stockFilter === "sold" && !n.variants.some((v) => v.stock === 0)) {
      return false;
    }

    if (!searchText) return true;

    const haystack = [
      n.name,
      n.fabric,
      n.occasion,
      n.category,
      ...n.variants.map((v) => v.colour)
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(searchText);
  });

  const shown = filtered.slice(0, visibleCount);

  return (
    <div className="admin-page">
      <div className="admin-wrap">

        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">MADANLAL SAREES</p>
            <h1>Admin Panel</h1>
          </div>

          <div className="admin-header-actions">
            <button className="admin-small-btn" onClick={openNew}>
              + ADD SAREE
            </button>

            <button
              className="admin-btn-outline"
              onClick={() => signOut(auth)}
            >
              LOGOUT
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={tab === "sarees" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("sarees")}
          >
            SAREES
          </button>

          <button
            className={tab === "orders" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("orders")}
          >
            ORDERS
            {newOrders > 0 && (
              <span className="admin-tab-badge">{newOrders}</span>
            )}
          </button>
        </div>

        {message && <p className="admin-message">{message}</p>}

        {tab === "orders" ? (
          <AdminOrders orders={orders} products={products} />
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <p>Database me abhi koi saree nahi hai.</p>

            <button
              className="admin-btn"
              onClick={importLocal}
              disabled={busy}
            >
              {busy ? "IMPORTING..." : "IMPORT EXISTING SAREES"}
            </button>
          </div>
        ) : (
          <>
            <div className="admin-controls">
              <input
                className="admin-search"
                type="search"
                placeholder="Saree dhundo (naam, colour, fabric)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(20);
                }}
              />

              <div className="admin-chips">
                {[{ value: "all", label: "All" }, ...CATEGORIES].map((c) => (
                  <button
                    key={c.value}
                    className={
                      categoryFilter === c.value
                        ? "admin-chip active"
                        : "admin-chip"
                    }
                    onClick={() => {
                      setCategoryFilter(c.value);
                      setVisibleCount(20);
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="admin-chips">
                {[
                  { value: "all", label: "Sab stock" },
                  { value: "low", label: "Kam stock (1-2)" },
                  { value: "sold", label: "Sold out" }
                ].map((s) => (
                  <button
                    key={s.value}
                    className={
                      stockFilter === s.value
                        ? "admin-chip active"
                        : "admin-chip"
                    }
                    onClick={() => {
                      setStockFilter(s.value);
                      setVisibleCount(20);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="admin-count">
              {filtered.length} SAREES
              {filtered.length !== products.length &&
                ` (kul ${products.length})`}
            </p>

            {filtered.length === 0 ? (
              <div className="admin-empty">
                <p>Is search me koi saree nahi mili.</p>
              </div>
            ) : (
              <div className="admin-list">
                {shown.map((p) => {
                  const n = normalizeProduct(p);
                  const multi = n.variants.length > 1;

                  return (
                    <div className="admin-item" key={p.docId}>

                      <img src={n.image} alt={n.name} />

                      <div className="admin-item-info">
                        <h3>{n.name}</h3>
                        <p>
                          ₹{n.price} · {n.category} · {n.fabric}
                          {multi && ` · ${n.variants.length} colours`}
                        </p>

                        {n.variants.map((v, vi) => (
                          <div className="admin-stock-row" key={vi}>
                            {multi && (
                              <>
                                <span
                                  className="admin-dot"
                                  style={{ background: v.hex }}
                                />
                                <span className="admin-stock-name">
                                  {v.colour}
                                </span>
                              </>
                            )}

                            <div className="admin-stock">
                              <button onClick={() => changeStock(p, vi, -1)}>
                                −
                              </button>
                              <span>
                                {v.stock === 0
                                  ? "Sold out"
                                  : `${v.stock} in stock`}
                              </span>
                              <button onClick={() => changeStock(p, vi, 1)}>
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="admin-item-actions">
                        <button
                          className="admin-edit"
                          onClick={() => openEdit(p)}
                        >
                          EDIT
                        </button>

                        <button
                          className="admin-delete"
                          onClick={() => removeProduct(p)}
                        >
                          DELETE
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {filtered.length > visibleCount && (
              <button
                className="admin-btn-outline admin-more"
                onClick={() => setVisibleCount(visibleCount + 20)}
              >
                SHOW MORE ({filtered.length - visibleCount})
              </button>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default Admin;