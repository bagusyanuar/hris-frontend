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
  class="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
  style="background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 30%, #f0fdf8 50%, #ecfdf5 70%, #d1fae5 100%);"
>
  <!-- Curved Lines - Bottom Left (3 arcs) -->
  <div
    class="absolute pointer-events-none"
    style="bottom: -200px; left: -300px; width: 700px; height: 700px; border: 2px solid rgba(16,185,129,0.18); border-radius: 50%;"
  ></div>
  <div
    class="absolute pointer-events-none"
    style="bottom: -230px; left: -330px; width: 750px; height: 750px; border: 1.5px solid rgba(16,185,129,0.14); border-radius: 50%;"
  ></div>
  <div
    class="absolute pointer-events-none"
    style="bottom: -260px; left: -360px; width: 800px; height: 800px; border: 1px solid rgba(16,185,129,0.10); border-radius: 50%;"
  ></div>

  <!-- Curved Lines - Top Right (2 arcs) -->
  <div
    class="absolute pointer-events-none"
    style="top: -250px; right: -300px; width: 650px; height: 650px; border: 2px solid rgba(16,185,129,0.16); border-radius: 50%;"
  ></div>
  <div
    class="absolute pointer-events-none"
    style="top: -280px; right: -330px; width: 700px; height: 700px; border: 1.5px solid rgba(16,185,129,0.12); border-radius: 50%;"
  ></div>

  <!-- Filled Dots -->
  <div class="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/40 pointer-events-none" style="top: 15%; left: 10%;"></div>
  <div class="absolute w-2 h-2 rounded-full bg-emerald-400/35 pointer-events-none" style="top: 40%; left: 6%;"></div>
  <div class="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/30 pointer-events-none" style="top: 70%; left: 15%;"></div>
  <div class="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/35 pointer-events-none" style="top: 12%; right: 15%;"></div>
  <div class="absolute w-2 h-2 rounded-full bg-emerald-400/30 pointer-events-none" style="top: 35%; right: 8%;"></div>
  <div class="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/25 pointer-events-none" style="top: 65%; right: 20%;"></div>
  <div class="absolute w-2 h-2 rounded-full bg-emerald-400/35 pointer-events-none" style="top: 85%; left: 45%;"></div>
  <div class="absolute w-2 h-2 rounded-full bg-emerald-400/30 pointer-events-none" style="top: 8%; left: 35%;"></div>

  <!-- Open Rings -->
  <div
    class="absolute rounded-full pointer-events-none"
    style="top: 20%; right: 10%; width: 16px; height: 16px; border: 2px solid rgba(16,185,129,0.30);"
  ></div>
  <div
    class="absolute rounded-full pointer-events-none"
    style="top: 60%; left: 8%; width: 14px; height: 14px; border: 2px solid rgba(16,185,129,0.25);"
  ></div>
  <div
    class="absolute rounded-full pointer-events-none"
    style="top: 75%; right: 18%; width: 12px; height: 12px; border: 2px solid rgba(16,185,129,0.28);"
  ></div>
  <div
    class="absolute rounded-full pointer-events-none"
    style="top: 25%; left: 18%; width: 11px; height: 11px; border: 2px solid rgba(16,185,129,0.22);"
  ></div>

  <div class="w-full max-w-md space-y-4 relative z-10">
    <!-- Login Card -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/60 transition-all duration-300"
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

          <Button variant="danger" class="w-full h-11 rounded-lg" onclick={() => store.logout()}>
            Keluar dari Sesi
          </Button>
        </div>
      {:else}
        <!-- Login Form Header -->
        <div class="text-center mb-6">
          <div
            class="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <Icon icon="lucide:shield-check" class="h-7 w-7" />
          </div>
          <Typography
            variant="h3"
            weight="bold"
            class="tracking-tight text-slate-900 dark:text-slate-100"
          >
            Masuk ke HRIS
          </Typography>
          <Typography variant="body-sm" color="muted" class="mt-1.5">
            Kelola SDM dengan mudah dan efisien
          </Typography>
        </div>

        <!-- Login Form -->
        <form class="space-y-4" onsubmit={handleSubmit}>
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
              class="hover:underline text-brand-primary transition-all duration-150"
            >
              <Typography variant="body-sm" color="brand" weight="medium">
                Lupa Password?
              </Typography>
            </a>
          </div>

          <Button
            type="submit"
            class="w-full h-11 bg-brand-primary hover:bg-brand-hover text-white transition-all duration-200 mt-2 font-semibold shadow-xs"
            isLoading={store.isLoading}
            loadingText="Memverifikasi..."
          >
            Masuk
          </Button>
        </form>

        <!-- Footer inside card -->
        <div class="text-center mt-5">
          <Typography variant="body-sm" color="muted">
            Belum punya akun? <a href="#contact" class="text-brand-primary font-medium hover:underline transition-colors duration-150">Hubungi Admin</a>
          </Typography>
        </div>
      {/if}
    </div>

    <!-- Bottom Hints (Dev only, remove in production) -->
    <div
      class="rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-neutral-border p-3 text-center"
    >
      <Typography variant="caption" color="muted">
        Petunjuk: Gunakan <code
          class="bg-white dark:bg-slate-950 border border-neutral-border px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-xs"
          >admin@hris.com</code
        >
        /
        <code
          class="bg-white dark:bg-slate-950 border border-neutral-border px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-xs"
          >password123</code
        >
      </Typography>
    </div>
  </div>
</div>



