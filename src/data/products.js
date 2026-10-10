import saree1 from "../assets/images/products/saree1.jpg";
import saree2 from "../assets/images/products/saree2.jpg";
import saree3 from "../assets/images/products/saree3.jpg";
import saree4 from "../assets/images/products/saree4.jpg";
import saree5 from "../assets/images/products/saree5.jpg";
import saree1_2 from "../assets/images/products/saree1-2.jpg";
import saree1_3 from "../assets/images/products/saree1-3.jpg";

const products = [
  {
    id: 1,
    image: saree1,
    images: [saree1, saree1_2, saree1_3],
    name: "Elegant Silk Saree",
    price: "4,999",
    originalPrice: "6,999",
    category: "silk",
    fabric: "Pure Silk",
    occasion: "Festive & Wedding",
    badge: "NEW",
    stock: 5,
    description:
      "A beautifully crafted silk saree featuring an elegant traditional design, perfect for festive celebrations and special occasions."
  },

  {
    id: 2,
    image: saree2,
    images: [saree2],
    name: "Banarasi Heritage Saree",
    price: "6,499",
    originalPrice: "6,999",
    category: "banarasi",
    fabric: "Banarasi Silk",
    occasion: "Wedding & Festive",
    badge: "BESTSELLER",
    stock: 2,
    description:
      "A timeless Banarasi saree inspired by traditional Indian craftsmanship and designed for elegant celebrations."
  },

  {
    id: 3,
    image: saree3,
    images: [saree3],
    name: "Pure Cotton Saree",
    price: "2,499",
    originalPrice: "6,999",
    category: "cotton",
    fabric: "Pure Cotton",
    occasion: "Daily & Casual",
    badge: "NEW",
    stock: 2,
    description:
      "A lightweight cotton saree combining comfort and traditional elegance for everyday wear and casual occasions."
  },

  {
    id: 4,
    image: saree4,
    images: [saree4],
    name: "Festive Designer Saree 2",
    price: "5,999",
    originalPrice: "6,999",
    category: "festive",
    fabric: "Designer Fabric",
    occasion: "Festive & Party",
    badge: "FESTIVE",
    stock: 0,
    description:
      "A graceful designer saree created for festive occasions, celebrations and memorable evenings."
  },

  {
    id: 5,
    image: saree5,
    images: [saree5],
    name: "Festive Designer Saree",
    price: "5,999",
    originalPrice: "6,999",
    category: "festive",
    fabric: "Designer Fabric",
    occasion: "Festive & Party",
    badge: "FESTIVE",
    stock: 4,
    description:
      "A graceful designer saree created for festive occasions, celebrations and memorable evenings."
  }
];

export default products;