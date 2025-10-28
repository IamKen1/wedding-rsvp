# Wedding RSVP Color Theme Guide

## Color Philosophy
**Predominantly WHITE with subtle champagne, beige, and cream accents**

## Color Palette

### Primary Colors
- **White**: `#FFFFFF` or `bg-white` - Main background color
- **Off-White/Cream**: `#F5EEE6` - Very subtle background tints
- **Light Gray**: `#F9FAFB` or `bg-gray-50` - Alternative subtle background

### Accent Colors (Use Sparingly)
- **Champagne/Cream**: `#F5EEE6` - Light accents, very subtle backgrounds
- **Beige**: `#E6D5BE` - Borders, dividers, hover states
- **Tan/Gold**: `#C9A87C` - Icons, small decorative elements, active states

### Text Colors
- **Primary Text**: `#1F2937` or `text-gray-800` - Headings, important text
- **Secondary Text**: `#4B5563` or `text-gray-600` - Body text
- **Tertiary Text**: `#6B7280` or `text-gray-500` - Less important text

## Replacement Guide

### Background Colors
- ❌ `bg-gradient-to-br from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6]`
- ✅ `bg-white`
- ✅ `bg-gradient-to-b from-white via-[#F5EEE6]/10 to-white` (very subtle)

- ❌ `from-sage-50 via-cream-50 to-mint-50`
- ✅ `bg-white`

- ❌ `from-mint-100 to-sage-100`
- ✅ `from-white to-gray-50`

### Text Colors
- ❌ `text-forest-800`, `text-forest-700`
- ✅ `text-gray-800`, `text-gray-700`

- ❌ `text-[#4A3C2E]`, `text-[#6B5D4F]`, `text-[#8B6F47]`
- ✅ `text-gray-800`, `text-gray-700`, `text-gray-600`

- ❌ `text-mint-600`, `text-sage-600`
- ✅ `text-gray-600` or `text-[#C9A87C]` (for accents only)

### Border Colors
- ❌ `border-mint-200`, `border-sage-200`, `border-forest-200`
- ✅ `border-gray-200`, `border-gray-100`

- ❌ `border-[#C9A87C]/30`, `border-[#C9A87C]/40`
- ✅ `border-[#E6D5BE]/50`, `border-gray-200` (use champagne very sparingly)

### Accent Elements (Use Sparingly)
- Icons: `text-[#C9A87C]` (tan/gold for small decorative icons)
- Hover states: `border-[#E6D5BE]` (beige on hover)
- Subtle backgrounds: `bg-[#F5EEE6]/30` or `bg-[#F5EEE6]/40` (very light cream)
- Decorative dots: `bg-[#C9A87C]`, `bg-[#E6D5BE]`

### Button/Interactive Elements
- Primary buttons:
  - ❌ `bg-gradient-to-r from-mint-500 to-sage-500`
  - ✅ `bg-white border-2 border-[#E6D5BE] text-gray-800 hover:bg-[#F5EEE6]/50`
  
- Active states:
  - ❌ `bg-mint-100`
  - ✅ `bg-[#F5EEE6]/60` or `bg-gray-50`

## Component-Specific Guidelines

### Hero Section
- Background: Pure white with very subtle floating cream orbs
- Text: Gray-800 for headings, Gray-600 for body
- Accents: Champagne/beige for borders and decorative elements

### RSVP Section
- Background: White with extremely subtle cream gradient overlay
- Cards: White with light gray borders
- Accents: Champagne for guest info boxes (very light)

### Schedule/Events
- Background: White
- Event cards: White with gray borders
- Icons: Can use champagne/tan for visual interest

### Attire Section
- Background: White
- Cards: White with champagne accents
- Text: Gray palette

### Locations
- Background: White
- Cards: White with gray borders
- Accents: Minimal champagne touches

### Footer
- Can be slightly darker (light gray) for contrast
- Or keep white with gray text

## Key Principles
1. **White is dominant** - 80-90% of the design should be white/off-white
2. **Champagne/beige/cream are accents** - Use for 5-10% of design (borders, subtle backgrounds, icons)
3. **Gray text** - Use gray scale for text, not brown tones
4. **Subtle gradients** - If using gradients, make them barely noticeable (10-15% opacity)
5. **Clean and airy** - Lots of white space, minimal color distraction
