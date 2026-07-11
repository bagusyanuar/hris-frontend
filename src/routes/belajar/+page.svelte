<script lang="ts">
	// State dasar menggunakan Rune $state
	let name = $state('Svelter');
	let counter = $state(0);
	
	// Derived state menggunakan $derived (otomatis terhitung kembali jika counter berubah)
	let counterSquared = $derived(counter * counter);
	let nameLength = $derived(name.length);

	// Tipe data untuk todo list
	interface Todo {
		id: number;
		text: string;
		done: boolean;
	}

	// State array reaktif
	let todos = $state<Todo[]>([
		{ id: 1, text: 'Pelajari konsep Runes ($state, $derived)', done: true },
		{ id: 2, text: 'Coba Two-way Binding', done: false },
		{ id: 3, text: 'Buat Komponen Kustom', done: false }
	]);

	let newTodoText = $state('');

	// Menambahkan todo baru
	function addTodo(e: SubmitEvent) {
		e.preventDefault();
		if (!newTodoText.trim()) return;
		
		todos = [...todos, {
			id: Date.now(),
			text: newTodoText,
			done: false
		}];
		newTodoText = '';
	}

	// Menghapus todo
	function deleteTodo(id: number) {
		todos = todos.filter(t => t.id !== id);
	}

	// Derived state untuk melacak persentase task yang selesai
	let completedCount = $derived(todos.filter(t => t.done).length);
	let completionPercentage = $derived(
		todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0
	);

	// $effect berjalan ketika state di dalamnya berubah (mirip useEffect/watcher)
	$effect(() => {
		console.log(`State berubah! Counter sekarang: ${counter}, Jumlah Todos: ${todos.length}`);
	});
</script>

<svelte:head>
	<title>Belajar Svelte 5 | Playground</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans selection:bg-indigo-500 selection:text-white">
	<div class="max-w-4xl mx-auto space-y-8">
		<!-- Header -->
		<header class="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<div>
				<h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
					Belajar Svelte 5 🚀
				</h1>
				<p class="text-slate-400 mt-2">Selamat datang di playground interaktif Svelte 5 menggunakan Runes.</p>
			</div>
			<div class="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full w-fit">
				<span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
				<span class="text-sm font-semibold text-slate-300">Live Preview Active</span>
			</div>
		</header>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Bagian 1: State & Two-way Binding -->
			<section class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold text-slate-200">1. State & Binding</h2>
					<span class="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">$state & bind:value</span>
				</div>

				<!-- Input Binding -->
				<div class="space-y-2">
					<label for="name-input" class="block text-sm font-medium text-slate-400">Siapa namamu?</label>
					<input
						id="name-input"
						type="text"
						bind:value={name}
						placeholder="Masukkan namamu..."
						class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
					/>
				</div>

				<div class="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
					<p class="text-lg">
						Halo, <span class="font-bold text-pink-400">{name || 'Orang Asing'}</span>! 👋
					</p>
					<p class="text-sm text-slate-500 mt-1 font-mono">
						Panjang nama: {nameLength} karakter (dihitung via <span class="text-pink-500">$derived</span>)
					</p>
				</div>

				<!-- Counter -->
				<div class="space-y-4 pt-4 border-t border-slate-800">
					<span class="block text-sm font-medium text-slate-400">Counter Reaktif</span>
					<div class="flex items-center gap-4">
						<button
							onclick={() => counter--}
							class="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl text-xl font-bold transition"
						>
							-
						</button>
						<div class="flex-1 text-center bg-slate-950 border border-slate-850 rounded-xl py-2 font-mono text-2xl font-bold">
							{counter}
						</div>
						<button
							onclick={() => counter++}
							class="w-12 h-12 flex items-center justify-center bg-slate-850 hover:bg-slate-750 active:scale-95 rounded-xl text-xl font-bold transition"
						>
							+
						</button>
					</div>
					<div class="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 text-center">
						<span class="text-xs text-indigo-400 font-mono">Nilai Kuadrat ({counter}²): {counterSquared}</span>
					</div>
				</div>
			</section>

			<!-- Bagian 2: List & Control Flow -->
			<section class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-bold text-slate-200">2. Control Flow & List</h2>
						<span class="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">#each & #if</span>
					</div>

					<!-- Progress Bar -->
					<div class="space-y-2">
						<div class="flex justify-between text-xs text-slate-400">
							<span>Progress Belajar</span>
							<span class="font-mono">{completionPercentage}% ({completedCount}/{todos.length})</span>
						</div>
						<div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
							<div class="bg-gradient-to-r from-orange-500 to-pink-500 h-full transition-all duration-300" style="width: {completionPercentage}%"></div>
						</div>
					</div>

					<!-- Form Tambah Todo -->
					<form onsubmit={addTodo} class="flex gap-2">
						<input
							type="text"
							bind:value={newTodoText}
							placeholder="Tambah target belajar baru..."
							class="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
						/>
						<button
							type="submit"
							class="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 font-semibold rounded-xl text-sm transition active:scale-95"
						>
							Tambah
						</button>
					</form>

					<!-- Todo List -->
					<ul class="space-y-2 max-h-[220px] overflow-y-auto pr-1">
						{#each todos as todo (todo.id)}
							<li class="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-slate-800 transition">
								<label class="flex items-center gap-3 cursor-pointer select-none flex-1">
									<input
										type="checkbox"
										bind:checked={todo.done}
										class="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-800 focus:ring-orange-500 focus:ring-offset-slate-950 focus:ring-2"
									/>
									<span class="text-sm {todo.done ? 'line-through text-slate-500' : 'text-slate-300'} transition-all">
										{todo.text}
									</span>
								</label>
								<button
									onclick={() => deleteTodo(todo.id)}
									class="text-xs text-red-400/70 hover:text-red-400 p-1 font-mono transition"
									aria-label="Hapus todo"
								>
									[Hapus]
								</button>
							</li>
						{:else}
							<li class="text-center py-6 text-sm text-slate-500">
								Belum ada target belajar. Tambahkan di atas!
							</li>
						{/each}
					</ul>
				</div>
			</section>
		</div>

		<!-- Footer Info -->
		<footer class="text-center pt-8 text-xs text-slate-600 border-t border-slate-900">
			Dibuat untuk belajar Svelte 5 Runes • Akses halaman ini di browser pada alamat <code class="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">/belajar</code>
		</footer>
	</div>
</main>
