import { UserList } from "./features/users/components/UserList";

function App() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-600 via-indigo-400 to-sky-200">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
			>
				Skip to main content
			</a>
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<header className="text-center mb-12">
					<div className="inline-flex items-center gap-3 mb-4">
						<div className="p-3 bg-indigo-200 rounded-2xl shadow-lg">
							<span className="text-white text-2xl" aria-hidden="true">
								👤
							</span>
						</div>
						<div>
							<h1
								id="user-list-heading"
								className="text-4xl font-bold text-gray-900"
							>
								User Directory
							</h1>
							<p className="mt-1 text-slate-900">
								Modern user management made simple
							</p>
						</div>
					</div>
				</header>
				<main id="main-content" tabIndex={-1}>
					<UserList />
				</main>
			</div>
		</div>
	);
}

export default App;
