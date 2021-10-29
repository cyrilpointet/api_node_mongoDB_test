import React from "react";
import {
  Datagrid,
  List,
  TextField,
  FunctionField,
  DateField,
  BooleanField,
} from "react-admin";

const getFeedsCount = (group): string => {
  return group.feeds.length;
};

const getMembersCount = (group): string => {
  return group.members.length;
};

export const GroupList: React.FunctionComponent = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="name" label="Name" />
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <FunctionField
          label="Members count"
          render={(group) => getMembersCount(group)}
        />
        <FunctionField
          label="Feeds count"
          render={(group) => getFeedsCount(group)}
        />
        <BooleanField source="active" label="Active" />
      </Datagrid>
    </List>
  );
};
