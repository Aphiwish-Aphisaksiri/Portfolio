"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { PERSONAL } from "@/lib/constants";
import { FiMail, FiSend } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Toast from "@/components/ui/Toast";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          setToast({
            message: "Message sent! I'll get back to you soon.",
            type: "success",
          });
          reset();
        } else {
          const json = await res.json();
          setToast({
            message: json.error || "Something went wrong. Please try again.",
            type: "error",
          });
        }
      } catch {
        setToast({
          message: "Something went wrong. Please try again.",
          type: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [reset]
  );

  return (
    <section id="contact" className="relative z-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[1100px] mx-auto px-6"
      >
        <h2 className="text-3xl font-bold text-text-primary mb-12">
          Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left column — Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-text-primary">
              Let&apos;s Connect
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Open to opportunities, collaborations, or just a chat.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${PERSONAL.email}`}
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors duration-200 text-sm"
              >
                <FiMail size={18} />
                {PERSONAL.email}
              </a>
              <a
                href={PERSONAL.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors duration-200 text-sm"
              >
                <FaGithub size={18} />
                {PERSONAL.github.display}
              </a>
              <a
                href={PERSONAL.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors duration-200 text-sm"
              >
                <FaLinkedin size={18} />
                {PERSONAL.linkedin.display}
              </a>
            </div>
          </div>

          {/* Right column — Form */}
          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-text-muted text-xs uppercase tracking-wider"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  {...register("name")}
                  className="bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-200"
                  placeholder="Your name"
                />
                {errors.name && (
                  <span className="text-error text-xs">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-text-muted text-xs uppercase tracking-wider"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  {...register("email")}
                  className="bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-200"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <span className="text-error text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-text-muted text-xs uppercase tracking-wider"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  {...register("message")}
                  className="bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
                  placeholder="Your message..."
                />
                {errors.message && (
                  <span className="text-error text-xs">
                    {errors.message.message}
                  </span>
                )}
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
