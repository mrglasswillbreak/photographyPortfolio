'use client';
import { useState, useCallback, memo, useMemo, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { fadeIn, fadeInLeft, fadeInRight, cardFadeIn } from '@/utils/animations';
import { ContactSkeleton } from '@/components/ui/Skeleton';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactInfo {
  section_title: string;
  section_subtitle: string;
  email: string;
  phone: string;
  location: string;
}

const DEFAULTS: ContactInfo = {
  section_title: "Let's Connect",
  section_subtitle: "Have a project in mind? I'd love to hear from you. Let's create something beautiful together.",
  email: 'hello@lenscraft.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
};

const initialFormData = { name: '', email: '', subject: '', message: '' };

function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setContactInfo({
          section_title: data.contact_section_title || DEFAULTS.section_title,
          section_subtitle: data.contact_section_subtitle || DEFAULTS.section_subtitle,
          email: data.contact_email || DEFAULTS.email,
          phone: data.contact_phone || DEFAULTS.phone,
          location: data.contact_location || DEFAULTS.location,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const infoItems = useMemo(() => [
    { icon: Mail, label: 'Email', value: contactInfo.email },
    { icon: Phone, label: 'Phone', value: contactInfo.phone },
    { icon: MapPin, label: 'Location', value: contactInfo.location },
  ], [contactInfo]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (name === 'email') {
      setEmailError(value && !EMAIL_REGEX.test(value) ? 'Please enter a valid email address' : '');
    }
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    // Quick email format check before submitting
    if (!EMAIL_REGEX.test(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setFormData(initialFormData);
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 4000);
      }
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const titleWords = contactInfo.section_title.split(' ');

  if (isLoading) return <ContactSkeleton />;

  return (
    <section id="contact" className="py-20 md:py-32 bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ amount: 0.3 }} className="text-center mb-16">
          <span className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">Get in Touch</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
            {titleWords.slice(0, -1).join(' ')}{' '}
            <span className="typography-emphasis italic font-semibold">{titleWords.slice(-1)}</span>
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">{contactInfo.section_subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ amount: 0.3 }} className="space-y-8">
            {infoItems.map((info, i) => (
              <motion.div key={info.label} variants={cardFadeIn} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }} transition={{ delay: i * 0.15 }} whileHover={{ x: 10, scale: 1.02 }} className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-full">
                  <info.icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{info.label}</h3>
                  <p className="text-neutral-900 dark:text-white mt-1">{info.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.form variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} onSubmit={handleSubmit} className="lg:col-span-2 space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Name</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-300" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border text-neutral-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-300 ${emailError ? 'border-red-400 focus:ring-red-400' : 'border-neutral-200 dark:border-neutral-800 focus:ring-neutral-400 dark:focus:ring-neutral-600'}`} placeholder="your@email.com" />
                {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Subject</label>
              <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-300" placeholder="What's this about?" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Message</label>
              <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-300 resize-none" placeholder="Tell me about your project..." />
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                type="submit"
                disabled={isSubmitting || !!emailError}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" aria-hidden="true" /> Send Message</>}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Message sent!</span>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Failed to send. Please try again.</span>
                </motion.div>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);
