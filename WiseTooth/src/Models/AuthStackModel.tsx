

interface ThankYouValues {
  email: string;
  name: string;
  password: string;
  verifyPassword: string;
}

export type LoginStackParamList = {
    Login: {
      values: ThankYouValues;
    };
    Account: undefined;
    AccountDetails: {
      email:string,
      name: string,
      password: string,
      verifyPassword: string,
      isToUpdateUser?: boolean,
      id?:string;
    };
    ThankYou: {
      values: ThankYouValues;
    };
  };