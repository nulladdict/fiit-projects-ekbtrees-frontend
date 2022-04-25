import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import React, {ChangeEvent, ReactNode, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import UISelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Spinner from "../Spinner/Spinner";
import {ISelectProps, ISelectOption} from "./types";

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        '& .MuiFormControl-root': {
            width: '100%',
        },
    },
    label: {
        backgroundColor: "white"
    }
}));

export const Select = (props: ISelectProps) => {
    const {id, item, onChange, onOpen, required} = props;
    const styles = useStyles();
    const [selected, setSelected] = useState<boolean>(false);

    const handleChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child?: ReactNode) => {
        setSelected(true);
        onChange(event, child);
    }

    const renderOptions = (values: ISelectOption[]) => {
        if (item.loading) {
            return <MenuItem disabled>
                <Spinner/>
            </MenuItem>;
        }

        const menuItems = values.map(value => {
            return (
                <MenuItem value={value.id} key={value.id}>
                    {value.title}
                </MenuItem>
            );
        });
        return menuItems;
    }

    return (
        <div className={styles.root}>
            <FormControl  required={required} error={required && !selected}>
                <InputLabel className={styles.label} id={`label-for-select-${item.title}`} variant="outlined" htmlFor={id}>{item.title}</InputLabel>
                <UISelect
                    labelId={`label-for-select-${item.title}`}
                    onOpen={onOpen}
                    native={false}
                    onChange={handleChange}
                    variant="outlined"
                    inputProps={{
                        name: item.title,
                        id,
                    }}
                    value={item.value}
                >
                    {renderOptions(item.values ?? [])}
                </UISelect>
            </FormControl>
        </div>
    )
}

export default Select;
