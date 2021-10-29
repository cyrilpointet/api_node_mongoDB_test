import React from "react";
import { Admin, Resource } from "react-admin";

import { setDataProvider } from "./providers/dataProviderSetter";
import { setAuthProvider } from "./providers/authProviderSetter";

import { KeringDashbord } from "./components/KeringDashbord";
// import { ArticleList } from "./components/products/ArticleList";
// import { ArticleEdit } from "./components/products/ArticleEdit";
// import { ArticleCreate } from "./components/products/ArticleCreate";
import { MemberList } from "./components/members/MemberList";
import { MemberShow } from "./components/members/MemberShow";
import { GroupShow } from "./components/groups/GroupShow";
import { GroupList } from "./components/groups/GroupList";
import { FeedList } from "./components/feeds/FeedList";
import { FeedShow } from "./components/feeds/FeedShow";

const BASE_URL = process.env.BASE_URL;
const dataProvider = setDataProvider(BASE_URL);
const authProvider = setAuthProvider(BASE_URL + "/user/login");

const Main: React.FunctionComponent = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={KeringDashbord}
    authProvider={authProvider}
  >
    {/*<Resource*/}
    {/*  name="article"*/}
    {/*  list={ArticleList}*/}
    {/*  edit={ArticleEdit}*/}
    {/*  create={ArticleCreate}*/}
    {/*/>*/}
    <Resource name="member" list={MemberList} show={MemberShow} />
    <Resource name="group" list={GroupList} show={GroupShow} />
    <Resource name="feed" list={FeedList} show={FeedShow} />
  </Admin>
);

export { Main };
