import {Datagrid, List, NumberField, TextField, EditButton} from "react-admin";
import * as React from "react";

export const ProductList = props => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="title" label="Titre" />
                <TextField source="description" label="Description" />
                <NumberField source="price" label="Prix" />
                <EditButton />
            </Datagrid>
        </List>
    );
}

