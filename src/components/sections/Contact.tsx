import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { fadeIn, staggerContainer, staggerItem } from '../../utils/animations';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@lenscraft.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: MapPin, label: 'Location', value: 'New York, NY' },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">
            Get in Touch
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
            Let's <span className="italic font-semibold">Connect</span>
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear from you. Let's create something
            beautiful together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-8"
          >
            {contactInfo.map((info) => (
              <motion.div
                key={info.label}
                variants={staggerItem}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-full">
                  <info.icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {info.label}
                  </h3>
                  <p className="text-neutral-900 dark:text-white mt-1">{info.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 
                             border border-neutral-200 dark:border-neutral-800
                             text-neutral-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600
                             transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 
                             border border-neutral-200 dark:border-neutral-800
                             text-neutral-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600
                             transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 
                           border border-neutral-200 dark:border-neutral-800
                           text-neutral-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600
                           transition-all duration-300"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 
                           border border-neutral-200 dark:border-neutral-800
                           text-neutral-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600
                           transition-all duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-neutral-900 dark:bg-white 
                         text-white dark:text-neutral-900 font-medium
                         hover:bg-neutral-800 dark:hover:bg-neutral-100
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Sending...'
              ) : submitted ? (
                'Message Sent!'
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
