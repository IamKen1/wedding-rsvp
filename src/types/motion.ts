/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, HTMLMotionProps } from "framer-motion";

// Motion components with proper typing
export const MotionDiv = motion.div as any;
export const MotionSection = motion.section as any;
export const MotionForm = motion.form as any;
export const MotionInput = motion.input as any;
export const MotionTextarea = motion.textarea as any;
export const MotionSelect = motion.select as any;
export const MotionP = motion.p as any;
export const MotionButton = motion.button as any;

// Types for props if needed
export type MotionDivProps = HTMLMotionProps<"div">;
export type MotionSectionProps = HTMLMotionProps<"section">;
export type MotionFormProps = HTMLMotionProps<"form">;
export type MotionInputProps = HTMLMotionProps<"input">;
export type MotionTextareaProps = HTMLMotionProps<"textarea">;
export type MotionSelectProps = HTMLMotionProps<"select">;
export type MotionPProps = HTMLMotionProps<"p">;
export type MotionButtonProps = HTMLMotionProps<"button">; 