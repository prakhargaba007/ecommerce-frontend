"use client";
import { useState, useEffect } from "react";
import { CardsCarousel } from "@/components/Home Page/CardsCarousel";
import Category from "@/components/Home Page/Category";
import { HeaderMegaMenu } from "@/components/header/HeaderMegaMenu";
import { Button, TextInput } from "@mantine/core";
import { IconTruckDelivery, IconRefresh, IconShieldLock, IconHeadset, IconArrowRight, IconStarFilled } from "@tabler/icons-react";
import "./page.css";

interface CategoryItem {
  _id: string;
  name: string;
  image: {
    male: string;
    female: string;
  };
}

interface GenderSpecificCategoryItem {
  id: string;
  name: string;
  image: string;
}

export default function Home() {
  const [menCategories, setMenCategories] = useState<GenderSpecificCategoryItem[]>([]);
  const [womenCategories, setWomenCategories] = useState<GenderSpecificCategoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/porduct/category";
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: CategoryItem[] = await response.json();
        setMenCategories(data.map((item) => ({ id: item._id, name: item.name, image: item.image.male })));
        setWomenCategories(data.map((item) => ({ id: item._id, name: item.name, image: item.image.female })));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: IconTruckDelivery, title: "Free Shipping", desc: "On orders over \u20b9499" },
    { icon: IconRefresh, title: "Easy Returns", desc: "30-day return policy" },
    { icon: IconShieldLock, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: IconHeadset, title: "24/7 Support", desc: "Dedicated support team" },
  ];

  const footerLinks = {
    Shop: ["Men", "Women", "Accessories", "Sale", "New Arrivals"],
    Company: ["About Us", "Careers", "Press", "Blog", "Contact"],
    Support: ["Help Center", "Shipping Info", "Returns", "Size Guide", "Track Order"],
  };

  return (
    <>
      <HeaderMegaMenu />

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <IconStarFilled size={14} />
              New Season Collection 2026
            </div>
            <h1 className="hero-title">
              Style That<br />Speaks <span>Volumes</span>
            </h1>
            <p className="hero-description">
              Discover curated fashion that defines your personality. From streetwear to sophisticated elegance \u2014 find your perfect look.
            </p>
            <div className="hero-actions">
              <Button size="xl" radius="md" styles={(theme) => ({
                root: {
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '0 2rem',
                  height: '52px',
                  border: 'none',
                  '&:hover': { background: 'linear-gradient(135deg, #d97706, #b45309)' }
                }
              })}>
                Shop Now
              </Button>
              <Button size="xl" radius="md" variant="outline" styles={() => ({
                root: {
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '1rem',
                  padding: '0 2rem',
                  height: '52px',
                  '&:hover': { borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.05)' }
                }
              })}>
                Explore Collection
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="floating-card-header">
                <span className="floating-card-title">Trending Now</span>
                <a href="#" className="floating-card-link">View All \u2192</a>
              </div>
              <div className="floating-card-items">
                {[
                  { name: "Premium Cotton Tee", price: "\u20b91,299", color: "#6366f1" },
                  { name: "Slim Fit Denim", price: "\u20b92,499", color: "#8b5cf6" },
                  { name: "Leather Sneakers", price: "\u20b94,999", color: "#ec4899" },
                ].map((product, i) => (
                  <div key={i} className="floating-product">
                    <div className="floating-product-img" style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}dd)` }} />
                    <div className="floating-product-info">
                      <div className="floating-product-name">{product.name}</div>
                      <div className="floating-product-price">{product.price}</div>
                    </div>
                    <div className="floating-product-rating">\u2605 4.{9-i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="categories-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find what you\u2019re looking for</p>
          </div>
          <a href="#" className="section-link">
            Browse All <IconArrowRight size={16} />
          </a>
        </div>
        <Category title="Men" data={menCategories} gender="male" />
        <div style={{ marginTop: '2rem' }}>
          <Category title="Women" data={womenCategories} gender="female" />
        </div>
      </section>

      {/* ===== DEAL BANNER ===== */}
      <div className="deal-banner">
        <div className="deal-content">
          <h2>Flash Sale \u2014 Up to 60% Off</h2>
          <p>Limited time offer on selected items. Don\u2019t miss out on these incredible deals.</p>
        </div>
        <Button size="xl" radius="md" styles={() => ({
          root: {
            background: '#f59e0b',
            color: '#000',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '0 2.5rem',
            height: '52px',
            flexShrink: 0,
            '&:hover': { background: '#d97706' }
          }
        })}>
          Grab the Deal
        </Button>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">
                <feature.icon size={28} color="#f59e0b" stroke={1.5} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay in the Loop</h2>
          <p>Subscribe to get exclusive updates on new drops, special offers, and style inspiration delivered to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <Button size="lg" radius="md" styles={() => ({
              root: {
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                fontWeight: 600,
                padding: '0 1.75rem',
                height: '50px',
                '&:hover': { background: 'linear-gradient(135deg, #d97706, #b45309)' }
              }
            })}>
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>ShopHub</h3>
            <p>Your destination for premium fashion and lifestyle products. We bring the latest trends right to your doorstep.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-col">
              <h4>{title}</h4>
              {links.map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 ShopHub. All rights reserved.</span>
          <span>Built with passion</span>
        </div>
      </footer>
    </>
  );
}
