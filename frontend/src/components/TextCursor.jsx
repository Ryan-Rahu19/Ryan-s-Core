import { useState, useEffect, useRef } from 'react';
import './TextCursor.css';
import { motion, AnimatePresence } from 'motion/react';

const TextCursor = ({
  text = 'hello',
  spacing = 100,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 5,
}) => {
  const [trail, setTrail] = useState([]);
  const lastMoveRef = useRef(Date.now());
  const idCounter = useRef(0);
  const lastPosRef = useRef(null);

  // ── Listen on window so it works regardless of parent position/size ───────
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const rndData = () =>
        randomFloat
          ? {
            randomX: Math.random() * 10 - 5,
            randomY: Math.random() * 10 - 5,
            randomRotate: Math.random() * 10 - 5,
          }
          : {};

      setTrail((prev) => {
        const next = [...prev];

        if (!lastPosRef.current) {
          lastPosRef.current = { x: mouseX, y: mouseY };
          next.push({ id: idCounter.current++, x: mouseX, y: mouseY, angle: 0, ...rndData() });
        } else {
          const { x: lx, y: ly } = lastPosRef.current;
          const dx = mouseX - lx;
          const dy = mouseY - ly;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist >= spacing) {
            const angle = followMouseDirection
              ? (Math.atan2(dy, dx) * 180) / Math.PI
              : 0;
            const steps = Math.floor(dist / spacing);

            for (let i = 1; i <= steps; i++) {
              const t = (spacing * i) / dist;
              next.push({
                id: idCounter.current++,
                x: lx + dx * t,
                y: ly + dy * t,
                angle,
                ...rndData(),
              });
            }
            lastPosRef.current = {
              x: lx + dx * (spacing * steps / dist),
              y: ly + dy * (spacing * steps / dist),
            };
          }
        }

        return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
      });

      lastMoveRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [spacing, followMouseDirection, randomFloat, maxPoints]);

  // ── Remove trail items when mouse is idle ─────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveRef.current > 100) {
        setTrail((prev) => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div className="text-cursor-container">
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            className="text-cursor-item"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0.8, rotate: item.angle }}
            animate={{
              opacity: 1,
              scale: 1,
              x: randomFloat ? [0, item.randomX || 0, 0] : 0,
              y: randomFloat ? [0, item.randomY || 0, 0] : 0,
              rotate: randomFloat
                ? [item.angle, item.angle + (item.randomRotate || 0), item.angle]
                : item.angle,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: exitDuration, ease: 'easeOut' },
              ...(randomFloat && {
                x: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
                y: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
                rotate: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
              }),
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TextCursor;