import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    NumberInput
} from 'react-admin';

export const ProductCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" label="Titre" />
            <TextInput source="description" label="Description" />
            <NumberInput source="price" label="Prix" />
        </SimpleForm>
    </Create>
);