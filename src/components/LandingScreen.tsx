import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import AntiGravityDots from './AntiGravityDots';
import Logo from '../../public/parts/Logo';
import '../App.css';

// Carousel Image Imports
import abstractImg from '../assets/landingImages/abstract_logic-removebg-preview.png';
import physicalImg from '../assets/landingImages/physical_law-removebg-preview.png';
import failingImg from '../assets/landingImages/failing_midterms-removebg-preview.png';

/* ─── Typewriter hook ─────────────────────────────────── */
function useTypewriter(text: string, speed = 40, startDelay = 600) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        let i = 0;
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                i++;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, speed);
            return () => clearInterval(interval);
        }, startDelay);

        return () => clearTimeout(timer);
    }, [text, speed, startDelay]);

    return { displayed, done };
}

/* ─── Data ───────────────────────────────────────────── */
const TYPEWRITER_TEXT = 'Where Academic Struggle Meets Technical Genius.';

const BULLET_POINTS = [
    'From abstract logic to scalable software architecture.',
    'From physical laws to the hardware of the future.',
    'From failing a midterm to building a global legacy.',
];

const CAROUSEL_IMAGES = [abstractImg, physicalImg, failingImg];

/* ─── Styles ─────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
    page: {
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    navbar: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 48px',
        height: '64px',
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8eaed',
    },
    body: {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
    },
    left: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 64px 80px 72px',
    },
    right: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        paddingBottom: '40px', // Extra padding for the scrollbar dots
    },
};

/* ─── Component ──────────────────────────────────────── */
interface LandingScreenProps {
    onNavigate?: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
    const { displayed, done: typingDone } = useTypewriter(TYPEWRITER_TEXT, 38, 500);
    const [isMobile, setIsMobile] = useState(false);

    // Carousel State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHoveringBlob, setIsHoveringBlob] = useState(false);

    // Responsive listener
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 900);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Carousel Auto-play Timer (5 seconds)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentImageIndex]);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1));
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    };

    const fadeUp = (delay: number) => ({
        initial: { opacity: 0, y: 18 },
        animate: typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
        transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
    });

    return (
        <div style={styles.page}>
            <AntiGravityDots />

            {/* ── Navbar ──────────────────────────────────── */}
            <nav style={styles.navbar}>
                <Logo />
                <button className="btn-primary" aria-label="Start your journey" onClick={onNavigate}>
                    Get Started
                    <ArrowRight size={16} className="arrow-icon" />
                </button>
            </nav>

            {/* ── Main grid ───────────────────────────────── */}
            <div
                style={{
                    ...styles.body,
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* ── LEFT — copy ─────────────────────────── */}
                <div
                    style={{
                        ...styles.left,
                        padding: isMobile ? '60px 28px 48px' : '80px 64px 80px 72px',
                    }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 700,
                            fontSize: isMobile ? '2rem' : '3.2em',
                            lineHeight: 1.18,
                            letterSpacing: '-0.5px',
                            color: '#202124',
                            marginBottom: '10px',
                            whiteSpace: isMobile ? 'normal' : 'nowrap',
                        }}
                    >
                        Master the Code of Reality
                    </motion.h1>

                    <div
                        style={{
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 300,
                            fontSize: isMobile ? '1.3rem' : '1.8rem',
                            lineHeight: 1.4,
                            color: '#5f6368',
                            marginBottom: '48px',
                            minHeight: isMobile ? '3.2rem' : '2.3rem',
                            letterSpacing: '0.01em',
                        }}
                    >
                        {displayed}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                            style={{ borderRight: '2px solid #5f6368', marginLeft: '1px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                        {BULLET_POINTS.map((point, i) => (
                            <motion.div
                                key={i}
                                {...fadeUp(i * 0.15)}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                            >
                                <ArrowRight
                                    size={17}
                                    color="#202124"
                                    style={{ flexShrink: 0, marginTop: '3px' }}
                                />
                                <span
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 400,
                                        fontSize: '1.16rem',
                                        lineHeight: 1.55,
                                        color: '#3c4043',
                                    }}
                                >
                                    {point}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        {...fadeUp(0.6)}
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '1.1rem',
                            lineHeight: 1.72,
                            color: '#5f6368',
                            maxWidth: '520px',
                        }}
                    >
                        The standard classroom failed to tell you why these courses matter.
                        We're here to bridge that gap. Designed for the modern tech student,
                        this platform transforms the five most grueling academic pillars—from
                        Discrete Math to Circuit Theory—into a visual roadmap of inspiration.
                        Stop just studying. Start engineering your future.
                    </motion.p>
                </div>

                {/* ── RIGHT — Expanded Blob Carousel ──────────────────── */}
                <div style={styles.right}>

                    {/* Interactive Blob Wrapper */}
                    <div
                        style={{
                            position: 'relative',
                            width: isMobile ? '380px' : '650px',
                            height: isMobile ? '380px' : '650px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '30px'
                        }}
                        onMouseEnter={() => setIsHoveringBlob(true)}
                        onMouseLeave={() => setIsHoveringBlob(false)}
                    >
                        {/* Background Liquid Blob */}
                        <div
                            className="liquid-blob"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                opacity: 0.85,
                                zIndex: 0,
                            }}
                        />

                        {/* Rendering the active carousel image */}
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImageIndex}
                                src={CAROUSEL_IMAGES[currentImageIndex]}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    maxWidth: '85%',
                                    maxHeight: '85%',
                                    objectFit: 'contain',
                                    zIndex: 1,
                                    filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.15))'
                                }}
                            />
                        </AnimatePresence>

                        {/* Left / Right Hover Arrows */}
                        <AnimatePresence>
                            {isHoveringBlob && (
                                <>
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        onClick={handlePrevImage}
                                        className="carousel-arrow left"
                                        aria-label="Previous image"
                                        style={{ left: isMobile ? '-20px' : '-60px' }}
                                    >
                                        <ChevronLeft size={32} />
                                    </motion.button>

                                    <motion.button
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        onClick={handleNextImage}
                                        className="carousel-arrow right"
                                        aria-label="Next image"
                                        style={{ right: isMobile ? '-20px' : '-60px' }}
                                    >
                                        <ChevronRight size={32} />
                                    </motion.button>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 3-Dot Scrollbar Pagination */}
                    <div style={{ display: 'flex', gap: '14px', zIndex: 10 }}>
                        {CAROUSEL_IMAGES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: currentImageIndex === i ? 'var(--text-primary)' : 'var(--border-subtle)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: currentImageIndex === i ? 'scale(1.3)' : 'scale(1)',
                                    padding: 0
                                }}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Bottom-right CTA — anchored absolutely */}
                    <AnimatePresence>
                        {typingDone && (
                            <motion.div
                                key="cta"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    position: 'absolute',
                                    bottom: isMobile ? '40px' : '56px',
                                    right: isMobile ? '28px' : '60px',
                                    zIndex: 10,
                                }}
                            >
                                <button
                                    className="btn-primary"
                                    style={{ fontSize: '1rem', padding: '14px 28px' }}
                                    aria-label="Start your journey"
                                    onClick={onNavigate}
                                >
                                    Start Your Journey
                                    <ArrowRight size={18} className="arrow-icon" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
};

export default LandingScreen;
