"use client";

import React, { useRef, useEffect } from "react";
import {
  createScope,
  createAnimatable,
  createDraggable,
  animate,
  utils,
} from "animejs";

export default function AnimatedCircle() {
  const circleRef = useRef(null);

  useEffect(() => {
    if (!circleRef.current) return;

    const scope = createScope({
      mediaQueries: {
        isSmall: "(max-width: 200px)",
      },
    }).add((self) => {
      const $circle = circleRef.current;

      // در حالت small draggable کن
      if (self.matches.isSmall) {
        $circle.classList.add("draggable");
        self.circle = createDraggable($circle, { container: document.body });
      } else {
        $circle.classList.remove("draggable");
        self.circle = createAnimatable($circle, { x: 500, y: 500, ease: "out(3)" });
      }

      let win = { w: window.innerWidth, h: window.innerHeight };

      self.add("refreshBounds", () => {
        win.w = window.innerWidth;
        win.h = window.innerHeight;
      });

      self.add("onMouseMove", (e) => {
        if (self.matches.isSmall) return;
        const x = e.clientX - $circle.offsetWidth / 2;
        const y = e.clientY - $circle.offsetHeight / 2;
        if (self.circle.x) {
          self.circle.x(x);
          self.circle.y(y);
        }
      });

      self.add("onPointerDown", () => {
        const { isSmall } = self.matches;
        animate($circle, {
          scale: [
            { to: isSmall ? 1.25 : 0.25, duration: isSmall ? 50 : 150 },
            { to: 1, duration: isSmall ? 250 : 500 },
          ],
        });
      });
    });

    window.addEventListener("resize", scope.methods.refreshBounds);
    window.addEventListener("mousemove", scope.methods.onMouseMove);
    document.addEventListener("pointerdown", scope.methods.onPointerDown);

    return () => {
      // cleanup event listeners
      window.removeEventListener("resize", scope.methods.refreshBounds);
      window.removeEventListener("mousemove", scope.methods.onMouseMove);
      document.removeEventListener("pointerdown", scope.methods.onPointerDown);
    };
  }, []);

  return (
    <div
      ref={circleRef}
      className="circle"
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "red",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
}
