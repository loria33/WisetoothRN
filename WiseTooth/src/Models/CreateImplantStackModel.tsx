export interface ImplantImageData {
  implantLabel: string;
  implantLabelId: number;
  new: boolean;
  ManufacturerModel?: any;
  installId?: string;
  hasFailure?: boolean;
  length?: string;
  lot?:string;
  diameter?:string;
  toothNum?: any;
  toothNumList?: any;
}

export interface ScanImplantCreateImplantProps {
  implants: ImplantImageData[];
  toothNumbers: string[];
  implantPhoto?: string;
  isBackFromNewImplant?: boolean;
}

export interface SelectToothNumberCreateImplantProps extends ScanImplantCreateImplantProps{
  implantPhoto: string | undefined
}

export interface NewImplantCreateImplantProps extends SelectToothNumberCreateImplantProps {
}

export interface CreateImplantPatientInformationCreateImplantProps extends NewImplantCreateImplantProps {
  visit? :any;
}

export interface CreateImplantSummaryCreateImplantProps extends CreateImplantPatientInformationCreateImplantProps {
  patientFullName: string;
  gender: string;
  patientAge: string;
  medicalCondition: string; 
}

export type CreateImplantParamList = {
    ScanImplant: ScanImplantCreateImplantProps;
    SelectToothNumber: SelectToothNumberCreateImplantProps;
    NewImplant: NewImplantCreateImplantProps;
    CreateImplantPatientInformation: CreateImplantPatientInformationCreateImplantProps;
    CreateImplantSummary: CreateImplantSummaryCreateImplantProps;
};