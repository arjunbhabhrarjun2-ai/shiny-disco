"use client";
import { useState } from "react";
import { Mail, Phone, ArrowRight, MapPin } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(13,19,32,0.75)',
    border: '1px solid rgba(212,175,127,0.18)',
    borderRadius: '12px',
    color: '#F5F1EA',
    outline: 'none',
    width: '100%',
    padding: '14px 18px',
    fontSize: '14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: '#F5F1EA' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative text-center pt-12 pb-16 hero-bg-editorial overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(212,175,127,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 space-y-5">
          <div className="flex items-center justify-center gap-3">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Get in touch</span>
            <span className="accent-rule" />
          </div>
          <h1 className="leading-[1.05]" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}>
            <span className="font-serif-display text-gradient-editorial">Contact </span>
            <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: '#A9B1C0' }}>
            Reach the desks, press, and partnerships at Kandella. Our global support team is
            available 24/7 via live chat and the support center, with dedicated coverage for
            institutional and Kandella+ members.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 mb-12">
        <div
          className="rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 overflow-hidden relative"
          style={{
            background: 'linear-gradient(160deg, rgba(23,34,58,0.55) 0%, rgba(11,15,26,0.8) 100%)',
            border: '1px solid rgba(212,175,127,0.18)',
          }}
        >
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

          {/* Contact info */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-3 mb-5">
              <span className="accent-rule-solid" />
              <span className="text-editorial-kicker">Reach Out</span>
            </div>
            <h2 className="font-serif-display text-gradient-editorial text-3xl mb-4">
              Contact details
            </h2>
            <p className="text-sm mb-9 max-w-sm leading-relaxed" style={{ color: '#A9B1C0' }}>
              Fill out the form and a member of our team will get back to you within 24 hours.
            </p>

            <div className="space-y-5 mb-9">
              {[
                { icon: <Mail size={15} />, label: 'Email us', value: 'info@cryptotradeprime.io', color: '#D4AF7F' },
                { icon: <Phone size={15} />, label: 'Call us', value: '08-476 49 53', color: '#10B981' },
                { icon: <MapPin size={15} />, label: 'Visit us', value: 'Klarabergsviadukten 40, 111 64 Stockholm, Sweden', color: '#60A5FA' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}40`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase" style={{ color: '#6B7280', letterSpacing: '0.18em' }}>{item.label}</p>
                    <p className="text-sm mt-1" style={{ color: '#F5F1EA' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider-gold mb-5" />
            <p className="text-[10px] uppercase mb-4" style={{ color: '#D4AF7F', letterSpacing: '0.2em' }}>Follow us</p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(212,175,127,0.22)',
                    color: '#A9B1C0',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.color = '#D4AF7F';
                    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)';
                    e.currentTarget.style.background = 'rgba(212,175,127,0.08)';
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.color = '#A9B1C0';
                    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.22)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-5 relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Carter"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)'; }}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)'; }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>
                Phone number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)'; }}
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>
                Message
              </label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)'; }}
              />
            </div>

            <button
              type="submit"
              className="btn-gold rounded-lg px-7 py-3.5 inline-flex items-center gap-2 text-sm"
            >
              Send Message <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{ background: 'var(--color-bg)' }}>
        <div
          className="py-12 px-6 sm:px-10 md:px-14 w-[92%] md:w-[85%] mx-auto rounded-3xl"
          style={{
            background: 'linear-gradient(180deg, rgba(23,34,58,0.4) 0%, rgba(11,15,26,0.7) 100%)',
            border: '1px solid rgba(212,175,127,0.14)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 items-start text-center sm:text-left">
            <div className="space-y-5 flex flex-col items-center sm:items-start">
              <Logo size={42} wordmarkSize="1.75rem" />
              <p className="text-sm" style={{ color: '#A9B1C0' }}>Giving you the best investment opportunities</p>
              <div className="flex gap-3 mt-2 justify-center sm:justify-start">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                  <a
                    key={i}
                    className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(212,175,127,0.18)',
                      color: '#A9B1C0',
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.color = '#D4AF7F';
                      e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)';
                      e.currentTarget.style.background = 'rgba(212,175,127,0.08)';
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.color = '#A9B1C0';
                      e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            <div className="sm:col-span-1 md:col-span-3 space-y-5">
              <h1 className="text-editorial-caps" style={{ color: '#D4AF7F' }}>Useful Links</h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-6 sm:gap-8">
                {[
                  [{ href: '/', label: 'Home' }, { href: '/screens/About', label: 'About' }],
                  [{ href: '#', label: 'Contact Us' }, { href: '#', label: 'Investment Plans' }],
                  [{ href: '/screens/auth/Signin', label: 'Login' }, { href: '/screens/auth/Signup', label: 'Sign up' }],
                ].map((group, gi) => (
                  <div key={gi} className="space-y-2.5">
                    {group.map((item) => (
                      <Link key={item.label} href={item.href}>
                        <li
                          className="list-none text-sm cursor-pointer transition-colors duration-200"
                          style={{ color: '#A9B1C0' }}
                          onMouseEnter={(e: any) => { e.currentTarget.style.color = '#D4AF7F'; }}
                          onMouseLeave={(e: any) => { e.currentTarget.style.color = '#A9B1C0'; }}
                        >
                          {item.label}
                        </li>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="text-editorial-caps" style={{ color: '#D4AF7F' }}>Legal</h1>
              <div className="space-y-2.5">
                {['Terms of Use', 'Privacy Policy'].map((item) => (
                  <p
                    key={item}
                    className="text-sm cursor-pointer transition-colors duration-200"
                    style={{ color: '#A9B1C0' }}
                    onMouseEnter={(e: any) => { e.currentTarget.style.color = '#D4AF7F'; }}
                    onMouseLeave={(e: any) => { e.currentTarget.style.color = '#A9B1C0'; }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-6 text-xs uppercase" style={{ color: '#6B7280', letterSpacing: '0.16em' }}>
          <p>© Kandella · {new Date().getFullYear()} · All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
