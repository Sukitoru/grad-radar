import { useQuery } from '@tanstack/react-query';
import {
  getApplications,
  getPrograms,
  getSchools,
  getTerms,
  type Application,
  type ApplicationFilters,
} from './api';

export interface AnalyticsFilters extends ApplicationFilters {
  searchText?: string;
  programName?: string;
  researchArea?: string;
  degreeLevel?: 'Masters' | 'Doctoral';
  minimumGpa?: number;
  maximumGpa?: number;
}

const filterAnalyticsApplications = (
  applications: Application[],
  filters: AnalyticsFilters,
) => {
  return applications.filter((application) => {
    const applicationGpa =
      application.gpa === null ? null : Number(application.gpa);
    const searchValue = filters.searchText?.trim().toLowerCase() ?? '';
    const searchableValues = [
      application.school?.name,
      application.program?.name,
      application.researchArea,
    ];

    const matchesSearch =
      !searchValue ||
      searchableValues.some((value) =>
        value?.toLowerCase().includes(searchValue),
      );
    const matchesResearchArea =
      !filters.researchArea ||
      application.researchArea === filters.researchArea;
    const matchesProgramName =
      !filters.programName ||
      application.program?.name === filters.programName;
    const matchesDegreeLevel =
      !filters.degreeLevel ||
      application.program?.degreeLevel === filters.degreeLevel;
    const matchesMinimumGpa =
      filters.minimumGpa === undefined ||
      (applicationGpa !== null && applicationGpa >= filters.minimumGpa);
    const matchesMaximumGpa =
      filters.maximumGpa === undefined ||
      (applicationGpa !== null && applicationGpa <= filters.maximumGpa);

    return (
      matchesSearch &&
      matchesProgramName &&
      matchesResearchArea &&
      matchesDegreeLevel &&
      matchesMinimumGpa &&
      matchesMaximumGpa
    );
  });
};

export const useAnalyticsApplications = (
  filters: AnalyticsFilters = {},
) => {
  const applicationFilters: ApplicationFilters = {
    schoolId: filters.schoolId,
    programId: filters.programId,
    termId: filters.termId,
    decisionStatus: filters.decisionStatus,
  };

  return useQuery({
    queryKey: ['analytics', 'applications', applicationFilters],
    queryFn: () => getApplications(applicationFilters),
    select: (applications) =>
      filterAnalyticsApplications(applications, filters),
  });
};

export const useAnalyticsSchools = () => {
  return useQuery({
    queryKey: ['analytics', 'schools'],
    queryFn: getSchools,
  });
};

export const useAnalyticsPrograms = () => {
  return useQuery({
    queryKey: ['analytics', 'programs'],
    queryFn: getPrograms,
  });
};

export const useAnalyticsTerms = () => {
  return useQuery({
    queryKey: ['analytics', 'terms'],
    queryFn: getTerms,
  });
};
