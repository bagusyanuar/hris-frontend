import type { CompanyModel, UpdateCompanyInput } from './company.model';

export class CompanyService {
  static toInput(model: CompanyModel): UpdateCompanyInput {
    return {
      id: model.id,
      code: model.code,
      legalName: model.legalName,
      npwp: model.npwp,
      bpjsNo: model.bpjsNo,
      isActive: model.isActive
    };
  }

  static getStats(companies: CompanyModel[]) {
    const total = companies.length;
    const active = companies.filter((c) => c.isActive).length;
    const inactive = total - active;
    const activePercentage = total === 0 ? 0 : Math.round((active / total) * 100);

    return {
      total,
      active,
      inactive,
      activePercentage
    };
  }
}
