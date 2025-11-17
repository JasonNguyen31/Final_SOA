/**
 * Shared UI Components Library
 *
 * A comprehensive collection of reusable UI components with consistent
 * prop patterns and TypeScript interfaces.
 *
 * @module shared/components/ui
 */

// Button
export { Button, type ButtonProps } from './Button/Button'

// Input
export { Input, type InputProps } from './Input/Input'

// Modal
export { Modal, type ModalProps } from './Modal/Modal'

// Card
export {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	type CardProps
} from './Card/Card'

// Tabs
export {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	type TabsProps
} from './Tabs/Tabs'

// Dropdown
export {
	Dropdown,
	DropdownItem,
	DropdownDivider,
	type DropdownProps
} from './Dropdown/Dropdown'

// Badge
export { Badge, type BadgeProps } from './Badge/Badge'

// Avatar
export { Avatar, type AvatarProps } from './Avatar/Avatar'

// Spinner
export { Spinner, type SpinnerProps } from './Spinner/Spinner'

// Alert
export { Alert, type AlertProps } from './Alert/Alert'
