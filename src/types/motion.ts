import { motion, MotionProps } from "framer-motion";

// Add type for HTML props
type HTMLMotionProps<T extends keyof HTMLElementTagNameMap> = 
  Omit<React.HTMLAttributes<HTMLElementTagNameMap[T]>, keyof MotionProps> & MotionProps;

// Special type for input elements
type InputMotionProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof MotionProps> & MotionProps;
type TextareaMotionProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof MotionProps> & MotionProps;
type SelectMotionProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, keyof MotionProps> & MotionProps;

// Motion components with proper typing
export const MotionDiv = motion.div as React.FC<HTMLMotionProps<"div">>;
export const MotionSection = motion.section as React.FC<HTMLMotionProps<"section">>;
export const MotionNav = motion.nav as React.FC<HTMLMotionProps<"nav">>;
export const MotionForm = motion.form as React.FC<HTMLMotionProps<"form">>;
export const MotionP = motion.p as React.FC<HTMLMotionProps<"p">>;
export const MotionButton = motion.button as React.FC<HTMLMotionProps<"button">>;

// Form element components with specific props
export const MotionInput = motion.input as React.FC<InputMotionProps>;
export const MotionTextarea = motion.textarea as React.FC<TextareaMotionProps>;
export const MotionSelect = motion.select as React.FC<SelectMotionProps>; 