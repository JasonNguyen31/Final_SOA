# Shared UI Components Library

A comprehensive collection of reusable UI components built with React and TypeScript. All components follow consistent patterns for props, styling, and behavior.

## Installation & Usage

```typescript
import { Button, Input, Modal, Card, Alert } from '@/shared/components/ui'
```

---

## Components

### Button

A versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `loading`: boolean
- `disabled`: boolean

**Example:**
```tsx
<Button variant="primary" size="medium" loading={isLoading}>
  Submit
</Button>

<Button variant="ghost" icon={<Search />} iconPosition="left">
  Search
</Button>
```

---

### Input

A flexible input component with label, icons, and error states.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `fullWidth`: boolean

**Example:**
```tsx
<Input
  label="Email"
  type="email"
  leftIcon={<Mail />}
  placeholder="Enter your email"
  error={errors.email}
/>

<Input
  placeholder="Search..."
  rightIcon={<Search />}
  fullWidth
/>
```

---

### Modal

A customizable modal dialog with multiple sizes and behaviors.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'small' | 'medium' | 'large' | 'fullscreen'
- `showCloseButton`: boolean
- `closeOnOverlayClick`: boolean
- `closeOnEsc`: boolean
- `footer`: ReactNode

**Example:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="medium"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

---

### Card

A container component with header, content, and footer sections.

**Props:**
- `variant`: 'default' | 'outlined' | 'elevated' | 'glass'
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `hover`: boolean
- `onClick`: () => void

**Subcomponents:**
- `CardHeader`
- `CardTitle`
- `CardContent`
- `CardFooter`

**Example:**
```tsx
<Card variant="elevated" hover>
  <CardHeader>
    <CardTitle>Movie Title</CardTitle>
    <Badge variant="primary">New</Badge>
  </CardHeader>
  <CardContent>
    <p>Movie description goes here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Watch Now</Button>
  </CardFooter>
</Card>
```

---

### Tabs

A tabbed interface component with controlled and uncontrolled modes.

**Props:**
- `defaultValue`: string
- `value`: string (controlled)
- `onValueChange`: (value: string) => void
- `variant`: 'default' | 'pills' | 'underline'

**Subcomponents:**
- `TabsList`
- `TabsTrigger`
- `TabsContent`

**Example:**
```tsx
<Tabs defaultValue="movies" variant="pills">
  <TabsList>
    <TabsTrigger value="movies">Movies</TabsTrigger>
    <TabsTrigger value="books">Books</TabsTrigger>
    <TabsTrigger value="news">News</TabsTrigger>
  </TabsList>
  <TabsContent value="movies">
    <MoviesList />
  </TabsContent>
  <TabsContent value="books">
    <BooksList />
  </TabsContent>
  <TabsContent value="news">
    <NewsList />
  </TabsContent>
</Tabs>
```

---

### Dropdown

A dropdown menu with hover and click support.

**Props:**
- `trigger`: ReactNode
- `align`: 'left' | 'right' | 'center'
- `onOpenChange`: (open: boolean) => void

**Subcomponents:**
- `DropdownItem`
- `DropdownDivider`

**Example:**
```tsx
<Dropdown
  trigger={
    <Button variant="ghost">
      Menu <ChevronDown />
    </Button>
  }
  align="right"
>
  <DropdownItem href="/profile">Profile</DropdownItem>
  <DropdownItem href="/settings">Settings</DropdownItem>
  <DropdownDivider />
  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
</Dropdown>
```

---

### Badge

A small badge component for labels and status indicators.

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger'
- `size`: 'small' | 'medium' | 'large'

**Example:**
```tsx
<Badge variant="primary" size="small">Premium</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">3</Badge>
```

---

### Avatar

A user avatar component with status indicator.

**Props:**
- `src`: string
- `alt`: string
- `size`: 'small' | 'medium' | 'large'
- `status`: 'online' | 'offline' | 'away' | 'busy'
- `fallback`: ReactNode

**Example:**
```tsx
<Avatar
  src="/user-avatar.jpg"
  alt="John Doe"
  size="medium"
  status="online"
/>

<Avatar
  size="large"
  fallback="JD"
  status="away"
/>
```

---

### Spinner

A loading spinner component.

**Props:**
- `size`: 'small' | 'medium' | 'large'
- `color`: 'primary' | 'white' | 'inherit'

**Example:**
```tsx
<Spinner size="medium" color="primary" />

{/* Inside a button */}
<Button disabled>
  <Spinner size="small" color="white" />
  Loading...
</Button>
```

---

### Alert

An alert/notification component with multiple variants.

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string
- `closable`: boolean
- `onClose`: () => void
- `icon`: ReactNode (custom icon override)

**Example:**
```tsx
<Alert variant="success" title="Success!">
  Your changes have been saved successfully.
</Alert>

<Alert variant="error" closable onClose={() => setError(null)}>
  An error occurred. Please try again.
</Alert>

<Alert variant="warning" title="Warning">
  This action cannot be undone.
</Alert>
```

---

## Design Principles

### Consistent Prop Patterns

All components follow these patterns:

- **Variants**: Use `variant` prop for different visual styles
- **Sizes**: Use `size` prop for small/medium/large variations
- **States**: Use boolean props like `disabled`, `loading`, `active`
- **Callbacks**: Use `on[Event]` pattern like `onClick`, `onClose`
- **Styling**: Use `className` for additional custom styles

### TypeScript Support

All components have full TypeScript interfaces exported:

```typescript
import type { ButtonProps, ModalProps, CardProps } from '@/shared/components/ui'
```

### Accessibility

- Semantic HTML elements
- ARIA attributes where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly

### Responsive Design

All components are mobile-responsive with:
- Touch-friendly sizes
- Breakpoint-based adjustments
- Mobile-optimized interactions

---

## Styling

Components use CSS modules for styling. Each component has:
- Base styles in `ComponentName.css`
- CSS variables for theming
- BEM naming convention
- Consistent spacing and colors

### CSS Class Structure

```css
.ui-[component]                    /* Base class */
.ui-[component]--[variant]         /* Variant modifier */
.ui-[component]--[size]            /* Size modifier */
.ui-[component]__[element]         /* Child element */
.ui-[component]--[state]           /* State modifier */
```

**Example:**
```css
.ui-button
.ui-button--primary
.ui-button--large
.ui-button__icon
.ui-button--loading
```

---

## Best Practices

### Composition Over Configuration

Prefer composing components rather than adding many props:

```tsx
// ✅ Good - Composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid - Too many props
<Card title="Title" content="Content" hasHeader={true} />
```

### Controlled vs Uncontrolled

Most form components support both patterns:

```tsx
// Uncontrolled
<Tabs defaultValue="tab1">...</Tabs>

// Controlled
<Tabs value={activeTab} onValueChange={setActiveTab}>...</Tabs>
```

### Extending Components

Use `className` to extend styling:

```tsx
<Button className="my-custom-button" variant="primary">
  Custom Styled Button
</Button>
```

---

## Contributing

When adding new components:

1. Follow the existing component structure
2. Include TypeScript interfaces
3. Add comprehensive CSS with all states
4. Support dark theme
5. Make it responsive
6. Add to this documentation
7. Export from index.ts

---

## Component Checklist

- [ ] TypeScript interface with proper types
- [ ] Default props for optional values
- [ ] CSS module with BEM naming
- [ ] Responsive breakpoints
- [ ] Hover, focus, active states
- [ ] Loading and disabled states
- [ ] Accessibility attributes
- [ ] Dark theme support
- [ ] Documentation with examples
- [ ] Export from index.ts
