import type { PaginatedResult } from '$lib/core/shared';
import type { ICompanyRepository } from './company.repository';
import type {
  CompanyModel,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyParams
} from './company.model';

export class CompanyUseCase {
  constructor(private readonly repository: ICompanyRepository) {}

  async getAll(params: CompanyParams): Promise<PaginatedResult<CompanyModel>> {
    return this.repository.getAll(params);
  }

  async getById(id: string): Promise<CompanyModel | null> {
    return this.repository.getById(id);
  }

  async create(input: CreateCompanyInput): Promise<CompanyModel> {
    return this.repository.create(input);
  }

  async update(input: UpdateCompanyInput): Promise<CompanyModel> {
    return this.repository.update(input);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
