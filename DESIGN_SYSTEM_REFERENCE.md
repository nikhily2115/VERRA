# VERRA Luxury Design System Reference

## Quick Reference Guide for Developers

### Color Palette

```css
/* Tailwind Classes */
bg-background     /* #0B0B0B - Main background */
bg-card           /* #111111 - Card/elevated surfaces */
bg-gold           /* #C6A75E - Primary accent */
text-primary      /* #FFFFFF - Main text */
text-secondary    /* #A0A0A0 - Supporting text */
border-border     /* #1E1E1E - Borders and dividers */
```

### Typography

```jsx
/* Headings - Use Playfair Display */
<h1 className="font-playfair text-6xl text-primary">Heading</h1>
<h2 className="font-playfair text-5xl text-primary">Heading</h2>
<h3 className="font-playfair text-4xl text-primary">Heading</h3>

/* Body Text - Use Inter */
<p className="text-primary">Main text</p>
<p className="text-secondary">Supporting text</p>
<p className="text-gold">Accent text</p>
```

### Spacing

```jsx
/* Section Spacing */
<section className="py-24 px-4">  /* Standard section */
<section className="py-16 px-4">  /* Compact section */

/* Container */
<div className="max-w-7xl mx-auto">  /* Standard container */

/* Element Spacing */
space-y-4   /* Small spacing */
space-y-8   /* Medium spacing */
space-y-12  /* Large spacing */
space-y-16  /* Extra large spacing */
```

### Buttons

```jsx
/* Primary Button */
<button className="bg-gold hover:bg-opacity-90 text-background font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105">
  Button Text
</button>

/* Secondary Button */
<button className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-background font-semibold py-3 px-8 rounded-full transition-all duration-300">
  Button Text
</button>

/* Using Button Component */
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
```

### Cards

```jsx
/* Standard Card */
<div className="bg-card border border-border rounded-2xl p-6 hover:border-gold transition-all duration-300">
  Card Content
</div>

/* Card with Shadow */
<div className="bg-card border border-border rounded-2xl p-8 luxury-shadow-lg">
  Card Content
</div>
```

### Inputs

```jsx
/* Text Input */
<input 
  type="text"
  className="w-full bg-card border border-border focus:border-gold text-primary px-4 py-3 rounded-2xl outline-none transition-colors duration-300 placeholder-secondary"
  placeholder="Enter text"
/>

/* Using Input Component */
<Input
  label="Email"
  type="email"
  name="email"
  placeholder="your@email.com"
  required
/>
```

### Images

```jsx
/* Product Image Container */
<div className="relative overflow-hidden rounded-2xl aspect-square">
  <img 
    src={imageUrl}
    alt="Product"
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
  />
</div>

/* Hero Image with Overlay */
<div className="relative rounded-2xl overflow-hidden">
  <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
</div>
```

### Hover Effects

```jsx
/* Scale on Hover */
hover:scale-105        /* Buttons */
hover:scale-110        /* Images */

/* Border Change */
hover:border-gold      /* Cards, inputs */

/* Color Change */
hover:text-gold        /* Links, text */
hover:bg-opacity-90    /* Buttons */

/* Transform */
hover:-translate-y-1   /* Lift effect */
```

### Animations

```jsx
/* Fade In */
animate-fade-in

/* Slide In */
animate-slide-in-right
animate-slide-in-left

/* Transition Classes */
transition-all duration-300        /* Standard */
transition-all duration-500        /* Slower */
transition-transform duration-700  /* Image transforms */
```

### Grid Layouts

```jsx
/* Responsive Product Grid */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Products */}
</div>

/* 2-Column Split */
<div className="grid lg:grid-cols-2 gap-16 items-center">
  {/* Left content */}
  {/* Right content */}
</div>

/* 3-Column Categories */
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Categories */}
</div>

/* 4-Column Footer */
<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
  {/* Footer columns */}
</div>
```

### Shadows

```jsx
/* Utility Classes */
luxury-shadow       /* Soft shadow */
luxury-shadow-lg    /* Large shadow */

/* Hover Shadow */
hover:shadow-2xl
hover:luxury-shadow-lg
```

### Borders & Corners

```jsx
/* Rounded Corners */
rounded-2xl         /* Standard for cards, inputs, containers */
rounded-full        /* Buttons, pills, badges */

/* Borders */
border border-border              /* Standard border */
border-2 border-gold             /* Accent border */
hover:border-gold                /* Hover state */
```

### Common Patterns

#### Section Header
```jsx
<div className="text-center mb-16 space-y-4">
  <h2 className="font-playfair text-5xl lg:text-6xl text-primary">
    Section Title
  </h2>
  <p className="text-secondary text-lg">
    Section description
  </p>
</div>
```

#### Feature Card
```jsx
<div className="text-center space-y-4 p-8 bg-card border border-border rounded-2xl hover:border-gold transition-all duration-300">
  <div className="text-gold flex justify-center">
    {/* Icon SVG */}
  </div>
  <h3 className="text-primary font-semibold text-lg">
    Feature Title
  </h3>
  <p className="text-secondary text-sm">
    Feature description
  </p>
</div>
```

#### Link with Hover
```jsx
<Link 
  to="/path"
  className="text-secondary hover:text-gold transition-colors"
>
  Link Text
</Link>
```

#### Badge
```jsx
<span className="bg-gold text-background text-xs font-semibold px-3 py-1 rounded-full">
  Badge Text
</span>
```

#### Filter Pills
```jsx
<button
  className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
    active
      ? 'bg-gold text-background'
      : 'bg-background text-secondary hover:text-gold border border-border'
  }`}
>
  Filter Name
</button>
```

### Responsive Breakpoints

```jsx
/* Tailwind Breakpoints */
sm:   /* 640px */
md:   /* 768px */
lg:   /* 1024px */
xl:   /* 1280px */

/* Common Usage */
<div className="text-4xl lg:text-6xl">  /* Larger on desktop */
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">  /* Responsive grid */
<div className="hidden lg:flex">  /* Show on desktop only */
<div className="lg:hidden">  /* Show on mobile only */
```

### Icons

```jsx
/* Use inline SVG with proper sizing */
<svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>

/* Icon in button */
<button className="text-secondary hover:text-gold transition-colors">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* Path */}
  </svg>
</button>
```

### Loading States

```jsx
/* Using Loader Component */
<Loader size="sm" />   /* Small */
<Loader size="md" />   /* Medium */
<Loader size="lg" />   /* Large */
<Loader fullScreen />  /* Full screen overlay */
```

### Empty States

```jsx
<div className="text-center py-20">
  <svg className="w-24 h-24 mx-auto text-secondary mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* Icon */}
  </svg>
  <h3 className="text-2xl font-playfair text-primary mb-2">Empty State Title</h3>
  <p className="text-secondary mb-6">Empty state description</p>
  <button className="bg-gold hover:bg-opacity-90 text-background font-semibold py-3 px-8 rounded-full transition-all duration-300">
    Action Button
  </button>
</div>
```

## Best Practices

1. **Always use rounded-2xl** for cards, containers, and inputs
2. **Use rounded-full** for buttons and badges
3. **Maintain consistent spacing** (py-24 for sections, gap-8 for grids)
4. **Use Playfair Display** for all headings
5. **Use Inter** for body text
6. **Gold color** for accents, CTAs, and highlights
7. **Smooth transitions** (duration-300 standard, duration-700 for images)
8. **Hover effects** on all interactive elements
9. **High contrast** between text and background
10. **Generous white space** for premium feel

## Component Import Paths

```javascript
// Common Components
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

// Product Components
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import SearchBar from '../../components/product/SearchBar';

// Context
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
```

## Testing Checklist

- [ ] Colors match exact specifications
- [ ] Typography uses correct fonts
- [ ] Spacing is consistent and generous
- [ ] Hover effects work smoothly
- [ ] Animations are smooth (no jank)
- [ ] Responsive on all breakpoints
- [ ] Buttons have proper states (hover, active, disabled)
- [ ] Forms have proper validation styling
- [ ] Images load with proper aspect ratios
- [ ] Navigation works correctly
- [ ] All links are functional
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Empty states display correctly
