import * as React from "react";
import { Admin, Resource } from "react-admin";

import myDataProvider from "./providers/dataProvider";
import authProvider from "./providers/authProvider";

import Dashboard from "./components/Dashboard";
import { ArticleList } from "./components/products/ArticleList";
import { ArticleEdit } from "./components/products/ArticleEdit";
import { ArticleCreate } from "./components/products/ArticleCreate";
import { MemberList } from "./components/members/MemberList";
import { MemberShow } from "./components/members/MemberShow";
import { GroupShow } from "./components/groups/GroupShow";
import { GroupList } from "./components/groups/GroupList";
import { GroupEdit } from "./components/groups/GroupEdit";

const dataProvider = myDataProvider("http://localhost:8081");

const Main = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={Dashboard}
    authProvider={authProvider}
  >
    <Resource
      name="article"
      list={ArticleList}
      edit={ArticleEdit}
      create={ArticleCreate}
    />
    <Resource name="member" list={MemberList} show={MemberShow} />
    <Resource name="group" list={GroupList} show={GroupShow} edit={GroupEdit} />
  </Admin>
);

export default Main;
