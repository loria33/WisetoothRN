import _ from 'lodash';

export const isEmpty = (text = '') => _.trim(text).length === 0;
