import React from "react";
import { Datagrid, DateField, List, TextField, ImageField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useImageFieldStyles = makeStyles(() => ({
  image: {
    maxWidth: 50,
    maxHeight: 50,
  },
}));

export const FeedList: React.FunctionComponent = (props) => {
  const imageFieldClasses = useImageFieldStyles();
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <TextField source="type" label="Type" />
        <TextField source="story" label="Story" />
        <TextField source="message" label="Message" />
        <ImageField
          classes={imageFieldClasses}
          source="pictureLink"
          label="picture link"
        />
      </Datagrid>
    </List>
  );
};
