<script lang="ts">
  import type { Component } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Carousel } from '$lib/presentation/shared/components/carousel';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import PhoneFrame from './showcase/PhoneFrame.svelte';
  import AttendanceMockup from './showcase/AttendanceMockup.svelte';
  import LeaveMockup from './showcase/LeaveMockup.svelte';
  import PayrollMockup from './showcase/PayrollMockup.svelte';
  import PeopleMockup from './showcase/PeopleMockup.svelte';

  interface ShowcaseSlide {
    id: string;
    /** Copy inside the white card. */
    headline: string;
    tagline: string;
    ctaLabel: string;
    /** Copy below the card, directly on the brand panel. */
    title: string;
    description: string;
    /** Phone screen content — a composed UI mockup, no image asset. */
    screen: Component;
    /** Pill overlapping the phone's lower edge. */
    action: { icon: string; label: string };
    highlight: { label: string; value: string };
  }

  const slides: ShowcaseSlide[] = [
    {
      id: 'attendance',
      headline: 'Maksimalkan Produktivitas.',
      tagline: 'Absensi ringkas untuk seluruh tim',
      ctaLabel: 'Pelajari',
      title: 'Kelola Waktu & Kehadiran.',
      description:
        'Atur shift, pantau keterlambatan, dan hitung lembur dari satu dasbor yang sama.',
      screen: AttendanceMockup,
      action: { icon: 'lucide:fingerprint', label: 'Check In' },
      highlight: { label: 'Rata-rata tepat waktu', value: '98,7%' }
    },
    {
      id: 'leave',
      headline: 'Cuti Tanpa Antre.',
      tagline: 'Persetujuan yang berjalan sendiri',
      ctaLabel: 'Pelajari',
      title: 'Alur Persetujuan Rapi.',
      description: 'Setiap ajuan mengalir ke atasan yang tepat, dan saldo cuti terhitung otomatis.',
      screen: LeaveMockup,
      action: { icon: 'lucide:check-circle-2', label: 'Setujui' },
      highlight: { label: 'Rata-rata approval', value: '2 jam 15 menit' }
    },
    {
      id: 'payroll',
      headline: 'Payroll Sekali Klik.',
      tagline: 'Hitung gaji tanpa spreadsheet',
      ctaLabel: 'Pelajari',
      title: 'Gaji Akurat Tiap Bulan.',
      description:
        'Tunjangan, BPJS, dan PPh 21 diproses sekaligus, lalu slip terkirim ke karyawan.',
      screen: PayrollMockup,
      action: { icon: 'lucide:wallet', label: 'Proses Gaji' },
      highlight: { label: 'Periode Juli 2026', value: 'Selesai diproses' }
    },
    {
      id: 'people',
      headline: 'Satu Sumber Data.',
      tagline: 'Profil karyawan yang selalu mutakhir',
      ctaLabel: 'Pelajari',
      title: 'Data Karyawan Terpusat.',
      description:
        'Kontrak, jabatan, dan riwayat mutasi tersimpan rapi dalam satu profil karyawan.',
      screen: PeopleMockup,
      action: { icon: 'lucide:user-plus', label: 'Tambah Data' },
      highlight: { label: 'Unit kerja aktif', value: '18 departemen' }
    }
  ];
</script>

<aside
  id="login-showcase"
  class="bg-brand-deep relative hidden overflow-hidden lg:flex lg:flex-col"
>
  <!-- Ambient brand glow -->
  <div
    class="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"
  ></div>
  <div
    class="pointer-events-none absolute -bottom-48 -left-24 h-96 w-96 rounded-full bg-emerald-300/[0.06] blur-3xl"
  ></div>

  <header id="showcase-header" class="relative z-10 flex items-center justify-end px-10 pt-8">
    <a
      href="#bantuan"
      class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-emerald-50/70 backdrop-blur-sm transition-all duration-200 ease-out hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      <Icon icon="lucide:life-buoy" class="h-3.5 w-3.5" />
      <Typography variant="body-xs" weight="medium" color="inherit">Pusat Bantuan</Typography>
    </a>
  </header>

  <Carousel
    id="showcase-carousel"
    items={slides}
    tone="light"
    interval={7000}
    showArrows
    label="Sorotan fitur TalentFlow"
    class="relative z-10 flex-1 px-10 pt-4 pb-10"
    controlsClass="justify-center"
  >
    {#snippet slide(item: ShowcaseSlide)}
      {@const Screen = item.screen}
      <div class="flex h-full flex-col items-center justify-center">
        <!-- Bottom padding reserves room for the phone and chip that overflow the card. -->
        <div class="w-full max-w-lg pb-16">
          <div class="relative">
            <article
              class="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-2xl shadow-emerald-950/40"
            >
              <!-- Card copy -->
              <div class="flex min-w-0 flex-1 flex-col gap-3">
                <span class="block text-slate-900">
                  <Typography variant="h4" weight="bold" color="inherit" class="tracking-tight">
                    {item.headline}
                  </Typography>
                </span>
                <span class="block text-slate-500">
                  <Typography variant="body-sm" color="inherit" class="leading-snug">
                    {item.tagline}
                  </Typography>
                </span>
                <a
                  href="#fitur"
                  class="bg-brand-deep hover:bg-brand-hover mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-white transition-all duration-200 ease-out hover:-translate-y-0.5"
                >
                  <Typography variant="body-xs" weight="semibold" color="inherit">
                    {item.ctaLabel}
                  </Typography>
                  <Icon icon="lucide:arrow-right" class="h-3.5 w-3.5" />
                </a>
              </div>

              <!-- Phone mockup, deliberately overflowing the card's lower edge -->
              <div class="relative -mb-12 shrink-0">
                <PhoneFrame>
                  <Screen />
                </PhoneFrame>
                <span
                  class="bg-brand-primary absolute -right-3 -bottom-3 -left-3 flex items-center justify-center gap-1.5 rounded-2xl py-2 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-white/15"
                  aria-hidden="true"
                >
                  <Icon icon={item.action.icon} class="h-3.5 w-3.5" />
                  <Typography variant="body-xs" weight="semibold" color="inherit">
                    {item.action.label}
                  </Typography>
                </span>
              </div>
            </article>

            <!-- Floating metric chip -->
            <div
              class="absolute -bottom-5 left-6 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-xl shadow-emerald-950/50 ring-1 ring-slate-900/5"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
              >
                <Icon icon="lucide:check" class="h-4 w-4" />
              </span>
              <span class="flex flex-col gap-0.5 leading-none">
                <span class="text-slate-500">
                  <Typography variant="body-xs" weight="medium" color="inherit">
                    {item.highlight.label}
                  </Typography>
                </span>
                <span class="text-slate-900">
                  <Typography variant="body-sm" weight="bold" color="inherit">
                    {item.highlight.value}
                  </Typography>
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Panel copy -->
        <div class="max-w-md space-y-2.5 text-center">
          <span class="block text-white">
            <Typography variant="h4" weight="bold" color="inherit" class="tracking-tight">
              {item.title}
            </Typography>
          </span>
          <span class="block text-emerald-100/60">
            <Typography variant="body-sm" color="inherit" class="leading-relaxed">
              {item.description}
            </Typography>
          </span>
        </div>
      </div>
    {/snippet}
  </Carousel>
</aside>
