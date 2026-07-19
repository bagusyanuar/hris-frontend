<script lang="ts">
  import { provideAuthStore } from '$lib/infrastructure/auth';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { PasswordField } from '$lib/presentation/shared/components/passwordfield';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Checkbox } from '$lib/presentation/shared/components/checkbox';
  import { toast } from '$lib/presentation/shared/components/toast';
  import Icon from '@iconify/svelte';

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

<div
  class="min-h-screen bg-neutral-bg flex lg:grid lg:grid-cols-12 font-sans transition-colors duration-300"
>
  <!-- Left Side: Brand Visuals (Only on large screens) -->
  <div
    class="relative hidden lg:flex lg:col-span-7 bg-slate-950 flex-col justify-between p-12 overflow-hidden border-r border-neutral-border"
  >
    <!-- Background decorations -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-brand-primary),transparent_45%)] opacity-30"
    ></div>
    <div
      class="absolute -top-40 -left-40 w-96 h-96 bg-brand-primary rounded-full filter blur-3xl opacity-10"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-80 h-80 bg-emerald-700 rounded-full filter blur-3xl opacity-15"
    ></div>
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[24px_24px]"
    ></div>

    <!-- Top Header -->
    <div class="relative z-10 flex items-center gap-3">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
      >
        <Icon icon="lucide:layers" class="h-5 w-5" />
      </div>
      <Typography variant="h4" weight="bold" color="inherit" class="text-white tracking-wide">
        HRIS Portal
      </Typography>
    </div>

    <!-- Middle Quote / Benefit -->
    <div class="relative z-10 my-auto max-w-lg space-y-6">
      <Typography variant="h2" weight="bold" color="inherit" class="text-white leading-tight">
        Simplify your workforce management.
      </Typography>
      <Typography variant="body-lg" color="inherit" class="text-slate-300">
        An elegant, all-in-one corporate portal to streamline payroll, attendance, leaves, and
        talent management with enterprise-grade security.
      </Typography>

      <!-- Premium Badge card -->
      <div
        class="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-white/20"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/20 text-brand-primary"
          >
            <Icon icon="lucide:sparkles" class="h-6 w-6" />
          </div>
          <div class="space-y-1">
            <Typography variant="body-md" weight="semibold" color="inherit" class="text-white">
              Powered by Antigravity AI
            </Typography>
            <Typography variant="body-sm" color="inherit" class="text-slate-400">
              Experience automated talent mapping, smart scheduling, and real-time dashboard
              generation.
            </Typography>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer Info -->
    <div class="relative z-10 flex justify-between items-center text-slate-400 text-sm">
      <Typography variant="caption" color="inherit">
        &copy; {new Date().getFullYear()} HRIS System. All rights reserved.
      </Typography>
      <div class="flex gap-4">
        <a href="#privacy" class="hover:text-white transition-colors duration-200">
          <Typography variant="caption" color="inherit">Privacy Policy</Typography>
        </a>
        <a href="#terms" class="hover:text-white transition-colors duration-200">
          <Typography variant="caption" color="inherit">Terms of Service</Typography>
        </a>
      </div>
    </div>
  </div>

  <!-- Right Side: Login Form -->
  <div
    class="flex-1 lg:col-span-5 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 xl:px-16 py-12 relative overflow-hidden bg-neutral-bg"
  >
    <!-- Decorative Background Ambient Glow for Mobile/Tablet -->
    <div
      class="lg:hidden absolute top-0 right-0 w-80 h-80 bg-brand-primary rounded-full filter blur-3xl opacity-10"
    ></div>
    <div
      class="lg:hidden absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full filter blur-3xl opacity-5"
    ></div>

    <div class="w-full max-w-md space-y-8 relative z-10">
      <!-- Mobile Logo Header -->
      <div class="flex flex-col items-center text-center lg:items-start lg:text-left">
        <div
          class="flex lg:hidden h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20 mb-4"
        >
          <Icon icon="lucide:layers" class="h-6 w-6" />
        </div>
        <Typography
          variant="h3"
          weight="bold"
          class="tracking-tight text-slate-900 dark:text-slate-100"
        >
          Welcome back
        </Typography>
        <Typography variant="body-md" color="muted" class="mt-2">
          Enter your credentials to access your account
        </Typography>
      </div>

      <!-- Login Card -->
      <div
        class="rounded-2xl border border-neutral-border bg-neutral-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        {#if store.isAuthenticated}
          <!-- Authenticated State -->
          <div class="text-center space-y-6 py-4">
            <div
              class="w-16 h-16 bg-brand-light text-brand-text rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm border border-brand-border"
            >
              <Icon icon="lucide:check" class="h-8 w-8" />
            </div>
            <div class="space-y-2">
              <Typography variant="h4" weight="bold">Selamat datang kembali!</Typography>
              <Typography variant="body-md" color="muted">
                Anda berhasil masuk sebagai <span
                  class="font-semibold text-slate-900 dark:text-slate-100">{store.user?.name}</span
                >
                ({store.user?.role})
              </Typography>
            </div>

            <Button variant="danger" class="w-full h-11" onclick={() => store.logout()}>
              Keluar dari Sesi
            </Button>
          </div>
        {:else}
          <!-- Login Form -->
          <form class="space-y-5" onsubmit={handleSubmit}>
            <!-- Alert Error -->
            {#if store.error}
              <div
                class="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-4 rounded-xl transition-all duration-200"
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
              label="Email Address"
              placeholder="admin@hris.com"
              class="h-11"
            >
              {#snippet prefix()}
                <Icon icon="lucide:mail" class="h-4 w-4 text-slate-400" />
              {/snippet}
            </TextField>

            <div class="space-y-1.5">
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
            </div>

            <!-- Remember & Forgot Password -->
            <div class="flex items-center justify-between pt-1">
              <Checkbox bind:checked={rememberMe} label="Remember me" />
              <a
                href="#forgot"
                class="hover:underline text-brand-primary transition-all duration-150"
              >
                <Typography variant="body-sm" color="brand" weight="medium">
                  Forgot password?
                </Typography>
              </a>
            </div>

            <Button
              type="submit"
              class="w-full h-11 bg-brand-primary hover:bg-brand-hover text-white transition-all duration-200 mt-2 font-medium shadow-sm shadow-brand-primary/10"
              isLoading={store.isLoading}
              loadingText="Verifying details..."
            >
              Masuk
            </Button>
          </form>
        {/if}
      </div>

      <!-- Bottom Hints / Instructions -->
      <div
        class="rounded-xl bg-slate-100 dark:bg-slate-900 border border-neutral-border p-4 text-center"
      >
        <Typography variant="caption" color="muted">
          Hint: Gunakan <code
            class="bg-white dark:bg-slate-950 border border-neutral-border px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono"
            >admin@hris.com</code
          >
          dan
          <code
            class="bg-white dark:bg-slate-950 border border-neutral-border px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono"
            >password123</code
          >
        </Typography>
      </div>
    </div>
  </div>
</div>
