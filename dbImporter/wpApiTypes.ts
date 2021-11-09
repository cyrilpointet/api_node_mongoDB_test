export type wpGroupRouteResponseType = {
  data: wpGroupType[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
};

export type wpMemberRouteResponseType = {
  data: wpMemberType[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
};

export type wpFeedRouteResponseType = {
  data: wpFeedType[];
  paging?: {
    previous: string;
    next: string;
    cursors?: {
      before: string;
      after: string;
    };
  };
};

export type wpCommentRouteResponseType = {
  data: wpCommentType[];
  paging?: {
    previous: string;
    next: string;
    cursors?: {
      previous: string;
      next: string;
    };
  };
};

export type wpGroupType = {
  id: string;
  name: string;
  privacy: string;
  created_time: string;
  updated_time: string;
  archived: string;
  description?: string;
};

export type wpMemberType = {
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

export type wpFeedType = {
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
  comments?: wpCommentRouteResponseType;
};

export type wpCommentType = {
  id: string;
  message: string;
  from: {
    name: string;
    id: string;
  };
  created_time: string;
};
