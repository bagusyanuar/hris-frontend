import { createQuery } from '@tanstack/svelte-query';

export type AttendanceTrendPoint = {
  day: string;
  present: number;
  late: number;
  absent: number;
};

export type DepartmentStat = {
  name: string;
  count: number;
  percentage: number;
  color: string;
};

export type PendingLeaveRequest = {
  id: string;
  name: string;
  role: string;
  type: string;
  duration: string;
  avatar?: string;
};

export type RecentActivityItem = {
  id: string;
  user: string;
  action: string;
  time: string;
  icon: string;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  category: string;
  badgeVariant: 'primary' | 'warning' | 'success' | 'danger' | 'default';
};

export type KpiStat = {
  name: string;
  score: number;
  target: number;
  status: 'optimal' | 'warning' | 'critical';
};

export type DashboardData = {
  stats: {
    totalEmployees: number;
    employeeGrowth: string;
    presentToday: number;
    presentPercentage: number;
    pendingLeaves: number;
    upcomingReviews: number;
  };
  kpiStats: KpiStat[]; // NEW
  attendanceTrend: AttendanceTrendPoint[];
  departmentDistribution: DepartmentStat[];
  pendingLeaveRequests: PendingLeaveRequest[];
  recentActivities: RecentActivityItem[];
  upcomingEvents: UpcomingEvent[];
};

export function useDashboardQuery() {
  return createQuery<DashboardData, Error, DashboardData, readonly string[]>(() => ({
    queryKey: ['dashboard'] as const,
    queryFn: async (): Promise<DashboardData> => {
      return {
        stats: {
          totalEmployees: 185,
          employeeGrowth: '+12% bulan ini',
          presentToday: 174,
          presentPercentage: 94,
          pendingLeaves: 6,
          upcomingReviews: 4
        },
        kpiStats: [
          { name: 'Kualitas Pekerjaan', score: 92, target: 90, status: 'optimal' },
          { name: 'Kehadiran', score: 94, target: 95, status: 'warning' },
          { name: 'Pencapaian Target', score: 85, target: 90, status: 'critical' }
        ],
        attendanceTrend: [
          { day: 'Sen', present: 170, late: 8, absent: 7 },
          { day: 'Sel', present: 178, late: 4, absent: 3 },
          { day: 'Rab', present: 175, late: 6, absent: 4 },
          { day: 'Kam', present: 172, late: 9, absent: 4 },
          { day: 'Jum', present: 174, late: 5, absent: 6 },
          { day: 'Sab', present: 85, late: 2, absent: 2 },
          { day: 'Min', present: 0, late: 0, absent: 0 }
        ],

        departmentDistribution: [
          { name: 'Teknologi & Produk', count: 62, percentage: 33.5, color: '#3b82f6' },
          { name: 'Operasional', count: 45, percentage: 24.3, color: '#10b981' },
          { name: 'Pemasaran & Sales', count: 38, percentage: 20.5, color: '#f59e0b' },
          { name: 'Keuangan & SDM', count: 24, percentage: 13.0, color: '#8b5cf6' },
          { name: 'Lainnya', count: 16, percentage: 8.7, color: '#64748b' }
        ],
        pendingLeaveRequests: [
          {
            id: 'l1',
            name: 'Sarah Lestari',
            role: 'Manajer SDM',
            type: 'Cuti Tahunan',
            duration: '3 hari (20-22 Jul)',
            avatar: ''
          },
          {
            id: 'l2',
            name: 'Budi Pratama',
            role: 'Pengembang Senior',
            type: 'Cuti Sakit',
            duration: '1 hari (24 Jul)',
            avatar: ''
          },
          {
            id: 'l3',
            name: 'Anisa Rahmawati',
            role: 'Desainer UI/UX',
            type: 'Cuti Melahirkan',
            duration: '3 bulan (Agt-Okt)',
            avatar: ''
          },
          {
            id: 'l4',
            name: 'Dimas Anggara',
            role: 'Analis Keuangan',
            type: 'Cuti Tahunan',
            duration: '2 hari (28-29 Jul)',
            avatar: ''
          }
        ],
        recentActivities: [
          {
            id: 'a1',
            user: 'Rina Wijaya',
            action: 'menyetujui pengajuan klaim medis Budi Pratama',
            time: '10 menit lalu',
            icon: 'lucide:check-circle-2'
          },
          {
            id: 'a2',
            user: 'Sistem HRIS',
            action: 'memproses slip gaji periode Juli 2026',
            time: '1 jam lalu',
            icon: 'lucide:file-text'
          },
          {
            id: 'a3',
            user: 'Ahmad Fauzi',
            action: 'memperbarui informasi kontak darurat',
            time: '3 jam lalu',
            icon: 'lucide:user-check'
          },
          {
            id: 'a4',
            user: 'Dewi Kartika',
            action: 'mengajukan permohonan Cuti Tahunan',
            time: '5 jam lalu',
            icon: 'lucide:calendar'
          }
        ],
        upcomingEvents: [
          {
            id: 'e1',
            title: 'Evaluasi Kinerja Q3',
            date: '28 Jul 2026',
            category: 'Penilaian',
            badgeVariant: 'warning'
          },
          {
            id: 'e2',
            title: 'Hari Kemerdekaan RI',
            date: '17 Agt 2026',
            category: 'Hari Libur',
            badgeVariant: 'danger'
          },
          {
            id: 'e3',
            title: 'Pelatihan Onboarding Anggota Baru',
            date: '02 Agt 2026',
            category: 'Pelatihan',
            badgeVariant: 'primary'
          }
        ]
      };
    }
  }));
}
