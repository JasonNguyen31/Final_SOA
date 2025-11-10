import { Layout } from '@/components/layout'

const CommentsPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Comment Moderation</h1>
				<p className="text-gray-600">
					This page will allow administrators to review, approve, or remove user comments and reviews.
				</p>
			</div>
		</Layout>
	)
}

export default CommentsPage
