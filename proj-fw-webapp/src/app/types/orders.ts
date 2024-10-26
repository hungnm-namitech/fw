export declare type NewEntryCommonFields = {
  deliveryDate?: Date;
  manager?: string;
  transportVehicle?: string;
  location?: string;
  notice?: string;
  mixedLoadingFlag?: boolean;
};

export declare type TabularNewEntry = {
  items?: {
    [itemDetailId: string]: number;
  };
  type: 'tabular';
} & NewEntryCommonFields;

export declare type PulldownNewEntry = {
  products?: {
    [randomKey: string]: {
      id: string | undefined;
      productId: string | undefined;
      desireQuantity: string;
    };
  };
  type: 'pulldown';
} & NewEntryCommonFields;
