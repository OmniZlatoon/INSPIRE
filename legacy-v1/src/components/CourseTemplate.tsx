import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, PlayCircle, Quote, X, Play } from 'lucide-react';
import AntiGravityDots from './AntiGravityDots';
import type { CourseData, CourseQA } from '../data/coursesData';

// Asset imports
import albertEinsteinImg from '../assets/MainSystemImages/albertEinstein-removebg-preview.png';
import introImg from '../assets/MainSystemImages/introduction-removebg-preview.png';

// Video imports
import mathVideo from '../Videos/Maths.mp4';
import physicsVideo from '../Videos/Physics.mp4';
import cProgrammingVideo from '../Videos/CProgramming.mp4';
import circuitTheoryVideo from '../Videos/Circuit theory.mp4';

/* ─── Typewriter hook ─────────────────────────────────── */
function useTypewriter(text: string, speed = 60, startDelay = 400) {
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

interface CourseTemplateProps {
    data: CourseData;
    themeColor?: string;
    icon?: React.ReactNode;
    activeModule: string | null;
}

/* ─── Components ─────────────────────────────────────── */

const VideoModal: React.FC<{ src: string | null, onClose: () => void }> = ({ src, onClose }) => {
    if (!src) return null;
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                }}
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                        position: 'relative',
                        width: '80%',
                        maxWidth: '1000px',
                        aspectRatio: '16/9',
                        backgroundColor: '#000',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            zIndex: 10,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#fff',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <X size={24} />
                    </button>
                    <video 
                        src={src} 
                        controls 
                        autoPlay 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const VideoCard: React.FC<{ src: string, name: string, onPlay: (src: string) => void }> = ({ src, name, onPlay }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div style={{ flexShrink: 0, width: '240px' }}>
            <div 
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '135px',
                    backgroundColor: '#000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid #e8eaed'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => onPlay(src)}
            >
                <video src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                <AnimatePresence>
                    {isHovered && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                color: '#fff'
                            }}
                        >
                            <Play size={40} fill="#fff" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <p style={{ 
                marginTop: '12px', 
                fontSize: '0.9rem', 
                color: '#5f6368', 
                textAlign: 'center', 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500
            }}>
                {name}
            </p>
        </div>
    );
};

const TypewriterHeading: React.FC<{ text: string, style?: React.CSSProperties }> = ({ text, style }) => {
    const { displayed, done } = useTypewriter(text);
    return (
        <h1 style={{ ...style, display: 'inline-block' }}>
            {displayed}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "steps(2)" }}
                style={{
                    display: done ? 'none' : 'inline-block',
                    marginLeft: '2px',
                    width: '3px',
                    height: '1em',
                    backgroundColor: '#202124',
                    verticalAlign: 'middle'
                }}
            />
        </h1>
    );
};

const GradientLine: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '2px', marginTop: '4px', overflow: 'hidden' }}>
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, #1a73e8, #34a853, #ea4335)',
                    position: 'absolute'
                }}
            />
        </div>
    );
};

const SandTimerBackground: React.FC = () => {
    const duration = 2; 
    const total = duration * 4;

    const cornerStyle: React.CSSProperties = {
        position: 'absolute',
        width: '75px',
        height: '75px',
        pointerEvents: 'none',
        filter: 'blur(20px)',
        opacity: 0.7
    };

    const googleBlue = 'rgba(33, 111, 236, 0.9)';
    const googleGreen = 'rgba(52, 168, 83, 0.9)';
    const googleRed = 'rgba(234, 67, 53, 0.9)';
    const googleOrange = 'rgba(251, 188, 5, 0.9)';

    const getGradient = (color: string, pos: string) => `radial-gradient(circle at ${pos}, ${color} 0%, transparent 100%)`;

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <motion.div 
                style={{ ...cornerStyle, top: '-10px', left: '-10px', background: getGradient(googleBlue, 'top left') }}
                animate={{ opacity: [0.8, 0, 0, 0, 0.8] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />
            <motion.div 
                style={{ ...cornerStyle, bottom: '-10px', left: '-10px', background: getGradient(googleGreen, 'bottom left') }}
                animate={{ opacity: [0, 0.8, 0, 0, 0] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />
            <motion.div 
                style={{ ...cornerStyle, bottom: '-10px', right: '-10px', background: getGradient(googleRed, 'bottom right') }}
                animate={{ opacity: [0, 0, 0.8, 0, 0] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />
            <motion.div 
                style={{ ...cornerStyle, top: '-10px', right: '-10px', background: getGradient(googleOrange, 'top right') }}
                animate={{ opacity: [0, 0, 0, 0.8, 0] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />

            <motion.div 
                style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px' }}
                animate={{ backgroundColor: [googleBlue, googleGreen, 'transparent', 'transparent', googleBlue], opacity: [1, 1, 0, 0, 1] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />
            <motion.div 
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px' }}
                animate={{ backgroundColor: ['transparent', googleGreen, googleRed, 'transparent', 'transparent'], opacity: [0, 1, 1, 0, 0] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />
            <motion.div 
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '2px' }}
                animate={{ backgroundColor: ['transparent', 'transparent', googleRed, googleOrange, 'transparent'], opacity: [0, 0, 1, 1, 0] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />
            <motion.div 
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px' }}
                animate={{ backgroundColor: [googleBlue, 'transparent', 'transparent', googleOrange, googleBlue], opacity: [1, 0, 0, 1, 1] }}
                transition={{ duration: total, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            />
        </div>
    );
};

const QABlock = ({ qa }: { qa: CourseQA }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid #e8eaed', padding: '16px 0' }}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center', gap: '16px' }}
            >
                <h4 style={{ 
                    margin: 0, fontWeight: 500, color: isOpen ? '#1a73e8' : '#202124', 
                    transition: 'color 0.2s', lineHeight: 1.4, fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" 
                }}>
                    {qa.question}
                </h4>
                {isOpen ? <ChevronUp size={20} color="#5f6368" /> : <ChevronDown size={20} color="#5f6368" />}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p style={{ margin: '12px 0 0 0', color: '#5f6368', lineHeight: 1.6, fontSize: '0.95rem', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                            {qa.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CourseTemplate: React.FC<CourseTemplateProps> = ({ data, activeModule }) => {
    const refs = useRef<Record<string, HTMLDivElement | null>>({});
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    useEffect(() => {
        if (activeModule && refs.current[activeModule]) {
            refs.current[activeModule]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeModule]);

    if (!data) return null;

    const cleanTitle = (title: string) => {
        return title.replace(/^Module\s\d+:\s*/i, '').replace(/^"|"$/g, '');
    };

    const isPhysics = data.title.toLowerCase().includes('physics');
    const isCircuit = data.title.toLowerCase().includes('circuit');
    const isC = data.title.toLowerCase().includes('c programming');

    const getIntroVideo = () => {
        if (isPhysics) return physicsVideo;
        if (isCircuit) return circuitTheoryVideo;
        if (isC) return cProgrammingVideo;
        return mathVideo;
    };

    const showcaseVideos = [
        { src: mathVideo, name: "Mathematical Foundations" },
        { src: physicsVideo, name: "Laws of Physics" },
        { src: cProgrammingVideo, name: "C Programming Deep Dive" },
        { src: circuitTheoryVideo, name: "Circuit Analysis" }
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflowY: 'auto', backgroundColor: 'transparent' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }}>
                <AntiGravityDots />
            </div>

            <VideoModal src={selectedVideo} onClose={() => setSelectedVideo(null)} />

            <div style={{ position: 'relative', zIndex: 1, padding: '48px 48px', width: '100%', boxSizing: 'border-box' }}>
                
                {/* Course Header */}
                <div style={{ marginBottom: '32px', paddingBottom: '16px' }}>
                    <TypewriterHeading 
                        text={data.title} 
                        style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '2rem', color: '#202124', letterSpacing: '-0.5px' }} 
                    />
                    <div style={{ width: '200px' }}>
                        <GradientLine />
                    </div>
                </div>

                {/* Modules 1-7 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {data.modules.map((module, idx) => {
                        const isQuoteSection = module.title.includes('Real-World Wisdom');
                        const isDidYouKnow = module.title.includes('Did You Know');
                        const isBriefIntro = module.title.includes('Brief Course Introduction');
                        
                        return (
                            <motion.div
                                key={idx}
                                ref={el => refs.current[module.title] = el}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                style={{
                                    padding: '32px 24px',
                                    borderBottom: (isQuoteSection || (isBriefIntro && idx !== 1)) ? 'none' : '1px solid #e8eaed',
                                    backgroundColor: isQuoteSection ? '#fffdf5' : 'transparent',
                                    borderRadius: (isQuoteSection || isBriefIntro) ? '12px' : '0',
                                    margin: (isQuoteSection || isBriefIntro) ? '24px 0' : '0',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: isDidYouKnow ? '600px' : (isBriefIntro ? '500px' : 'auto'),
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                {isDidYouKnow && (
                                    <video autoPlay muted loop playsInline 
                                        key={data.title}
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }}>
                                        <source src={getIntroVideo()} type="video/mp4" />
                                    </video>
                                )}

                                {isBriefIntro && <SandTimerBackground />}

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ textAlign: (isDidYouKnow || isQuoteSection) ? 'center' : 'left' }}>
                                        <h3 style={{ 
                                            margin: '0 0 16px 0', color: '#202124', fontSize: '1.4rem', 
                                            fontWeight: 600, fontFamily: "'Inter', sans-serif", display: 'inline-block'
                                        }}>
                                            {isQuoteSection ? 'Intelligent Quotes' : cleanTitle(module.title)}
                                        </h3>
                                        {!isQuoteSection && !isDidYouKnow && !isBriefIntro && <div style={{ width: '60px' }}><GradientLine /></div>}
                                        {isDidYouKnow && <div style={{ width: '120px', margin: '0 auto' }}><GradientLine /></div>}
                                        {isBriefIntro && <div style={{ width: '120px', marginLeft: 0 }}><GradientLine /></div>}
                                    </div>

                                    {isDidYouKnow ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '24px', maxWidth: '1000px', margin: '24px auto 0' }}>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ color: '#202124', lineHeight: 1.7, fontSize: 'calc(1.1rem + 5px)', fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                                                    {module.content.map((p, pi) => <p key={pi} style={{ margin: '8px 0' }}>{p}</p>)}
                                                </div>
                                            </div>
                                        </div>
                                    ) : isBriefIntro ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '48px', marginTop: '24px' }}>
                                            <div style={{ flex: 1, color: '#202124', lineHeight: 1.8, fontSize: '1.05rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, textAlign: 'left' }}>
                                                {module.content.map((p, pi) => <p key={pi} style={{ margin: '12px 0' }}>{p}</p>)}
                                            </div>
                                            <div style={{ flexShrink: 0, width: '280px' }}>
                                                <img 
                                                    src={introImg} 
                                                    alt="Introduction" 
                                                    style={{ width: '100%', height: 'auto', borderRadius: '12px' }} 
                                                />
                                            </div>
                                        </div>
                                    ) : isQuoteSection ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                            <div style={{ position: 'relative', padding: '40px 20px', textAlign: 'center', flex: 1 }}>
                                                <Quote size={40} color="#5d4037" style={{ position: 'absolute', top: 0, left: '5%', opacity: 0.15 }} />
                                                <div style={{ fontStyle: 'italic', fontSize: '1.25rem', color: '#5d4037', lineHeight: 1.6, padding: '0 32px', fontWeight: 300 }}>
                                                    {module.content.map((text, ti) => {
                                                        const parts = text.split('—');
                                                        const quoteContent = parts[0].trim();
                                                        const author = parts[1] ? parts[1].trim() : '';
                                                        const isEinstein = author.toLowerCase().includes('albert einstein');
                                                        
                                                        return (
                                                            <div key={ti} style={{ position: 'relative' }}>
                                                                <span style={{ fontSize: '1.5rem', color: '#5d4037' }}>"</span>
                                                                {quoteContent}
                                                                <span style={{ fontSize: '1.5rem', color: '#5d4037' }}>"</span>
                                                                {author && (
                                                                    <div style={{ 
                                                                        textAlign: 'right', 
                                                                        marginTop: '16px', 
                                                                        fontStyle: 'normal', 
                                                                        fontSize: '0.95rem', 
                                                                        color: '#202124', 
                                                                        fontWeight: 500,
                                                                        position: 'absolute',
                                                                        right: 0,
                                                                        bottom: '-32px'
                                                                    }}>
                                                                        — {author}
                                                                    </div>
                                                                )}
                                                                {isEinstein && (
                                                                    <div style={{ 
                                                                        position: 'absolute', 
                                                                        right: '-250px', 
                                                                        top: '50%', 
                                                                        transform: 'translateY(-50%)',
                                                                        width: '200px',
                                                                        pointerEvents: 'none'
                                                                    }}>
                                                                        <img 
                                                                            src={albertEinsteinImg} 
                                                                            alt="Albert Einstein" 
                                                                            style={{ width: '100%', height: 'auto', borderRadius: '12px' }} 
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <Quote size={40} color="#5d4037" style={{ position: 'absolute', bottom: 0, right: '5%', opacity: 0.15, transform: 'rotate(180deg)' }} />
                                            </div>
                                            {/* Spacer for Einstein image if it exists */}
                                            {module.content.some(text => text.toLowerCase().includes('albert einstein')) && (
                                                <div style={{ width: '220px', flexShrink: 0 }} />
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ color: '#5f6368', lineHeight: 1.7, fontSize: '1.05rem', fontFamily: "'Inter', sans-serif", fontWeight: 300, marginTop: '16px' }}>
                                            {module.content.map((paragraph, pIdx) => (
                                                <p key={pIdx} style={{ margin: '0 0 12px 0' }}>
                                                    {paragraph.startsWith('•') ? (
                                                        <span style={{ display: 'flex', gap: '8px' }}>
                                                            <span style={{ color: '#202124' }}>•</span>
                                                            <span>{paragraph.substring(1).trim()}</span>
                                                        </span>
                                                    ) : paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Module 8: Real-World Application Showcase */}
                <motion.div
                    ref={el => refs.current['module8'] = el}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ padding: '32px 0', borderBottom: '1px solid #e8eaed' }}
                >
                    <h3 style={{ margin: '0 0 8px 0', color: '#202124', fontSize: '1.25rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", display: 'inline-block' }}>
                        Real-World Application Showcase
                    </h3>
                    <div style={{ width: '120px' }}><GradientLine /></div>
                    
                    <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', padding: '24px 0 16px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {showcaseVideos.map((vid, i) => (
                            <VideoCard key={i} src={vid.src} name={vid.name} onPlay={setSelectedVideo} />
                        ))}
                    </div>
                </motion.div>

                {/* Module 9: Q&A Section */}
                <motion.div
                    ref={el => refs.current['Module 9: Q&A Section'] = el}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ padding: '32px 0', marginBottom: '64px' }}
                >
                    <h3 style={{ margin: '0 0 8px 0', color: '#202124', fontSize: '1.25rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", display: 'inline-block' }}>
                        Q&A Section
                    </h3>
                    <div style={{ width: '60px' }}><GradientLine /></div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24px' }}>
                        {data.qa.map((item, idx) => <QABlock key={idx} qa={item} />)}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default CourseTemplate;
