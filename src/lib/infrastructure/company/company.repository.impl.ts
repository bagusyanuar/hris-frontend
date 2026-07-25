import type {
  ICompanyRepository,
  CompanyModel,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyParams
} from '$lib/core/company';
import type { PaginatedResult } from '$lib/core/shared';
import type { CompanyResponse, CompanyListResponse } from './company.schema';
import { CompanyMapper } from './company.mapper';
import { httpClient } from '$lib/infrastructure/http/client';
import { handleAppError } from '$lib/infrastructure/http/error.mapper';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';
import type { ApiResponse } from '$lib/infrastructure/http/types';

export class CompanyRepositoryImpl implements ICompanyRepository {
  private readonly basePath = '/v1/companies';

  async getAll(params: CompanyParams): Promise<PaginatedResult<CompanyModel>> {
    return handleAppError(async () => {
      const query = CompanyMapper.toQuery(params);
      const response = await httpClient.get<CompanyListResponse>(this.basePath, { params: query });
      return PaginationMapper.toResult(response, CompanyMapper.toModel);
    });
  }

  async getById(id: string): Promise<CompanyModel | null> {
    return handleAppError(async () => {
      const response = await httpClient.get<ApiResponse<CompanyResponse>>(`${this.basePath}/${id}`);
      return CompanyMapper.toModel(response.data);
    });
  }

  async create(input: CreateCompanyInput): Promise<CompanyModel> {
    return handleAppError(async () => {
      const request = CompanyMapper.toCreateRequest(input);
      const response = await httpClient.post<ApiResponse<CompanyResponse>>(this.basePath, request);
      return CompanyMapper.toModel(response.data);
    });
  }

  async update(input: UpdateCompanyInput): Promise<CompanyModel> {
    return handleAppError(async () => {
      const request = CompanyMapper.toUpdateRequest(input);
      const response = await httpClient.put<ApiResponse<CompanyResponse>>(
        `${this.basePath}/${input.id}`,
        request
      );
      return CompanyMapper.toModel(response.data);
    });
  }

  async delete(id: string): Promise<boolean> {
    return handleAppError(async () => {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    });
  }
}
