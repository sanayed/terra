<script lang="ts">
	import { Sparkles, CheckSquare, Users } from '@lucide/svelte';
</script>

<div class="flex min-h-screen flex-col bg-gradient-to-br from-base-100 to-base-200">
	<!-- Header -->
	<header class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<a href="/" class="btn text-2xl font-bold btn-ghost"> Terra </a>
		</div>
		<div class="navbar-end">
			<a href="/auth" class="btn btn-ghost">Sign In</a>
			<a href="/app" class="btn btn-primary">Get Started</a>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="flex flex-1 items-center justify-center px-6 py-20">
		<div class="max-w-2xl text-center">
			<h1 class="mb-6 text-5xl font-bold text-base-content md:text-6xl">Terra</h1>
			<p class="mb-8 text-xl text-base-content/80 md:text-2xl">Create. Organize. Collaborate.</p>
			<p class="mx-auto mb-12 max-w-xl text-lg text-base-content/70">
				A powerful project management platform designed for teams to create ideas, organize tasks,
				and collaborate seamlessly in real-time.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="/app" class="btn btn-lg btn-primary"> Get Started </a>
				<button class="btn btn-outline btn-lg"> Learn More </button>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="bg-base-100 px-6 py-20">
		<div class="mx-auto max-w-6xl">
			<h2 class="mb-16 text-center text-4xl font-bold text-base-content">Powerful Features</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<!-- Feature 1 -->
				<div class="card bg-base-200 shadow-lg">
					<div class="card-body">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
							<Sparkles class="text-primary" size={28} />
						</div>
						<h3 class="mb-3 card-title text-2xl">Create</h3>
						<p class="text-base-content/80">
							Bring your ideas to life with intuitive tools. Create boards, tasks, and projects with
							ease.
						</p>
					</div>
				</div>

				<!-- Feature 2 -->
				<div class="card bg-base-200 shadow-lg">
					<div class="card-body">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
							<CheckSquare class="text-secondary" size={28} />
						</div>
						<h3 class="mb-3 card-title text-2xl">Organize</h3>
						<p class="text-base-content/80">
							Keep your work structured and on track. Manage priorities, deadlines, and workflows
							effortlessly.
						</p>
					</div>
				</div>

				<!-- Feature 3 -->
				<div class="card bg-base-200 shadow-lg">
					<div class="card-body">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
							<Users class="text-accent" size={28} />
						</div>
						<h3 class="mb-3 card-title text-2xl">Collaborate</h3>
						<p class="text-base-content/80">
							Work together in real-time. Share updates, assign tasks, and celebrate wins as a team.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-20">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="mb-6 text-4xl font-bold text-base-content">Ready to Transform Your Workflow?</h2>
			<p class="mb-8 text-lg text-base-content/80">
				Join teams already using Terra to manage their projects more effectively.
			</p>
			<a href="/app" class="btn btn-lg btn-primary"> Start Your Free Trial </a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="footer-center footer bg-base-200 p-10 text-base-content">
		<aside>
			<p class="font-semibold">Terra &copy; 2026</p>
			<p>Project management made simple and collaborative</p>
		</aside>
	</footer>
</div>
