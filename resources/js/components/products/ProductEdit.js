import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput
} from 'react-admin';

export const ProductEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" label="Titre" />
            <TextInput source="description" label="Description" />
            <NumberInput source="price" label="Prix" />
        </SimpleForm>
    </Edit>
);