import type {
  ICompanyRepository,
  CompanyModel,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyParams
} from '$lib/core/company';
import type { PaginatedResult } from '$lib/core/shared';
import { mockBranches } from '../branch/branch.repository.mock';

export const mockCompanies: Omit<CompanyModel, 'branches'>[] = [
  {
    id: 'co-1',
    code: 'PTA',
    legalName: 'PT Alpha Nusantara',
    npwp: '01.234.567.8-901.000',
    bpjsNo: 'JKN-0001',
    isActive: true
  },
  {
    id: 'co-2',
    code: 'PTB',
    legalName: 'PT Beta Sejahtera',
    npwp: '02.345.678.9-012.000',
    bpjsNo: 'JKN-0002',
    isActive: true
  }
];

export class CompanyRepositoryMock implements ICompanyRepository {
  private getCompanyWithBranches(c: Omit<CompanyModel, 'branches'>): CompanyModel {
    return {
      ...c,
      branches: mockBranches.filter((b) => b.companyId === c.id)
    };
  }

  async getAll(params: CompanyParams): Promise<PaginatedResult<CompanyModel>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = [...mockCompanies];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((c) => {
        const matchesCompany = c.legalName.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
        const matchesBranch = mockBranches.some(
          (b) => b.companyId === c.id && b.name.toLowerCase().includes(q)
        );
        return matchesCompany || matchesBranch;
      });
    }

    if (params.isActive !== undefined && params.isActive !== 'all') {
      filtered = filtered.filter((c) => c.isActive === params.isActive);
    }

    const items = filtered.map((c) => this.getCompanyWithBranches(c));

    return {
      items,
      page: params.page || 1,
      perPage: params.limit || 10,
      total: items.length
    };
  }

  async getById(id: string): Promise<CompanyModel | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const company = mockCompanies.find((c) => c.id === id);
    if (!company) return null;
    return this.getCompanyWithBranches(company);
  }

  async create(input: CreateCompanyInput): Promise<CompanyModel> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Validasi NPWP unik jika diisi
    if (input.npwp) {
      const duplicate = mockCompanies.some((c) => c.npwp === input.npwp);
      if (duplicate) {
        throw new Error('NPWP sudah terdaftar');
      }
    }

    const newCompany: Omit<CompanyModel, 'branches'> = {
      ...input,
      id: 'co-' + Math.random().toString().substring(2, 6),
      createdAt: new Date().toISOString()
    };
    mockCompanies.push(newCompany);
    return this.getCompanyWithBranches(newCompany);
  }

  async update(input: UpdateCompanyInput): Promise<CompanyModel> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockCompanies.findIndex((c) => c.id === input.id);
    if (index === -1) throw new Error('Company not found');

    if (input.npwp) {
      const duplicate = mockCompanies.some((c) => c.npwp === input.npwp && c.id !== input.id);
      if (duplicate) {
        throw new Error('NPWP sudah terdaftar');
      }
    }

    mockCompanies[index] = {
      ...mockCompanies[index],
      ...input,
      updatedAt: new Date().toISOString()
    };
    return this.getCompanyWithBranches(mockCompanies[index]);
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockCompanies.findIndex((c) => c.id === id);
    if (index === -1) return false;
    mockCompanies.splice(index, 1);
    // Note: branches remain orphaned but inactive or not shown, aligned with backend gap
    return true;
  }
}
