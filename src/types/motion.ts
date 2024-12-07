import { motion, MotionProps } from "framer-motion";

// Add type for HTML props
type HTMLMotionProps<T extends keyof HTMLElementTagNameMap> = 
  Omit<React.HTMLAttributes<HTMLElementTagNameMap[T]>, keyof MotionProps> & MotionProps;

// Motion components with proper typing
export const MotionDiv = motion.div as React.FC<HTMLMotionProps<"div">>;
export const MotionSection = motion.section as React.FC<HTMLMotionProps<"section">>;
export const MotionForm = motion.form as React.FC<HTMLMotionProps<"form">>;
export const MotionInput = motion.input as React.FC<HTMLMotionProps<"input">>;
export const MotionTextarea = motion.textarea as React.FC<HTMLMotionProps<"textarea">>;
export const MotionSelect = motion.select as React.FC<HTMLMotionProps<"select">>;
export const MotionP = motion.p as React.FC<HTMLMotionProps<"p">>;
export const MotionButton = motion.button as React.FC<HTMLMotionProps<"button">>; 