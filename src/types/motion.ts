/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, HTMLMotionProps } from "framer-motion";

// Motion components
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionForm = motion.form;
export const MotionInput = motion.input;
export const MotionTextarea = motion.textarea;
export const MotionSelect = motion.select;
export const MotionP = motion.p;
export const MotionButton = motion.button;

// Types
export type MotionDivProps = HTMLMotionProps<"div">;
export type MotionSectionProps = HTMLMotionProps<"section">;
export type MotionFormProps = HTMLMotionProps<"form">;
export type MotionInputProps = HTMLMotionProps<"input">;
export type MotionTextareaProps = HTMLMotionProps<"textarea">;
export type MotionSelectProps = HTMLMotionProps<"select">;
export type MotionPProps = HTMLMotionProps<"p">;
export type MotionButtonProps = HTMLMotionProps<"button">; 