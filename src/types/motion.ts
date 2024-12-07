import { motion, HTMLMotionProps } from "framer-motion";

// Motion components with proper typing
export const MotionDiv = motion.div as React.ForwardRefExoticComponent<HTMLMotionProps<"div">>;
export const MotionSection = motion.section as React.ForwardRefExoticComponent<HTMLMotionProps<"section">>;
export const MotionForm = motion.form as React.ForwardRefExoticComponent<HTMLMotionProps<"form">>;
export const MotionInput = motion.input as React.ForwardRefExoticComponent<HTMLMotionProps<"input">>;
export const MotionTextarea = motion.textarea as React.ForwardRefExoticComponent<HTMLMotionProps<"textarea">>;
export const MotionSelect = motion.select as React.ForwardRefExoticComponent<HTMLMotionProps<"select">>;
export const MotionP = motion.p as React.ForwardRefExoticComponent<HTMLMotionProps<"p">>;
export const MotionButton = motion.button as React.ForwardRefExoticComponent<HTMLMotionProps<"button">>; 