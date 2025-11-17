/**
 * UI Components Library - Usage Examples
 *
 * This file contains practical examples of how to use each component
 * from the shared UI library.
 */

import { useState } from 'react'
import {
	Button,
	Input,
	Modal,
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	Dropdown,
	DropdownItem,
	DropdownDivider,
	Badge,
	Avatar,
	Spinner,
	Alert
} from './index'
import { Search, User, ChevronDown, Settings } from 'lucide-react'

// ============================================================================
// BUTTON EXAMPLES
// ============================================================================

export const ButtonExamples = () => {
	const [loading, setLoading] = useState(false)

	const handleClick = () => {
		setLoading(true)
		setTimeout(() => setLoading(false), 2000)
	}

	return (
		<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
			{/* Variants */}
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>

			{/* Sizes */}
			<Button size="small">Small</Button>
			<Button size="medium">Medium</Button>
			<Button size="large">Large</Button>

			{/* With Icons */}
			<Button icon={<Search />} iconPosition="left">
				Search
			</Button>
			<Button icon={<ChevronDown />} iconPosition="right">
				More
			</Button>

			{/* States */}
			<Button disabled>Disabled</Button>
			<Button loading={loading} onClick={handleClick}>
				{loading ? 'Loading...' : 'Click Me'}
			</Button>

			{/* Full Width */}
			<Button fullWidth variant="primary">
				Full Width Button
			</Button>
		</div>
	)
}

// ============================================================================
// INPUT EXAMPLES
// ============================================================================

export const InputExamples = () => {
	const [email, setEmail] = useState('')

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			{/* Basic Input */}
			<Input
				label="Email"
				type="email"
				placeholder="Enter your email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			{/* With Left Icon */}
			<Input
				label="Username"
				leftIcon={<User />}
				placeholder="Choose a username"
			/>

			{/* With Right Icon */}
			<Input
				placeholder="Search..."
				rightIcon={<Search />}
			/>

			{/* With Error */}
			<Input
				label="Password"
				type="password"
				error="Password must be at least 8 characters"
				value=""
			/>

			{/* With Helper Text */}
			<Input
				label="API Key"
				helperText="You can find this in your account settings"
			/>

			{/* Full Width */}
			<Input
				fullWidth
				placeholder="Full width input"
			/>
		</div>
	)
}

// ============================================================================
// MODAL EXAMPLES
// ============================================================================

export const ModalExamples = () => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Example Modal"
				size="medium"
				footer={
					<>
						<Button variant="ghost" onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button variant="primary" onClick={() => setIsOpen(false)}>
							Confirm
						</Button>
					</>
				}
			>
				<p>This is the modal content. You can put any React elements here.</p>
				<p>The modal supports multiple sizes and customization options.</p>
			</Modal>
		</>
	)
}

// ============================================================================
// CARD EXAMPLES
// ============================================================================

export const CardExamples = () => {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
			{/* Default Card */}
			<Card variant="default">
				<CardHeader>
					<CardTitle>Default Card</CardTitle>
					<Badge variant="primary">New</Badge>
				</CardHeader>
				<CardContent>
					This is a default card with header and content.
				</CardContent>
			</Card>

			{/* Elevated Card with Footer */}
			<Card variant="elevated" hover>
				<CardHeader>
					<CardTitle>Movie Title</CardTitle>
				</CardHeader>
				<CardContent>
					A thrilling adventure that will keep you on the edge of your seat.
				</CardContent>
				<CardFooter>
					<Button variant="ghost" size="small">More Info</Button>
					<Button variant="primary" size="small">Watch Now</Button>
				</CardFooter>
			</Card>

			{/* Glass Card */}
			<Card variant="glass" padding="large">
				<CardContent>
					Glass morphism card with blur effect and transparency.
				</CardContent>
			</Card>

			{/* Clickable Card */}
			<Card variant="outlined" hover onClick={() => alert('Card clicked!')}>
				<CardContent>
					<strong>Clickable Card</strong>
					<p>Click anywhere on this card</p>
				</CardContent>
			</Card>
		</div>
	)
}

// ============================================================================
// TABS EXAMPLES
// ============================================================================

export const TabsExamples = () => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
			{/* Default Variant */}
			<Tabs defaultValue="tab1" variant="default">
				<TabsList>
					<TabsTrigger value="tab1">Overview</TabsTrigger>
					<TabsTrigger value="tab2">Details</TabsTrigger>
					<TabsTrigger value="tab3">Reviews</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">
					<p>Overview content goes here...</p>
				</TabsContent>
				<TabsContent value="tab2">
					<p>Details content goes here...</p>
				</TabsContent>
				<TabsContent value="tab3">
					<p>Reviews content goes here...</p>
				</TabsContent>
			</Tabs>

			{/* Pills Variant */}
			<Tabs defaultValue="movies" variant="pills">
				<TabsList>
					<TabsTrigger value="movies">Movies</TabsTrigger>
					<TabsTrigger value="books">Books</TabsTrigger>
					<TabsTrigger value="news">News</TabsTrigger>
				</TabsList>
				<TabsContent value="movies">Movies content</TabsContent>
				<TabsContent value="books">Books content</TabsContent>
				<TabsContent value="news">News content</TabsContent>
			</Tabs>
		</div>
	)
}

// ============================================================================
// DROPDOWN EXAMPLES
// ============================================================================

export const DropdownExamples = () => {
	return (
		<div style={{ display: 'flex', gap: '12px' }}>
			{/* Basic Dropdown */}
			<Dropdown
				trigger={
					<Button variant="secondary">
						Actions <ChevronDown />
					</Button>
				}
			>
				<DropdownItem>Edit</DropdownItem>
				<DropdownItem>Duplicate</DropdownItem>
				<DropdownDivider />
				<DropdownItem>Delete</DropdownItem>
			</Dropdown>

			{/* User Menu Dropdown */}
			<Dropdown
				trigger={
					<Button variant="ghost">
						<Settings /> Settings
					</Button>
				}
				align="right"
			>
				<DropdownItem href="/profile">Profile</DropdownItem>
				<DropdownItem href="/account">Account</DropdownItem>
				<DropdownItem href="/preferences">Preferences</DropdownItem>
				<DropdownDivider />
				<DropdownItem onClick={() => alert('Logout')}>Logout</DropdownItem>
			</Dropdown>
		</div>
	)
}

// ============================================================================
// BADGE EXAMPLES
// ============================================================================

export const BadgeExamples = () => {
	return (
		<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
			{/* Variants */}
			<Badge variant="default">Default</Badge>
			<Badge variant="primary">Primary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="danger">Danger</Badge>

			{/* Sizes */}
			<Badge size="small">Small</Badge>
			<Badge size="medium">Medium</Badge>
			<Badge size="large">Large</Badge>

			{/* Practical Usage */}
			<Badge variant="primary" size="small">Premium</Badge>
			<Badge variant="success" size="small">Active</Badge>
			<Badge variant="danger" size="small">3</Badge>
		</div>
	)
}

// ============================================================================
// AVATAR EXAMPLES
// ============================================================================

export const AvatarExamples = () => {
	return (
		<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
			{/* Sizes */}
			<Avatar size="small" fallback="S" status="online" />
			<Avatar size="medium" fallback="M" status="away" />
			<Avatar size="large" fallback="L" status="busy" />

			{/* Status Indicators */}
			<Avatar fallback="U" status="online" />
			<Avatar fallback="U" status="offline" />
			<Avatar fallback="U" status="away" />
			<Avatar fallback="U" status="busy" />

			{/* With Image */}
			<Avatar
				src="/user-avatar.jpg"
				alt="User Name"
				status="online"
			/>
		</div>
	)
}

// ============================================================================
// SPINNER EXAMPLES
// ============================================================================

export const SpinnerExamples = () => {
	return (
		<div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
			{/* Sizes */}
			<Spinner size="small" color="primary" />
			<Spinner size="medium" color="primary" />
			<Spinner size="large" color="primary" />

			{/* Colors */}
			<Spinner color="primary" />
			<Spinner color="white" />

			{/* In Button */}
			<Button disabled>
				<Spinner size="small" color="white" />
				Loading...
			</Button>
		</div>
	)
}

// ============================================================================
// ALERT EXAMPLES
// ============================================================================

export const AlertExamples = () => {
	const [showAlert, setShowAlert] = useState(true)

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			{/* Variants */}
			<Alert variant="info" title="Information">
				This is an informational alert with important details.
			</Alert>

			<Alert variant="success" title="Success!">
				Your changes have been saved successfully.
			</Alert>

			<Alert variant="warning" title="Warning">
				This action may have unintended consequences.
			</Alert>

			<Alert variant="error" title="Error">
				An error occurred while processing your request.
			</Alert>

			{/* Closable Alert */}
			{showAlert && (
				<Alert
					variant="info"
					closable
					onClose={() => setShowAlert(false)}
				>
					This alert can be dismissed by clicking the X button.
				</Alert>
			)}

			{/* Without Title */}
			<Alert variant="success">
				Simple alert without a title.
			</Alert>
		</div>
	)
}

// ============================================================================
// COMPREHENSIVE EXAMPLE - Using Multiple Components Together
// ============================================================================

export const ComprehensiveExample = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState('overview')

	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<Card variant="elevated" padding="large">
				<CardHeader>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<Avatar size="medium" fallback="M" status="online" />
						<CardTitle>Movie Dashboard</CardTitle>
						<Badge variant="primary">Premium</Badge>
					</div>
					<Dropdown
						trigger={
							<Button variant="ghost" size="small">
								Actions <ChevronDown />
							</Button>
						}
						align="right"
					>
						<DropdownItem>Edit</DropdownItem>
						<DropdownItem>Share</DropdownItem>
						<DropdownDivider />
						<DropdownItem>Delete</DropdownItem>
					</Dropdown>
				</CardHeader>

				<CardContent>
					<Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="cast">Cast & Crew</TabsTrigger>
							<TabsTrigger value="reviews">Reviews</TabsTrigger>
						</TabsList>

						<TabsContent value="overview">
							<Alert variant="info" title="Now Available">
								This movie is now available to stream in 4K quality.
							</Alert>
						</TabsContent>

						<TabsContent value="cast">
							<p>Cast information would go here...</p>
						</TabsContent>

						<TabsContent value="reviews">
							<p>User reviews would go here...</p>
						</TabsContent>
					</Tabs>
				</CardContent>

				<CardFooter>
					<Button variant="ghost">Learn More</Button>
					<Button variant="primary" onClick={() => setIsModalOpen(true)}>
						Watch Now
					</Button>
				</CardFooter>
			</Card>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Start Watching"
				size="medium"
				footer={
					<>
						<Button variant="ghost" onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button variant="primary">
							<Spinner size="small" color="white" />
							Play Movie
						</Button>
					</>
				}
			>
				<Input
					label="Quality"
					leftIcon={<Settings />}
					placeholder="Select quality..."
				/>
			</Modal>
		</div>
	)
}
