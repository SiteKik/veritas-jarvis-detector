import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Props = HTMLMotionProps<"button">;

export const PressScale = forwardRef<HTMLButtonElement, Props>(function PressScale(
  { children, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});
