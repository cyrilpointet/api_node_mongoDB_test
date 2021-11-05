export type ogGroupRouteResponseType = {
  data: ogGroupType[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
};

export type ogMemberRouteResponseType = {
  data: ogMemberType[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
};

export type ogFeedRouteResponseType = {
  data: ogFeedType[];
  paging?: {
    previous: string;
    next: string;
  };
};

export type ogCommentRouteResponseType = {
  data: ogCommentType[];
  paging?: {
    previous: string;
    next: string;
  };
};

export type ogGroupType = {
  id: string;
  name: string;
  privacy: string;
  created_time: string;
  updated_time: string;
  archived: string;
  description?: string;
  members?: ogMemberRouteResponseType;
  feed?: ogFeedRouteResponseType;
};

export type ogMemberType = {
  id: string;
  name: string;
  email?: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  department: string;
  primary_address: string;
  account_claim_time?: string;
  active: boolean;
};

export type ogFeedType = {
  id: string;
  from: {
    name: string;
    id: string;
  };
  type: string;
  story: string;
  message: string;
  created_time: string;
  updated_time: string;
  full_picture?: string;
  comments?: ogCommentRouteResponseType;
};

export type ogCommentType = {
  id: string;
  message: string;
  from: {
    name: string;
    id: string;
  };
  created_time: string;
};
