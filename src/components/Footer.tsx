import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  quickLinks: [
    { label: "Browse Stadiums", href: "/stadiums" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQs", href: "/faqs" },
  ],
  contact: [
    { label: "support@Matiko.com", href: "mailto:support@Matiko.com" },
    { label: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { label: "123 Stadium Way, Sports City", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-t-4 border-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary border-2 border-background rounded-lg shadow-neo-sm flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xl">S</span>
              </div>
              <span className="font-black text-xl uppercase tracking-tighter text-background">
                Matiko
              </span>
            </Link>
            <p className="font-medium text-background/80 mb-6">
              Book premium stadiums for your events with ease. From corporate gatherings to sports tournaments.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-background text-foreground border-2 border-background rounded-lg flex items-center justify-center transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="size-5" strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-black uppercase tracking-tight text-sm text-background mb-4">
              About
            </h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-medium text-background/80 hover:text-background hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase tracking-tight text-sm text-background mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-medium text-background/80 hover:text-background hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black uppercase tracking-tight text-sm text-background mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              {footerLinks.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-medium text-background/80 hover:text-background hover:underline transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t-2 border-primary">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-medium text-background/80 text-sm">
              © 2024 Matiko. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="font-medium text-sm text-background/80 hover:text-background hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-medium text-sm text-background/80 hover:text-background hover:underline"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
