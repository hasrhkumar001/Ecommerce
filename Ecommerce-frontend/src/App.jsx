import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { ProductDetail } from "./components/Products/ProductDetail";
import ProductListing from "./components/ProductListing/ProductListing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import  Cart  from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./components/Order/MyOrders";
import { AuthProvider } from "./components/AuthContext";
import Wishlist from "./pages/Wishlist";
import AccountDetails from "./components/UserDetail/AccountDetails";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFoundScreen from "./pages/NotFoundScreen";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./pages/PaymentForm";
import OrderConfirmation from "./pages/OrderConfirmation";
import { Toaster } from "react-hot-toast";

const stripePromise = loadStripe("pk_test_51Qvz19E0EuLrC21R6ztDSoabB85JgOkAbsgRi3pjwmx5K6yNip9xYv95wWYHFwTxAHRGkbkrcDL8MdZ2tclTTQKp00wmGkB4cd");

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
       <AuthProvider>
      <Navbar handleOrderPopup={handleOrderPopup} />
      <Toaster
  position="top-right"
  containerStyle={{
    top: 60, 

  }}
  toastOptions={{
    duration: 3000, // Default duration for all toasts
    style: {
      background: "rgba(255, 255, 255, 0.9)", // Slight transparency
      color: "#333", // Darker text for better readability
      border: "1px solid #ddd", // Soft border
      borderRadius: "8px", // Rounded corners
      padding: "10px 15px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
      fontSize: "14px",
      fontWeight: "500",
    },
   
  }}
/>
      <Routes>
      
        <Route index path="/" element={<Home />} />
        <Route  path="/about-us" element={<AboutUs />} />
        <Route  path="/order-confirmed" element={<OrderConfirmation />} />
        <Route  path="/contact-us" element={<ContactUs />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:categoryParam" element={<ProductListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/checkout" element={<Checkout />} /> */}
        <Route path="/checkout" element={<Elements stripe={stripePromise}> <Checkout /> </Elements>}/>
        
        <Route
            path="/payment"
            element={
              <Elements stripe={stripePromise}>
                <PaymentForm />
              </Elements>
            }
          />

        {/* <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<MyOrders />} /> */}
        <Route path="/signup" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account/:page" element={<AccountDetails />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
      
      <Footer />
      </AuthProvider>
      
    </div>
  );
};

export default App;
