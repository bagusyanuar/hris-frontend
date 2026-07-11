<script lang="ts">
	import { provideAuthStore } from '$lib/infrastructure/auth';
	import { Button } from '$lib/presentation/shared/components/button';

	// Mengambil Store secara langsung via Dependency Provider
	const store = provideAuthStore();

	// Local UI state untuk binding form
	let email = $state('');
	let password = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const success = await store.login({ email, password });
		if (success) {
			// Misalnya: Redirect ke halaman dashboard
			// alert('Login Berhasil! ' + store.user?.name);
		}
	}
</script>

<div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">
			HRIS Login
		</h2>
		<p class="mt-2 text-center text-sm text-slate-600">
			Masuk ke dashboard untuk mengelola data karyawan
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
			{#if store.isAuthenticated}
				<!-- Jika sudah login -->
				<div class="text-center space-y-4">
					<div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">
						✓
					</div>
					<h3 class="text-xl font-bold text-slate-800">Selamat datang, {store.user?.name}!</h3>
					<p class="text-slate-500">Kamu berhasil login sebagai {store.user?.role}.</p>
					
					<Button
						variant="danger"
						class="w-full"
						onclick={() => store.logout()}
					>
						Keluar
					</Button>
				</div>
			{:else}
				<!-- Form Login -->
				<form class="space-y-6" onsubmit={handleSubmit}>
					
					<!-- Alert Error -->
					{#if store.error}
						<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
							<div class="flex">
								<div class="shrink-0">
									<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
									</svg>
								</div>
								<div class="ml-3">
									<p class="text-sm text-red-700">{store.error}</p>
								</div>
							</div>
						</div>
					{/if}
 
					<div>
						<label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
						<div class="mt-1">
							<input
								id="email"
								name="email"
								type="email"
								autocomplete="email"
								required
								bind:value={email}
								placeholder="admin@hris.com"
								class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
							/>
						</div>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-slate-700">Password</label>
						<div class="mt-1">
							<input
								id="password"
								name="password"
								type="password"
								autocomplete="current-password"
								required
								bind:value={password}
								placeholder="password123"
								class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
							/>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							variant="primary"
							class="w-full"
							disabled={store.isLoading}
						>
							{#if store.isLoading}
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Memproses...
							{:else}
								Masuk
							{/if}
						</Button>
					</div>
				</form>
			{/if}
		</div>
		<p class="text-center mt-4 text-sm text-slate-500">
			Hint: Gunakan <code class="bg-slate-100 px-1 rounded">admin@hris.com</code> dan <code class="bg-slate-100 px-1 rounded">password123</code>
		</p>
	</div>
</div>
