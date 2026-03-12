"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

// All portfolio content is loaded from data/portfolio.json. Edit that file and save—refresh the browser to see changes.
import portfolioData from "@/data/portfolio.json"

type Project = (typeof portfolioData.projects)[number]
type Testimonial = (typeof portfolioData.testimonials)[number]

// Navigation node component - optimized to prevent blinking
interface NavNodeProps {
  id: string
  label: string
  x: number
  y: number
  color?: string
  active?: boolean
  onClick: () => void
}

const NavNode = memo(({ id, label, x, y, color = "#4f46e5", active = false, onClick }: NavNodeProps) => (
  <motion.div
    className={`absolute cursor-pointer select-none ${active ? "z-10" : "z-0"}`}
    style={{ top: `${y}%`, left: `${x}%` }}
    initial={{ scale: 0 }}
    animate={{
      scale: active ? 1.15 : 1,
      opacity: active ? 1 : 0.8,
    }}
    whileHover={{ scale: 1.15, opacity: 1 }}
    onClick={onClick}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute w-12 h-12 rounded-full opacity-25 blur-sm"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
      <div
        className="w-6 h-6 rounded-full z-10 ring-2 ring-white/50 dark:ring-white/20 shadow-lg border-2 border-white/40"
        style={{ backgroundColor: color }}
      />
      <div className="absolute whitespace-nowrap px-3 py-1.5 -bottom-9 text-sm font-medium rounded-lg bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 shadow-lg border border-gray-200/80 dark:border-gray-700/80 backdrop-blur-sm">
        {label}
      </div>
    </div>
  </motion.div>
))

NavNode.displayName = "NavNode"

// Contact section as a stable component so inputs don't remount on every keystroke (fixes focus loss)
interface ContactSectionProps {
  formData: { name: string; email: string; message: string }
  errors: { name: string; email: string; message: string }
  isSubmitting: boolean
  submitStatus: "idle" | "success" | "error"
  submitError: string
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

const ContactSection = memo(({
  formData,
  errors,
  isSubmitting,
  submitStatus,
  submitError,
  onFormChange,
  onSubmit,
}: ContactSectionProps) => (
  <motion.div
    className="h-full w-full flex flex-col items-center justify-center p-8 bg-mesh overflow-y-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="max-w-md w-full mx-auto text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Get In Touch</h2>
      <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6" />
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Interested in working together? Feel free to reach out using the form below or contact me directly.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
        {portfolioData.personal.email && (
          <a href={`mailto:${portfolioData.personal.email}`} className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            {portfolioData.personal.email}
          </a>
        )}
        {portfolioData.personal.phone && (
          <a href={`tel:${portfolioData.personal.phone.replace(/\D/g, "")}`} className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            {portfolioData.personal.phone}
          </a>
        )}
        {portfolioData.personal.location && (
          <span className="text-gray-600 dark:text-gray-400">{portfolioData.personal.location}</span>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onFormChange}
            placeholder="Your Name"
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border shadow-sm ${
              errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow`}
            aria-label="Your Name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onFormChange}
            placeholder="Your Email"
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border shadow-sm ${
              errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow`}
            aria-label="Your Email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={onFormChange}
            placeholder="Your Message"
            rows={4}
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border shadow-sm ${
              errors.message ? "border-red-500" : "border-gray-200 dark:border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow resize-none`}
            aria-label="Your Message"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        {submitStatus === "success" && (
          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
            Message sent successfully! I&apos;ll get back to you soon.
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-500 text-sm">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>

      <div className="flex justify-center flex-wrap gap-6 mt-8">
        {portfolioData.personal.github && (
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-purple-500 transition-colors duration-300"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        )}
        {portfolioData.personal.instagram && (
          <a
            href={portfolioData.personal.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-purple-500 transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
        )}
        {portfolioData.personal.twitter && (
          <a
            href={portfolioData.personal.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-purple-500 transition-colors duration-300"
            aria-label="Twitter"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
        )}
        {portfolioData.personal.linkedin && (
          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-purple-500 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  </motion.div>
))

ContactSection.displayName = "ContactSection"

// Main portfolio component
const InteractivePortfolioSimple = () => {
  const [activeSection, setActiveSection] = useState("intro")
  const [cursorText, setCursorText] = useState("")
  const [isExploring, setIsExploring] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Form state for contact section
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus("idle")
    setSubmitError("")

    // Validate
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      email: !formData.email ? "Email is required" : !/^\S+@\S+\.\S+$/.test(formData.email) ? "Email is invalid" : "",
      message: formData.message ? "" : "Message is required",
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some((error) => error)) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitStatus("error")
        setSubmitError(data.error || "Failed to send message. Please try again.")
        return
      }
      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch {
      setSubmitStatus("error")
      setSubmitError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const setSection = useCallback((section: string, text = "") => {
    setActiveSection(section)
    setCursorText(text)
  }, [])

  const startExploring = useCallback(() => {
    setIsExploring(true)
    setTimeout(() => setSection("map"), 800)
  }, [setSection])

  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("portfolio-theme", newMode ? "dark" : "light")
  }, [isDarkMode])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow key navigation
      if (activeSection === "map") {
        switch (e.key) {
          case "ArrowUp":
            setSection("about")
            break
          case "ArrowRight":
            setSection("projects")
            break
          case "ArrowDown":
            setSection("skills")
            break
          case "ArrowLeft":
            setSection("contact")
            break
        }
      } else if (e.key === "Escape") {
        // Escape key to go back to map
        if (selectedProject) {
          setSelectedProject(null)
        } else {
          setSection("map")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSection, selectedProject, setSection])

  // Check for saved theme preference (default is dark)
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme")
    if (savedTheme === "light") {
      setIsDarkMode(false)
    }
  }, [])

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Scroll animation for longer sections
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const items = container.querySelectorAll(".animate-on-scroll")

      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.8

        if (isVisible) {
          item.classList.add("animate-visible")
        }
      })
    }

    // Use a timeout to ensure the DOM is ready
    const timer = setTimeout(() => {
      handleScroll()
    }, 100)

    container.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timer)
      container.removeEventListener("scroll", handleScroll)
    }
  }, [activeSection])

  // Section components
  const IntroSection = () => (
    <motion.div
      className="h-full w-full flex flex-col items-center justify-center text-center p-6 bg-mesh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-purple-600 dark:text-purple-400 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Portfolio
      </motion.div>
      <motion.h1
        className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400 tracking-tight leading-[1.1]"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="block">{portfolioData.intro.headlineLine1}</span>
        <span className="block">{portfolioData.intro.headlineLine2}</span>
      </motion.h1>
      <motion.p
        className="text-lg md:text-2xl max-w-xl mb-10 text-gray-600 dark:text-gray-400 font-medium"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {portfolioData.intro.subtagline}
      </motion.p>
      <motion.button
        className="mt-4 px-8 py-4 rounded-full text-lg font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl shadow-purple-500/20 dark:shadow-purple-400/20 hover:shadow-2xl hover:shadow-purple-500/30 dark:hover:shadow-purple-400/30 transition-all duration-300 hover:scale-105 active:scale-[0.98]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={startExploring}
      >
        {portfolioData.intro.ctaButton}
      </motion.button>
    </motion.div>
  )

  const MapSection = () => (
    <motion.div
      className="h-full w-full relative bg-mesh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(71,85,105,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="absolute top-6 left-6 font-display text-2xl font-bold text-gray-800 dark:text-gray-100">
        Portfolio Map
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      {/* Navigation nodes */}
      <NavNode
        id="about"
        label="About"
        x={25}
        y={30}
        color="#06b6d4"
        active={activeSection === "about"}
        onClick={() => setSection("about")}
      />
      <NavNode
        id="projects"
        label="Projects"
        x={65}
        y={40}
        color="#8b5cf6"
        active={activeSection === "projects"}
        onClick={() => setSection("projects")}
      />
      <NavNode
        id="skills"
        label="Skills"
        x={40}
        y={65}
        color="#22c55e"
        active={activeSection === "skills"}
        onClick={() => setSection("skills")}
      />
      <NavNode
        id="testimonials"
        label="Testimonials"
        x={15}
        y={70}
        color="#f59e0b"
        active={activeSection === "testimonials"}
        onClick={() => setSection("testimonials")}
      />
      <NavNode
        id="contact"
        label="Contact"
        x={80}
        y={75}
        color="#f43f5e"
        active={activeSection === "contact"}
        onClick={() => setSection("contact")}
      />

      <motion.div
        className="absolute bottom-6 left-6 text-sm text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/60 dark:border-gray-700/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Click a node to explore · Arrow keys to navigate
      </motion.div>
    </motion.div>
  )

  const AboutSection = () => (
    <motion.div
      ref={containerRef}
      className="h-full w-full flex flex-col items-center justify-start p-8 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-2xl mx-auto text-center mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-6">About Me</h2>
        <p className="text-xl mb-6">{portfolioData.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <motion.div
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-bold mb-2">Background</h3>
            <p>{portfolioData.about.background}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-6 text-white"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold mb-2">Approach</h3>
            <p>{portfolioData.about.approach}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Experience Timeline */}
      <div className="mt-12 max-w-2xl mx-auto animate-on-scroll">
        <h3 className="text-xl font-bold mb-6 text-center">Professional Experience</h3>

        <div className="relative border-l-2 border-purple-500 pl-8 ml-4 space-y-10">
          {portfolioData.experience.map((item, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <div className="absolute -left-12 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <div className="text-sm text-purple-500 font-bold mb-1">{item.year}</div>
              <div className="font-bold text-lg">{item.title}</div>
              <div className="text-gray-600 dark:text-gray-300 mb-1">
                {item.company}
                {item.location ? ` · ${item.location}` : ""}
              </div>
              <div className="text-gray-500 dark:text-gray-400">{item.description}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Education */}
      {portfolioData.education && portfolioData.education.length > 0 && (
        <div className="mt-12 max-w-2xl mx-auto animate-on-scroll">
          <h3 className="text-xl font-bold mb-6 text-center">Education</h3>
          <div className="relative border-l-2 border-indigo-500 pl-8 ml-4 space-y-6">
            {portfolioData.education.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <div className="absolute -left-12 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
                <div className="font-bold text-lg">{item.degree}</div>
                <div className="text-gray-600 dark:text-gray-300">{item.institution}</div>
                <div className="text-sm text-indigo-500 font-medium">{item.period}{item.grade ? ` · ${item.grade}` : ""}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  )

  const ProjectsSection = () => (
    <motion.div
      ref={containerRef}
      className="h-full min-h-0 w-full flex flex-col items-center justify-start p-8 overflow-y-auto overflow-x-hidden bg-mesh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Featured Projects</h2>
      <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {portfolioData.projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/80 shadow-lg border border-gray-200/80 dark:border-gray-700/80 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedProject(project)}
          >
            <div className="h-1.5 w-full group-hover:h-2 transition-all" style={{ backgroundColor: project.color }} />
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-1 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{project.title}</h3>
              {"projectType" in project && project.projectType && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 block">
                  {(project as { projectType?: string }).projectType}
                </span>
              )}
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border"
                    style={{
                      backgroundColor: `${project.color}18`,
                      color: project.color,
                      borderColor: `${project.color}40`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200/80 dark:border-gray-700/80"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{selectedProject.title}</h3>
                {"projectType" in selectedProject && selectedProject.projectType && (
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mt-0.5">
                    {(selectedProject as { projectType?: string }).projectType}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-52 bg-gray-100 dark:bg-gray-700/50 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
              <img
                src={selectedProject.image || "/placeholder.svg"}
                alt={selectedProject.title}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">{selectedProject.description}</p>

            <div className="mb-5">
              <h4 className="font-display font-semibold mb-2 text-gray-900 dark:text-white">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg"
                    style={{
                      backgroundColor: `${selectedProject.color}20`,
                      color: selectedProject.color,
                      border: `1px solid ${selectedProject.color}50`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {(selectedProject.liveUrl || selectedProject.codeUrl) && (
              <div className="flex gap-3">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    View Live
                  </a>
                )}
                {selectedProject.codeUrl && (
                  <a
                    href={selectedProject.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    View Code
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )

  const SkillsSection = () => (
    <motion.div
      className="h-full w-full flex flex-col items-center justify-center p-8 bg-mesh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Skills & Expertise</h2>
      <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-10" />

      <div className="max-w-2xl w-full mx-auto space-y-6">
        {portfolioData.skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 p-4 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * index }}
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
              <span className="text-sm font-semibold tabular-nums" style={{ color: skill.color }}>{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-3 rounded-full shadow-sm"
                style={{ backgroundColor: skill.color }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.15 * index }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const TestimonialsSection = () => (
    <motion.div
      ref={containerRef}
      className="h-full min-h-0 w-full flex flex-col items-center justify-start p-8 overflow-y-auto overflow-x-hidden bg-mesh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Client Testimonials</h2>
      <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-10" />

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {portfolioData.testimonials.length > 0 ? (
          portfolioData.testimonials.map((testimonial: Testimonial, index: number) => (
            <motion.div
              key={index}
              className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 p-6 rounded-2xl shadow-lg animate-on-scroll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-purple-200 dark:ring-purple-500/30"
                />
                <div>
                  <div className="font-display font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
              <p className="italic text-gray-600 dark:text-gray-300 border-l-2 border-purple-400/60 pl-4">"{testimonial.quote}"</p>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
            No testimonials yet. Add entries to the &quot;testimonials&quot; array in data/portfolio.json to display them here.
          </p>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className={`relative w-full h-screen min-h-0 bg-white text-gray-900 overflow-hidden ${isDarkMode ? "dark" : ""}`}>
      {/* Loading screen */}
      {isLoading ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-mesh"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, delay: 1 }}
          onAnimationComplete={() => setIsLoading(false)}
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
            className="w-14 h-14 rounded-full border-4 border-purple-200 dark:border-purple-500/30 border-t-purple-500"
          />
        </motion.div>
      ) : (
        <>
          {/* Back button - top left, when viewing any section (not intro/map) */}
          {activeSection !== "intro" && activeSection !== "map" && (
            <motion.button
              className="fixed top-5 left-5 z-30 p-2.5 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700/90 text-gray-700 dark:text-gray-200 transition-all duration-300 backdrop-blur-sm"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={() => setSection("map")}
              aria-label="Back to map"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {/* Main content */}
          <div
            ref={containerRef}
            className="relative w-full h-full min-h-0 flex flex-col overflow-hidden dark:bg-gray-900 dark:text-gray-100"
          >
            <div className="flex-1 min-h-0 relative w-full">
              <AnimatePresence mode="wait">
                {activeSection === "intro" && <IntroSection key="intro" />}
                {activeSection === "map" && <MapSection key="map" />}
                {activeSection === "about" && <AboutSection key="about" />}
                {activeSection === "projects" && <ProjectsSection key="projects" />}
                {activeSection === "skills" && <SkillsSection key="skills" />}
                {activeSection === "testimonials" && <TestimonialsSection key="testimonials" />}
                {activeSection === "contact" && (
                  <ContactSection
                    key="contact"
                    formData={formData}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    submitStatus={submitStatus}
                    submitError={submitError}
                    onFormChange={handleChange}
                    onSubmit={handleSubmit}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile navigation */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-gray-800/95 border-t border-gray-200/80 dark:border-gray-700/80 backdrop-blur-md">
              <div className="flex justify-around gap-1 max-w-lg mx-auto">
                {["map", "about", "projects", "skills", "testimonials", "contact"].map((section) => (
                  <button
                    key={section}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-200 ${
                      activeSection === section
                        ? "bg-purple-500 text-white shadow-md shadow-purple-500/30"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => setSection(section)}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InteractivePortfolioSimple

