import { type ReactNode, useState, createContext, useContext } from 'react'
import './Tabs.css'

interface TabsContextType {
	activeTab: string
	setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export interface TabsProps {
	defaultValue: string
	value?: string
	onValueChange?: (value: string) => void
	children: ReactNode
	variant?: 'default' | 'pills' | 'underline'
	className?: string
}

export const Tabs = ({
	defaultValue,
	value,
	onValueChange,
	children,
	variant = 'default',
	className = ''
}: TabsProps) => {
	const [internalValue, setInternalValue] = useState(defaultValue)
	const activeTab = value ?? internalValue

	const handleTabChange = (newValue: string) => {
		if (!value) {
			setInternalValue(newValue)
		}
		onValueChange?.(newValue)
	}

	const classes = [
		'ui-tabs',
		`ui-tabs--${variant}`,
		className
	].filter(Boolean).join(' ')

	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
			<div className={classes}>
				{children}
			</div>
		</TabsContext.Provider>
	)
}

export const TabsList = ({
	children,
	className = ''
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<div className={`ui-tabs__list ${className}`} role="tablist">
			{children}
		</div>
	)
}

export const TabsTrigger = ({
	value,
	children,
	disabled = false,
	className = ''
}: {
	value: string
	children: ReactNode
	disabled?: boolean
	className?: string
}) => {
	const context = useContext(TabsContext)
	if (!context) {
		throw new Error('TabsTrigger must be used within Tabs')
	}

	const { activeTab, setActiveTab } = context
	const isActive = activeTab === value

	const classes = [
		'ui-tabs__trigger',
		isActive && 'ui-tabs__trigger--active',
		disabled && 'ui-tabs__trigger--disabled',
		className
	].filter(Boolean).join(' ')

	return (
		<button
			className={classes}
			onClick={() => !disabled && setActiveTab(value)}
			disabled={disabled}
			role="tab"
			aria-selected={isActive}
		>
			{children}
		</button>
	)
}

export const TabsContent = ({
	value,
	children,
	className = ''
}: {
	value: string
	children: ReactNode
	className?: string
}) => {
	const context = useContext(TabsContext)
	if (!context) {
		throw new Error('TabsContent must be used within Tabs')
	}

	const { activeTab } = context

	if (activeTab !== value) return null

	return (
		<div className={`ui-tabs__content ${className}`} role="tabpanel">
			{children}
		</div>
	)
}

export default Tabs
