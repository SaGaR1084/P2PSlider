"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "../../styles/P2PSlider.module.css";

import glowingLeft from "./animations/glowing_left_arrows.json";
import glowingRight from "./animations/glowing_right_arrows.json";
import { glowColors, imageSets } from "./data";

// Main Slider Component
const P2PSlider = ({ onAccept, onDecline }) => {
  // ----- State Management -----
  const [activeState, setActiveState] = useState("default"); // Tracks current action: 'default', 'accept', or 'decline'
  const [fadeOut, setFadeOut] = useState(false); // Handles fade-out animation after drag
  const [isSliding, setIsSliding] = useState(false); // Flag to detect if user is actively sliding

  const x = useMotionValue(0); // Tracks drag offset value (Framer Motion)
  const DRAG_LIMIT = 165; // Drag threshold for triggering accept/decline

  const currentGlow = glowColors[activeState]; // Current glow colors based on state
  const currentImages = imageSets[activeState]; // Current image set (orb + arrows + icons)

  // ----- Text and Icon Opacity Transitions -----
  const declineOpacity = useTransform(x, [-120, 0], [1, 0.9]); // Decline text fades when not dragging left
  const acceptOpacity = useTransform(x, [0, 120], [0.9, 1]); // Accept text fades when not dragging right

  // ----- Dynamic Text Color Based on Slide Direction -----
  let textColor = "rgba(255, 255, 255, 1)";
  if (isSliding && activeState === "decline") {
    textColor = "rgba(128, 32, 55, 1)";
  } else if (isSliding && activeState === "accept") {
    textColor = "rgba(7, 110, 73, 1)";
  }

  // ----- Detect Drag Direction and Update State -----
  useEffect(() => {
    const unsubscribe = x.on("change", (latestX) => {
      if (latestX < -20) {
        setActiveState("decline");
        setIsSliding(true);
      } else if (latestX > 20) {
        setActiveState("accept");
        setIsSliding(true);
      } else {
        setActiveState("default");
        setIsSliding(false);
      }
    });
    return () => unsubscribe();
  }, [x]);

  // ----- Handle Drag End Logic -----
  const handleDragEnd = () => {
    const xPos = x.get();
    if (xPos <= -DRAG_LIMIT + 10) {
      // Trigger Decline
      setFadeOut(true);
      setTimeout(() => {
        onDecline();
        animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
        setFadeOut(false);
      }, 300);
    } else if (xPos >= DRAG_LIMIT - 10) {
      // Trigger Accept
      setFadeOut(true);
      setTimeout(() => {
        onAccept();
        animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
        setFadeOut(false);
      }, 300);
    } else {
      // Snap back to center if not enough drag
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  };

  // ----- Render UI -----
  return (
    <div className={styles.container}>
      <div
        className={styles.gradientBorderWrapper}
        style={{
          "--border-gradient": currentGlow.borderGradient,
        }}
      >
        <div
          className={`${styles.track}`}
          style={{
            "--active-text-color": textColor,
            "--background-gradient": currentGlow.bgGradient,
          }}
        >
          {/* ---- Left Label (Decline) ---- */}
          <motion.div
            className={styles.labelGroup}
            style={{ opacity: declineOpacity }}
          >
            <Image
              width={24}
              height={24}
              alt="Decline"
              src={currentImages.close}
            />
            <span
              className={styles.labelText}
              style={{ "--active-text-color": textColor }}
            >
              Decline
            </span>
          </motion.div>

          {/* ---- Center Group (Orb + Arrows) ---- */}
          <div className={styles.centerGroup}>
            {/* ---- Left Arrow Animation or Static ---- */}
            <div
              className={`${styles.arrowWrapper} ${styles.arrowWrapperLeft}`}
            >
              {isSliding ? (
                <Image
                  width={40}
                  height={34}
                  alt="leftArrow"
                  className={styles.arrow}
                  src={currentImages.leftArrow}
                />
              ) : (
                <Lottie
                  loop
                  autoplay
                  animationData={glowingLeft}
                  style={{ width: 40, height: 34 }}
                />
              )}
            </div>

            {/* ---- Drag Orb ---- */}
            <motion.div
              drag="x"
              tabIndex={0}
              role="slider"
              style={{ x }}
              dragElastic={0.1}
              aria-valuenow={x.get()}
              onDragEnd={handleDragEnd}
              aria-valuemax={DRAG_LIMIT}
              aria-valuemin={-DRAG_LIMIT}
              aria-label="Swipe to accept or decline"
              dragConstraints={{ left: -DRAG_LIMIT, right: DRAG_LIMIT }}
              className={`${styles.orb} ${fadeOut ? styles.fadeOut : ""}`}
            >
              <Image
                fill
                alt="Slider Orb"
                src={currentImages.button}
                className={styles.orbImage}
              />

              {/* ---- Glowing Aura (only when not sliding) ---- */}
              {!isSliding && (
                <div
                  className={styles.glow}
                  style={{
                    "--glow-color": currentGlow.solid,
                    "--glow-rgba": currentGlow.rgba,
                  }}
                ></div>
              )}
            </motion.div>

            {/* ---- Right Arrow Animation or Static ---- */}
            <div
              className={`${styles.arrowWrapper} ${styles.arrowWrapperRight}`}
            >
              {isSliding ? (
                <Image
                  width={40}
                  height={34}
                  alt="rightArrow"
                  className={styles.arrow}
                  src={currentImages.rightArrow}
                />
              ) : (
                <Lottie
                  loop
                  autoplay
                  animationData={glowingRight}
                  style={{ width: 40, height: 34 }}
                />
              )}
            </div>
          </div>

          {/* ---- Right Label (Accept) ---- */}
          <motion.div
            className={styles.labelGroup}
            style={{ opacity: acceptOpacity }}
          >
            <span
              className={styles.labelText}
              style={{ "--active-text-color": textColor }}
            >
              Accept
            </span>
            <Image
              width={24}
              height={24}
              alt="Accept"
              src={currentImages.check}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default P2PSlider;
