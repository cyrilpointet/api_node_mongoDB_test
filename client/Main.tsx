import React from "react";
import { Admin, Resource } from "react-admin";

import { setDataProvider } from "./providers/dataProviderSetter";
import { setAuthProvider } from "./providers/authProviderSetter";

import { KeringDashboard } from "./components/KeringDashboard";
import { MemberList } from "./components/members/MemberList";
import { MemberShow } from "./components/members/MemberShow";
import { GroupShow } from "./components/groups/GroupShow";
import { GroupList } from "./components/groups/GroupList";
import { FeedList } from "./components/feeds/FeedList";
import { FeedShow } from "./components/feeds/FeedShow";
import { CommentList } from "./components/comments/CommentList";
import { CommentShow } from "./components/comments/CommentShow";
import { UserList } from "./components/users/UserList";
import { UserShow } from "./components/users/UserShow";
import { UserCreate } from "./components/users/UserCreate";

const BASE_URL = process.env.BASE_URL;
const dataProvider = setDataProvider(BASE_URL);
const authProvider = setAuthProvider(BASE_URL + "/user/login");

const Main: React.FunctionComponent = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={KeringDashboard}
    authProvider={authProvider}
  >
    <Resource name="member" list={MemberList} show={MemberShow} />
    <Resource name="group" list={GroupList} show={GroupShow} />
    <Resource name="feed" list={FeedList} show={FeedShow} />
    <Resource name="comment" list={CommentList} show={CommentShow} />
    <Resource name="user" list={UserList} show={UserShow} create={UserCreate} />
  </Admin>
);

export { Main };
