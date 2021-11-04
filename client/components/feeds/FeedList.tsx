import React from "react";
import {
  Datagrid,
  DateField,
  List,
  TextField,
  ImageField,
  FunctionField,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useImageFieldStyles = makeStyles(() => ({
  image: {
    maxWidth: 100,
    maxHeight: 100,
  },
}));

const getFormatedField = (feed, field): string => {
  if (!feed[field]) return null;
  return feed[field].length > 50
    ? feed[field].substring(0, 50) + "..."
    : feed[field];
};

export const FeedList: React.FunctionComponent = (props) => {
  const imageFieldClasses = useImageFieldStyles();
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <TextField source="type" label="Type" />
        <FunctionField
          label="Story"
          render={(feed) => getFormatedField(feed, "story")}
        />
        <FunctionField
          label="Message"
          render={(feed) => getFormatedField(feed, "message")}
        />
        <ImageField
          classes={imageFieldClasses}
          source="pictureLink"
          label="picture link"
        />
      </Datagrid>
    </List>
  );
};
