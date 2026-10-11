import { useState } from "react";
import {
  deleteDoc,
  doc,
  runTransaction,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import normalizeProduct from "../utils/normalizeProduct";
import shop from "../config";

const STATUS_LABEL = {
  new: "NEW",
  confirmed: "CONFIRMED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED"
};

const FILTERS = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" }
];

const toNumber = (value) => Number(String(value).replace(/,/g, ""));

const formatDate = (ts) =>
  ts && ts.toDate
    ? ts.toDate().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
      })
    : "abhi";

// direction -1 = take stock out (order confirmed)
// direction +1 = give stock back (order cancelled)
async function adjustStock(order, products, direction, newStatus, stockReduced) {
  const groups = new Map(); // product doc id -> items of this order
  const missing = [];

  for (const item of order.items || []) {
    const baseName = item.productName || item.name;
    const product = products.find((p) => p.name === baseName);

    if (!product) {
      missing.push(baseName);
      continue;
    }

    if (!groups.has(product.docId)) groups.set(product.docId, []);
    groups.get(product.docId).push(item);
  }

  if (direction < 0 && missing.length > 0) {
    throw new Error(
      `Ye saree database me nahi mili: ${[...new Set(missing)].join(", ")}`
    );
  }

  const warnings = [];

  await runTransaction(db, async (tx) => {
    warnings.length = 0;

    const orderRef = doc(db, "orders", order.docId);
    const ids = [...groups.keys()];
    const refs = ids.map((id) => doc(db, "products", id));

    // all reads first
    const snaps = [];
    for (const ref of refs) {
      snaps.push(await tx.get(ref));
    }

    // then all writes
    snaps.forEach((snap, i) => {
      if (!snap.exists()) return;

      const variants = normalizeProduct(snap.data()).variants.map((v) => ({
        ...v
      }));

      groups.get(ids[i]).forEach((item) => {
        const index = item.colour
          ? variants.findIndex((v) => v.colour === item.colour)
          : 0;

        if (index < 0) {
          warnings.push(`${item.name}: ye colour ab nahi mila`);
          return;
        }

        const qty = Number(item.quantity) || 0;
        const next = variants[index].stock + direction * qty;

        if (next < 0) {
          warnings.push(
            `${item.name}: stock sirf ${variants[index].stock} tha`
          );
        }

        variants[index].stock = Math.max(0, next);
      });

      tx.update(refs[i], {
        variants,
        stock: variants.reduce((sum, v) => sum + v.stock, 0)
      });
    });

    tx.update(orderRef, { status: newStatus, stockReduced });
  });

  return { warnings };
}

function AdminOrders({ orders, products }) {
  const [filter, setFilter] = useState("new");
  const [busyId, setBusyId] = useState("");
  const [note, setNote] = useState("");

  const count = (status) => orders.filter((o) => o.status === status).length;

  const list =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const run = async (order, task) => {
    setBusyId(order.docId);
    setNote("");

    try {
      const result = await task();

      if (result && result.warnings && result.warnings.length > 0) {
        setNote("Dhyan do: " + result.warnings.join("; "));
      }
    } catch (err) {
      setNote("Nahi hua: " + err.message);
    }

    setBusyId("");
  };

  const confirmOrder = (order) => {
    if (
      !window.confirm(
        "Order confirm karein? Saree ka stock apne aap kam ho jayega."
      )
    ) {
      return;
    }

    run(order, () => adjustStock(order, products, -1, "confirmed", true));
  };

  const cancelOrder = (order) => {
    if (order.stockReduced) {
      if (!window.confirm("Order cancel karein? Stock wapas badh jayega.")) {
        return;
      }

      run(order, () => adjustStock(order, products, 1, "cancelled", false));
      return;
    }

    if (!window.confirm("Order cancel karein?")) return;

    run(order, () =>
      updateDoc(doc(db, "orders", order.docId), { status: "cancelled" })
    );
  };

  const markDelivered = (order) =>
    run(order, () =>
      updateDoc(doc(db, "orders", order.docId), { status: "delivered" })
    );

  const removeOrder = (order) => {
    if (!window.confirm("Ye order list se hamesha ke liye hata dein?")) return;

    run(order, () => deleteDoc(doc(db, "orders", order.docId)));
  };

  return (
    <>
      <div className="admin-chips admin-order-filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={filter === f.value ? "admin-chip active" : "admin-chip"}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {f.value !== "all" && ` (${count(f.value)})`}
          </button>
        ))}
      </div>

      {note && <p className="admin-message">{note}</p>}

      {list.length === 0 ? (
        <div className="admin-empty">
          <p>Is list me abhi koi order nahi hai.</p>
        </div>
      ) : (
        <div className="admin-list">
          {list.map((o) => {
            const waText = `Hello ${o.name}, ${shop.name} se aapka order ${o.orderId} mila hai. Hum ise confirm kar rahe hain.`;
            const busy = busyId === o.docId;

            return (
              <div className="admin-order" key={o.docId}>

                <div className="admin-order-head">
                  <div>
                    <strong>{o.orderId}</strong>
                    <span>{formatDate(o.createdAt)}</span>
                  </div>

                  <span className={`admin-status status-${o.status}`}>
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </div>

                <div className="admin-order-customer">
                  <p>
                    <strong>{o.name}</strong> · {o.phone}
                  </p>
                  <p>
                    {o.address}, {o.city} - {o.pincode}
                  </p>
                </div>

                <ul className="admin-order-items">
                  {(o.items || []).map((it, i) => (
                    <li key={i}>
                      <span>
                        {it.name} × {it.quantity}
                      </span>
                      <span>
                        ₹
                        {(
                          toNumber(it.price) * (Number(it.quantity) || 0)
                        ).toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="admin-order-total">
                  <span>TOTAL</span>
                  <strong>
                    ₹{Number(o.total || 0).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="admin-order-actions">
                  <a
                    href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(
                      waText
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WHATSAPP
                  </a>

                  <a href={`tel:+91${o.phone}`}>CALL</a>

                  {o.status === "new" && (
                    <button
                      className="admin-order-primary"
                      onClick={() => confirmOrder(o)}
                      disabled={busy}
                    >
                      {busy ? "WAIT..." : "CONFIRM ORDER"}
                    </button>
                  )}

                  {o.status === "confirmed" && (
                    <button
                      className="admin-order-primary"
                      onClick={() => markDelivered(o)}
                      disabled={busy}
                    >
                      MARK DELIVERED
                    </button>
                  )}

                  {(o.status === "new" || o.status === "confirmed") && (
                    <button
                      className="admin-delete"
                      onClick={() => cancelOrder(o)}
                      disabled={busy}
                    >
                      CANCEL
                    </button>
                  )}

                  {(o.status === "delivered" || o.status === "cancelled") && (
                    <button
                      className="admin-delete"
                      onClick={() => removeOrder(o)}
                      disabled={busy}
                    >
                      DELETE
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default AdminOrders;