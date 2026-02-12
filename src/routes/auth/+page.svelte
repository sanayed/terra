<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { form } = $props();

	let mode = $state<'login' | 'signup'>('login');
	let error = $derived(form?.error);

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	function toggleMode() {
		mode = mode === 'login' ? 'signup' : 'login';
		error = '';
	}
</script>

<div class="flex min-h-screen bg-gray-100">
	<div class="flex w-full items-center justify-center bg-white px-8 md:w-[40%]">
		<div class="w-full max-w-sm">
			<h1 class="mb-1 text-3xl font-bold">
				{mode === 'login' ? 'Welcome back' : 'Create your account'}
			</h1>
			<p class="mb-6 text-gray-500">
				{mode === 'login'
					? 'We’re glad to see you again. Please sign in to continue.'
					: 'Join us — it only takes a minute.'}
			</p>

			<form
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							if (result?.data?.mode == 'signup') {
								alert(result.data.message);
								mode = 'login';
							}
						} else if (result.type === 'redirect') {
							goto(result.location);
						}
					};
				}}
				method="POST"
			>
				<input type="hidden" name="mode" value={mode} />

				{#if mode == 'signup'}
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Username</legend>
						<input name="username" id="username" type="text" required class="input w-full" />
						<p class="label whitespace-normal">
							Only lowercase characters, underscores and periods are allowed.
						</p>
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Fullname</legend>
						<input name="fullname" id="fullname" type="text" required class="input w-full" />
					</fieldset>
				{/if}
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Email address</legend>
					<input name="email" id="email" type="email" required class="input w-full" />
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Password</legend>
					<label class="input w-full">
						<input
							name="password"
							id="password"
							type={showPassword ? 'text' : 'password'}
							required
							class="grow"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute inset-y-0 right-0 flex items-center px-3 text-xs text-gray-500 hover:text-gray-700"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								Hide
							{:else}
								Show
							{/if}
						</button>
					</label>
					<p class="label whitespace-normal">
						At least 8 characters, with uppercase, lowercase, and a number.
					</p>
				</fieldset>

				{#if mode === 'signup'}
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Confirm password</legend>
						<label class="input w-full">
							<input
								name="password_confirm"
								id="password_confirm"
								type={showConfirmPassword ? 'text' : 'password'}
								required
								class="grow"
							/>
							<button
								type="button"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
								class="absolute inset-y-0 right-0 flex items-center px-3 text-xs text-gray-500 hover:text-gray-700"
								aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
							>
								{#if showConfirmPassword}
									Hide
								{:else}
									Show
								{/if}
							</button>
						</label>
					</fieldset>
				{/if}

				{#if error}
					<p class="error-text my-1 text-error">{error}</p>
				{/if}

				<!-- Submit -->
				<button type="submit" class="btn mt-2 w-full btn-primary">
					{mode === 'login' ? 'Sign in' : 'Create account'}
				</button>
			</form>

			<div class="mt-6 text-center text-sm text-gray-600">
				{#if mode === 'login'}
					New here?
					<button onclick={toggleMode} class="btn-link"> Create an account </button>
				{:else}
					Already have an account?
					<button onclick={toggleMode} class="btn-link"> Sign in instead </button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Right -->
	<div class="hidden w-[70%] bg-linear-to-br from-primary to-secondary md:flex"></div>
</div>
