import React from "react";
import {
  BooleanField,
  Datagrid,
  FunctionField,
  List,
  TextField,
} from "react-admin";
import { Avatar } from "@material-ui/core";

const getGroupsCount = (member): string => {
  return member.groups.length;
};

const getFeedsCount = (member): string => {
  return member.feeds.length;
};

export const MemberList: React.FunctionComponent = (props) => {
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <FunctionField
          label="Avatar"
          render={(member) => <Avatar src={member.pictureLink} />}
        />
        <TextField source="name" label="Name" />
        <TextField source="email" label="Email" />
        <TextField source="department" label="Department" />
        <FunctionField
          label="Groups count"
          render={(member) => getGroupsCount(member)}
        />
        <FunctionField
          label="Feeds count"
          render={(member) => getFeedsCount(member)}
        />
        <BooleanField source="active" label="Active" />
      </Datagrid>
    </List>
  );
};
