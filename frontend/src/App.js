import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import BuyerDashboard from "@/pages/BuyerDashboard";
import FarmerDashboard from "@/pages/FarmerDashboard";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ContactPage from "@/pages/ContactPage";
import AgricultureInfoPage from "@/pages/AgricultureInfoPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import CheckoutAddress from "@/pages/CheckoutAddress";
import CheckoutPayment from "@/pages/CheckoutPayment";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route
                  path="/products/:productId"
                  element={<ProductDetailPage />}
                />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                  path="/agriculture-info"
                  element={<AgricultureInfoPage />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/checkout/address" element={<CheckoutAddress />} />
                <Route path="/checkout/payment" element={<CheckoutPayment />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
