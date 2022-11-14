import {
  GET_VISIT_LIST,
  SEARCH_ON_VISIT_LIST,
  CREATE_REPORT,
  GET_IMPLANT_STATISTICS,
  EDIT_REPORT,
  SET_LIST_FLAG
} from './types';

export const getVisitList = () => ({
  type: GET_VISIT_LIST.PENDING
});

export const getVisitListSuccess = (visits: object) => ({
  type: GET_VISIT_LIST.SUCCESS,
  visits
});

export const getVisitListError = (error: string) => ({
  type: GET_VISIT_LIST.ERROR,
  error
});

export const searchOnVisitList = (queryObj: any) => ({
  type: SEARCH_ON_VISIT_LIST.PENDING,
  queryObj
});

export const searchOnVisitListSuccess = (visits: object) => ({
  type: SEARCH_ON_VISIT_LIST.SUCCESS,
  visits
});

export const searchOnVisitListError = (error: string) => ({
  type: SEARCH_ON_VISIT_LIST.ERROR,
  error
});

export const createReport = (reqObj: any) => ({
  type: CREATE_REPORT.PENDING,
  reqObj
});

export const createReportSuccess = () => ({
  type: CREATE_REPORT.SUCCESS
});

export const createReportError = (error: string) => ({
  type: CREATE_REPORT.ERROR,
  error
});

export const getImplantStatistics = (queryObj: any, navigateToStatisticsView: boolean) => ({
  type: GET_IMPLANT_STATISTICS.PENDING,
  queryObj,
  navigateToStatisticsView
});

export const getImplantStatisticsSuccess = (res: any) => ({
  type: GET_IMPLANT_STATISTICS.SUCCESS,
  res
});

export const getImplantStatisticsError = (error: string) => ({
  type: GET_IMPLANT_STATISTICS.ERROR,
  error
});

export const editReport = (reqObj: any) => ({
  type: EDIT_REPORT.PENDING,
  reqObj
});

export const editReportSuccess = () => ({
  type: EDIT_REPORT.SUCCESS
});

export const editReportError = (error: string) => ({
  type: EDIT_REPORT.ERROR,
  error
});

export const setListFlag = () => ({
  type: SET_LIST_FLAG
});