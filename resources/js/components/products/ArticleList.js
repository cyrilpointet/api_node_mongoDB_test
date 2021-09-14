import {Datagrid, List, NumberField, TextField, EditButton} from "react-admin";
import * as React from "react";

export const ArticleList = props => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="title" label="Titre" />
                <TextField source="content" label="Contenu" />
                <EditButton />
            </Datagrid>
        </List>
    );
}

