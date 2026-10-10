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
  setDoc,
  updateDoc
} from "firebase/firestore";
import { auth, db, ADMIN_EMAIL } from "../firebase";
import localProducts from "../data/products";

// ---- Cloudinary (fill these two) ----
const CLOUD_NAME = "agggcodl";
const UPLOAD_PRESET = "madanlal_products";
// -------------------------------------

const MAX_PHOTOS = 6;

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

const emptyForm = {
  docId: "",
  id: 0,
  name: "",
  price: "",
  originalPrice: "",
  category: "silk",
  fabric: "",
  occasion: "",
  badge: "",
  stock: "1",
  description: "",
  images: []
};

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
        (blob) => (blob ? resolve(blob) : reject(new Error("Photo process nahi hui"))),
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setLoginError("Email ya password galat hai.");
    }
  };

  const changeStock = async (product, delta) => {
    const next = Math.max(0, (product.stock || 0) + delta);

    try {
      await updateDoc(doc(db, "products", product.docId), { stock: next });
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
    setForm({ ...emptyForm });
  };

  const openEdit = (p) => {
    setFormError("");
    setMessage("");
    setForm({
      docId: p.docId,
      id: p.id,
      name: p.name || "",
      price: String(p.price || "").replace(/,/g, ""),
      originalPrice: p.originalPrice
        ? String(p.originalPrice).replace(/,/g, "")
        : "",
      category: p.category || "silk",
      fabric: p.fabric || "",
      occasion: p.occasion || "",
      badge: p.badge || "",
      stock: String(p.stock ?? 0),
      description: p.description || "",
      images:
        p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : []
    });
  };

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    if (files.length === 0) return;

    if (CLOUD_NAME.startsWith("PASTE")) {
      setFormError("Pehle Admin.js me apna Cloudinary cloud name daalo.");
      return;
    }

    if (form.images.length + files.length > MAX_PHOTOS) {
      setFormError(`Ek saree ki zyada se zyada ${MAX_PHOTOS} photos.`);
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
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    }

    setUploading("");
  };

  const makeMain = (index) =>
    setForm((f) => {
      const images = [...f.images];
      const [picked] = images.splice(index, 1);
      return { ...f, images: [picked, ...images] };
    });

  const removePhoto = (index) =>
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index)
    }));

  const saveProduct = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const priceNum = toNumber(form.price);
    const originalNum = form.originalPrice ? toNumber(form.originalPrice) : 0;

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
      return setFormError("Original price sirf number me likho, ya khali chhod do.");
    }

    if (form.images.length === 0) {
      return setFormError("Kam se kam ek photo daalo.");
    }

    const id = form.id || Date.now();

    const data = {
      id,
      image: form.images[0],
      images: form.images,
      name,
      price: formatPrice(priceNum),
      originalPrice: originalNum ? formatPrice(originalNum) : "",
      category: form.category,
      fabric: form.fabric.trim(),
      occasion: form.occasion.trim(),
      badge: form.badge,
      stock: Math.max(0, parseInt(form.stock, 10) || 0),
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
    return (
      <div className="admin-page">
        <div className="admin-wrap">

          <form className="admin-form" onSubmit={saveProduct}>
            <p className="admin-eyebrow">MADANLAL SAREES</p>
            <h1>{form.docId ? "Edit Saree" : "Add New Saree"}</h1>

            {formError && <p className="admin-message">{formError}</p>}

            <div className="admin-field">
              <label>PHOTOS (pehli photo main hoti hai)</label>

              <div className="admin-photos">
                {form.images.map((url, i) => (
                  <div className="admin-photo" key={url + i}>
                    <img src={url} alt="" />

                    {i === 0 ? (
                      <span className="admin-photo-main">MAIN</span>
                    ) : (
                      <button
                        type="button"
                        className="admin-photo-set"
                        onClick={() => makeMain(i)}
                      >
                        MAIN BANAO
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-photo-remove"
                      onClick={() => removePhoto(i)}
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
                  onChange={handleFiles}
                  disabled={!!uploading}
                  hidden
                />
              </label>
            </div>

            <div className="admin-field">
              <label htmlFor="f-name">SAREE KA NAAM</label>
              <input
                id="f-name"
                type="text"
                value={form.name}
                onChange={setField("name")}
                placeholder="Jaise: Royal Maroon Banarasi Saree"
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
                <label htmlFor="f-stock">STOCK (kitni piece)</label>
                <input
                  id="f-stock"
                  type="text"
                  inputMode="numeric"
                  value={form.stock}
                  onChange={setField("stock")}
                />
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

  // 5. admin panel (list)
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

        {message && <p className="admin-message">{message}</p>}

        {products.length === 0 ? (
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
            <p className="admin-count">{products.length} SAREES</p>

            <div className="admin-list">
              {products.map((p) => (
                <div className="admin-item" key={p.docId}>

                  <img src={p.image} alt={p.name} />

                  <div className="admin-item-info">
                    <h3>{p.name}</h3>
                    <p>
                      ₹{p.price} · {p.category} · {p.fabric}
                    </p>

                    <div className="admin-stock">
                      <button onClick={() => changeStock(p, -1)}>−</button>
                      <span>
                        {p.stock === 0 ? "Sold out" : `${p.stock} in stock`}
                      </span>
                      <button onClick={() => changeStock(p, 1)}>+</button>
                    </div>
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
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Admin;