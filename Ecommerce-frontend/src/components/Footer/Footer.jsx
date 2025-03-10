import React from "react";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import { FaRocket, FaRedoAlt, FaLock, FaHeadset } from "react-icons/fa";
import { Link } from "react-router-dom";

const BannerImg = {
 
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "About",
    link: "/about-us",
  },
  {
    title: "Contact",
    link: "/contact-us",
  },
  
];

const Footer = () => {
  const features = [
    {
      icon: <FaRocket className="text-yellow-500 text-4xl" />,
      title: "Free Delivery",
      description: "For all orders ",
    },
    {
      icon: <FaRedoAlt className="text-yellow-500 text-4xl" />,
      title: "90 Days Return",
      description: "If goods have problems",
    },
    {
      icon: <FaLock className="text-yellow-500 text-4xl" />,
      title: "Secure Payment",
      description: "100% secure payment",
    },
    {
      icon: <FaHeadset className="text-yellow-500 text-4xl" />,
      title: "24/7 Support",
      description: "Dedicated support",
    },
  ];

  return (<>
    <div className="flex items-center justify-around   py-6 shadow-md" style={{marginTop:"50px"}}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-center flex-col md:flex-row space-x-4">
          <div>{feature.icon}</div>
          <div>
            <h3 className="text-lg text-black dark:text-white font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
    <div style={{backgroundColor:"black"}} className="text-white">
      <div className="container relative bottom-0">
        <div  className="grid md:grid-cols-3 pb-32 pt-5">
          {/* company details */}
          <div className="py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
              <img src={footerLogo} alt="" className="max-w-[50px]" />
              UrbanAura
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
              beatae ea recusandae blanditiis veritatis.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid   md:grid-cols-3 col-span-2 md:pl-10">
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <Link to={link.link}>
                    <li
                      className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                      key={link.title}
                    >
                      <span>{link.title}</span>
                    </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
           

            {/* social links */}

            <div>
              <div className="flex items-center gap-3 mt-6">
                <Link to="https://www.instagram.com">
                  <FaInstagram className="text-3xl" />
                </Link>
                <Link to="https://www.facebook.com">
                  <FaFacebook className="text-3xl" />
                </Link>
                <Link to="https://www.linkedin.com">
                  <FaLinkedin className="text-3xl" />
                </Link>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <FaLocationArrow />
                  <p>Chandigarh, India</p>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <FaMobileAlt />
                  <Link to="tel:+911234567890">
                  <p>+91 1234567890</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
};

export default Footer;
