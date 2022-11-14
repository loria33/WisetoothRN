import axios from 'axios';
import { api as apiURL } from '../config/Backend';


export const getVisitList = () =>
  axios.get(`${apiURL}/visit`);

export const searchOnVisitList = (queryObj: any) =>
  axios.get(`${apiURL}/visit?${queryObj}`);

export const createReport = (reqObj: any) =>
  axios.post(`${apiURL}/report`, reqObj);

export const getImplantStatistics = (token: string, queryObj: any) =>
  axios.get(`${apiURL}/implant/statistics?${queryObj}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const editReport = (reqObj: any) =>
  axios.post(`${apiURL}/report/update/${reqObj.reportId}`, reqObj);
