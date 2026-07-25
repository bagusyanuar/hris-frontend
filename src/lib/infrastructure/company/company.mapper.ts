import type {
  CompanyModel,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyParams
} from '$lib/core/company';
import type {
  CompanyResponse,
  CompanyQuery,
  CreateCompanyRequest,
  UpdateCompanyRequest
} from './company.schema';
import { BranchMapper } from '../branch/branch.mapper';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';

export class CompanyMapper {
  static toModel(response: CompanyResponse): CompanyModel {
    return {
      id: response.id,
      code: response.code,
      legalName: response.legal_name,
      npwp: response.npwp,
      bpjsNo: response.bpjs_no,
      isActive: response.is_active,
      branches: response.branches ? response.branches.map(BranchMapper.toModel) : [],
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
  }

  static toQuery(params: CompanyParams): CompanyQuery {
    return {
      ...PaginationMapper.toQuery(params),
      ...(params.search && { search: params.search }),
      ...(params.isActive !== undefined && params.isActive !== 'all' && { is_active: params.isActive })
    };
  }

  static toCreateRequest(input: CreateCompanyInput): CreateCompanyRequest {
    return {
      code: input.code,
      legal_name: input.legalName,
      npwp: input.npwp || undefined,
      bpjs_no: input.bpjsNo || undefined,
      is_active: input.isActive
    };
  }

  static toUpdateRequest(input: UpdateCompanyInput): UpdateCompanyRequest {
    return this.toCreateRequest(input);
  }
}
