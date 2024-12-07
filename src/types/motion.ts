import { motion, HTMLMotionProps } from "framer-motion";

type MotionComponent<T extends keyof HTMLElementTagNameMap> = React.ComponentType<HTMLMotionProps<T>>;

// Motion components with proper typing
export const MotionDiv: MotionComponent<"div"> = motion.div;
export const MotionSection: MotionComponent<"section"> = motion.section;
export const MotionForm: MotionComponent<"form"> = motion.form;
export const MotionInput: MotionComponent<"input"> = motion.input;
export const MotionTextarea: MotionComponent<"textarea"> = motion.textarea;
export const MotionSelect: MotionComponent<"select"> = motion.select;
export const MotionP: MotionComponent<"p"> = motion.p;
export const MotionButton: MotionComponent<"button"> = motion.button; 