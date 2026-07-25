import type { PaginatedResult } from '$lib/core/shared';
import type {
  CompanyModel,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyParams
} from './company.model';

export interface ICompanyRepository {
  getAll(params: CompanyParams): Promise<PaginatedResult<CompanyModel>>;
  getById(id: string): Promise<CompanyModel | null>;
  create(input: CreateCompanyInput): Promise<CompanyModel>;
  update(input: UpdateCompanyInput): Promise<CompanyModel>;
  delete(id: string): Promise<boolean>;
}
