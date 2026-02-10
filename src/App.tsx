import { UserList } from "./features/users/components/UserList";

function App() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-600 via-indigo-400 to-sky-200">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<header className="text-center mb-12">
					<div className="inline-flex items-center gap-3 mb-4">
						<div className="p-3 bg-indigo-200 rounded-2xl shadow-lg">
							<span className="text-white text-2xl">👤</span>
						</div>
						<div>
							<h1
								id="user-list-heading"
								className="text-4xl font-bold text-gray-900"
							>
								User Directory
							</h1>
							<p className="text-gray-200 mt-1">
								Modern user management made simple
							</p>
						</div>
					</div>
				</header>
				<main>
					<UserList />
				</main>
			</div>
		</div>
	);
}

export default App;
