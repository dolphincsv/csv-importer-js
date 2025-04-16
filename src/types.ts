type SharedColumnFields = {
  internal_ref: string;
  label: string;
  required?: boolean;
};

type DateRangeMeta = {
  minValue?: string;
  maxValue?: string;
};

type TextColumn = {
  type: 'text';
  meta?: {
    maxLength?: number;
    minLength?: number;
    alphanumericOnly?: boolean;
    letterCasing?: 'default' | 'uppercase' | 'lowercase' | 'title';
    disallowedCharacters?: string;
    disallowTabs?: boolean;
    disallowLinebreaks?: boolean;
  };
} & SharedColumnFields;

type EmailColumn = {
  type: 'email';
} & SharedColumnFields;

type UrlColumn = {
  type: 'url';
} & SharedColumnFields;

type InternationalPhoneNumberColumn = {
  type: 'phone';
} & SharedColumnFields;

type UsPhoneNumberColumn = {
  type: 'usPhone';
} & SharedColumnFields;

type UsPostcodeColumn = {
  type: 'us_postcode';
} & SharedColumnFields;

type PicklistColumn = {
  type: 'picklist';
  meta: {
    options: { label: string; value: string }[];
  };
} & SharedColumnFields;

type NumberColumn = {
  type: 'number';
  meta?: {
    minValue?: number;
    maxValue?: number;
    disallow_decimals?: boolean;
  };
} & SharedColumnFields;

type PercentageColumn = {
  type: 'percentage';
  meta?: {
    minValue?: number;
    maxValue?: number;
  };
} & SharedColumnFields;

type BooleanColumn = {
  type: 'boolean';
} & SharedColumnFields;

type DateColumn = {
  type: 'date';
  meta?: DateRangeMeta;
} & SharedColumnFields;

type DatetimeColumn = {
  type: 'datetime';
  meta?: DateRangeMeta;
} & SharedColumnFields;

export type TemplateColumn =
  | TextColumn
  // | NameColumn
  | EmailColumn
  | UrlColumn
  | InternationalPhoneNumberColumn
  | UsPhoneNumberColumn
  | UsPostcodeColumn
  | PicklistColumn
  | NumberColumn
  | PercentageColumn
  | BooleanColumn
  | DateColumn
  | DatetimeColumn;

export type Template = TemplateColumn[]

export type ImporterModes = 'development' | 'production' | 'demo';

export interface SimpleClientIdAuthenticationParams {
  clientId: string;
}

export interface JwtAuthenticationParams {
  jwt: string;
}

type Theme = {
  colors?: {
    primary?: string
    primaryText?: string
    background?: string
    headingText?: string
    text?: string

    border?: string
    muted?: string
    mutedForeground?: string
    subtle?: string

    danger?: string
    dangerForeground?: string


    tableHeaderBg?: string
    tableHeaderText?: string
    tableCellBg?: string
    tableCellText?: string
    tableGridLine?: string
    discardedRowsBg?: string
    discardedRowsForeground?: string
  }

  radius?: {
    button?: string
    chip?: string
    dropdown?: string
  },

  typography?: {
    heading?: string,
    body?: string,
    size?: string,
  }
}

type BaseImporterParams = {
  iFrameClassName?: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  onClose: () => void;
  theme?: Theme;
  extraData?: {
    [key: string]: string | number | boolean | null | undefined;
  };
  rowLimit?: number;
};

type ProductionImporterParams = BaseImporterParams & {
  mode: 'development' | 'production';
  columns?: Template;
  templateKey: string;
  clientId: string;
};

type DemoImporterParams = BaseImporterParams & {
  mode: 'demo';
  columns?: never;
  templateKey?: never;
  clientId?: never;
};

export type ImporterParams = ProductionImporterParams | DemoImporterParams;

