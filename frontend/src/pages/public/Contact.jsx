import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import contactService from '../../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await contactService.submitContactForm(formData);
      
      // Show success message with reference ID
      showSuccess(`Message sent successfully! Reference ID: ${response.data.referenceId}. We'll get back to you soon.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gold mb-6 tracking-wider animate-slide-up">
            Contact Us
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            We're here to assist you with any inquiries about our luxury collection
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 border border-border luxury-shadow-lg animate-slide-in-left hover-lift">
            <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-primary mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-primary focus:outline-none focus:border-gold focus:scale-[1.02] transition-ultra-smooth placeholder-secondary focus-ring"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-primary mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-primary focus:outline-none focus:border-gold focus:scale-[1.02] transition-ultra-smooth placeholder-secondary focus-ring"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-primary mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-primary focus:outline-none focus:border-gold focus:scale-[1.02] transition-ultra-smooth placeholder-secondary focus-ring"
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-medium text-primary mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-background border border-border rounded-2xl text-primary focus:outline-none focus:border-gold focus:scale-[1.02] transition-ultra-smooth resize-none placeholder-secondary focus-ring"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  className="luxury-shadow-lg"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 animate-slide-in-right">
            <div className="bg-card rounded-2xl p-8 border border-border luxury-shadow-lg hover-lift animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-xl font-playfair font-bold text-primary mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="text-gold mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary font-medium">Email</p>
                    <a href="mailto:nikhily2115@gmail.com" className="text-secondary text-sm hover:text-gold transition-colors">
                      nikhily2115@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="text-gold mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary font-medium">Phone</p>
                    <a href="tel:+917021551912" className="text-secondary text-sm hover:text-gold transition-colors">
                      +91 7021551912
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="text-gold mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary font-medium">Address</p>
                    <p className="text-secondary text-sm">
                      123 Luxury Avenue<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="text-gold mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary font-medium">Response Time</p>
                    <p className="text-secondary text-sm">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border luxury-shadow-lg hover-lift animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <h3 className="text-xl font-playfair font-bold text-primary mb-6">Business Hours</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border border-opacity-30">
                  <span className="text-secondary">Monday - Friday</span>
                  <span className="text-primary font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border border-opacity-30">
                  <span className="text-secondary">Saturday</span>
                  <span className="text-primary font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-secondary">Sunday</span>
                  <span className="text-red-400 font-medium">Closed</span>
                </div>
              </div>
            </div>

            {/* Additional Support Options */}
            <div className="bg-card rounded-2xl p-8 border border-border luxury-shadow-lg hover-lift animate-fade-in" style={{ animationDelay: '1s' }}>
              <h3 className="text-xl font-playfair font-bold text-primary mb-6">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-gold rounded-full animate-pulse-glow"></div>
                  <span className="text-secondary">Live Chat available during business hours</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-gold rounded-full animate-pulse-glow"></div>
                  <span className="text-secondary">WhatsApp support: +91 7021551912</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-gold rounded-full animate-pulse-glow"></div>
                  <span className="text-secondary">Emergency support available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <p className="text-secondary mb-4">Looking for quick answers?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/faq" className="bg-card hover:bg-gold hover:text-background text-secondary hover:scale-105 px-6 py-2 rounded-full text-sm transition-ultra-smooth border border-border hover:border-gold">
              View FAQ
            </a>
            <a href="/about" className="bg-card hover:bg-gold hover:text-background text-secondary hover:scale-105 px-6 py-2 rounded-full text-sm transition-ultra-smooth border border-border hover:border-gold">
              About Us
            </a>
            <a href="/terms" className="bg-card hover:bg-gold hover:text-background text-secondary hover:scale-105 px-6 py-2 rounded-full text-sm transition-ultra-smooth border border-border hover:border-gold">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
