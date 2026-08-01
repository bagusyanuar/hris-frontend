<script lang="ts">
  import { resolve } from '$app/paths';
  import { provideAuthStore } from '$lib/infrastructure/auth';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { PasswordField } from '$lib/presentation/shared/components/passwordfield';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Checkbox } from '$lib/presentation/shared/components/checkbox';
  import { toast } from '$lib/presentation/shared/components/toast';
  import Icon from '@iconify/svelte';
  import LoginShowcase from '../components/LoginShowcase.svelte';

  // Mengambil Store secara langsung via Dependency Provider
  const store = provideAuthStore();

  // Local UI state untuk binding form
  let email = $state('');
  let password = $state('');
  let rememberMe = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const success = await store.login({ email, password });
    if (success) {
      toast.success(`Selamat datang kembali, ${store.user?.name}!`, 'Login Berhasil');
    } else if (store.error) {
      toast.error(store.error, 'Login Gagal');
    }
  }
</script>

<div class="bg-neutral-card grid min-h-screen grid-cols-1 font-sans lg:grid-cols-2">
  <!-- Panel Kiri: Form Autentikasi -->
  <section
    id="login-form-section"
    class="flex flex-col px-6 py-8 sm:px-12 lg:px-16 xl:px-24"
    aria-labelledby="login-title"
  >
    <!-- Brand -->
    <a
      href={resolve('/')}
      class="inline-flex items-center gap-2.5 self-start"
      aria-label="Beranda TalentFlow"
    >
      <span
        class="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        <Icon icon="lucide:layers" class="h-5 w-5" />
      </span>
      <span class="flex flex-col leading-none">
        <Typography variant="body-md" weight="bold" class="tracking-tight">TALENTFLOW</Typography>
        <span class="text-slate-400 uppercase">
          <Typography variant="caption" weight="semibold" color="inherit" class="tracking-widest">
            HRIS Ecosystem
          </Typography>
        </span>
      </span>
    </a>

    <div class="flex flex-1 items-center py-10">
      <div class="mx-auto w-full max-w-sm">
        {#if store.isAuthenticated}
          <!-- Authenticated State -->
          <div class="space-y-6 text-center">
            <div
              class="bg-brand-light text-brand-text border-brand-border mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border"
            >
              <Icon icon="lucide:check" class="h-8 w-8" />
            </div>
            <div class="space-y-2">
              <Typography variant="h4" weight="bold" id="login-title">
                Selamat datang kembali!
              </Typography>
              <Typography variant="body-sm" color="muted">
                Anda berhasil masuk sebagai
                <span class="font-semibold text-slate-900 dark:text-slate-100"
                  >{store.user?.name}</span
                >
                ({store.user?.role})
              </Typography>
            </div>

            <Button variant="danger" class="h-11 w-full" onclick={() => store.logout()}>
              Keluar dari Sesi
            </Button>
          </div>
        {:else}
          <!-- Header -->
          <header id="login-header" class="mb-8">
            <Typography variant="h2" weight="bold" id="login-title" class="tracking-tight">
              Masuk
            </Typography>
            <Typography variant="body-sm" color="muted" class="mt-2">
              Belum punya akses?
              <a
                href="#contact"
                class="text-brand-primary font-medium underline-offset-4 transition-colors duration-150 hover:underline"
              >
                Hubungi Admin HR
              </a>
            </Typography>
          </header>

          <!-- Login Form -->
          <form class="space-y-4" onsubmit={handleSubmit}>
            <!-- Alert Error -->
            {#if store.error}
              <div
                class="rounded-xl border-l-4 border-rose-500 bg-rose-50 p-4 transition-all duration-200 dark:bg-rose-950/30"
              >
                <div class="flex">
                  <div class="shrink-0 text-rose-500">
                    <Icon icon="lucide:alert-circle" class="h-5 w-5" />
                  </div>
                  <div class="ml-3">
                    <Typography variant="body-sm" color="error" weight="medium">
                      {store.error}
                    </Typography>
                  </div>
                </div>
              </div>
            {/if}

            <TextField
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              bind:value={email}
              label="Email"
              placeholder="nama@perusahaan.com"
              class="h-11"
            >
              {#snippet prefix()}
                <Icon icon="lucide:mail" class="h-4 w-4 text-slate-400" />
              {/snippet}
            </TextField>

            <PasswordField
              id="password"
              name="password"
              autocomplete="current-password"
              required
              bind:value={password}
              label="Password"
              placeholder="••••••••"
              class="h-11"
            >
              {#snippet prefix()}
                <Icon icon="lucide:lock" class="h-4 w-4 text-slate-400" />
              {/snippet}
            </PasswordField>

            <!-- Remember & Forgot Password -->
            <div class="flex items-center justify-between pt-1">
              <Checkbox bind:checked={rememberMe} label="Ingat Saya" />
              <a
                href="#forgot"
                class="text-brand-primary underline-offset-4 transition-all duration-150 hover:underline"
              >
                <Typography variant="body-sm" color="brand" weight="medium">
                  Lupa Password?
                </Typography>
              </a>
            </div>

            <Button
              type="submit"
              class="bg-brand-primary hover:bg-brand-hover mt-2 h-11 w-full font-semibold text-white transition-all duration-200"
              isLoading={store.isLoading}
              loadingText="Memverifikasi..."
            >
              Masuk
            </Button>
          </form>

          <!-- Dev Hint (hapus saat produksi) -->
          <div
            class="border-neutral-border mt-8 rounded-xl border bg-slate-50 p-3 dark:bg-slate-900"
          >
            <Typography variant="caption" color="muted">
              Petunjuk: Gunakan <code
                class="border-neutral-border rounded border bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >admin@hris.com</code
              >
              /
              <code
                class="border-neutral-border rounded border bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >password123</code
              >
            </Typography>
          </div>
        {/if}
      </div>
    </div>

    <footer id="login-footer">
      <Typography variant="caption" color="muted">
        © 2026 TalentFlow — HRIS Ecosystem. Seluruh hak cipta dilindungi.
      </Typography>
    </footer>
  </section>

  <!-- Panel Kanan: Carousel Sorotan Produk -->
  <LoginShowcase />
</div>
