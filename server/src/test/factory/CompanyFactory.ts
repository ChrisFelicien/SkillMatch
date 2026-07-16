import { CompanyStatus, ICompany } from '@/interfaces/ICompany';

const companyFactory = (override?: Partial<ICompany>) => ({
  name: 'Google',
  status: CompanyStatus.PENDING,
  description:
    'Lorem ipsum is a nonsensical placeholder text used by designers to fill space and test page layouts without the distraction of meaningful content. It is derived from a scrambled 1st-century BC Latin text by the philosopher Cicero. The specific words you provided do not form a sensible sentence in Latin.',
  ...override,
});

export default companyFactory;
