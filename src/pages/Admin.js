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

// photos copied into public/images/products
const IMPORT_IMAGES = {
  1: ["saree1.jpg", "saree1-2.jpg", "saree1-3.jpg"],
  2: ["saree2.jpg"],
  3: ["saree3.jpg"],
  4: ["saree4.jpg"],
  5: ["saree5.jpg"]
};

const imgPath = (file) => `/images/products/${file}`;

function Admin() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

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

  // 1. still checking login
  if (user === undefined) {
    return <div className="admin-page"><p className="admin-note">Loading...</p></div>;
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

          <button type="submit" className="admin-btn">LOGIN</button>
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

  // 4. admin panel
  return (
    <div className="admin-page">
      <div className="admin-wrap">

        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">MADANLAL SAREES</p>
            <h1>Admin Panel</h1>
          </div>

          <button className="admin-btn-outline" onClick={() => signOut(auth)}>
            LOGOUT
          </button>
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

                  <button
                    className="admin-delete"
                    onClick={() => removeProduct(p)}
                  >
                    DELETE
                  </button>

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